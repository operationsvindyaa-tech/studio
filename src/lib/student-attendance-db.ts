
// This is a simple in-memory "database" for student attendance.
// In a real application, this would be tied to your actual attendance records.

import { subDays, eachDayOfInterval, format } from 'date-fns';

export type AttendanceStatus = 'Present' | 'Absent' | 'Holiday' | 'No Class';

export type AttendanceRecord = {
    date: string; // ISO date string
    status: AttendanceStatus;
};

// Function to generate pseudo-random attendance data for a student
const generateMockAttendance = (studentId: string): AttendanceRecord[] => {
    const records: AttendanceRecord[] = [];
    const today = new Date();
    const startDate = subDays(today, 60); // Look at the last 60 days
    
    const interval = eachDayOfInterval({ start: startDate, end: today });
    
    interval.forEach(day => {
        const dayOfWeek = day.getDay(); // Sunday - 0, Saturday - 6

        // No classes on Sunday
        if (dayOfWeek === 0) {
            records.push({ date: day.toISOString(), status: 'Holiday' });
            return;
        }

        // Simple hash to create varied but consistent patterns per student
        const studentFactor = parseInt(studentId.replace('S', ''), 10);
        const dateFactor = parseInt(format(day, 'd'), 10);
        
        // Pseudo-random logic for attendance
        const randomValue = (studentFactor + dateFactor) % 10;
        
        let status: AttendanceStatus = 'Present';
        if (randomValue < 2) { // 20% chance of being absent
            status = 'Absent';
        }

        records.push({ date: day.toISOString(), status: status });
    });

    return records;
};


// Cache to store generated data so it's consistent across requests for a session
const attendanceCache = new Map<string, AttendanceRecord[]>();

export const getAttendanceForStudent = async (studentId: string): Promise<AttendanceRecord[]> => {
    if (attendanceCache.has(studentId)) {
        return Promise.resolve(attendanceCache.get(studentId)!);
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const data = generateMockAttendance(studentId);
    attendanceCache.set(studentId, data);
    
    return Promise.resolve(data);
};
