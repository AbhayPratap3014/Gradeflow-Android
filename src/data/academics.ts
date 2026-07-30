import type { Semester } from '../types/academic';

export const semesters: Semester[] = [
  { id: 1, name: 'Semester 1', courses: [
    {code:'EE112B',name:'Introduction to IoT',credits:3,gradePoint:9},{code:'HS101P',name:'Communication Skills',credits:2,gradePoint:8},{code:'IT101L',name:'Programming for Problem Solving',credits:3,gradePoint:8},{code:'IT101P',name:'Programming for Problem Solving Lab',credits:2,gradePoint:8},{code:'IT102P',name:'Web Designing',credits:1,gradePoint:10},{code:'IT103L',name:'Design Thinking',credits:1,gradePoint:8},{code:'MA101L',name:'Calculus for Engineers',credits:4,gradePoint:6},{code:'MA202L',name:'Discrete Structures & Theory of Logic',credits:3,gradePoint:8},{code:'PH101L',name:'Semiconductor Physics and Devices',credits:3,gradePoint:7},{code:'PH101P',name:'Semiconductor Physics Lab',credits:1,gradePoint:5}
  ]},
  { id: 2, name: 'Semester 2', courses: [
    {code:'AI101B',name:'Introduction to AI',credits:3,gradePoint:10},{code:'AI102P',name:'Python for Engineers',credits:2,gradePoint:10},{code:'CH101L',name:'Environmental Chemistry',credits:2,gradePoint:8},{code:'CS201B',name:'Data Structure',credits:4,gradePoint:8},{code:'EC201L',name:'Computer Organization & Logic Design',credits:3,gradePoint:8},{code:'EC201P',name:'Computer Organization Lab',credits:1,gradePoint:9},{code:'HS106P',name:'Basic Proficiency in Spanish',credits:2,gradePoint:8},{code:'IT104P',name:'Innovation & Entrepreneurship',credits:1,gradePoint:8},{code:'MA103L',name:'Linear Algebra for Engineers',credits:4,gradePoint:9}
  ]},
  { id: 3, name: 'Semester 3', courses: [
    {code:'IT301L',name:'Database Systems',credits:3,gradePoint:8},{code:'MA105L',name:'Probability & Statistics',credits:3,gradePoint:8},{code:'HS110L',name:'Aptitude-1',credits:1,gradePoint:8},{code:'CS302B',name:'Advanced Data Structure',credits:4,gradePoint:8},{code:'AI201B',name:'Machine Learning Essentials',credits:4,gradePoint:8},{code:'CS336B',name:'OOP with Java',credits:4,gradePoint:8},{code:'AI103E',name:'Professional Elective-I',credits:4,gradePoint:8},{code:'IT301P',name:'Database Systems Lab',credits:1,gradePoint:8},{code:'IT105P',name:'Social Internship Assessment',credits:1,gradePoint:8}
  ]}
];

export const activeSemester = 3;
