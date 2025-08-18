
import { Student } from "./db";
import { Enquiry } from "./enquiries-db";
import { BillingStatus, StudentBillingInfo } from "./billing-db";
import { MerchandiseSale } from "./merchandise-db";
import { Expense } from "./expenses-db";
import { Staff } from "./staff-db";
import { TeacherPerformance } from "./teacher-performance-db";

// Helper function to get a pseudo-random number for mock data
const getRandom = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

// Student & Enrollment Reports
export const analyzeEnrollmentTrends = (students: Student[]) => {
    const monthlyAdmissions: { [key: string]: number } = {};
    students.forEach(student => {
        const month = new Date(student.joined).toISOString().slice(0, 7);
        monthlyAdmissions[month] = (monthlyAdmissions[month] || 0) + 1;
    });
    return Object.entries(monthlyAdmissions)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => a.name.localeCompare(b.name));
};

export const getStudentDemographics = (students: Student[]) => {
    return students.reduce((acc, student) => {
        acc[student.status] = (acc[student.status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
};

export const getAttendanceOverview = () => ({
    mostAttended: [
        { course: "Bharatanatyam", rate: 95 },
        { course: "Yoga", rate: 92 },
    ],
    leastAttended: [
        { course: "Guitar", rate: 78 },
        { course: "Zumba", rate: 81 },
    ],
});

export const getRetentionRates = () => ({
    retentionRate: 88,
    dropoutRate: 12,
});

export const getPerformanceSummary = () => ({
    'A+': 15, 'A': 35, 'B+': 25, 'B': 15, 'C': 8, 'D': 2,
});


// Financial Reports
export const getRevenueBreakdown = (billing: StudentBillingInfo[], merchandise: MerchandiseSale[]) => {
    const tuitionFees = billing.reduce((sum, record) => sum + record.activities.reduce((s, a) => s + a.fee, 0), 0);
    const merchandiseSales = merchandise.reduce((sum, sale) => sum + sale.totalAmount, 0);
    const workshopFees = 50000; // Mock data
    return [
        { name: 'Tuition Fees', value: tuitionFees },
        { name: 'Merchandise', value: merchandiseSales },
        { name: 'Workshops', value: workshopFees },
    ];
};

export const getExpenseAnalysis = (expenses: Expense[], staff: Staff[]) => {
    const salaries = staff.reduce((sum, s) => sum + s.payroll.salary, 0);
    const rent = expenses.filter(e => e.head === 'Rent').reduce((sum, e) => sum + e.amount, 0);
    const marketing = expenses.filter(e => e.head.includes('Marketing')).reduce((sum, e) => sum + e.amount, 0);
    const utilities = expenses.filter(e => e.head.includes('Utilities')).reduce((sum, e) => sum + e.amount, 0);
    return [
        { name: 'Salaries', value: salaries },
        { name: 'Rent', value: rent },
        { name: 'Marketing', value: marketing },
        { name: 'Utilities', value: utilities },
    ];
};

export const getOutstandingFees = (billing: StudentBillingInfo[]) => {
    return billing.filter(record => record.status === 'Overdue' || record.status === 'Due');
};

export const getClassProfitability = () => ([
    { name: 'Bharatanatyam', revenue: 150000, profit: 95000 },
    { name: 'Vocal Carnatic', revenue: 120000, profit: 70000 },
    { name: 'Guitar', revenue: 80000, profit: 45000 },
    { name: 'Yoga', revenue: 110000, profit: 80000 },
]);


// Instructor & Staff Reports
export const getInstructorUtilization = (staff: Staff[]) => {
    return staff
        .filter(s => s.jobDetails.department === 'Academics')
        .map(instructor => ({
            name: instructor.fullName,
            hoursTaught: getRandom(18, 22),
            contractedHours: 24,
        }));
};

export const getInstructorPerformance = (staff: Staff[], performance: TeacherPerformance[]) => {
    return staff
        .filter(s => s.jobDetails.department === 'Academics')
        .map(instructor => {
            const perfData = performance.find(p => p.teacherId === instructor.id);
            return {
                name: instructor.fullName,
                feedbackScore: perfData?.studentFeedbackScore || 0,
                studentsTaught: getRandom(40, 80),
                retentionRate: getRandom(85, 98),
            };
        });
};

export const getPayrollSummary = (staff: Staff[]) => {
    return staff.reduce((sum, s) => sum + s.payroll.salary, 0);
};


// Operations Reports
export const analyzeRoomUsage = () => {
    return [
        { hour: '9 AM', usage: 30 }, { hour: '10 AM', usage: 50 }, { hour: '11 AM', usage: 60 },
        { hour: '4 PM', usage: 80 }, { hour: '5 PM', usage: 95 }, { hour: '6 PM', usage: 90 },
    ];
};

export const getCapacityReport = () => {
    return {
        overCapacity: [{ course: 'Bharatanatyam - Weekend Batch', actual: 25, capacity: 20 }],
        underCapacity: [{ course: 'Guitar - Weekday Batch', actual: 8, capacity: 15 }],
    };
};

export const getMaintenanceReport = (expenses: Expense[]) => {
    const maintenanceExpenses = expenses.filter(e => e.head.includes('Maintenance'));
    return {
        totalCost: maintenanceExpenses.reduce((sum, e) => sum + e.amount, 0),
        recentActivities: maintenanceExpenses.slice(0, 3),
    };
};

// Marketing & Growth Reports
export const getLeadConversion = (enquiries: Enquiry[]) => {
    const total = enquiries.length;
    const converted = enquiries.filter(e => e.status === 'Enrolled').length;
    return {
        totalLeads: total,
        convertedLeads: converted,
        conversionRate: total > 0 ? (converted / total) * 100 : 0,
    };
};

export const getStudentSources = (enquiries: Enquiry[]) => {
    return enquiries.reduce((acc, enquiry) => {
        acc[enquiry.source] = (acc[enquiry.source] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
};


// Strategic Reports
export const getHistoricalEnrollmentData = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => {
        const year = currentYear - 4 + i;
        return { year, students: 200 + i * 50 + getRandom(-20, 20) };
    });
};

export const getHistoricalRevenueData = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => {
        const year = currentYear - 4 + i;
        return { year, revenue: 3000000 + i * 1000000 + getRandom(-500000, 500000) };
    });
};
