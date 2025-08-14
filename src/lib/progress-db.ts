
// This is a simple in-memory "database" for student progress reports.
// In a real application, this data would come from a database like Firestore or PostgreSQL.

export type ModuleProgress = {
    moduleName: string;
    score: number; // Percentage
};

export type ProgressReport = {
    reportId: string;
    studentId: string;
    course: string;
    teacherName: string;
    reportDate: string; // ISO date string
    overallGrade: 'A+' | 'A' | 'B+' | 'B' | 'C' | 'D';
    attendancePercentage: number;
    classesAttended: number;
    totalClasses: number;
    moduleProgress: ModuleProgress[];
    feedback: {
        strengths: string;
        areasForImprovement: string;
        comments: string;
    };
    nextAssessment: {
        name: string;
        date: string; // ISO date string
    };
};

const initialProgressReports: ProgressReport[] = [
    {
        reportId: "PR001",
        studentId: "S001",
        course: "Bharatanatyam",
        teacherName: "Priya Sharma",
        reportDate: new Date().toISOString(),
        overallGrade: "A",
        attendancePercentage: 95,
        classesAttended: 19,
        totalClasses: 20,
        moduleProgress: [
            { moduleName: "Thattadavu Series", score: 98 },
            { moduleName: "Nattadavu Series", score: 92 },
            { moduleName: "Pushpanjali", score: 88 },
        ],
        feedback: {
            strengths: "Excellent footwork (tala) and great enthusiasm. Grasps new adavus quickly.",
            areasForImprovement: "Needs to focus on improving hasta mudras (hand gestures) and maintaining araimandi posture consistently.",
            comments: "Amelia is a joy to teach and has great potential to be a fine dancer. Keep up the hard work!",
        },
        nextAssessment: {
            name: "Mid-Term Practical",
            date: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
        },
    },
    {
        reportId: "PR002",
        studentId: "S001",
        course: "Yoga",
        teacherName: "Sunita Reddy",
        reportDate: new Date().toISOString(),
        overallGrade: "B+",
        attendancePercentage: 90,
        classesAttended: 18,
        totalClasses: 20,
        moduleProgress: [
            { moduleName: "Surya Namaskar", score: 95 },
            { moduleName: "Basic Asanas", score: 85 },
            { moduleName: "Pranayama Basics", score: 80 },
        ],
        feedback: {
            strengths: "Good flexibility and dedication. Always tries her best in class.",
            areasForImprovement: "Focus on improving balance in standing poses and core strength.",
            comments: "Consistent practice will lead to great improvements. Well done.",
        },
        nextAssessment: {
            name: "Posture Review",
            date: new Date(new Date().setDate(new Date().getDate() + 45)).toISOString(),
        },
    },
    {
        reportId: "PR003",
        studentId: "S002",
        course: "Vocal Carnatic",
        teacherName: "Ravi Kumar",
        reportDate: new Date().toISOString(),
        overallGrade: "B",
        attendancePercentage: 85,
        classesAttended: 17,
        totalClasses: 20,
        moduleProgress: [
            { moduleName: "Sarali Varisai", score: 90 },
            { moduleName: "Janta Varisai", score: 82 },
            { moduleName: "Pillari Geethams", score: 75 },
        ],
        feedback: {
            strengths: "Has a naturally strong voice and good sense of rhythm (laya).",
            areasForImprovement: "Needs to practice more on pitch accuracy (sruti) and breath control during longer phrases.",
            comments: "Benjamin is progressing steadily. Regular practice sessions at home are highly recommended.",
        },
        nextAssessment: {
            name: "Geetham Recital",
            date: new Date(new Date().setDate(new Date().getDate() + 25)).toISOString(),
        },
    },
    {
        reportId: "PR004",
        studentId: "S003",
        course: "Guitar",
        teacherName: "Vikram Singh",
        reportDate: new Date().toISOString(),
        overallGrade: "C",
        attendancePercentage: 70,
        classesAttended: 14,
        totalClasses: 20,
        moduleProgress: [
            { moduleName: "Basic Chords", score: 75 },
            { moduleName: "Strumming Patterns", score: 68 },
            { moduleName: "Reading Tabs", score: 60 },
        ],
        feedback: {
            strengths: "Good rhythm and learns new songs quickly by ear.",
            areasForImprovement: "Struggles with barre chords and needs to be more consistent with practice. Attendance needs to improve.",
            comments: "Chloe has potential but needs to apply herself more consistently to see significant progress.",
        },
        nextAssessment: {
            name: "Chord Transition Test",
            date: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
        },
    }
];


let progressReports: ProgressReport[] = [...initialProgressReports];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getProgressReports = async (): Promise<ProgressReport[]> => {
  await delay(500); // Simulate network latency
  return Promise.resolve(progressReports);
};
