
"use client"
import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Users, Wallet, IndianRupee, UserCheck, ArrowUp, Circle, CalendarCheck, UserMinus } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { getStudents, Student } from "@/lib/db"
import { getStaff, Staff } from "@/lib/staff-db"
import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"

type ChartData = {
  name: string;
  value: number;
  fill: string;
};

const STUDENT_STATUS_COLORS = {
    Active: 'hsl(var(--chart-1))',
    Inactive: 'hsl(var(--chart-2))',
    Suspended: 'hsl(var(--chart-5))',
};

const FEE_STATUS_COLORS = {
    Paid: 'hsl(var(--chart-1))',
    Due: 'hsl(var(--chart-2))',
    Overdue: 'hsl(var(--chart-5))',
}

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

export default function ReportsPage() {
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

  const studentStatusData: ChartData[] = Object.entries(
    students.reduce((acc, student) => {
        acc[student.status] = (acc[student.status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ 
    name, 
    value, 
    fill: STUDENT_STATUS_COLORS[name as keyof typeof STUDENT_STATUS_COLORS] || '#cccccc' 
  }));
  
  const feeStatusData: ChartData[] = [
      { name: "Paid", value: 400, fill: FEE_STATUS_COLORS.Paid },
      { name: "Due", value: 150, fill: FEE_STATUS_COLORS.Due },
      { name: "Overdue", value: 50, fill: FEE_STATUS_COLORS.Overdue },
  ];

  const totalFeesCollected = 150500;
  const totalFeesPending = 45500;
  const totalSalaryDisbursed = 320000;

  return (
    <div className="space-y-6">
       <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Fees Collected</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalFeesCollected)}</div>
            <p className="text-xs text-muted-foreground">in this financial year</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Fees Pending</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalFeesPending)}</div>
             <p className="text-xs text-muted-foreground">across all students</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Salary Disbursed</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalSalaryDisbursed)}</div>
             <p className="text-xs text-muted-foreground">in this financial year</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Student Demographics</CardTitle>
            <CardDescription>Distribution of students by their current status.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
             {loading ? <Skeleton className="h-48 w-48 rounded-full" /> : (
                <div className="w-full h-64 flex items-center justify-around">
                    <ResponsiveContainer width="50%" height="100%">
                        <PieChart>
                            <Tooltip contentStyle={{ background: "hsl(var(--background))", borderColor: "hsl(var(--border))" }} />
                            <Pie data={studentStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} label>
                                {studentStatusData.map((entry) => <Cell key={entry.name} fill={entry.fill} />)}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                     <div className="flex flex-col gap-2 text-sm">
                        {studentStatusData.map(entry => (
                            <div key={entry.name} className="flex items-center gap-2">
                                <Circle className="h-3 w-3" style={{ fill: entry.fill, color: entry.fill }}/>
                                <div>
                                    <span className="font-semibold">{entry.name}</span>
                                    <span className="text-muted-foreground"> ({entry.value})</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
             )}
          </CardContent>
        </Card>
         <Card>
          <CardHeader>
            <CardTitle>Fee Status Breakdown</CardTitle>
            <CardDescription>Overview of paid, due, and overdue invoices.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
              <div className="w-full h-64 flex items-center justify-around">
                    <ResponsiveContainer width="50%" height="100%">
                        <PieChart>
                            <Tooltip contentStyle={{ background: "hsl(var(--background))", borderColor: "hsl(var(--border))" }} />
                            <Pie data={feeStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} label>
                                {feeStatusData.map((entry) => <Cell key={entry.name} fill={entry.fill} />)}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                     <div className="flex flex-col gap-2 text-sm">
                        {feeStatusData.map(entry => (
                            <div key={entry.name} className="flex items-center gap-2">
                                <Circle className="h-3 w-3" style={{ fill: entry.fill, color: entry.fill }}/>
                                <div>
                                    <span className="font-semibold">{entry.name}</span>
                                    <span className="text-muted-foreground"> ({entry.value})</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-2">
          <Card>
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
                    {recentTransactions.map((activity, index) => (
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
                    ))}
                </TableBody>
                </Table>
            </CardContent>
        </Card>
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Attendance Overview</CardTitle>
                    <CardDescription>Summary of staff and teacher attendance for the current month.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                     <div className="p-4 rounded-lg bg-muted flex items-center gap-4">
                        <div className="bg-background p-3 rounded-full">
                            <UserCheck className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">98%</p>
                            <p className="text-sm text-muted-foreground">Teacher Attendance</p>
                        </div>
                     </div>
                     <div className="p-4 rounded-lg bg-muted flex items-center gap-4">
                        <div className="bg-background p-3 rounded-full">
                            <UserMinus className="h-6 w-6 text-destructive" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">95%</p>
                            <p className="text-sm text-muted-foreground">Staff Attendance</p>
                        </div>
                     </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  )
}
