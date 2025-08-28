import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Users, UserCheck, BookOpen, ClipboardList, Building2, CalendarDays } from "lucide-react"
import { getStudents } from "@/lib/db"
import { getStaff } from "@/lib/staff-db"
import { getCourses } from "@/lib/courses-db"
import { getEnquiries } from "@/lib/enquiries-db"
import { getEvents } from "@/lib/schedule-db"
import { isThisWeek, format } from 'date-fns'
import { StudentStatusChart } from "./student-status-chart"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

const COLORS = {
    Active: 'hsl(var(--chart-1))',
    Inactive: 'hsl(var(--chart-2))',
    Suspended: 'hsl(var(--chart-5))',
};

async function getDashboardData() {
    const [studentData, staffData, courseData, enquiryData, eventData] = await Promise.all([
        getStudents(), 
        getStaff(),
        getCourses(),
        getEnquiries(),
        getEvents(),
    ]);
    return { students: studentData, staff: staffData, courses: courseData, enquiries: enquiryData, events: eventData };
}

export default async function DashboardPage() {
  const { students, staff, courses, enquiries, events } = await getDashboardData();
  
  const studentStatusData = Object.entries(
    students.reduce((acc, student) => {
        acc[student.status] = (acc[student.status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ 
    name, 
    value, 
    fill: COLORS[name as keyof typeof COLORS] || '#cccccc' 
  }));

  const newEnquiriesThisWeek = enquiries.filter(e => isThisWeek(new Date(e.enquiryDate))).length;

  const upcomingEvents = events
    .filter(e => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 4);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/students">
          <Card className="hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{students.length}</div>
              <p className="text-xs text-muted-foreground">+5 new students this week</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/courses">
          <Card className="hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{courses.length}</div>
              <p className="text-xs text-muted-foreground">across all levels</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/enquiries">
          <Card className="hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Enquiries</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{newEnquiriesThisWeek}</div>
              <p className="text-xs text-muted-foreground">this week</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/staff">
          <Card className="hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{staff.length}</div>
              <p className="text-xs text-muted-foreground">including teachers</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/teachers">
          <Card className="hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Teachers</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{staff.filter(s => s.jobDetails.department === 'Academics').length}</div>
              <p className="text-xs text-muted-foreground">on payroll</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <StudentStatusChart data={studentStatusData} totalStudents={students.length} />
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>What's next on the calendar for the academy.</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingEvents.length > 0 ? (
                <div className="space-y-4">
                    {upcomingEvents.map(event => (
                        <div key={event.id} className="flex items-center gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-muted rounded-md flex flex-col items-center justify-center">
                                <span className="text-lg font-bold">{format(event.date, 'dd')}</span>
                                <span className="text-xs text-muted-foreground">{format(event.date, 'MMM')}</span>
                            </div>
                            <div>
                                <h3 className="font-semibold">{event.title}</h3>
                                <p className="text-sm text-muted-foreground">{event.time}</p>
                            </div>
                            <Badge variant="outline" className="ml-auto capitalize">{event.type}</Badge>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 text-muted-foreground">
                    <CalendarDays className="h-12 w-12 mx-auto mb-2" />
                    <p>No upcoming events scheduled.</p>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
