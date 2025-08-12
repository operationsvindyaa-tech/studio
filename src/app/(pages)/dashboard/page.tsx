
"use client"
import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Users, Wallet, IndianRupee, UserCheck, ArrowDown, ArrowUp, Circle } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { getStudents, Student } from "@/lib/db"
import { getStaff, Staff } from "@/lib/staff-db"
import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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

const recentTransactions = [
    { studentName: "Amelia Rodriguez", amount: 2500, status: "Paid" },
    { studentName: "Benjamin Carter", amount: 3000, status: "Paid" },
    { studentName: "David Kim", amount: 4500, status: "Due" },
    { studentName: "Franklin Garcia", amount: 2000, status: "Overdue" },
    { studentName: "Chloe Nguyen", amount: 4000, status: "Paid" },
];

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
    }).format(amount);
};

export default function DashboardPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
        try {
            const [studentData, staffData] = await Promise.all([getStudents(), getStaff()]);
            setStudents(studentData);
            setStaff(staffData);
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

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
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
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? <Skeleton className="h-8 w-24" /> : students.length}</div>
            <p className="text-xs text-muted-foreground">+5 new students this week</p>
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
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Latest fee payments from students.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                    Array.from({length: 5}).map((_, i) => (
                        <TableRow key={i}>
                            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                            <TableCell className="text-right"><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
                            <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                        </TableRow>
                    ))
                ) : (
                    recentTransactions.map((activity, index) => (
                        <TableRow key={index}>
                            <TableCell className="font-medium">{activity.studentName}</TableCell>
                            <TableCell className="text-right">{formatCurrency(activity.amount)}</TableCell>
                            <TableCell>
                                <Badge variant={
                                    activity.status === 'Paid' ? 'secondary' : activity.status === 'Due' ? 'outline' : 'destructive'
                                } className={
                                    activity.status === 'Paid' ? "bg-green-100 text-green-800" : activity.status === 'Due' ? "bg-orange-100 text-orange-800" : ""
                                }>
                                    {activity.status}
                                </Badge>
                            </TableCell>
                        </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
            <CardTitle>Upcoming Salary Payouts</CardTitle>
            <CardDescription>Staff and teacher salaries scheduled for the current pay period.</CardDescription>
        </CardHeader>
        <CardContent>
             <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Staff Member</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Salary</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                 {loading ? (
                    Array.from({length: 4}).map((_, i) => (
                        <TableRow key={i}>
                            <TableCell>
                                 <div className="flex items-center gap-3">
                                    <Skeleton className="h-9 w-9 rounded-full" />
                                    <Skeleton className="h-4 w-32" />
                                </div>
                            </TableCell>
                            <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                            <TableCell className="text-right"><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
                        </TableRow>
                    ))
                 ) : (
                    staff.slice(0, 4).map((s) => (
                        <TableRow key={s.id}>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-9 w-9">
                                        <AvatarImage src={s.personalInfo.photo} alt={s.fullName} data-ai-hint="person" />
                                        <AvatarFallback>{s.initials}</AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium">{s.fullName}</span>
                                </div>
                            </TableCell>
                            <TableCell>{s.jobDetails.role}</TableCell>
                            <TableCell className="text-right">{formatCurrency(s.payroll.salary)}</TableCell>
                        </TableRow>
                    ))
                 )}
              </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  )
}
