
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, XCircle, AlertCircle, Download } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { getBillingData, updateBillingData, StudentBillingInfo, courseFees } from "@/lib/billing-db";
import { useToast } from "@/hooks/use-toast";
import { getStudents, Student } from "@/lib/db";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import * as XLSX from "xlsx";

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
const allCourses = Object.keys(courseFees).map(key => key.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '));
const paymentStatuses: PaymentStatus[] = ["Paid", "Due", "Overdue"];


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
  const [allPaymentData, setAllPaymentData] = useState<StudentPaymentRecord[]>([]);
  const [filteredPaymentData, setFilteredPaymentData] = useState<StudentPaymentRecord[]>([]);
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [billingRecords, setBillingRecords] = useState<StudentBillingInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [selectedCourse, setSelectedCourse] = useState<string>("All Courses");
  const [selectedStatus, setSelectedStatus] = useState<string>("All Statuses");
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
    if (allStudents.length > 0) {
        let studentsToProcess = allStudents;
        const courseKey = selectedCourse.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
        
        if (selectedCourse !== "All Courses") {
            studentsToProcess = allStudents.filter(student => 
                student.enrolledCourses?.includes(courseKey)
            );
        }

        const studentPaymentRecordsMap: Map<string, StudentPaymentRecord> = new Map();

        // Initialize all students to be processed
        studentsToProcess.forEach(student => {
            studentPaymentRecordsMap.set(student.id, {
                student: student,
                payments: {}
            });
        });

        billingRecords.forEach(record => {
            const studentRecord = studentPaymentRecordsMap.get(record.studentId);
            if (studentRecord) {
                const tuitionActivities = record.activities.filter(a => a.name === "Tuition Fee");
                
                tuitionActivities.forEach(tuitionActivity => {
                    const activityCourseKey = (tuitionActivity.description || "")
                        .replace("Tuition Fee for ", "")
                        .replace(/ for the month.*$/, "")
                        .toLowerCase()
                        .replace(/ & /g, '-')
                        .replace(/ /g, '-');
                    
                    if (selectedCourse !== "All Courses" && activityCourseKey !== courseKey) {
                        return; // Skip if a specific course is selected and it doesn't match
                    }

                    record.months.forEach(monthName => {
                        const monthAbbr = Object.keys(monthMap).find(key => monthMap[key as keyof typeof monthMap].toLowerCase() === monthName.toLowerCase());
                        if (monthAbbr) {
                             if (!studentRecord.payments[monthAbbr]) {
                                studentRecord.payments[monthAbbr] = { status: record.status, amount: 0 };
                             }
                             studentRecord.payments[monthAbbr].amount += tuitionActivity.fee;
                             // Status of the last relevant invoice for the month will be taken.
                             studentRecord.payments[monthAbbr].status = record.status;
                        }
                    });
                })
            }
        });
        
        setAllPaymentData(Array.from(studentPaymentRecordsMap.values()));
    }
  }, [allStudents, billingRecords, selectedCourse]);

  useEffect(() => {
      if (selectedStatus === "All Statuses") {
          setFilteredPaymentData(allPaymentData);
      } else {
          const filtered = allPaymentData.filter(record => 
              Object.values(record.payments).some(payment => payment.status === selectedStatus)
          );
          setFilteredPaymentData(filtered);
      }
  }, [allPaymentData, selectedStatus]);
  
  const years = Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - i).toString());
  
  const handleStatusChange = (studentId: string, month: string, newStatus: PaymentStatus) => {
    // Find the corresponding billing record and update it
    const updatedBillingRecords = billingRecords.map(record => {
        const monthFullName = monthMap[month as keyof typeof monthMap];
        if (record.studentId === studentId && record.months.includes(monthFullName)) {
            const courseKeyFromDesc = (record.activities.find(a => a.name === "Tuition Fee")?.description || "")
                .replace("Tuition Fee for ", "")
                .replace(/ for month.*$/, "")
                .toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
            const selectedCourseKey = selectedCourse.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');

            if(selectedCourse === "All Courses" || courseKeyFromDesc === selectedCourseKey) {
                 return { ...record, status: newStatus };
            }
        }
        return record;
    });

    // Update the central cache
    updateBillingData(updatedBillingRecords);
    setBillingRecords(updatedBillingRecords); // Update local state to trigger re-render

    const studentName = allPaymentData.find(r => r.student.id === studentId)?.student.name;
    toast({
        title: "Status Updated",
        description: `${studentName}'s payment for ${monthMap[month as keyof typeof monthMap]} is now ${newStatus}.`,
    });
  };
  
   const handleExport = () => {
    if (filteredPaymentData.length === 0) {
      toast({ title: "No data to export", variant: "destructive" });
      return;
    }
    const worksheetData = filteredPaymentData.map(record => {
      const row: { [key: string]: string | number } = {
        'Student Name': record.student.name,
      };
      months.forEach(month => {
        const payment = record.payments[month];
        row[month] = payment ? `${payment.amount} (${payment.status})` : 'N/A';
      });
      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Payment Tracker');
    XLSX.writeFile(workbook, `Payment_Tracker_${selectedCourse}_${selectedYear}.xlsx`);
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
          <div className="flex items-center gap-2">
           <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export to Excel
            </Button>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="All Statuses">All Statuses</SelectItem>
                    {paymentStatuses.map(status => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
           <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Courses">All Courses</SelectItem>
                {allCourses.map(course => (
                    <SelectItem key={course} value={course}>{course}</SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                filteredPaymentData.map(({ student, payments }) => (
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

    