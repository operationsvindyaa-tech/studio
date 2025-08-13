
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getStudents, type Student } from "@/lib/db";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type PaymentStatus = "Paid" | "Due" | "Overdue";

type MonthlyPaymentStatus = {
  [month: string]: PaymentStatus;
};

type StudentPaymentRecord = {
  student: Student;
  payments: MonthlyPaymentStatus;
};

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Generate mock payment data for demonstration
const generateMockPayments = (studentId: string, joinDate: string): MonthlyPaymentStatus => {
  const payments: MonthlyPaymentStatus = {};
  const currentMonth = new Date().getMonth();
  const joinMonth = new Date(joinDate).getMonth();
  const joinYear = new Date(joinDate).getFullYear();
  const currentYear = new Date().getFullYear();

  months.forEach((month, index) => {
    // No status for future months or before joining
    if (index > currentMonth || joinYear > currentYear) {
      return;
    }
    if (joinYear === currentYear && index < joinMonth) {
        return;
    }

    const seed = (studentId.charCodeAt(1) + index) % 10;
    if (index < currentMonth - 1) {
      // Older months are more likely to be paid
      payments[month] = seed < 8 ? "Paid" : "Overdue";
    } else if (index === currentMonth -1) {
      // Last month
      payments[month] = seed < 6 ? "Paid" : "Overdue";
    } else {
      // Current month
      payments[month] = seed < 4 ? "Paid" : "Due";
    }
  });
  return payments;
};

const StatusIndicator = ({ status }: { status: PaymentStatus }) => {
  switch (status) {
    case "Paid":
      return <Tooltip><TooltipTrigger asChild><CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" /></TooltipTrigger><TooltipContent><p>Paid</p></TooltipContent></Tooltip>;
    case "Due":
      return <Tooltip><TooltipTrigger asChild><AlertCircle className="h-5 w-5 text-orange-500 mx-auto" /></TooltipTrigger><TooltipContent><p>Due</p></TooltipContent></Tooltip>;
    case "Overdue":
      return <Tooltip><TooltipTrigger asChild><XCircle className="h-5 w-5 text-red-500 mx-auto" /></TooltipTrigger><TooltipContent><p>Overdue</p></TooltipContent></Tooltip>;
    default:
      return null;
  }
};


export default function PaymentStatusPage() {
  const [paymentData, setPaymentData] = useState<StudentPaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());

  useEffect(() => {
    const fetchStudentData = async () => {
      setLoading(true);
      try {
        const students = await getStudents();
        const records = students.map(student => ({
          student,
          payments: generateMockPayments(student.id, student.joined),
        }));
        setPaymentData(records);
      } catch (error) {
        console.error("Failed to load student data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [selectedYear]);
  
  const years = Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - i).toString());

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Student Payment Status</CardTitle>
            <CardDescription>
              12-month fee payment tracker for all students.
            </CardDescription>
          </div>
           <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {years.map(year => (
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg overflow-x-auto">
         <TooltipProvider>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="sticky left-0 bg-background z-10 min-w-[200px]">Student</TableHead>
                {months.map(month => (
                  <TableHead key={month} className="text-center">{month}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="sticky left-0 bg-background z-10">
                         <div className="flex items-center gap-3">
                            <Skeleton className="h-9 w-9 rounded-full" />
                            <div className="space-y-1">
                                <Skeleton className="h-4 w-24" />
                            </div>
                        </div>
                    </TableCell>
                    {months.map(month => (
                        <TableCell key={month} className="text-center"><Skeleton className="h-5 w-5 mx-auto" /></TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                paymentData.map(({ student, payments }) => (
                  <TableRow key={student.id}>
                    <TableCell className="sticky left-0 bg-background z-10 font-medium">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                                <AvatarImage src={student.avatar} alt={student.name} data-ai-hint="person" />
                                <AvatarFallback>{student.initials}</AvatarFallback>
                            </Avatar>
                            <span>{student.name}</span>
                        </div>
                    </TableCell>
                    {months.map(month => (
                      <TableCell key={month} className="text-center">
                        <StatusIndicator status={payments[month]} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  );
}
