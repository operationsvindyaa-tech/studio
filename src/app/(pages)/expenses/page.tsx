
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, PlusCircle, MoreHorizontal, Edit, Trash2, ReceiptText, WalletCards, CalendarClock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { getExpenses, addExpense, updateExpense, deleteExpense, type Expense, expenseHeads, centers } from "@/lib/expenses-db";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
    }).format(amount);
};

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [formData, setFormData] = useState<Partial<Omit<Expense, 'id' | 'date'>> & { date?: Date }>({});
  const { toast } = useToast();

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const data = await getExpenses();
      setExpenses(data);
    } catch (error) {
      toast({ title: "Error", description: "Failed to load expenses.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [toast]);

  const handleOpenDialog = (expense: Expense | null) => {
    setEditingExpense(expense);
    setFormData(expense ? { ...expense, date: new Date(expense.date) } : { date: new Date() });
    setIsDialogOpen(true);
  };
  
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingExpense(null);
    setFormData({});
  };

  const handleFormChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleFormSubmit = async () => {
    if (!formData.head || !formData.center || !formData.date || !formData.amount) {
        toast({ title: "Error", description: "Please fill all required fields.", variant: "destructive" });
        return;
    }

    const expenseData = { ...formData, date: formData.date.toISOString(), amount: Number(formData.amount) };

    if (editingExpense) {
        await updateExpense(editingExpense.id, expenseData);
        toast({ title: "Success", description: "Expense updated successfully." });
    } else {
        await addExpense(expenseData);
        toast({ title: "Success", description: "New expense added successfully." });
    }
    fetchExpenses();
    handleCloseDialog();
  };
  
  const handleDelete = async (expenseId: string) => {
      await deleteExpense(expenseId);
      toast({ title: "Deleted", description: "The expense record has been removed." });
      fetchExpenses();
  }
  
  const totalExpenseThisMonth = expenses
    .filter(e => new Date(e.date).getMonth() === new Date().getMonth() && new Date(e.date).getFullYear() === new Date().getFullYear())
    .reduce((sum, e) => sum + e.amount, 0);
    
  const totalExpenseThisYear = expenses
    .filter(e => new Date(e.date).getFullYear() === new Date().getFullYear())
    .reduce((sum, e) => sum + e.amount, 0);


  return (
    <>
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Expenses (This Month)</CardTitle>
                    <WalletCards className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    {loading ? <Skeleton className="h-8 w-32" /> : <div className="text-2xl font-bold">{formatCurrency(totalExpenseThisMonth)}</div>}
                    <p className="text-xs text-muted-foreground">For {format(new Date(), 'MMMM yyyy')}</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Expenses (This Year)</CardTitle>
                    <CalendarClock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    {loading ? <Skeleton className="h-8 w-32" /> : <div className="text-2xl font-bold">{formatCurrency(totalExpenseThisYear)}</div>}
                    <p className="text-xs text-muted-foreground">For the year {new Date().getFullYear()}</p>
                </CardContent>
            </Card>
        </div>
        <Card>
            <CardHeader>
            <div className="flex justify-between items-center">
                <div>
                <CardTitle>Expense Tracker</CardTitle>
                <CardDescription>
                    Log and monitor all operational expenses for your centers.
                </CardDescription>
                </div>
                <Button onClick={() => handleOpenDialog(null)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Expense
                </Button>
            </div>
            </CardHeader>
            <CardContent>
            <div className="border rounded-lg">
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Expense Head</TableHead>
                    <TableHead>Center</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                        Array.from({length: 5}).map((_, i) => (
                            <TableRow key={i}>
                                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                                <TableCell className="text-right"><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
                                <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                            </TableRow>
                        ))
                    ) : expenses.length > 0 ? (
                    expenses.map(expense => (
                        <TableRow key={expense.id}>
                            <TableCell>{format(new Date(expense.date), "dd MMM, yyyy")}</TableCell>
                            <TableCell>
                                <div className="font-medium">{expense.head}</div>
                                <div className="text-xs text-muted-foreground truncate max-w-xs">{expense.description}</div>
                            </TableCell>
                            <TableCell>{expense.center}</TableCell>
                            <TableCell className="text-right font-mono">{formatCurrency(expense.amount)}</TableCell>
                            <TableCell>
                                <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button aria-haspopup="true" size="icon" variant="ghost">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Toggle menu</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleOpenDialog(expense)}>
                                    <Edit className="mr-2 h-4 w-4" /> Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleDelete(expense.id)} className="text-destructive">
                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center">No expenses recorded yet.</TableCell>
                        </TableRow>
                    )}
                </TableBody>
                </Table>
            </div>
            </CardContent>
            <CardFooter>
                <div className="text-xs text-muted-foreground">
                    Showing <strong>{expenses.length}</strong> expense records.
                </div>
            </CardFooter>
        </Card>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingExpense ? 'Edit' : 'Add'} Expense</DialogTitle>
            <DialogDescription>
              {editingExpense ? 'Update the details for this expense.' : 'Fill in the details to record a new expense.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="expense-head">Expense Head</Label>
                    <Select value={formData.head} onValueChange={(value) => handleFormChange('head', value)}>
                        <SelectTrigger id="expense-head"><SelectValue placeholder="Select a head" /></SelectTrigger>
                        <SelectContent>
                            {expenseHeads.map(head => <SelectItem key={head} value={head}>{head}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="center">Center</Label>
                    <Select value={formData.center} onValueChange={(value) => handleFormChange('center', value)}>
                        <SelectTrigger id="center"><SelectValue placeholder="Select a center" /></SelectTrigger>
                        <SelectContent>
                            {centers.map(center => <SelectItem key={center} value={center}>{center}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                        <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !formData.date && "text-muted-foreground")}>
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.date ? format(formData.date, "PPP") : <span>Pick a date</span>}
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={formData.date} onSelect={(date) => date && handleFormChange('date', date)} initialFocus />
                        </PopoverContent>
                    </Popover>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="amount">Amount (INR)</Label>
                    <Input id="amount" type="number" value={formData.amount} onChange={(e) => handleFormChange('amount', e.target.value)} placeholder="e.g., 500.00" />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea id="description" value={formData.description} onChange={(e) => handleFormChange('description', e.target.value)} placeholder="e.g., Office supplies for the month" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleFormSubmit}>Save Expense</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
