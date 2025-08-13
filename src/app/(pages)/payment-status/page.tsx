
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { getBillingData, updateBillingData, StudentBillingInfo } from "@/lib/billing-db";
import { useToast } from "@/hooks/use-toast";
import { getStudents, Student } from "@/lib/db";
import { cn } from "@/lib/utils";

type PaymentStatus = "Paid" | "Due" | "Overdue";

type MonthlyPaymentDetails = {
  status: PaymentStatus;
  amount: number;
};

type MonthlyPaymentStatus = {
  [month: string]: MonthlyPaymentDetails;
};

type StudentPaymentRecord = {
  student: Student;
  payments: MonthlyPaymentStatus;
};

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthMap = {
    "Jan": "January", "Feb": "February", "Mar": "March", "Apr": "April",
    "May": "May", "Jun": "June", "Jul": "July", "Aug": "August",
    "Sep": "September", "Oct": "October", "Nov": "November", "Dec": "December"
};


const StatusAmount = ({ details }: { details?: MonthlyPaymentDetails }) => {
    if (!details) return <div className="h-5 w-5 mx-auto" />;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const getStatusClass = () => {
        switch (details.status) {
            case "Paid": return "text-green-600";
            case "Due": return "text-orange-600";
            case "Overdue": return "text-red-600 font-bold";
            default: return "text-muted-foreground";
        }
    };

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <div className={cn("text-xs font-semibold text-center", getStatusClass())}>
                    {formatCurrency(details.amount)}
                </div>
            </TooltipTrigger>
            <TooltipContent>
                <p>{details.status}</p>
            </TooltipContent>
        </Tooltip>
    );
};


export default function PaymentStatusPage() {
  const [paymentData, setPaymentData] = useState<StudentPaymentRecord[]>([]);
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [billingRecords, setBillingRecords] = useState<StudentBillingInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const { toast } = useToast();

  useEffect(() => {
    const fetchBillingAndStudentData = async () => {
      setLoading(true);
      try {
        const [billingData, studentData] = await Promise.all([getBillingData(), getStudents()]);
        setBillingRecords(billingData);
        setAllStudents(studentData);
      } catch (error) {
        console.error("Failed to load billing data", error);
        toast({ title: "Error", description: "Could not load payment status data.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };

    fetchBillingAndStudentData();
  }, [selectedYear, toast]);
  
  useEffect(() => {
    if (allStudents.length > 0 && billingRecords.length > 0) {
        const studentPaymentRecordsMap: Map<string, StudentPaymentRecord> = new Map();

        // Initialize all students
        allStudents.forEach(student => {
            studentPaymentRecordsMap.set(student.id, {
                student: student,
                payments: {}
            });
        });

        billingRecords.forEach(record => {
            const studentRecord = studentPaymentRecordsMap.get(record.studentId);
            if (studentRecord) {
                const tuitionActivity = record.activities.find(a => a.name === "Tuition Fee");
                if (tuitionActivity) {
                    record.months.forEach(monthName => {
                        const monthAbbr = Object.keys(monthMap).find(key => monthMap[key as keyof typeof monthMap].toLowerCase() === monthName.toLowerCase());
                        if (monthAbbr) {
                             studentRecord.payments[monthAbbr] = {
                                status: record.status,
                                amount: tuitionActivity.fee
                            };
                        }
                    });
                }
            }
        });
        
        setPaymentData(Array.from(studentPaymentRecordsMap.values()));
    }
  }, [allStudents, billingRecords]);
  
  const years = Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - i).toString());
  
  const handleStatusChange = (studentId: string, month: string, newStatus: PaymentStatus) => {
    // Find the corresponding billing record and update it
    const updatedBillingRecords = billingRecords.map(record => {
        const monthFullName = monthMap[month as keyof typeof monthMap];
        if (record.studentId === studentId && record.months.includes(monthFullName)) {
            return { ...record, status: newStatus };
        }
        return record;
    });

    // Update the central cache
    updateBillingData(updatedBillingRecords);
    setBillingRecords(updatedBillingRecords); // Update local state to trigger re-render

    const studentName = paymentData.find(r => r.student.id === studentId)?.student.name;
    toast({
        title: "Status Updated",
        description: `${studentName}'s payment for ${monthMap[month as keyof typeof monthMap]} is now ${newStatus}.`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Student Payment Tracker</CardTitle>
            <CardDescription>
              12-month fee payment tracker for all students. Click a status icon to change it.
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
                        <TableCell key={month} className="text-center"><Skeleton className="h-5 w-16 mx-auto" /></TableCell>
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
                         <DropdownMenu>
                            <DropdownMenuTrigger asChild disabled={!payments[month]}>
                                <button className="w-full h-full flex items-center justify-center p-2 rounded-md hover:bg-muted disabled:cursor-not-allowed">
                                    <StatusAmount details={payments[month]} />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => handleStatusChange(student.id, month, 'Paid')}>
                                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" /> Mark as Paid
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(student.id, month, 'Due')}>
                                    <AlertCircle className="h-4 w-4 mr-2 text-orange-500" /> Mark as Due
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(student.id, month, 'Overdue')}>
                                    <XCircle className="h-4 w-4 mr-2 text-red-500" /> Mark as Overdue
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
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
