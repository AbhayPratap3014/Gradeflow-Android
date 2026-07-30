import { useCallback, useEffect, useMemo, useState } from 'react';
import { academicRepository, type GradeflowState } from '../services/academicRepository';
import type { Mark } from '../types/academic';

export function useAcademicState() {
  const [marks, setMarks] = useState<Mark[]>(() => academicRepository.getCachedMarks());
  const [state, setState] = useState<GradeflowState>(() => academicRepository.getCachedState());
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setSyncing(true);
    setError(null);
    try {
      const [nextState, nextMarks] = await Promise.all([
        academicRepository.getState(),
        academicRepository.getMarks(),
      ]);
      setState(nextState);
      setMarks(nextMarks);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not sync Gradeflow data');
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  const persistState = async (next: GradeflowState) => {
    const previous = state;
    setState(next);
    try {
      await academicRepository.saveState(next);
    } catch (e) {
      setState(previous);
      setError(e instanceof Error ? e.message : 'Could not save Gradeflow state');
      throw e;
    }
  };

  const setTarget = (target: number) => persistState({ ...state, target });
  const setS3 = (s3: GradeflowState['s3']) => persistState({ ...state, s3 });
  const setSandbox = (sim1: GradeflowState['sim1'], sim2: GradeflowState['sim2']) => persistState({ ...state, sim1, sim2 });
  const setMonth = (month: number) => persistState({ ...state, month });

  const addMark = async (mark: Omit<Mark, 'id' | 'createdAt'>) => {
    setError(null);
    try {
      const created = await academicRepository.addMark(mark);
      setMarks(prev => [created, ...prev.filter(m => m.id !== created.id)]);
      return created;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save marks');
      throw e;
    }
  };

  const updateMark = async (id: string, patch: Partial<Mark>) => {
    setError(null);
    try {
      const updated = await academicRepository.updateMark(id, patch);
      setMarks(prev => prev.map(m => m.id === id ? updated : m));
      return updated;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not update marks');
      throw e;
    }
  };

  const deleteMark = async (id: string) => {
    const removed = marks.find(m => m.id === id);
    if (!removed) return undefined;
    try {
      await academicRepository.deleteMark(id);
      setMarks(prev => prev.filter(m => m.id !== id));
      return removed;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not delete marks');
      throw e;
    }
  };

  const restoreMark = async (mark: Mark) => {
    const { id: _id, createdAt: _createdAt, ...draft } = mark;
    return addMark(draft);
  };

  const marksBySubject = useMemo(() => {
    const grouped = new Map<string, Mark[]>();
    for (const mark of marks) grouped.set(mark.subjectCode, [...(grouped.get(mark.subjectCode) || []), mark]);
    return grouped;
  }, [marks]);

  return {
    marks,
    state,
    target: state.target,
    s3: state.s3,
    sim1: state.sim1,
    sim2: state.sim2,
    month: state.month,
    setTarget,
    setS3,
    setSandbox,
    setMonth,
    addMark,
    updateMark,
    deleteMark,
    restoreMark,
    marksBySubject,
    loading,
    syncing,
    error,
    refresh,
  };
}
