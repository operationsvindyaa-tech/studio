
"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, FileText, Printer, GraduationCap, Download } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useReactToPrint } from "react-to-print";

type StudentBillingInfo = {
  id: string;
  name: string;
  course: string;
  monthlyFee: number;
  status: "Paid" | "Due" | "Overdue";
  dueDate: string;
  paymentDate?: string;
};

const billingData: StudentBillingInfo[] = [
  { id: "B001", name: "Amelia Rodriguez", course: "Bharatanatyam", monthlyFee: 2500, status: "Paid", dueDate: "2024-08-05", paymentDate: "2024-08-03" },
  { id: "B002", name: "Benjamin Carter", course: "Vocal Carnatic", monthlyFee: 3000, status: "Due", dueDate: "2024-08-05" },
  { id: "B003", name: "Chloe Nguyen", course: "Keyboard/Piano", monthlyFee: 2800, status: "Overdue", dueDate: "2024-07-05" },
  { id: "B004", name: "David Kim", course: "Guitar", monthlyFee: 2200, status: "Paid", dueDate: "2024-08-05", paymentDate: "2024-08-01" },
  { id: "B005", name: "Emily Wang", course: "Yoga", monthlyFee: 1800, status: "Due", dueDate: "2024-08-10" },
];

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
    }).format(amount);
};

export default function BillingPage() {
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<StudentBillingInfo | null>(null);
  const invoiceRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => invoiceRef.current,
  });
  
  const handleViewInvoice = (invoice: StudentBillingInfo) => {
    setSelectedInvoice(invoice);
    setIsInvoiceOpen(true);
  };

  const currentMonthYear = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Student Billing</CardTitle>
          <CardDescription>
            Manage student fee payments and generate invoices for activities.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {billingData.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>
                      <div className="font-medium">{invoice.name}</div>
                      <div className="text-sm text-muted-foreground">Invoice #{invoice.id}</div>
                    </TableCell>
                    <TableCell>{invoice.course}</TableCell>
                    <TableCell className="text-right">{formatCurrency(invoice.monthlyFee)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          invoice.status === "Paid" ? "secondary" : invoice.status === "Due" ? "outline" : "destructive"
                        }
                        className={
                           invoice.status === "Paid" ? "bg-green-100 text-green-800" : invoice.status === "Due" ? "bg-orange-100 text-orange-800" : ""
                        }
                      >
                        {invoice.status}
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
                          <DropdownMenuItem onClick={() => handleViewInvoice(invoice)}>
                            <FileText className="mr-2 h-4 w-4" /> View Invoice
                          </DropdownMenuItem>
                          <DropdownMenuItem disabled={invoice.status === "Paid"}>
                            Mark as Paid
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter>
            <div className="text-xs text-muted-foreground">
                Showing <strong>{billingData.length}</strong> records.
            </div>
        </CardFooter>
      </Card>

      {/* Invoice Dialog */}
      <Dialog open={isInvoiceOpen} onOpenChange={setIsInvoiceOpen}>
        <DialogContent className="sm:max-w-2xl">
          <div ref={invoiceRef} className="p-6">
            <DialogHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <GraduationCap className="h-8 w-8 text-primary" />
                            <h1 className="text-2xl font-bold font-headline">VINDYAA - The Altitude of Art</h1>
                        </div>
                        <p className="text-xs text-muted-foreground text-left">#19, 1st Cross, 1st Main, Sri Manjunatha Layout, <br/> Basavanapura Main Rd, Near SBI Bank, Bengaluru, Karnataka 560049</p>
                    </div>
                    <div className="text-right">
                        <DialogTitle className="text-2xl font-bold">INVOICE</DialogTitle>
                        <p className="text-sm text-muted-foreground">Invoice #{selectedInvoice?.id}</p>
                    </div>
                </div>
            </DialogHeader>
            {selectedInvoice && (
              <div className="mt-8 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground font-semibold">Bill To:</p>
                    <p>{selectedInvoice.name}</p>
                    <p>Student ID: {selectedInvoice.id.replace('B','S')}</p>
                  </div>
                  <div className="text-right">
                    <p><span className="text-muted-foreground font-semibold">Invoice Date:</span> {new Date().toLocaleDateString()}</p>
                    <p><span className="text-muted-foreground font-semibold">Due Date:</span> {new Date(selectedInvoice.dueDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <Separator className="my-6" />
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <p className="font-medium">Monthly Fee for {selectedInvoice.course}</p>
                        <p className="text-muted-foreground">For the month of {currentMonthYear}</p>
                      </TableCell>
                      <TableCell className="text-right">{formatCurrency(selectedInvoice.monthlyFee)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                <Separator />
                <div className="flex justify-end mt-4">
                  <div className="w-64 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{formatCurrency(selectedInvoice.monthlyFee)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax (0%)</span>
                      <span>{formatCurrency(0)}</span>
                    </div>
                    <Separator/>
                    <div className="flex justify-between font-bold text-base">
                      <span>Total</span>
                      <span>{formatCurrency(selectedInvoice.monthlyFee)}</span>
                    </div>
                  </div>
                </div>
                 <div className="mt-8">
                    <p className="font-semibold">Notes</p>
                    <p className="text-xs text-muted-foreground">Please make the payment before the due date to avoid late fees. Thank you for your prompt payment.</p>
                </div>
                <div className="mt-6 text-center text-xs text-muted-foreground">
                    This is a computer-generated invoice and does not require a signature.
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="mt-4 sm:justify-end p-6 pt-0">
            <Button variant="outline" onClick={() => setIsInvoiceOpen(false)}>Close</Button>
            <Button onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              Print / Save PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
