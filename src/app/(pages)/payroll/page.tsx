
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, FileDown, CheckCircle, UserPlus, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
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
import { Separator } from '@/components/ui/separator';

type StaffStatus = "Paid" | "Pending";

interface StaffMember {
  id: number;
  name: string;
  role: string;
  avatar: string;
  initials: string;
  monthlySalary: number;
  presentDays: number;
  absentDays: number;
  status: StaffStatus;
}

const staffData: StaffMember[] = [
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
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPayslipOpen, setIsPayslipOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);

  const calculateNetSalary = (monthlySalary: number, presentDays: number) => {
    const perDaySalary = monthlySalary / TOTAL_WORKING_DAYS;
    const grossSalary = perDaySalary * presentDays;
    const professionalTax = 200;
    const providentFund = grossSalary * 0.12;
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

  const handleProcessAll = () => {
    const pendingCount = staff.filter(s => s.status === 'Pending').length;
    if (pendingCount === 0) {
        toast({ title: "No Pending Payments", description: "All staff salaries have already been processed." });
        return;
    }
    setStaff(prevStaff => prevStaff.map(s => s.status === 'Pending' ? { ...s, status: 'Paid' } : s));
    toast({
        title: `Processed ${pendingCount} Payments`,
        description: "All pending staff salaries have been marked as paid."
    });
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get('name') as string;
    const role = formData.get('role') as string;
    const salary = formData.get('salary') as string;

    if (!name || !role || !salary) {
      toast({ title: "Error", description: "Please fill out all fields.", variant: "destructive" });
      return;
    }

    if (editingStaff) {
        setStaff(prevStaff => prevStaff.map(s => s.id === editingStaff.id ? {
            ...s,
            name,
            role,
            monthlySalary: parseFloat(salary),
        } : s));
        toast({ title: "Staff Updated", description: `${name}'s details have been updated.` });
    } else {
        const newStaffMember = {
            id: staff.length + 1,
            name,
            role,
            avatar: "https://placehold.co/100x100.png",
            initials: name.split(' ').map(n => n[0]).join('').toUpperCase(),
            monthlySalary: parseFloat(salary),
            presentDays: TOTAL_WORKING_DAYS,
            absentDays: 0,
            status: "Pending" as StaffStatus,
        };
        setStaff(prevStaff => [...prevStaff, newStaffMember]);
        toast({ title: "Staff Added", description: `${name} has been added to the payroll.` });
    }
    
    setIsFormOpen(false);
    setEditingStaff(null);
  };
  
  const handleOpenEditDialog = (staffMember: StaffMember) => {
    setEditingStaff(staffMember);
    setIsFormOpen(true);
  };

  const handleOpenAddDialog = () => {
    setEditingStaff(null);
    setIsFormOpen(true);
  };
  
  const handleViewPayslip = (staffMember: StaffMember) => {
    setSelectedStaff(staffMember);
    setIsPayslipOpen(true);
  }

  const handleExport = () => {
    const headers = ["ID", "Name", "Role", "Monthly Salary (INR)", "Gross Salary (INR)", "PF (INR)", "PT (INR)", "Total Deductions (INR)", "Net Salary (INR)", "Status"];
    const csvContent = [
      headers.join(','),
      ...staff.map(s => {
        const { grossSalary, providentFund, professionalTax, totalDeductions, netSalary } = calculateNetSalary(s.monthlySalary, s.presentDays);
        return [
            s.id, `"${s.name}"`, s.role, s.monthlySalary.toFixed(2),
            grossSalary.toFixed(2), providentFund.toFixed(2), professionalTax.toFixed(2),
            totalDeductions.toFixed(2), netSalary.toFixed(2), s.status,
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

  const payslipDetails = selectedStaff ? calculateNetSalary(selectedStaff.monthlySalary, selectedStaff.presentDays) : null;

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
              <CardTitle>Staff Payroll</CardTitle>
              <CardDescription>
                  Manage and process monthly salaries for all staff members.
              </CardDescription>
          </div>
          <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleOpenAddDialog}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Staff
              </Button>
              <Button variant="outline" onClick={handleExport}>
                  <FileDown className="h-4 w-4 mr-2" />
                  Export
              </Button>
              <Button onClick={handleProcessAll}>
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
                                      <DropdownMenuItem onClick={() => handleViewPayslip(s)}>
                                        <Eye className="mr-2 h-4 w-4" /> View Payslip
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => handleProcessPayment(s.id)} disabled={s.status === 'Paid'}>
                                          Mark as Paid
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => handleOpenEditDialog(s)}>
                                        Edit Details
                                      </DropdownMenuItem>
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

      {/* Add/Edit Staff Dialog */}
      <Dialog open={isFormOpen} onOpenChange={(open) => {
            setIsFormOpen(open);
            if (!open) setEditingStaff(null);
        }}>
          <DialogContent>
              <DialogHeader>
                  <DialogTitle>{editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}</DialogTitle>
                  <DialogDescription>
                      {editingStaff ? "Update the details for this staff member." : "Enter the details for the new staff member."}
                  </DialogDescription>
              </DialogHeader>
              <form id="staff-form" onSubmit={handleFormSubmit}>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Name</Label>
                        <Input id="name" name="name" defaultValue={editingStaff?.name} className="col-span-3" placeholder="e.g., John Doe"/>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="role" className="text-right">Role</Label>
                        <Input id="role" name="role" defaultValue={editingStaff?.role} className="col-span-3" placeholder="e.g., Guitar Teacher"/>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="salary" className="text-right">Monthly Salary (INR)</Label>
                        <Input id="salary" name="salary" type="number" defaultValue={editingStaff?.monthlySalary} className="col-span-3" placeholder="e.g., 50000"/>
                    </div>
                </div>
              </form>
              <DialogFooter>
                  <DialogClose asChild><Button variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button></DialogClose>
                  <Button type="submit" form="staff-form">{editingStaff ? 'Save Changes' : 'Add Staff Member'}</Button>
              </DialogFooter>
          </DialogContent>
      </Dialog>
      
      {/* View Payslip Dialog */}
      <Dialog open={isPayslipOpen} onOpenChange={setIsPayslipOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Payslip for {selectedStaff?.name}</DialogTitle>
            <DialogDescription>
              Salary breakdown for the current period.
            </DialogDescription>
          </DialogHeader>
          {selectedStaff && payslipDetails && (
            <div className="space-y-4">
                <div className="space-y-2">
                    <div className="flex justify-between items-center"><span>Monthly Salary:</span> <span className="font-medium">{formatCurrency(selectedStaff.monthlySalary)}</span></div>
                    <div className="flex justify-between items-center"><span>Working Days:</span> <span className="font-medium">{selectedStaff.presentDays} / {TOTAL_WORKING_DAYS}</span></div>
                </div>
                <Separator />
                <div>
                    <h4 className="font-semibold mb-2">Earnings</h4>
                    <div className="flex justify-between items-center text-muted-foreground"><span>Gross Salary:</span> <span className="font-medium text-foreground">{formatCurrency(payslipDetails.grossSalary)}</span></div>
                </div>
                <Separator />
                <div>
                    <h4 className="font-semibold mb-2">Deductions (Tax Heads)</h4>
                    <div className="flex justify-between items-center text-muted-foreground"><span>Provident Fund (PF):</span> <span>{formatCurrency(payslipDetails.providentFund)}</span></div>
                    <div className="flex justify-between items-center text-muted-foreground"><span>Professional Tax (PT):</span> <span>{formatCurrency(payslipDetails.professionalTax)}</span></div>
                    <Separator className="my-2" />
                    <div className="flex justify-between items-center text-muted-foreground">
                        <strong>Total Deductions:</strong>
                        <strong className="text-destructive">{formatCurrency(payslipDetails.totalDeductions)}</strong>
                    </div>
                </div>
                <Separator />
                <div className="flex justify-between items-center text-lg">
                    <strong className="text-lg">Net Salary Payable:</strong>
                    <strong className="text-lg text-green-600">{formatCurrency(payslipDetails.netSalary)}</strong>
                </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPayslipOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );

    