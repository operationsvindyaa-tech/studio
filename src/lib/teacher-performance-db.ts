
// This is a simple in-memory "database" for demonstration purposes.
// In a real application, you would use a proper database like Firestore, PostgreSQL, etc.

export type TeacherPerformance = {
    teacherId: string;
    avgStudentPerformance: number; // percentage
    punctuality: number; // percentage
    studentFeedbackScore: number; // out of 5
    performanceMetrics: { metric: string; score: number }[];
    recentFeedback: {
        course: string;
        comment: string;
        rating: number; // out of 5
    }[];
};

const initialPerformanceData: TeacherPerformance[] = [
    {
        teacherId: "T001",
        avgStudentPerformance: 92,
        punctuality: 98,
        studentFeedbackScore: 4.8,
        performanceMetrics: [
            { metric: "Subject Knowledge", score: 95 },
            { metric: "Communication", score: 92 },
            { metric: "Punctuality", score: 98 },
            { metric: "Student Engagement", score: 90 },
            { metric: "Syllabus Coverage", score: 94 },
        ],
        recentFeedback: [
            { course: "Bharatanatyam", comment: "Dr. Reed is very knowledgeable and patient.", rating: 5.0 },
            { course: "Bharatanatyam", comment: "Explains complex steps very clearly.", rating: 4.7 },
        ],
    },
    {
        teacherId: "T002",
        avgStudentPerformance: 88,
        punctuality: 95,
        studentFeedbackScore: 4.5,
        performanceMetrics: [
            { metric: "Subject Knowledge", score: 90 },
            { metric: "Communication", score: 85 },
            { metric: "Punctuality", score: 95 },
            { metric: "Student Engagement", score: 88 },
            { metric: "Syllabus Coverage", score: 92 },
        ],
        recentFeedback: [
            { course: "Science", comment: "Makes difficult topics easy to understand.", rating: 4.5 },
            { course: "Science", comment: "Could provide more real-world examples.", rating: 4.0 },
        ],
    },
    {
        teacherId: "T004",
        avgStudentPerformance: 95,
        punctuality: 99,
        studentFeedbackScore: 4.9,
        performanceMetrics: [
            { metric: "Subject Knowledge", score: 98 },
            { metric: "Communication", score: 95 },
            { metric: "Punctuality", score: 99 },
            { metric: "Student Engagement", score: 96 },
            { metric: "Syllabus Coverage", score: 97 },
        ],
        recentFeedback: [
            { course: "Arts", comment: "Super inspiring and creative classes!", rating: 5.0 },
            { course: "Arts", comment: "Always encourages us to try new things.", rating: 4.9 },
        ],
    },
    // Add more performance data for other teachers as needed...
];

let performanceData: TeacherPerformance[] = [...initialPerformanceData];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getTeacherPerformanceData = async (): Promise<TeacherPerformance[]> => {
  await delay(500); // Simulate network latency
  return Promise.resolve(performanceData);
};

export const getPerformanceByTeacherId = async (teacherId: string): Promise<TeacherPerformance | undefined> => {
    await delay(300);
    return Promise.resolve(performanceData.find(p => p.teacherId === teacherId));
};

    