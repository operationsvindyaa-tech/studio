"use client"
import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Wallet, ArrowUp, ArrowDown, Users, BookOpen } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { getStudents, Student } from "@/lib/db"
import { getStaff, Staff } from "@/lib/staff-db"
import { getBillingData, StudentBillingInfo } from "@/lib/billing-db"
import { getMerchandiseSales, MerchandiseSale } from "@/lib/merchandise-db"
import { getExpenses, Expense } from "@/lib/expenses-db"
import { 
    getRevenueBreakdown, 
    getExpenseAnalysis,
    getOutstandingFees,
    getClassProfitability,
} from "@/lib/report-utils"
import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"

const REVENUE_COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))'];
const EXPENSE_COLORS = ['hsl(var(--chart-5))', 'hsl(var(--chart-4))', 'hsl(var(--chart-2))', 'hsl(var(--chart-1))'];

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

export default function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [expenseData, setExpenseData] = useState<any[]>([]);
  const [outstandingFees, setOutstandingFees] = useState<StudentBillingInfo[]>([]);
  const [classProfitability, setClassProfitability] = useState<any[]>([]);
  const [totalFeesCollected, setTotalFeesCollected] = useState(0);
  const [totalFeesPending, setTotalFeesPending] = useState(0);
  const [totalSalaryDisbursed, setTotalSalaryDisbursed] = useState(0);


  useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
        try {
            const [billingData, merchandiseSalesData, expenseData, staffData] = await Promise.all([
                getBillingData(), 
                getMerchandiseSales(),
                getExpenses(),
                getStaff(),
            ]);
            
            const paidRecords = billingData.filter(b => b.status === 'Paid');
            const pendingRecords = billingData.filter(b => b.status === 'Due' || b.status === 'Overdue');

            setTotalFeesCollected(paidRecords.reduce((sum, b) => sum + b.activities.reduce((s, a) => s + a.fee, 0), 0));
            setTotalFeesPending(pendingRecords.reduce((sum, b) => sum + b.activities.reduce((s, a) => s + a.fee, 0), 0));
            setTotalSalaryDisbursed(staffData.reduce((sum, s) => sum + s.payroll.salary, 0));
            
            setRevenueData(getRevenueBreakdown(billingData, merchandiseSalesData));
            setExpenseData(getExpenseAnalysis(expenseData, staffData));
            setOutstandingFees(getOutstandingFees(billingData).slice(0, 5));
            setClassProfitability(getClassProfitability());
            
        } catch (error) {
            console.error("Failed to fetch dashboard data", error);
        } finally {
            setLoading(false);
        }
    }
    fetchData();
  }, []);


  return (
    <div className="space-y-6">
       <h1 className="text-3xl font-bold">Financial Reports</h1>
       <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Fees Collected (This Month)</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-32" /> : <div className="text-2xl font-bold">{formatCurrency(totalFeesCollected)}</div>}
             <p className="text-xs text-muted-foreground flex items-center">
              <ArrowUp className="h-3 w-3 text-green-500 mr-1"/> +15.2% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Fees Pending</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-32" /> : <div className="text-2xl font-bold">{formatCurrency(totalFeesPending)}</div>}
             <p className="text-xs text-muted-foreground flex items-center">
                <ArrowDown className="h-3 w-3 text-red-500 mr-1"/> -3.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Salary Disbursed (This Month)</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-32" /> : <div className="text-2xl font-bold">{formatCurrency(totalSalaryDisbursed)}</div>}
             <p className="text-xs text-muted-foreground">for {new Date().toLocaleString('default', { month: 'long' })}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Breakdown</CardTitle>
            <CardDescription>Sources of income for the current period.</CardDescription>
          </CardHeader>
          <CardContent>
             {loading ? <Skeleton className="h-64 w-full" /> : (
                <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                        <Tooltip contentStyle={{ background: "hsl(var(--background))", borderColor: "hsl(var(--border))" }} formatter={(value) => formatCurrency(value as number)} />
                        <Pie data={revenueData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} label={(entry) => entry.name}>
                            {revenueData.map((entry, index) => <Cell key={`cell-${index}`} fill={REVENUE_COLORS[index % REVENUE_COLORS.length]} />)}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
             )}
          </CardContent>
        </Card>
         <Card>
          <CardHeader>
            <CardTitle>Expense Analysis</CardTitle>
            <CardDescription>Major expense categories for the current period.</CardDescription>
          </CardHeader>
          <CardContent>
              {loading ? <Skeleton className="h-64 w-full" /> : (
                <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                        <Tooltip contentStyle={{ background: "hsl(var(--background))", borderColor: "hsl(var(--border))" }} formatter={(value) => formatCurrency(value as number)}/>
                        <Pie data={expenseData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} label={(entry) => entry.name}>
                             {expenseData.map((entry, index) => <Cell key={`cell-${index}`} fill={EXPENSE_COLORS[index % EXPENSE_COLORS.length]} />)}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
              )}
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-5">
          <Card className="lg:col-span-3">
            <CardHeader>
                <CardTitle>Outstanding Fees Report</CardTitle>
                <CardDescription>Top 5 students with due or overdue payments.</CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? <Skeleton className="h-64 w-full" /> : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Student</TableHead>
                                <TableHead>Month(s)</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {outstandingFees.map((record) => (
                                <TableRow key={record.id}>
                                    <TableCell className="font-medium">{record.name}</TableCell>
                                    <TableCell>{record.months.join(', ')}</TableCell>
                                    <TableCell>
                                        <Badge variant={record.status === 'Overdue' ? 'destructive' : 'outline'}>{record.status}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">{formatCurrency(record.activities.reduce((s, a) => s + a.fee, 0))}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>Per-Class Profitability</CardTitle>
                <CardDescription>Revenue vs. estimated profit for top classes.</CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? <Skeleton className="h-64 w-full" /> : (
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={classProfitability} layout="vertical" margin={{ left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" tickFormatter={(value) => formatCurrency(value as number)} />
                            <YAxis type="category" dataKey="name" width={80} tickLine={false} axisLine={false} />
                            <Tooltip formatter={(value) => formatCurrency(value as number)} />
                            <Legend />
                            <Bar dataKey="revenue" fill="hsl(var(--chart-2))" name="Revenue" />
                            <Bar dataKey="profit" fill="hsl(var(--chart-1))" name="Profit" />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
      </div>
    </div>
  )
}
