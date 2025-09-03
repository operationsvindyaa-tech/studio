
"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { getMerchandise, updateMerchandiseStock, addMerchandiseItem, updateMerchandiseItem, type MerchandiseItem, recordMerchandiseSale, getStockTransactions } from "@/lib/merchandise-db";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusCircle, ArrowDown, ArrowUp, Edit, Link as LinkIcon, ShoppingCart, PackagePlus, DollarSign, Download } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import * as XLSX from "xlsx";
import { Separator } from "@/components/ui/separator";


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
  const [editingItem, setEditingItem] = useState<Partial<MerchandiseItem> & { sizesInput?: string } | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [currentBuyingPrice, setCurrentBuyingPrice] = useState(0);
  const [taxRate, setTaxRate] = useState(10); // Default tax rate of 10%
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
    if (type === 'stock-in') {
        setCurrentBuyingPrice(item.buyingPrice);
        setIsStockInDialogOpen(true);
    }
    else if (type === 'sale') setIsSaleDialogOpen(true);
    else setIsPaymentLinkDialogOpen(true);
  };
  
  const handleOpenAddEditDialog = (item: MerchandiseItem | null) => {
    const initialItem = item 
        ? { ...item, sizesInput: item.sizes?.join(', ') || '' } 
        : { name: '', category: 'Apparel', sellingPrice: 0, buyingPrice: 0, stock: 0, sizesInput: '' };
    setEditingItem(initialItem);
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
    setCurrentBuyingPrice(0);
  };

  const handleStockUpdate = async () => {
    if (!selectedItem || quantity <= 0) {
      toast({ title: "Invalid Quantity", description: "Please enter a valid quantity.", variant: "destructive" });
      return;
    }

    const newStock = selectedItem.stock + quantity;
    await updateMerchandiseStock(selectedItem.id, newStock, currentBuyingPrice);
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
    
    const sizes = editingItem.sizesInput ? editingItem.sizesInput.split(',').map(s => s.trim()).filter(Boolean) : [];
    const itemToSave = { ...editingItem, sizes };
    delete (itemToSave as any).sizesInput;


    if (editingItem.id) {
        await updateMerchandiseItem(editingItem.id, itemToSave);
        toast({ title: "Item Updated", description: `${editingItem.name} has been updated.` });
    } else {
        await addMerchandiseItem(itemToSave as Omit<MerchandiseItem, 'id'>);
        toast({ title: "Item Added", description: `${editingItem.name} has been added to inventory.` });
    }
    fetchInventory();
    handleCloseDialogs();
  };

  const handleCopyLink = () => {
    if (!selectedItem) return;
    const subtotal = selectedItem.sellingPrice * quantity;
    const taxAmount = subtotal * (taxRate / 100);
    const total = subtotal + taxAmount;
    const link = `https://your-academy.com/pay?item=${selectedItem.id}&qty=${quantity}&amount=${total}`;
    navigator.clipboard.writeText(link).then(() => {
        toast({ title: "Link Copied!", description: "Payment link copied to clipboard." });
    });
  }

    const handleExport = async (type: 'in' | 'out') => {
        const transactions = await getStockTransactions(type);
        if (transactions.length === 0) {
            toast({ title: `No Stock ${type === 'in' ? 'In' : 'Out'} Data`, description: "There are no transactions to export.", variant: "default" });
            return;
        }

        const reportData = transactions.map(t => ({
            "Transaction ID": t.transactionId,
            "Product Name": inventory.find(i => i.id === t.itemId)?.name || 'Unknown',
            "Quantity": t.quantity,
            "Price": t.price,
            "Date": new Date(t.date).toLocaleString(),
        }));
        
        const worksheet = XLSX.utils.json_to_sheet(reportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, `Stock ${type === 'in' ? 'In' : 'Out'} Report`);
        XLSX.writeFile(workbook, `stock_${type}_report.xlsx`);
    };

  const totalStockValue = inventory.reduce((sum, item) => sum + (item.sellingPrice * item.stock), 0);
  const totalStockItems = inventory.reduce((sum, item) => sum + item.stock, 0);

  const saleSubtotal = selectedItem ? selectedItem.sellingPrice * quantity : 0;
  const saleTax = saleSubtotal * (taxRate / 100);
  const saleTotal = saleSubtotal + saleTax;

  return (
    <>
      <div className="space-y-6">
         <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
                <h1 className="text-2xl font-bold">Merchandise Catalog</h1>
                <p className="text-muted-foreground">Manage your academy's products and inventory.</p>
            </div>
            <div className="flex gap-2 flex-wrap items-center">
                <div className="space-y-1">
                    <Label htmlFor="tax-rate">Tax Rate (%)</Label>
                    <Input 
                        id="tax-rate"
                        type="number"
                        value={taxRate}
                        onChange={(e) => setTaxRate(Number(e.target.value))}
                        className="w-24"
                    />
                </div>
                <Button variant="outline" onClick={() => handleExport('in')}><Download className="mr-2 h-4 w-4" /> Export Stock In</Button>
                <Button variant="outline" onClick={() => handleExport('out')}><Download className="mr-2 h-4 w-4" /> Export Stock Out</Button>
                <Button onClick={() => handleOpenAddEditDialog(null)}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add New Product
                </Button>
            </div>
         </div>
         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Inventory Value</CardTitle>
                    <div className="h-4 w-4 text-muted-foreground" />
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
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {loading ? (
                Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-96 w-full" />)
            ) : inventory.map(item => (
                <Card key={item.id} className="flex flex-col overflow-hidden group">
                    <CardHeader className="p-0 relative">
                        <Image src="https://placehold.co/600x400.png" alt={item.name} width={600} height={400} className="object-cover" data-ai-hint={item.category.toLowerCase()} />
                        <Badge variant={item.stock < 10 ? 'destructive' : 'secondary'} className="absolute top-2 right-2">
                            {item.stock < 10 ? (item.stock > 0 ? `Low Stock` : 'Out of Stock') : 'In Stock'}
                        </Badge>
                    </CardHeader>
                    <CardContent className="p-4 flex-grow">
                        <p className="text-xs text-muted-foreground">{item.category}</p>
                        <h3 className="font-semibold text-lg truncate">{item.name}</h3>
                        <p className="text-2xl font-bold">{formatCurrency(item.sellingPrice)}</p>
                        {item.sizes && item.sizes.length > 0 && (
                            <div className="mt-2">
                                <span className="text-xs text-muted-foreground">Sizes: </span>
                                {item.sizes.map(size => <Badge key={size} variant="outline" className="mr-1">{size}</Badge>)}
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="p-2 border-t flex flex-col gap-2">
                        <div className="grid grid-cols-2 gap-2 w-full">
                            <Button variant="outline" size="sm" onClick={() => handleOpenDialog(item, 'stock-in')}>
                               <ArrowUp className="mr-2 h-4 w-4" /> Stock In
                            </Button>
                            <Button size="sm" onClick={() => handleOpenDialog(item, 'sale')} disabled={item.stock === 0}>
                               <ShoppingCart className="mr-2 h-4 w-4" /> Sell
                            </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-2 w-full">
                             <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(item, 'payment-link')}>
                                <LinkIcon className="mr-2 h-4 w-4" /> Payment Link
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleOpenAddEditDialog(item)}>
                               <Edit className="mr-2 h-4 w-4" /> Edit
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            ))}
        </div>
      </div>

      {/* Stock In Dialog */}
      <Dialog open={isStockInDialogOpen} onOpenChange={handleCloseDialogs}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Stock for {selectedItem?.name}</DialogTitle>
            <DialogDescription>
              Enter the quantity of new items received and the current buying price.
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
            <div className="space-y-2">
              <Label htmlFor="buying-price">Current Buying Price (per item)</Label>
              <Input
                id="buying-price"
                type="number"
                value={currentBuyingPrice}
                onChange={e => setCurrentBuyingPrice(parseFloat(e.target.value) || 0)}
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
            <Separator />
            <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatCurrency(saleSubtotal)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax ({taxRate}%)</span>
                    <span>{formatCurrency(saleTax)}</span>
                </div>
                 <div className="flex justify-between font-bold text-base">
                    <span>Total</span>
                    <span>{formatCurrency(saleTotal)}</span>
                </div>
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
                        <Input id="item-name" value={editingItem?.name || ''} onChange={(e) => setEditingItem(prev => ({...prev, name: e.target.value}))} />
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
                    {editingItem?.category === 'Apparel' && (
                        <div className="space-y-2">
                            <Label htmlFor="item-sizes">Sizes (comma-separated)</Label>
                            <Input id="item-sizes" value={editingItem?.sizesInput || ''} onChange={(e) => setEditingItem(prev => ({...prev, sizesInput: e.target.value}))} placeholder="e.g., S, M, L, XL" />
                        </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="item-buying-price">Buying Price</Label>
                            <Input id="item-buying-price" type="number" value={editingItem?.buyingPrice ?? 0} onChange={(e) => setEditingItem(prev => ({...prev, buyingPrice: parseFloat(e.target.value) || 0}))} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="item-selling-price">Selling Price</Label>
                            <Input id="item-selling-price" type="number" value={editingItem?.sellingPrice ?? 0} onChange={(e) => setEditingItem(prev => ({...prev, sellingPrice: parseFloat(e.target.value) || 0}))} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="item-stock">Initial Stock</Label>
                        <Input id="item-stock" type="number" value={editingItem?.stock ?? 0} onChange={(e) => setEditingItem(prev => ({...prev, stock: parseInt(e.target.value) || 0}))} />
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
                     <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span>{formatCurrency(saleSubtotal)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Tax ({taxRate}%)</span>
                            <span>{formatCurrency(saleTax)}</span>
                        </div>
                         <div className="flex justify-between font-bold text-base">
                            <span>Total</span>
                            <span>{formatCurrency(saleTotal)}</span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="payment-link">Payment Link</Label>
                        <div className="flex gap-2">
                            <Input id="payment-link" value={`https://your-academy.com/pay?item=${selectedItem?.id}&qty=${quantity}&amount=${saleTotal}`} readOnly />
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
