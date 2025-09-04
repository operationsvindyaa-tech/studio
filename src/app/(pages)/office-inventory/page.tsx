
"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MoreHorizontal, PlusCircle, Edit, Trash2, Package, ArrowUp, ArrowDown, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { useActionState, useTransition } from "react";
import { addItem, updateItem, deleteItem, updateStock } from "./actions";
import { getInventory, type InventoryItem, categories } from "@/lib/office-inventory-db";
import { centers } from "@/lib/expenses-db";
import { cn } from "@/lib/utils";

const formatNumber = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

const initialFormState = {
    message: "",
    success: false,
    error: null,
};

export default function OfficeInventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [filteredInventory, setFilteredInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isItemDialogOpen, setIsItemDialogOpen] = useState(false);
  const [isStockDialogOpen, setIsStockDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [stockUpdate, setStockUpdate] = useState<{ item: InventoryItem | null; type: 'in' | 'out' }>({ item: null, type: 'in' });
  const [stockQuantity, setStockQuantity] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [branchFilter, setBranchFilter] = useState("All Branches");
  const { toast } = useToast();

  const [formState, formAction] = useActionState(editingItem ? updateItem : addItem, initialFormState);

  const fetchInventory = async () => {
      setLoading(true);
      try {
          const data = await getInventory();
          setInventory(data);
      } catch (error) {
          toast({ title: "Error", description: "Failed to load inventory data.", variant: "destructive" });
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  useEffect(() => {
      let filtered = inventory;
      
      if (categoryFilter !== "All Categories") {
          filtered = filtered.filter(item => item.category === categoryFilter);
      }
      
      if (branchFilter !== "All Branches") {
          filtered = filtered.filter(item => item.branch === branchFilter);
      }

      setFilteredInventory(filtered);
  }, [categoryFilter, branchFilter, inventory]);

  useEffect(() => {
      if (formState.message) {
          toast({
              title: formState.success ? "Success" : "Error",
              description: formState.message,
              variant: formState.success ? "default" : "destructive",
          });
          if (formState.success) {
              fetchInventory();
              setIsItemDialogOpen(false);
          }
      }
  }, [formState, toast]);

  const handleOpenItemDialog = (item: InventoryItem | null) => {
    setEditingItem(item);
    setIsItemDialogOpen(true);
  };

  const handleOpenStockDialog = (item: InventoryItem, type: 'in' | 'out') => {
      setStockUpdate({ item, type });
      setStockQuantity(1);
      setIsStockDialogOpen(true);
  }
  
  const handleStockUpdate = async () => {
    if (!stockUpdate.item || stockQuantity <= 0) {
      toast({ title: "Invalid Quantity", variant: "destructive" });
      return;
    }
    const result = await updateStock(stockUpdate.item.id, stockUpdate.type, stockQuantity);
    toast({ title: result.success ? "Success" : "Error", description: result.message, variant: result.success ? "default" : "destructive" });
    if (result.success) {
      fetchInventory();
      setIsStockDialogOpen(false);
    }
  };

  const handleDelete = async (itemId: string) => {
    const result = await deleteItem(itemId);
    toast({ title: result.success ? "Success" : "Error", description: result.message, variant: result.success ? "default" : "destructive" });
    if (result.success) {
      fetchInventory();
    }
  };
  
  const totalValue = useMemo(() => inventory.reduce((sum, item) => sum + item.purchaseCost * item.stock, 0), [inventory]);
  const lowStockItems = useMemo(() => inventory.filter(item => item.stock <= (item.lowStockThreshold || 10)).length, [inventory]);

  return (
    <>
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Inventory Value</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    {loading ? <Skeleton className="h-8 w-32" /> : <div className="text-2xl font-bold">₹{formatNumber(totalValue)}</div>}
                    <p className="text-xs text-muted-foreground">Based on purchase cost</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Items Low on Stock</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    {loading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{lowStockItems}</div>}
                    <p className="text-xs text-muted-foreground">Items at or below threshold</p>
                </CardContent>
            </Card>
        </div>
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center flex-wrap gap-4">
                    <div>
                        <CardTitle>Office Inventory Tracker</CardTitle>
                        <CardDescription>
                            Manage all office supplies, equipment, and other assets.
                        </CardDescription>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        <Select value={branchFilter} onValueChange={setBranchFilter}>
                            <SelectTrigger className="w-[200px]"><SelectValue placeholder="Filter by Branch" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All Branches">All Branches</SelectItem>
                                {centers.map(branch => <SelectItem key={branch} value={branch}>{branch}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger className="w-[200px]"><SelectValue placeholder="Filter by Category" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All Categories">All Categories</SelectItem>
                                {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <Button onClick={() => handleOpenItemDialog(null)}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Add Item
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="border rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Item</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Branch</TableHead>
                                <TableHead className="text-right">Cost</TableHead>
                                <TableHead>Stock Level</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                             {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                        <TableCell className="text-right"><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
                                        <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                                        <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                                    </TableRow>
                                ))
                            ) : filteredInventory.length > 0 ? (
                                filteredInventory.map(item => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        <div className="font-medium">{item.name}</div>
                                        <div className="text-xs text-muted-foreground">{item.vendor}</div>
                                    </TableCell>
                                    <TableCell>{item.category}</TableCell>
                                    <TableCell>{item.branch}</TableCell>
                                    <TableCell className="text-right">₹{formatNumber(item.purchaseCost)}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Progress value={(item.stock / (item.lowStockThreshold * 2 || 20)) * 100} className={cn("w-24", item.stock <= item.lowStockThreshold && "bg-red-500/20 [&>*]:bg-red-500")}/>
                                            <span>{item.stock}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button size="icon" variant="ghost"><MoreHorizontal /></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleOpenStockDialog(item, 'in')}><ArrowUp className="mr-2 h-4 w-4 text-green-500" /> Stock In</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleOpenStockDialog(item, 'out')}><ArrowDown className="mr-2 h-4 w-4 text-red-500" /> Stock Out</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleOpenItemDialog(item)}><Edit className="mr-2 h-4 w-4" /> Edit Details</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleDelete(item.id)} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">No inventory items found.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
             <CardFooter>
                <div className="text-xs text-muted-foreground">
                    Showing <strong>{filteredInventory.length}</strong> of <strong>{inventory.length}</strong> items.
                </div>
            </CardFooter>
        </Card>
      </div>

      <Dialog open={isItemDialogOpen} onOpenChange={(open) => { if (!open) handleOpenItemDialog(null); setIsItemDialogOpen(open); }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Edit' : 'Add New'} Inventory Item</DialogTitle>
              <DialogDescription>
                {editingItem ? 'Update the details for this item.' : 'Enter details for a new inventory item.'}
              </DialogDescription>
            </DialogHeader>
            <form action={formAction}>
                 <input type="hidden" name="id" value={editingItem?.id || ''} />
                 <div className="grid gap-4 py-4">
                     <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-2">
                             <Label htmlFor="name">Item Name</Label>
                             <Input id="name" name="name" defaultValue={editingItem?.name} required />
                         </div>
                         <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Select name="category" defaultValue={editingItem?.category || categories[0]}>
                                <SelectTrigger id="category"><SelectValue/></SelectTrigger>
                                <SelectContent>
                                    {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                     </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                             <Label htmlFor="vendor">Vendor/Supplier</Label>
                             <Input id="vendor" name="vendor" defaultValue={editingItem?.vendor} />
                         </div>
                        <div className="space-y-2">
                            <Label htmlFor="branch">Branch</Label>
                            <Select name="branch" defaultValue={editingItem?.branch || centers[0]}>
                                <SelectTrigger id="branch"><SelectValue placeholder="Select Branch" /></SelectTrigger>
                                <SelectContent>
                                    {centers.map(branch => <SelectItem key={branch} value={branch}>{branch}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-2">
                             <Label htmlFor="purchaseCost">Purchase Cost</Label>
                             <Input id="purchaseCost" name="purchaseCost" type="number" defaultValue={editingItem?.purchaseCost} required />
                         </div>
                         <div className="space-y-2">
                             <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
                             <Input id="lowStockThreshold" name="lowStockThreshold" type="number" defaultValue={editingItem?.lowStockThreshold} />
                         </div>
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-2">
                             <Label htmlFor="stock">Initial Stock</Label>
                             <Input id="stock" name="stock" type="number" defaultValue={editingItem?.stock} disabled={!!editingItem} />
                         </div>
                     </div>
                 </div>
                 <DialogFooter>
                     <DialogClose asChild><Button type="button" variant="outline" onClick={() => setIsItemDialogOpen(false)}>Cancel</Button></DialogClose>
                     <Button type="submit">Save Item</Button>
                 </DialogFooter>
            </form>
          </DialogContent>
      </Dialog>
      
      <Dialog open={isStockDialogOpen} onOpenChange={(open) => { if (!open) setStockUpdate({item: null, type: 'in'}); setIsStockDialogOpen(open); }}>
          <DialogContent>
              <DialogHeader>
                  <DialogTitle>Update Stock for {stockUpdate.item?.name}</DialogTitle>
                  <DialogDescription>
                      Record items being added to or removed from inventory. Current stock: {stockUpdate.item?.stock}.
                  </DialogDescription>
              </DialogHeader>
               <div className="py-4 space-y-2">
                    <Label htmlFor="quantity">Quantity to {stockUpdate.type === 'in' ? 'Add' : 'Remove'}</Label>
                    <Input id="quantity" type="number" value={stockQuantity} onChange={(e) => setStockQuantity(Number(e.target.value) || 1)} min="1" max={stockUpdate.type === 'out' ? stockUpdate.item?.stock : undefined}/>
                </div>
              <DialogFooter>
                  <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                  <Button onClick={handleStockUpdate}>Confirm Update</Button>
              </DialogFooter>
          </DialogContent>
      </Dialog>
    </>
  );
}
