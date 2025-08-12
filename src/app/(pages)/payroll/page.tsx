
"use client";

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, FileDown, CheckCircle, UserPlus, Eye, GraduationCap, Upload, Trash2, Printer } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import * as XLSX from 'xlsx';
import { getStaff as fetchStaffFromDB, type Staff } from "@/lib/staff-db";
import { Skeleton } from '@/components/ui/skeleton';
import { useReactToPrint } from 'react-to-print';

type StaffStatus = "Paid" | "Pending";

interface PayrollStaffMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  initials: string;
  monthlySalary: number;
  presentDays: number;
  absentDays: number;
  status: StaffStatus;
  joiningDate: string;
  pan: string;
  bankAccount: string;
  uan: string;
  department: string;
}

const TOTAL_WORKING_DAYS = 22;

const numberToWords = (num: number): string => {
    const a = ['','one ','two ','three ','four ', 'five ','six ','seven ','eight ','nine ','ten ','eleven ','twelve ','thirteen ','fourteen ','fifteen ','sixteen ','seventeen ','eighteen ','nineteen '];
    const b = ['', '', 'twenty','thirty','forty','fifty', 'sixty','seventy','eighty','ninety'];
    
    if ((num = num.toString()).length > 9) return 'overflow';
    const n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return ''; 
    let str = '';
    str += (n[1] != '00') ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
    str += (n[2] != '00') ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
    str += (n[3] != '00') ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
    str += (n[4] != '00') ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
    str += (n[5] != '00') ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : '';
    
    return str.trim().split(' ').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
}


