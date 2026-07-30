import { useMemo, useState } from 'react';
import { academicRepository } from '../services/academicRepository';
import type { Mark } from '../types/academic';

export function useAcademicState() {
  const [marks, setMarks] = useState<Mark[]>(() => academicRepository.getMarks());
  const [target, setTargetState] = useState(() => academicRepository.getTarget(8.5));

  const saveMarks = (next: Mark[]) => { setMarks(next); academicRepository.saveMarks(next); };
  const addMark = (mark: Omit<Mark, 'id' | 'createdAt'>) => {
    const created: Mark = { ...mark, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
    saveMarks([created, ...marks]);
    return created;
  };
  const updateMark = (id: string, patch: Partial<Mark>) => saveMarks(marks.map(m => m.id === id ? { ...m, ...patch } : m));
  const deleteMark = (id: string) => {
    const removed = marks.find(m => m.id === id);
    if (removed) saveMarks(marks.filter(m => m.id !== id));
    return removed;
  };
  const restoreMark = (mark: Mark) => saveMarks([mark, ...marks.filter(m => m.id !== mark.id)]);
  const setTarget = (value: number) => { setTargetState(value); academicRepository.saveTarget(value); };
  const marksBySubject = useMemo(() => new Map<string, Mark[]>(marks.map(m => [m.subjectCode, marks.filter(x => x.subjectCode === m.subjectCode)])), [marks]);

  return { marks, target, setTarget, addMark, updateMark, deleteMark, restoreMark, marksBySubject };
}
