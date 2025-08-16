
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { getMerchandise, updateMerchandiseStock, type MerchandiseItem } from "@/lib/merchandise-db";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusCircle, MinusCircle, PackagePlus, ShoppingCart, ArrowDown, ArrowUp } from "lucide-react";

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
    }).format(amount);
};

export default function MerchandisePage() {
  const [inventory, setInventory] = useState<MerchandiseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isStockInDialogOpen, setIsStockInDialogOpen] = useState(false);
  const [isSaleDialogOpen, setIsSaleDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MerchandiseItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const data = await getMerchandise();
      setInventory(data);
    } catch (error) {
      toast({ title: "Error", description: "Failed to load merchandise data.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [toast]);

  const handleOpenDialog = (item: MerchandiseItem, type: 'stock-in' | 'sale') => {
    setSelectedItem(item);
    setQuantity(1);
    if (type === 'stock-in') {
      setIsStockInDialogOpen(true);
    } else {
      setIsSaleDialogOpen(true);
    }
  };

  const handleCloseDialogs = () => {
    setIsStockInDialogOpen(false);
    setIsSaleDialogOpen(false);
    setSelectedItem(null);
    setQuantity(1);
  };

  const handleStockUpdate = async () => {
    if (!selectedItem || quantity <= 0) {
      toast({ title: "Invalid Quantity", description: "Please enter a valid quantity.", variant: "destructive" });
      return;
    }

    const newStock = selectedItem.stock + quantity;
    await updateMerchandiseStock(selectedItem.id, newStock);
    toast({ title: "Stock Updated", description: `${quantity} unit(s) of ${selectedItem.name} added to inventory.` });
    fetchInventory();
    handleCloseDialogs();
  };

  const handleSale = async () => {
    if (!selectedItem || quantity <= 0) {
      toast({ title: "Invalid Quantity", description: "Please enter a valid quantity.", variant: "destructive" });
      return;
    }
    if (quantity > selectedItem.stock) {
      toast({ title: "Insufficient Stock", description: `Only ${selectedItem.stock} unit(s) available.`, variant: "destructive" });
      return;
    }

    const newStock = selectedItem.stock - quantity;
    await updateMerchandiseStock(selectedItem.id, newStock);
    toast({ title: "Sale Recorded", description: `${quantity} unit(s) of ${selectedItem.name} sold.` });
    fetchInventory();
    handleCloseDialogs();
  };

  const totalStockValue = inventory.reduce((sum, item) => sum + (item.price * item.stock), 0);
  const totalStockItems = inventory.reduce((sum, item) => sum + item.stock, 0);

  return (
    <>
      <div className="space-y-6">
         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Inventory Value</CardTitle>
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    {loading ? <Skeleton className="h-8 w-32" /> : <div className="text-2xl font-bold">{formatCurrency(totalStockValue)}</div>}
                    <p className="text-xs text-muted-foreground">Estimated value of all items in stock</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Items in Stock</CardTitle>
                    <PackagePlus className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    {loading ? <Skeleton className="h-8 w-32" /> : <div className="text-2xl font-bold">{totalStockItems}</div>}
                    <p className="text-xs text-muted-foreground">Total quantity of all merchandise</p>
                </CardContent>
            </Card>
        </div>
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Merchandise Inventory</CardTitle>
                <CardDescription>
                  Track stock levels and manage sales of academy merchandise.
                </CardDescription>
              </div>
              <Button disabled>
                <PlusCircle className="mr-2 h-4 w-4" /> Add New Product
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-center">Stock on Hand</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
                        <TableCell className="text-center"><Skeleton className="h-4 w-12 mx-auto" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
                      </TableRow>
                    ))
                  ) : inventory.map(item => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.price)}</TableCell>
                      <TableCell className={`text-center font-bold ${item.stock < 10 ? 'text-destructive' : ''}`}>
                        {item.stock}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" className="mr-2" onClick={() => handleOpenDialog(item, 'stock-in')}>
                           <ArrowUp className="mr-2 h-4 w-4" /> Stock In
                        </Button>
                        <Button size="sm" onClick={() => handleOpenDialog(item, 'sale')} disabled={item.stock === 0}>
                           <ArrowDown className="mr-2 h-4 w-4" /> Sell
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardFooter>
            <div className="text-xs text-muted-foreground">
              Showing <strong>{inventory.length}</strong> products.
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Stock In Dialog */}
      <Dialog open={isStockInDialogOpen} onOpenChange={handleCloseDialogs}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Stock for {selectedItem?.name}</DialogTitle>
            <DialogDescription>
              Enter the quantity of new items received.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="stock-in-quantity">Quantity to Add</Label>
              <Input
                id="stock-in-quantity"
                type="number"
                value={quantity}
                onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
            <Button onClick={handleStockUpdate}>Update Stock</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Record Sale Dialog */}
      <Dialog open={isSaleDialogOpen} onOpenChange={handleCloseDialogs}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Sale for {selectedItem?.name}</DialogTitle>
            <DialogDescription>
              Enter the quantity sold. Current stock: {selectedItem?.stock}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="sale-quantity">Quantity Sold</Label>
              <Input
                id="sale-quantity"
                type="number"
                value={quantity}
                onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
                max={selectedItem?.stock}
              />
            </div>
            <div className="text-lg font-bold">
                Total: {formatCurrency((selectedItem?.price || 0) * quantity)}
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
            <Button onClick={handleSale}>Record Sale</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