export default function PayrollPage() {
  const { toast } = useToast();
  const [staff, setStaff] = useState<PayrollStaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPayslipOpen, setIsPayslipOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<PayrollStaffMember | null>(null);
  const [editingStaff, setEditingStaff] = useState<PayrollStaffMember | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [staffToDelete, setStaffToDelete] = useState<PayrollStaffMember | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const payslipRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => payslipRef.current,
  });

  useEffect(() => {
    async function fetchStaff() {
        setLoading(true);
        try {
            const dbStaff = await fetchStaffFromDB();
            const payrollData = dbStaff.map(s => ({
                id: s.id,
                name: s.fullName,
                role: s.jobDetails.role,
                avatar: s.personalInfo.photo,
                initials: s.initials,
                monthlySalary: s.payroll.salary,
                presentDays: 22, // Placeholder, can be replaced by real attendance data
                absentDays: 0, // Placeholder
                status: "Pending" as StaffStatus,
                joiningDate: s.jobDetails.dateOfJoining,
                pan: s.payroll.benefitsNumber, // Assuming PAN is stored here for now
                bankAccount: s.payroll.bankDetails.accountNumber,
                uan: s.payroll.benefitsNumber, // Assuming UAN is stored here for now
                department: s.jobDetails.department,
            }));
            setStaff(payrollData);
        } catch (error) {
            toast({
                title: "Error fetching staff",
                description: "Could not load staff data. Please try again.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    }
    fetchStaff();
  }, [toast]);


  const calculateNetSalary = (monthlySalary: number, presentDays: number) => {
    const perDaySalary = monthlySalary / TOTAL_WORKING_DAYS;
    const grossSalary = perDaySalary * presentDays;

    // Earnings breakdown
    const basic = grossSalary * 0.45;
    const hra = basic * 0.40;
    const conveyanceAllowance = 1600;
    const medicalAllowance = 1250;
    const incentives = 0; // Placeholder for bonus/overtime
    const specialAllowance = grossSalary - basic - hra - conveyanceAllowance - medicalAllowance - incentives;

    // Deductions
    const professionalTax = 200;
    const providentFund = basic * 0.12;
    const incomeTax = grossSalary > 60000 ? grossSalary * 0.10 : 0; // Simple TDS calculation
    const esi = 0; // Placeholder for Employee State Insurance
    const loanRecovery = 0; // Placeholder for Loan Recovery
    const otherDeductions = 0; // Placeholder for Other Deductions
    
    const totalDeductions = professionalTax + providentFund + incomeTax + esi + loanRecovery + otherDeductions;
    const netSalary = grossSalary - totalDeductions;
    
    return { grossSalary, basic, hra, conveyanceAllowance, medicalAllowance, incentives, specialAllowance, professionalTax, providentFund, incomeTax, esi, loanRecovery, otherDeductions, totalDeductions, netSalary };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
  };

  const handleProcessPayment = (staffId: string) => {
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
    const department = formData.get('department') as string;

    if (!name || !role || !salary) {
      toast({ title: "Error", description: "Please fill out all fields.", variant: "destructive" });
      return;
    }

    if (editingStaff) {
        setStaff(prevStaff => prevStaff.map(s => s.id === editingStaff.id ? {
            ...s,
            name,
            role,
            department,
            monthlySalary: parseFloat(salary),
        } : s));
        toast({ title: "Staff Updated", description: `${name}'s details have been updated.` });
    } else {
        const newStaffMember: PayrollStaffMember = {
            id: `EMP${String(staff.length + 1).padStart(3, '0')}`,
            name,
            role,
            department,
            avatar: "https://placehold.co/100x100.png",
            initials: name.split(' ').map(n => n[0]).join('').toUpperCase(),
            monthlySalary: parseFloat(salary),
            presentDays: TOTAL_WORKING_DAYS,
            absentDays: 0,
            status: "Pending" as StaffStatus,
            joiningDate: new Date().toISOString().split('T')[0],
            pan: "AXXXX0000Z",
            bankAccount: "********0000",
            uan: "100000000000"
        };
        setStaff(prevStaff => [...prevStaff, newStaffMember]);
        toast({ title: "Staff Added", description: `${name} has been added to the payroll.` });
    }
    
    setIsFormOpen(false);
    setEditingStaff(null);
  };
  
  const handleOpenEditDialog = (staffMember: PayrollStaffMember) => {
    setEditingStaff(staffMember);
    setIsFormOpen(true);
  };

  const handleOpenAddDialog = () => {
    setEditingStaff(null);
    setIsFormOpen(true);
  };
  
  const handleViewPayslip = (staffMember: PayrollStaffMember) => {
    setSelectedStaff(staffMember);
    setIsPayslipOpen(true);
  }

  const handleDelete = (staffMember: PayrollStaffMember) => {
    setStaffToDelete(staffMember);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (staffToDelete) {
      setStaff(staff.filter(s => s.id !== staffToDelete.id));
      toast({
        title: "Staff Member Deleted",
        description: `${staffToDelete.name} has been removed from the payroll.`,
      });
      setStaffToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };


  const handleExport = () => {
    const headers = ["ID", "Name", "Role", "Monthly Salary", "Gross Salary", "PF", "PT", "TDS", "Total Deductions", "Net Salary", "Status"];
    const csvContent = [
      headers.join(','),
      ...staff.map(s => {
        const { grossSalary, providentFund, professionalTax, incomeTax, totalDeductions, netSalary } = calculateNetSalary(s.monthlySalary, s.presentDays);
        return [
            s.id, `"${s.name}"`, s.role, s.monthlySalary.toFixed(2),
            grossSalary.toFixed(2), providentFund.toFixed(2), professionalTax.toFixed(2), incomeTax.toFixed(2),
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

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet) as any[];

        const importedStaff = json.map((row, index) => {
            const name = row.Name || row.name || `Staff ${index + 1}`;
            return {
                id: row.ID || `EMP${String(staff.length + index + 1).padStart(3, '0')}`,
                name: name,
                role: row.Role || row.role || "N/A",
                department: row.Department || row.department || "N/A",
                monthlySalary: parseFloat(row["Monthly Salary"] || row.monthlySalary || 0),
                presentDays: parseInt(row["Present Days"] || row.presentDays || TOTAL_WORKING_DAYS),
                absentDays: parseInt(row["Absent Days"] || row.absentDays || 0),
                status: (row.Status || row.status || "Pending") as StaffStatus,
                joiningDate: new Date().toISOString().split('T')[0],
                pan: row.PAN || row.pan || "AXXXX0000Z",
                bankAccount: row["Bank Account"] || row.bankAccount || "********0000",
                uan: row.UAN || row.uan || "100000000000",
                avatar: "https://placehold.co/100x100.png",
                initials: name.split(' ').map((n: string) => n[0]).join('').toUpperCase(),
            };
        });

        setStaff(prevStaff => [...prevStaff, ...importedStaff]);
        toast({
          title: "Import Successful",
          description: `${importedStaff.length} staff members have been imported.`,
        });
      } catch (error) {
        console.error("Error parsing file:", error);
        toast({
          title: "Import Failed",
          description: "Could not parse the file. Please ensure it is a valid Excel or CSV file.",
          variant: "destructive",
        });
      }
    };
    reader.readAsBinaryString(file);
    if(fileInputRef.current) fileInputRef.current.value = "";
  };


  const payslipDetails = selectedStaff ? calculateNetSalary(selectedStaff.monthlySalary, selectedStaff.presentDays) : null;
  const currentMonthYear = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

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
               <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".xlsx, .xls, .csv"
                />
              <Button variant="outline" onClick={handleImportClick}>
                  <Upload className="h-4 w-4 mr-2" />
                  Import Sheet
              </Button>
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
                {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i}>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <Skeleton className="h-9 w-9 rounded-full" />
                                    <div className="space-y-1">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-3 w-32" />
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell text-right"><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
                            <TableCell className="text-right"><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
                            <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                            <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                        </TableRow>
                    ))
                ) : staff.map((s) => {
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
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem onClick={() => handleDelete(s)} className="text-destructive">
                                        <Trash2 className="mr-2 h-4 w-4" /> Delete
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
                        <Label htmlFor="department" className="text-right">Department</Label>
                        <Input id="department" name="department" defaultValue={editingStaff?.department} className="col-span-3" placeholder="e.g., Academics"/>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="salary" className="text-right">Monthly Salary</Label>
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
        <DialogContent className="sm:max-w-3xl">
          <div ref={payslipRef} className="p-4">
            <DialogHeader>
                <div className="flex flex-col items-center text-center">
                    <div className="flex items-center gap-2">
                        <GraduationCap className="h-8 w-8 text-primary" />
                        <h1 className="text-2xl font-bold font-headline">VINDYAA - The Altitude of Art</h1>
                    </div>
                    <p className="text-sm text-muted-foreground">123 Learning Lane, Knowledge City, 560100</p>
                    <p className="text-sm text-muted-foreground">Phone: (080) 1234 5678 | Email: contact@vindyaa.com</p>
                    <DialogTitle className="text-xl mt-4">Payslip for {currentMonthYear}</DialogTitle>
                </div>
            </DialogHeader>
            {selectedStaff && payslipDetails && (
                <div className="text-sm mt-4">
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 rounded-lg border p-4">
                        <div className="grid grid-cols-2"><span className="text-muted-foreground">Employee ID:</span> <span className="font-medium">{selectedStaff.id}</span></div>
                        <div className="grid grid-cols-2"><span className="text-muted-foreground">Employee Name:</span> <span className="font-medium">{selectedStaff.name}</span></div>
                        <div className="grid grid-cols-2"><span className="text-muted-foreground">Designation:</span> <span className="font-medium">{selectedStaff.role}</span></div>
                        <div className="grid grid-cols-2"><span className="text-muted-foreground">Department:</span> <span className="font-medium">{selectedStaff.department}</span></div>
                        <div className="grid grid-cols-2"><span className="text-muted-foreground">Date of Joining:</span> <span className="font-medium">{new Date(selectedStaff.joiningDate).toLocaleDateString()}</span></div>
                        <div className="grid grid-cols-2"><span className="text-muted-foreground">Bank Account No:</span> <span className="font-medium">{selectedStaff.bankAccount}</span></div>
                        <div className="grid grid-cols-2"><span className="text-muted-foreground">PAN No:</span> <span className="font-medium">{selectedStaff.pan}</span></div>
                        <div className="grid grid-cols-2"><span className="text-muted-foreground">UAN:</span> <span className="font-medium">{selectedStaff.uan}</span></div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-4">
                        <div className="rounded-lg border">
                            <div className="bg-muted px-4 py-2 font-semibold">Earnings</div>
                            <div className="space-y-2 p-4">
                                <div className="flex justify-between"><span>Basic Salary</span> <span>{formatCurrency(payslipDetails.basic)}</span></div>
                                <div className="flex justify-between"><span>House Rent Allowance (HRA)</span> <span>{formatCurrency(payslipDetails.hra)}</span></div>
                                <div className="flex justify-between"><span>Conveyance Allowance</span> <span>{formatCurrency(payslipDetails.conveyanceAllowance)}</span></div>
                                <div className="flex justify-between"><span>Medical Allowance</span> <span>{formatCurrency(payslipDetails.medicalAllowance)}</span></div>
                                <div className="flex justify-between"><span>Incentives / Bonus</span> <span>{formatCurrency(payslipDetails.incentives)}</span></div>
                                <div className="flex justify-between"><span>Special Allowance</span> <span>{formatCurrency(payslipDetails.specialAllowance)}</span></div>
                            </div>
                            <Separator />
                            <div className="flex justify-between px-4 py-2 font-semibold">
                                <span>Gross Earnings</span>
                                <span>{formatCurrency(payslipDetails.grossSalary)}</span>
                            </div>
                        </div>
                        <div className="rounded-lg border">
                            <div className="bg-muted px-4 py-2 font-semibold">Deductions</div>
                            <div className="space-y-2 p-4">
                                <div className="flex justify-between"><span>Provident Fund (PF)</span> <span>{formatCurrency(payslipDetails.providentFund)}</span></div>
                                <div className="flex justify-between"><span>Professional Tax (PT)</span> <span>{formatCurrency(payslipDetails.professionalTax)}</span></div>
                                <div className="flex justify-between"><span>Income Tax (TDS)</span> <span>{formatCurrency(payslipDetails.incomeTax)}</span></div>
                                <div className="flex justify-between"><span>Employee State Insurance (ESI)</span> <span>{formatCurrency(payslipDetails.esi)}</span></div>
                                <div className="flex justify-between"><span>Loan Recovery / Advances</span> <span>{formatCurrency(payslipDetails.loanRecovery)}</span></div>
                                <div className="flex justify-between"><span>Other Deductions</span> <span>{formatCurrency(payslipDetails.otherDeductions)}</span></div>
                            </div>
                            <Separator />
                            <div className="flex justify-between px-4 py-2 font-semibold">
                            <span>Total Deductions</span>
                            <span>{formatCurrency(payslipDetails.totalDeductions)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 rounded-lg border bg-primary/10 p-4">
                        <div className="flex justify-between font-bold text-base">
                            <span>Net Salary</span>
                            <span>{formatCurrency(payslipDetails.netSalary)}</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1 font-medium text-right">
                            (In words: {numberToWords(Math.round(payslipDetails.netSalary))} Rupees Only)
                        </div>
                    </div>

                    <div className="mt-6 text-center text-xs text-muted-foreground">
                        Payment Date: {new Date().toLocaleDateString()} | Payment Mode: Bank Transfer
                        <br />
                        This is a computer-generated payslip and does not require a signature.
                    </div>
                </div>
            )}
            </div>
            <DialogFooter className="mt-4 sm:justify-end">
                <Button variant="outline" onClick={() => setIsPayslipOpen(false)}>Close</Button>
                <Button onClick={handlePrint}>
                    <Printer className="mr-2 h-4 w-4" />
                    Print
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
       <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
                This action cannot be undone. This will permanently delete {staffToDelete?.name}'s record
                from the payroll.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setStaffToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">
                Delete
            </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
