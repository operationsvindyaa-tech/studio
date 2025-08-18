
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { getMerchandise, updateMerchandiseStock, addMerchandiseItem, updateMerchandiseItem, type MerchandiseItem, recordMerchandiseSale } from "@/lib/merchandise-db";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusCircle, MinusCircle, PackagePlus, ShoppingCart, ArrowDown, ArrowUp, Edit, Trash2, Link as LinkIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
        minimumFractionDigits: 2,
    }).format(amount);
};

export default function MerchandisePage() {
  const [inventory, setInventory] = useState<MerchandiseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isStockInDialogOpen, setIsStockInDialogOpen] = useState(false);
  const [isSaleDialogOpen, setIsSaleDialogOpen] = useState(false);
  const [isAddEditDialogOpen, setIsAddEditDialogOpen] = useState(false);
  const [isPaymentLinkDialogOpen, setIsPaymentLinkDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MerchandiseItem | null>(null);
  const [editingItem, setEditingItem] = useState<Partial<MerchandiseItem> | null>(null);
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

  const handleOpenDialog = (item: MerchandiseItem, type: 'stock-in' | 'sale' | 'payment-link') => {
    setSelectedItem(item);
    setQuantity(1);
    if (type === 'stock-in') setIsStockInDialogOpen(true);
    else if (type === 'sale') setIsSaleDialogOpen(true);
    else setIsPaymentLinkDialogOpen(true);
  };
  
  const handleOpenAddEditDialog = (item: MerchandiseItem | null) => {
    setEditingItem(item ? { ...item } : { name: '', category: 'Apparel', sellingPrice: 0, buyingPrice: 0, stock: 0 });
    setIsAddEditDialogOpen(true);
  };

  const handleCloseDialogs = () => {
    setIsStockInDialogOpen(false);
    setIsSaleDialogOpen(false);
    setIsAddEditDialogOpen(false);
    setIsPaymentLinkDialogOpen(false);
    setSelectedItem(null);
    setEditingItem(null);
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

    await recordMerchandiseSale(selectedItem.id, quantity);

    toast({ title: "Sale Recorded", description: `${quantity} unit(s) of ${selectedItem.name} sold.` });
    fetchInventory();
    handleCloseDialogs();
  };
  
  const handleSaveItem = async () => {
    if (!editingItem || !editingItem.name || !editingItem.category || editingItem.sellingPrice! < 0 || editingItem.buyingPrice! < 0 || editingItem.stock! < 0) {
        toast({ title: "Invalid Data", description: "Please fill all fields with valid data.", variant: "destructive" });
        return;
    }

    if (editingItem.id) {
        await updateMerchandiseItem(editingItem.id, editingItem);
        toast({ title: "Item Updated", description: `${editingItem.name} has been updated.` });
    } else {
        await addMerchandiseItem(editingItem as Omit<MerchandiseItem, 'id'>);
        toast({ title: "Item Added", description: `${editingItem.name} has been added to inventory.` });
    }
    fetchInventory();
    handleCloseDialogs();
  };

  const handleCopyLink = () => {
    if (!selectedItem) return;
    const link = `https://your-academy.com/pay?item=${selectedItem.id}&qty=${quantity}&amount=${selectedItem.sellingPrice * quantity}`;
    navigator.clipboard.writeText(link).then(() => {
        toast({ title: "Link Copied!", description: "Payment link copied to clipboard." });
    });
  }

  const totalStockValue = inventory.reduce((sum, item) => sum + (item.sellingPrice * item.stock), 0);
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
              <Button onClick={() => handleOpenAddEditDialog(null)}>
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
                    <TableHead className="text-right">Selling Price</TableHead>
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
                        <TableCell className="text-right"><Skeleton className="h-8 w-48 ml-auto" /></TableCell>
                      </TableRow>
                    ))
                  ) : inventory.map(item => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.sellingPrice)}</TableCell>
                      <TableCell className={`text-center font-bold ${item.stock < 10 ? 'text-destructive' : ''}`}>
                        {item.stock}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleOpenDialog(item, 'stock-in')}>
                           <ArrowUp className="mr-2 h-4 w-4" /> Stock In
                        </Button>
                        <Button size="sm" onClick={() => handleOpenDialog(item, 'sale')} disabled={item.stock === 0}>
                           <ArrowDown className="mr-2 h-4 w-4" /> Sell
                        </Button>
                        <Button variant="secondary" size="sm" onClick={() => handleOpenDialog(item, 'payment-link')}>
                            <LinkIcon className="mr-2 h-4 w-4" /> Payment Link
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleOpenAddEditDialog(item)}>
                           <Edit className="mr-2 h-4 w-4" /> Edit
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
                Total: {formatCurrency((selectedItem?.sellingPrice || 0) * quantity)}
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
            <Button onClick={handleSale}>Record Sale</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Item Dialog */}
        <Dialog open={isAddEditDialogOpen} onOpenChange={handleCloseDialogs}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{editingItem?.id ? 'Edit' : 'Add New'} Product</DialogTitle>
                    <DialogDescription>
                        {editingItem?.id ? 'Update the details for this product.' : 'Enter the details for the new product.'}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="item-name">Product Name</Label>
                        <Input id="item-name" value={editingItem?.name} onChange={(e) => setEditingItem(prev => ({...prev, name: e.target.value}))} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="item-category">Category</Label>
                        <Select value={editingItem?.category} onValueChange={(value) => setEditingItem(prev => ({...prev, category: value as any}))}>
                            <SelectTrigger id="item-category"><SelectValue placeholder="Select category" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Apparel">Apparel</SelectItem>
                                <SelectItem value="Books">Books</SelectItem>
                                <SelectItem value="Costumes">Costumes</SelectItem>
                                <SelectItem value="Accessories">Accessories</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="item-buying-price">Buying Price</Label>
                            <Input id="item-buying-price" type="number" value={editingItem?.buyingPrice} onChange={(e) => setEditingItem(prev => ({...prev, buyingPrice: parseFloat(e.target.value) || 0}))} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="item-selling-price">Selling Price</Label>
                            <Input id="item-selling-price" type="number" value={editingItem?.sellingPrice} onChange={(e) => setEditingItem(prev => ({...prev, sellingPrice: parseFloat(e.target.value) || 0}))} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="item-stock">Initial Stock</Label>
                        <Input id="item-stock" type="number" value={editingItem?.stock} onChange={(e) => setEditingItem(prev => ({...prev, stock: parseInt(e.target.value) || 0}))} />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                    <Button onClick={handleSaveItem}>Save Product</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

         {/* Payment Link Dialog */}
        <Dialog open={isPaymentLinkDialogOpen} onOpenChange={handleCloseDialogs}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Payment Link for {selectedItem?.name}</DialogTitle>
                    <DialogDescription>
                    Generate a shareable link for this purchase.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="payment-link-quantity">Quantity</Label>
                        <Input
                            id="payment-link-quantity"
                            type="number"
                            value={quantity}
                            onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                            min="1"
                            max={selectedItem?.stock}
                        />
                    </div>
                    <div className="text-lg font-bold">
                        Total: {formatCurrency((selectedItem?.sellingPrice || 0) * quantity)}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="payment-link">Payment Link</Label>
                        <div className="flex gap-2">
                            <Input id="payment-link" value={`https://your-academy.com/pay?item=${selectedItem?.id}&qty=${quantity}`} readOnly />
                            <Button onClick={handleCopyLink} variant="outline" size="icon"><LinkIcon /></Button>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild><Button variant="outline">Close</Button></DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </>
  );
}
