
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, FileDown, CheckCircle, PlusCircle, UserPlus, Wallet } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';

const staffData = [
  { id: 1, name: "Priya Sharma", role: "Bharatanatyam Guru", avatar: "https://placehold.co/100x100.png", initials: "PS", monthlySalary: 75000, presentDays: 22, absentDays: 0, status: "Paid" },
  { id: 2, name: "Ravi Kumar", role: "Vocal Carnatic Ustad", avatar: "https://placehold.co/100x100.png", initials: "RK", monthlySalary: 72000, presentDays: 21, absentDays: 1, status: "Pending" },
  { id: 3, name: "Anjali Mehta", role: "Keyboard & Piano Instructor", avatar: "https://placehold.co/100x100.png", initials: "AM", monthlySalary: 55000, presentDays: 20, absentDays: 2, status: "Paid" },
  { id: 4, name: "Vikram Singh", role: "Guitar Teacher", avatar: "https://placehold.co/100x100.png", initials: "VS", monthlySalary: 52000, presentDays: 22, absentDays: 0, status: "Pending" },
  { id: 5, name: "Sunita Reddy", role: "Yoga Acharya", avatar: "https://placehold.co/100x100.png", initials: "SR", monthlySalary: 60000, presentDays: 19, absentDays: 3, status: "Pending" },
  { id: 6, name: "Arjun Desai", role: "Kalaripayattu Master", avatar: "https://placehold.co/100x100.png", initials: "AD", monthlySalary: 68000, presentDays: 21, absentDays: 1, status: "Paid" },
  { id: 7, name: "Meera Iyer", role: "Admin & Operations Head", avatar: "https://placehold.co/100x100.png", initials: "MI", monthlySalary: 85000, presentDays: 22, absentDays: 0, status: "Paid" },
];

const TOTAL_WORKING_DAYS = 22;

export default function PayrollPage() {
  const { toast } = useToast();
  const [staff, setStaff] = useState(staffData);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffRole, setNewStaffRole] = useState('');
  const [newStaffSalary, setNewStaffSalary] = useState('');

  const calculateNetSalary = (monthlySalary: number, presentDays: number) => {
    // Basic salary calculation
    const perDaySalary = monthlySalary / TOTAL_WORKING_DAYS;
    const grossSalary = perDaySalary * presentDays;

    // Simplified Tax Calculation (example)
    const professionalTax = 200; // Fixed PT
    const providentFund = grossSalary * 0.12; // 12% PF deduction
    
    const totalDeductions = professionalTax + providentFund;
    const netSalary = grossSalary - totalDeductions;
    
    return { grossSalary, professionalTax, providentFund, totalDeductions, netSalary };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
    }).format(amount);
  };

  const handleProcessPayment = (staffId: number) => {
    setStaff(prevStaff => prevStaff.map(s => s.id === staffId ? {...s, status: 'Paid'} : s));
    toast({
      title: "Payment Processed!",
      description: `Salary for ${staff.find(s => s.id === staffId)?.name} has been marked as paid.`,
    });
  };

  const handleAddStaff = () => {
    if (!newStaffName || !newStaffRole || !newStaffSalary) {
      toast({
        title: "Error",
        description: "Please fill out all fields.",
        variant: "destructive",
      });
      return;
    }

    const newStaffMember = {
      id: staff.length + 1,
      name: newStaffName,
      role: newStaffRole,
      avatar: "https://placehold.co/100x100.png",
      initials: newStaffName.split(' ').map(n => n[0]).join('').toUpperCase(),
      monthlySalary: parseFloat(newStaffSalary),
      presentDays: TOTAL_WORKING_DAYS, // Default to full attendance
      absentDays: 0,
      status: "Pending" as "Pending" | "Paid",
    };

    setStaff(prevStaff => [...prevStaff, newStaffMember]);
    toast({
      title: "Staff Added",
      description: `${newStaffName} has been added to the payroll.`,
    });

    // Reset form fields
    setNewStaffName('');
    setNewStaffRole('');
    setNewStaffSalary('');
  };

  const handleExport = () => {
    const headers = ["ID", "Name", "Role", "Monthly Salary (INR)", "Gross Salary (INR)", "PF (INR)", "PT (INR)", "Total Deductions (INR)", "Net Salary (INR)", "Status"];
    const csvContent = [
      headers.join(','),
      ...staff.map(s => {
        const { grossSalary, providentFund, professionalTax, totalDeductions, netSalary } = calculateNetSalary(s.monthlySalary, s.presentDays);
        return [
            s.id,
            `"${s.name}"`,
            s.role,
            s.monthlySalary.toFixed(2),
            grossSalary.toFixed(2),
            providentFund.toFixed(2),
            professionalTax.toFixed(2),
            totalDeductions.toFixed(2),
            netSalary.toFixed(2),
            s.status,
        ].join(',');
      })
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
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Add Staff
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Staff Member</DialogTitle>
                        <DialogDescription>
                            Enter the details for the new staff member.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">Name</Label>
                            <Input id="name" value={newStaffName} onChange={(e) => setNewStaffName(e.target.value)} className="col-span-3" placeholder="e.g., John Doe"/>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="role" className="text-right">Role</Label>
                            <Input id="role" value={newStaffRole} onChange={(e) => setNewStaffRole(e.target.value)} className="col-span-3" placeholder="e.g., Guitar Teacher"/>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="salary" className="text-right">Monthly Salary</Label>
                            <Input id="salary" type="number" value={newStaffSalary} onChange={(e) => setNewStaffSalary(e.target.value)} className="col-span-3" placeholder="e.g., 50000"/>
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                           <Button type="button" onClick={handleAddStaff}>Add Staff Member</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

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
                    <TableHead className="hidden md:table-cell text-right">Monthly Salary</TableHead>
                    <TableHead className="text-right">Net Salary</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {staff.map((s) => {
                    const { netSalary } = calculateNetSalary(s.monthlySalary, s.presentDays);
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
                            <TableCell className="hidden md:table-cell text-right">
                                {formatCurrency(s.monthlySalary)}
                            </TableCell>
                            <TableCell className="font-medium text-right">
                                {formatCurrency(netSalary)}
                                <div className="text-xs text-muted-foreground">
                                    {s.presentDays}/{TOTAL_WORKING_DAYS} days
                                </div>
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
          Showing <strong>{staff.length}</strong> staff members. All amounts are in INR.
        </div>
      </CardFooter>
    </Card>
  );
}
