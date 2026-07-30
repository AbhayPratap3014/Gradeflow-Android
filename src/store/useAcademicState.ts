import { useCallback, useEffect, useMemo, useState } from 'react';
import { academicRepository } from '../services/academicRepository';
import type { Mark } from '../types/academic';

export function useAcademicState() {
  const [marks, setMarks] = useState<Mark[]>(() => academicRepository.getCachedMarks());
  const [target, setTargetState] = useState(() => academicRepository.getTarget(8.5));
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setSyncing(true); setError(null);
    try { setMarks(await academicRepository.getMarks()); }
    catch (e) { setError(e instanceof Error ? e.message : 'Could not sync Gradeflow data'); }
    finally { setLoading(false); setSyncing(false); }
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  const addMark = async (mark: Omit<Mark, 'id' | 'createdAt'>) => {
    setError(null);
    try { const created = await academicRepository.addMark(mark); setMarks(prev => [created, ...prev.filter(m => m.id !== created.id)]); return created; }
    catch (e) { setError(e instanceof Error ? e.message : 'Could not save marks'); throw e; }
  };
  const updateMark = async (id: string, patch: Partial<Mark>) => {
    setError(null);
    try { const updated = await academicRepository.updateMark(id, patch); setMarks(prev => prev.map(m => m.id === id ? updated : m)); return updated; }
    catch (e) { setError(e instanceof Error ? e.message : 'Could not update marks'); throw e; }
  };
  const deleteMark = async (id: string) => {
    const removed = marks.find(m => m.id === id);
    if (!removed) return undefined;
    setMarks(prev => prev.filter(m => m.id !== id));
    try { await academicRepository.deleteMark(id); return removed; }
    catch (e) { setMarks(prev => [removed, ...prev]); setError(e instanceof Error ? e.message : 'Could not delete marks'); throw e; }
  };
  const restoreMark = async (mark: Mark) => {
    const { id: _id, createdAt: _createdAt, ...draft } = mark;
    return addMark(draft);
  };
  const setTarget = (value: number) => { setTargetState(value); academicRepository.saveTarget(value); };
  const marksBySubject = useMemo(() => {
    const grouped = new Map<string, Mark[]>();
    for (const mark of marks) grouped.set(mark.subjectCode, [...(grouped.get(mark.subjectCode) || []), mark]);
    return grouped;
  }, [marks]);

  return { marks, target, setTarget, addMark, updateMark, deleteMark, restoreMark, marksBySubject, loading, syncing, error, refresh };
}
