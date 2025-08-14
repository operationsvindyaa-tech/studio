
"use client"
import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Users, Wallet, UserCheck, ArrowDown, ArrowUp, Circle, BookOpen, ClipboardList, Building2, CalendarDays, BadgeHelp } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { getStudents, Student } from "@/lib/db"
import { getStaff, Staff } from "@/lib/staff-db"
import { getCourses, Course } from "@/lib/courses-db"
import { getEnquiries, Enquiry } from "@/lib/enquiries-db"
import { getEvents, Event } from "@/lib/schedule-db"
import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { isThisWeek, format } from 'date-fns'

type StudentStatusData = {
  name: string;
  value: number;
  fill: string;
};

const COLORS = {
    Active: 'hsl(var(--chart-1))',
    Inactive: 'hsl(var(--chart-2))',
    Suspended: 'hsl(var(--chart-5))',
};

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
        minimumFractionDigits: 0,
    }).format(amount);
};

export default function DashboardPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
        try {
            const [studentData, staffData, courseData, enquiryData, eventData] = await Promise.all([
                getStudents(), 
                getStaff(),
                getCourses(),
                getEnquiries(),
                getEvents(),
            ]);
            setStudents(studentData);
            setStaff(staffData);
            setCourses(courseData);
            setEnquiries(enquiryData);
            setEvents(eventData);
        } catch (error) {
            console.error("Failed to fetch dashboard data", error);
        } finally {
            setLoading(false);
        }
    }
    fetchData();
  }, []);

  const studentStatusData: StudentStatusData[] = Object.entries(
    students.reduce((acc, student) => {
        acc[student.status] = (acc[student.status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ 
    name, 
    value, 
    fill: COLORS[name as keyof typeof COLORS] || '#cccccc' 
  }));

  const feesCollected = 150500;
  const feesPending = 45500;
  const newEnquiriesThisWeek = enquiries.filter(e => isThisWeek(new Date(e.enquiryDate))).length;
  const totalSalary = staff.reduce((acc, s) => acc + s.payroll.salary, 0);

  const upcomingEvents = events
    .filter(e => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 4);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{students.length}</div>}
            <p className="text-xs text-muted-foreground">+5 new students this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{courses.length}</div>}
            <p className="text-xs text-muted-foreground">across all levels</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Enquiries</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{newEnquiriesThisWeek}</div>}
            <p className="text-xs text-muted-foreground">this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{staff.length}</div>}
            <p className="text-xs text-muted-foreground">including teachers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fees Collected</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(feesCollected)}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <ArrowUp className="h-3 w-3 text-green-500 mr-1"/> +15.2% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fees Pending</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(feesPending)}</div>
            <p className="text-xs text-muted-foreground flex items-center">
                <ArrowDown className="h-3 w-3 text-red-500 mr-1"/> -3.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Salary Disbursal</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-24" /> : <div className="text-2xl font-bold">{formatCurrency(totalSalary)}</div>}
            <p className="text-xs text-muted-foreground">for this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Teachers</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? <Skeleton className="h-8 w-16" /> : staff.filter(s => s.jobDetails.department === 'Academics').length}</div>
            <p className="text-xs text-muted-foreground">on payroll</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Student Status</CardTitle>
            <CardDescription>Distribution of active, inactive, and suspended students.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
             {loading ? <Skeleton className="h-48 w-48 rounded-full" /> : (
                <div className="w-full h-64 flex items-center justify-center relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Tooltip
                                contentStyle={{
                                    background: "hsl(var(--background))",
                                    borderColor: "hsl(var(--border))",
                                    borderRadius: "var(--radius)"
                                }}
                            />
                            <Pie data={studentStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} labelLine={false} label>
                                {studentStatusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute flex flex-col items-center justify-center text-center">
                        <span className="text-2xl font-bold">{students.length}</span>
                        <span className="text-sm text-muted-foreground">Total Students</span>
                    </div>
                </div>
             )}
          </CardContent>
            {!loading && <CardContent className="flex justify-center gap-4 text-sm">
                {studentStatusData.map(entry => (
                    <div key={entry.name} className="flex items-center gap-2">
                        <Circle className="h-3 w-3" style={{ fill: entry.fill, color: entry.fill }}/>
                        <span>{entry.name}</span>
                    </div>
                ))}
            </CardContent>}
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>What's next on the calendar for the academy.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
                <div className="space-y-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                </div>
            ) : upcomingEvents.length > 0 ? (
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
