
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, FileDown, CheckCircle, Wallet } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/hooks/use-toast';

const staffData = [
  { id: 1, name: "Dr. Evelyn Reed", role: "Principal", avatar: "https://placehold.co/100x100.png", initials: "ER", monthlySalary: 80000, presentDays: 22, absentDays: 0, status: "Pending" },
  { id: 2, name: "Prof. Samuel Jones", role: "Science Head", avatar: "https://placehold.co/100x100.png", initials: "SJ", monthlySalary: 65000, presentDays: 20, absentDays: 2, status: "Pending" },
  { id: 3, name: "Maria Garcia", role: "Arts Teacher", avatar: "https://placehold.co/100x100.png", initials: "MG", monthlySalary: 50000, presentDays: 21, absentDays: 1, status: "Paid" },
  { id: 4, name: "Leo Chen", role: "Admin Officer", avatar: "https://placehold.co/100x100.png", initials: "LC", monthlySalary: 45000, presentDays: 22, absentDays: 0, status: "Pending" },
  { id: 5, name: "Dr. Alan Grant", role: "History Professor", avatar: "https://placehold.co/100x100.png", initials: "AG", monthlySalary: 62000, presentDays: 19, absentDays: 3, status: "Paid" },
];

const TOTAL_WORKING_DAYS = 22;

export default function PayrollPage() {
  const { toast } = useToast();
  const [staff, setStaff] = useState(staffData);

  const calculateNetSalary = (monthlySalary: number, presentDays: number) => {
    return (monthlySalary / TOTAL_WORKING_DAYS) * presentDays;
  };

  const handleProcessPayment = (staffId: number) => {
    setStaff(prevStaff => prevStaff.map(s => s.id === staffId ? {...s, status: 'Paid'} : s));
    toast({
      title: "Payment Processed!",
      description: `Salary for ${staff.find(s => s.id === staffId)?.name} has been marked as paid.`,
    });
  };

  const handleExport = () => {
    const headers = ["ID", "Name", "Role", "Monthly Salary", "Present Days", "Absent Days", "Net Salary", "Status"];
    const csvContent = [
      headers.join(','),
      ...staff.map(s => [
        s.id,
        `"${s.name}"`,
        s.role,
        s.monthlySalary,
        s.presentDays,
        s.absentDays,
        calculateNetSalary(s.monthlySalary, s.presentDays).toFixed(2),
        s.status,
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', 'staff_payroll.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle>Staff Payroll</CardTitle>
            <CardDescription>
                Manage and process monthly salaries for all staff members.
            </CardDescription>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleExport}>
                <FileDown className="h-4 w-4 mr-2" />
                Export
            </Button>
            <Button>
                <CheckCircle className="h-4 w-4 mr-2" />
                Process All Pending
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg">
            <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Staff Member</TableHead>
                    <TableHead className="hidden md:table-cell">Monthly Salary</TableHead>
                    <TableHead>Attendance</TableHead>
                    <TableHead>Net Salary</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {staff.map((s) => {
                    const netSalary = calculateNetSalary(s.monthlySalary, s.presentDays);
                    return (
                        <TableRow key={s.id}>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-9 w-9">
                                        <AvatarImage src={s.avatar} alt={s.name} data-ai-hint="person" />
                                        <AvatarFallback>{s.initials}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="font-medium">{s.name}</div>
                                        <div className="text-sm text-muted-foreground">{s.role}</div>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                                ₹{s.monthlySalary.toLocaleString()}
                            </TableCell>
                            <TableCell>
                                <div className="text-sm">
                                    <span className="text-green-600 font-medium">{s.presentDays}</span> / <span className="text-red-600">{s.absentDays}</span>
                                </div>
                                <div className="text-xs text-muted-foreground">Present / Absent</div>
                            </TableCell>
                            <TableCell className="font-medium">
                                ₹{netSalary.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </TableCell>
                            <TableCell>
                                <Badge variant={s.status === 'Paid' ? 'secondary' : 'default'} className={s.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}>
                                    {s.status}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                    <Button aria-haspopup="true" size="icon" variant="ghost">
                                        <MoreHorizontal className="h-4 w-4" />
                                        <span className="sr-only">Toggle menu</span>
                                    </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem onClick={() => handleProcessPayment(s.id)} disabled={s.status === 'Paid'}>
                                        Mark as Paid
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>View Payslip</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    )
                })}
            </TableBody>
            </Table>
        </div>
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Showing <strong>{staff.length}</strong> staff members.
        </div>
      </CardFooter>
    </Card>
  );
}
