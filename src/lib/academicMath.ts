import type { Course, FutureSemester } from '../types/academic';

export const semesterCredits = (courses: Course[]) => courses.reduce((sum, c) => sum + c.credits, 0);

export const calculateSGPA = (courses: Course[]) => {
  const graded = courses.filter(c => c.gradePoint != null);
  const credits = semesterCredits(graded);
  return credits ? graded.reduce((sum, c) => sum + c.credits * (c.gradePoint ?? 0), 0) / credits : 0;
};

export const calculateCGPA = (semesters: Course[][]) => {
  let egp = 0, credits = 0;
  for (const semester of semesters) for (const course of semester) if (course.gradePoint != null) {
    egp += course.credits * course.gradePoint;
    credits += course.credits;
  }
  return credits ? egp / credits : 0;
};

export const projectCGPA = (cgpa: number, completedCredits: number, sgpa: number, newCredits: number) =>
  (cgpa * completedCredits + sgpa * newCredits) / (completedCredits + newCredits);

export const requiredSGPA = (cgpa: number, completedCredits: number, target: number, newCredits: number) =>
  (target * (completedCredits + newCredits) - cgpa * completedCredits) / newCredits;

export const simulateFuture = (cgpa: number, credits: number, future: FutureSemester[]) =>
  future.reduce((state, semester) => ({
    cgpa: projectCGPA(state.cgpa, state.credits, semester.sgpa, semester.credits),
    credits: state.credits + semester.credits,
  }), { cgpa, credits });
