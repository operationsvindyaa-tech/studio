
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { getStudents, type Student } from "@/lib/db";
import { getBillingData, updateBillingData, type StudentBillingInfo, calculateTotal } from "@/lib/billing-db";
import { useToast } from "@/hooks/use-toast";
import { Wallet, CreditCard, CheckCircle } from "lucide-react";
import { format } from "date-fns";

export default function MyPaymentsPage() {
    const [students, setStudents] = useState<Student[]>([]);
    const [selectedStudentId, setSelectedStudentId] = useState<string>('');
    const [billingRecords, setBillingRecords] = useState<StudentBillingInfo[]>([]);
    const [studentInvoices, setStudentInvoices] = useState<StudentBillingInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [studentData, allBillingData] = await Promise.all([getStudents(), getBillingData()]);
                setStudents(studentData);
                setBillingRecords(allBillingData);
                if (studentData.length > 0) {
                    setSelectedStudentId(studentData[0].id);
                }
            } catch (error) {
                console.error("Failed to load data", error);
                toast({ title: "Error", description: "Could not load student or payment data.", variant: "destructive" });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [toast]);

    useEffect(() => {
        if (selectedStudentId) {
            const invoices = billingRecords
                .filter(record => record.studentId === selectedStudentId)
                .sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
            setStudentInvoices(invoices);
        }
    }, [selectedStudentId, billingRecords]);

    const handlePayNow = (invoiceId: string) => {
        // Simulate payment
        const updatedRecords = billingRecords.map(record => {
            if (record.id === invoiceId) {
                return { ...record, status: 'Paid', paymentDate: new Date().toISOString() };
            }
            return record;
        });
        updateBillingData(updatedRecords); // Update the central cache
        setBillingRecords(updatedRecords); // Update local state to trigger re-render
        
        toast({
            title: "Payment Successful!",
            description: "Your fee payment has been recorded.",
            action: <CheckCircle className="h-5 w-5 text-green-500" />,
        });
    };

    const getStatusVariant = (status: StudentBillingInfo['status']) => {
        switch (status) {
            case "Paid": return "secondary";
            case "Due": return "outline";
            case "Overdue": return "destructive";
            default: return "default";
        }
    };
    
    const totalDue = studentInvoices
        .filter(inv => inv.status === 'Due' || inv.status === 'Overdue')
        .reduce((sum, inv) => sum + calculateTotal(inv), 0);

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                        <div>
                            <CardTitle>My Payments</CardTitle>
                            <CardDescription>View your fee invoices and payment history.</CardDescription>
                        </div>
                        <div className="w-full sm:w-auto">
                            <Select value={selectedStudentId} onValueChange={setSelectedStudentId} disabled={loading}>
                                <SelectTrigger className="w-full sm:w-[250px]">
                                    <SelectValue placeholder="Select Student" />
                                </SelectTrigger>
                                <SelectContent>
                                    {students.map(s => (
                                        <SelectItem key={s.id} value={s.id}>{s.name} ({s.id})</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            <div className="grid md:grid-cols-3 gap-6">
                 <Card className="md:col-span-1">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Amount Due</CardTitle>
                        <Wallet className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {loading ? <Skeleton className="h-8 w-32" /> : <div className="text-2xl font-bold">{totalDue.toFixed(2)}</div>}
                        <p className="text-xs text-muted-foreground">Across all pending invoices.</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Invoice History</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Invoice For</TableHead>
                                    <TableHead>Due Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                    <TableHead className="text-center">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    Array.from({ length: 4 }).map((_, i) => (
                                        <TableRow key={i}>
                                            <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                            <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                                            <TableCell className="text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                                            <TableCell className="text-center"><Skeleton className="h-9 w-24 mx-auto" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : studentInvoices.length > 0 ? (
                                    studentInvoices.map(invoice => (
                                        <TableRow key={invoice.id}>
                                            <TableCell>
                                                <div className="font-medium">{invoice.activities.map(a => a.name).join(', ')}</div>
                                                <div className="text-sm text-muted-foreground">For {invoice.months.join(', ')}</div>
                                            </TableCell>
                                            <TableCell>{format(new Date(invoice.dueDate), "dd MMM, yyyy")}</TableCell>
                                            <TableCell>
                                                <Badge variant={getStatusVariant(invoice.status)}>{invoice.status}</Badge>
                                            </TableCell>
                                            <TableCell className="text-right font-semibold">{calculateTotal(invoice).toFixed(2)}</TableCell>
                                            <TableCell className="text-center">
                                                {invoice.status === 'Paid' ? (
                                                     <div className="flex items-center justify-center text-sm text-green-600">
                                                        <CheckCircle className="h-4 w-4 mr-2" /> Paid
                                                    </div>
                                                ) : (
                                                    <Button size="sm" onClick={() => handlePayNow(invoice.id)}>
                                                        <CreditCard className="mr-2 h-4 w-4" /> Pay Now
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center h-24">
                                            No invoices found for this student.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
                 <CardFooter>
                    <div className="text-xs text-muted-foreground">
                        Showing <strong>{studentInvoices.length}</strong> invoices.
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
