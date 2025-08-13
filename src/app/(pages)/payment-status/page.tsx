
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
import { getBillingData, StudentBillingInfo } from "@/lib/billing-db";
import { useToast } from "@/hooks/use-toast";
import { Student } from "@/lib/db";

type PaymentStatus = "Paid" | "Due" | "Overdue";

type MonthlyPaymentStatus = {
  [month: string]: PaymentStatus;
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

const StatusIndicator = ({ status }: { status?: PaymentStatus }) => {
    if (!status) return <div className="h-5 w-5 mx-auto" />; // Empty cell for no data
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
  const { toast } = useToast();

  useEffect(() => {
    const fetchBillingAndStudentData = async () => {
      setLoading(true);
      try {
        const billingRecords = await getBillingData();

        const studentPaymentRecordsMap: Map<string, StudentPaymentRecord> = new Map();

        billingRecords.forEach(record => {
            if (!studentPaymentRecordsMap.has(record.studentId)) {
                studentPaymentRecordsMap.set(record.studentId, {
                    student: {
                        id: record.studentId,
                        name: record.name,
                        email: record.email || '',
                        joined: new Date().toISOString(),
                        status: "Active",
                        courses: 1,
                        avatar: `https://placehold.co/100x100.png`,
                        initials: record.name.split(' ').map(n => n[0]).join('').toUpperCase(),
                        whatsappNumber: record.whatsappNumber,
                    },
                    payments: {}
                });
            }

            const studentRecord = studentPaymentRecordsMap.get(record.studentId)!;
            
            record.months.forEach(monthName => {
                const monthAbbr = Object.keys(monthMap).find(key => monthMap[key as keyof typeof monthMap] === monthName);
                if (monthAbbr) {
                    studentRecord.payments[monthAbbr] = record.status;
                }
            });
        });

        setPaymentData(Array.from(studentPaymentRecordsMap.values()));

      } catch (error) {
        console.error("Failed to load billing data", error);
        toast({ title: "Error", description: "Could not load payment status data.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };

    fetchBillingAndStudentData();
  }, [selectedYear, toast]);
  
  const years = Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - i).toString());
  
  const handleStatusChange = (studentId: string, month: string, newStatus: PaymentStatus) => {
    setPaymentData(prevData =>
        prevData.map(record => {
            if (record.student.id === studentId) {
                const updatedPayments = { ...record.payments, [month]: newStatus };
                return { ...record, payments: updatedPayments };
            }
            return record;
        })
    );
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
            <CardTitle>Student Payment Status</CardTitle>
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
                         <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="w-full h-full flex items-center justify-center p-2 rounded-md hover:bg-muted">
                                    <StatusIndicator status={payments[month]} />
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
