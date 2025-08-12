
"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, FileText, Printer, GraduationCap, Download, Edit, Trash2, PlusCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useReactToPrint } from "react-to-print";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

type Activity = {
  name: string;
  fee: number;
};

type StudentBillingInfo = {
  id: string;
  name: string;
  activities: Activity[];
  admissionFee?: number;
  discount?: number;
  status: "Paid" | "Due" | "Overdue";
  dueDate: string;
  paymentDate?: string;
  months: string[];
};

const initialBillingData: StudentBillingInfo[] = [
  { id: "B001", name: "Amelia Rodriguez", activities: [{ name: "Bharatanatyam", fee: 2500 }], admissionFee: 1000, discount: 200, status: "Paid", dueDate: "2024-08-05", paymentDate: "2024-08-03", months: ["August"] },
  { id: "B002", name: "Benjamin Carter", activities: [{ name: "Vocal Carnatic", fee: 3000 }, { name: "Yoga", fee: 1800 }], status: "Due", dueDate: "2024-08-05", months: ["August"] },
  { id: "B003", name: "Chloe Nguyen", activities: [{ name: "Keyboard/Piano", fee: 2800 }], status: "Overdue", dueDate: "2024-07-05", months: ["July"] },
  { id: "B004", name: "David Kim", activities: [{ name: "Guitar", fee: 2200 }], discount: 100, status: "Paid", dueDate: "2024-08-05", paymentDate: "2024-08-01", months: ["August"] },
  { id: "B005", name: "Emily Wang", activities: [{ name: "Yoga", fee: 1800 }, { name: "Art & Craft", fee: 1500 }], admissionFee: 1000, status: "Due", dueDate: "2024-08-10", months: ["August", "September"] },
];

const formatAmount = (amount: number) => {
    return amount.toFixed(2);
};

const calculateTotal = (student: StudentBillingInfo) => {
    const activitiesTotal = student.activities.reduce((sum, activity) => sum + activity.fee, 0);
    const admissionFee = student.admissionFee || 0;
    const discount = student.discount || 0;
    return activitiesTotal + admissionFee - discount;
}

export default function BillingPage() {
  const [billingData, setBillingData] = useState<StudentBillingInfo[]>(initialBillingData);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<StudentBillingInfo | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<StudentBillingInfo | null>(null);
  const invoiceRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handlePrint = useReactToPrint({
    content: () => invoiceRef.current,
  });
  
  const handleViewInvoice = (invoice: StudentBillingInfo) => {
    setSelectedInvoice(invoice);
    setIsInvoiceOpen(true);
  };
  
  const handleEditInvoice = (invoice: StudentBillingInfo) => {
    setEditingInvoice({ ...invoice, activities: [...invoice.activities] });
    setIsEditOpen(true);
  };
  
  const handleSaveEdit = () => {
    if (editingInvoice) {
        setBillingData(prevData =>
            prevData.map(item => (item.id === editingInvoice.id ? editingInvoice : item))
        );
        setIsEditOpen(false);
        setEditingInvoice(null);
        toast({
            title: "Success",
            description: "Invoice details have been updated successfully."
        });
    }
  };

  const handleActivityChange = (index: number, field: 'name' | 'fee', value: string) => {
    if (editingInvoice) {
        const updatedActivities = [...editingInvoice.activities];
        updatedActivities[index] = {
            ...updatedActivities[index],
            [field]: field === 'fee' ? Number(value) : value,
        };
        setEditingInvoice({ ...editingInvoice, activities: updatedActivities });
    }
  };

  const handleAddActivity = () => {
    if (editingInvoice) {
        setEditingInvoice({
            ...editingInvoice,
            activities: [...editingInvoice.activities, { name: '', fee: 0 }],
        });
    }
  };

  const handleRemoveActivity = (index: number) => {
    if (editingInvoice) {
        const updatedActivities = editingInvoice.activities.filter((_, i) => i !== index);
        setEditingInvoice({ ...editingInvoice, activities: updatedActivities });
    }
  };


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
                  <TableHead>Activities</TableHead>
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
                    <TableCell>{invoice.activities.map(a => a.name).join(', ')}</TableCell>
                    <TableCell className="text-right">{formatAmount(calculateTotal(invoice))}</TableCell>
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
                          <DropdownMenuItem onClick={() => handleEditInvoice(invoice)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit Invoice
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
                    {selectedInvoice.activities.map((activity, index) => (
                         <TableRow key={`activity-${index}`}>
                            <TableCell>
                                <p className="font-medium">Monthly Fee for {activity.name}</p>
                                <p className="text-muted-foreground">For month(s): {selectedInvoice.months.join(', ')}</p>
                            </TableCell>
                            <TableCell className="text-right">{formatAmount(activity.fee)}</TableCell>
                        </TableRow>
                    ))}
                    {selectedInvoice.admissionFee && (
                         <TableRow>
                            <TableCell>
                                <p className="font-medium">One-time Admission Fee</p>
                            </TableCell>
                            <TableCell className="text-right">{formatAmount(selectedInvoice.admissionFee)}</TableCell>
                        </TableRow>
                    )}
                  </TableBody>
                </Table>
                <Separator />
                <div className="flex justify-end mt-4">
                  <div className="w-64 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{formatAmount(selectedInvoice.activities.reduce((s, a) => s + a.fee, 0) + (selectedInvoice.admissionFee || 0))}</span>
                    </div>
                    {selectedInvoice.discount && (
                         <div className="flex justify-between">
                            <span className="text-muted-foreground">Discount</span>
                            <span>- {formatAmount(selectedInvoice.discount)}</span>
                        </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax (0%)</span>
                      <span>{formatAmount(0)}</span>
                    </div>
                    <Separator/>
                    <div className="flex justify-between font-bold text-base">
                      <span>Total</span>
                      <span>{formatAmount(calculateTotal(selectedInvoice))}</span>
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
      
       {/* Edit Invoice Dialog */}
       <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Invoice</DialogTitle>
            <DialogDescription>
              Correct the details for invoice #{editingInvoice?.id}.
            </DialogDescription>
          </DialogHeader>
          {editingInvoice && (
            <div className="space-y-4 py-4">
                <div className="space-y-2">
                    <Label htmlFor="studentName">Student Name</Label>
                    <Input id="studentName" value={editingInvoice.name} onChange={(e) => setEditingInvoice({...editingInvoice, name: e.target.value })}/>
                </div>

                <Separator />
                
                <div className="space-y-2">
                    <Label>Activities</Label>
                    {editingInvoice.activities.map((activity, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <Input placeholder="Activity Name" value={activity.name} onChange={(e) => handleActivityChange(index, 'name', e.target.value)} />
                            <Input type="number" placeholder="Fee" value={activity.fee} onChange={(e) => handleActivityChange(index, 'fee', e.target.value)} className="w-28" />
                            <Button variant="outline" size="icon" onClick={() => handleRemoveActivity(index)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={handleAddActivity}><PlusCircle className="mr-2 h-4 w-4" />Add Activity</Button>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <Label htmlFor="admissionFee">Admission Fee</Label>
                        <Input id="admissionFee" type="number" placeholder="1000" value={editingInvoice.admissionFee || ''} onChange={(e) => setEditingInvoice({...editingInvoice, admissionFee: Number(e.target.value) || undefined })} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="discount">Discount</Label>
                        <Input id="discount" type="number" placeholder="200" value={editingInvoice.discount || ''} onChange={(e) => setEditingInvoice({...editingInvoice, discount: Number(e.target.value) || undefined })} />
                    </div>
                </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
