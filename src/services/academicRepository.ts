import type { Mark } from '../types/academic';

const MARKS_KEY = 'gradeflow.marks.v1';
const TARGET_KEY = 'gradeflow.target.v1';

export const academicRepository = {
  getMarks(): Mark[] {
    try { return JSON.parse(localStorage.getItem(MARKS_KEY) || '[]') as Mark[]; } catch { return []; }
  },
  saveMarks(marks: Mark[]) { localStorage.setItem(MARKS_KEY, JSON.stringify(marks)); },
  getTarget(defaultValue = 9) {
    const value = Number(localStorage.getItem(TARGET_KEY));
    return Number.isFinite(value) && value >= 0 && value <= 10 ? value : defaultValue;
  },
  saveTarget(target: number) { localStorage.setItem(TARGET_KEY, String(target)); },
};
