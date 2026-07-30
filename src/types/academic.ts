export type Course = { code: string; name: string; credits: number; gradePoint?: number };
export type Semester = { id: number; name: string; courses: Course[] };
export type Mark = { id: string; semester: number; subjectCode: string; assessment: string; score: number; max: number; createdAt: string };
export type FutureSemester = { id: string; credits: number; sgpa: number };
