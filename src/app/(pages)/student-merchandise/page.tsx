
"use client";

import { useState, useEffect, useTransition } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { getMerchandise, type MerchandiseItem } from "@/lib/merchandise-db";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingCart, DollarSign, Link as LinkIcon, Copy, Loader2, Package } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { purchaseMerchandise } from "./actions";

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
        minimumFractionDigits: 2,
    }).format(amount);
};

export default function StudentMerchandisePage() {
  const [inventory, setInventory] = useState<MerchandiseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPurchaseDialogOpen, setIsPurchaseDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MerchandiseItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isPending, startTransition] = useTransition();
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

  const handleOpenPurchaseDialog = (item: MerchandiseItem) => {
    setSelectedItem(item);
    setQuantity(1);
    setIsPurchaseDialogOpen(true);
  };
  
  const handleCloseDialog = () => {
    setIsPurchaseDialogOpen(false);
    setSelectedItem(null);
    setQuantity(1);
  };

  const handlePurchase = () => {
    if (!selectedItem) return;
    
    startTransition(async () => {
        const result = await purchaseMerchandise(selectedItem.id, quantity);
        toast({
            title: result.success ? "Success!" : "Error",
            description: result.message,
            variant: result.success ? "default" : "destructive",
        });
        if (result.success) {
            fetchInventory();
            handleCloseDialog();
        }
    });
  };

  const handleCopyLink = () => {
    if (!selectedItem) return;
    const link = `https://your-academy.com/pay?item=${selectedItem.id}&qty=${quantity}&amount=${selectedItem.sellingPrice * quantity}`;
    navigator.clipboard.writeText(link).then(() => {
        toast({ title: "Link Copied!", description: "Payment link copied to clipboard." });
    });
  }

  const totalFee = (selectedItem?.sellingPrice || 0) * quantity;

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <ShoppingCart className="h-6 w-6" />
            <div>
              <CardTitle>Merchandise Store</CardTitle>
              <CardDescription>Browse and purchase items from our academy store.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {loading ? (
                Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-96 w-full" />)
            ) : inventory.length > 0 ? (
                inventory.map(item => (
                <Card key={item.id} className="flex flex-col overflow-hidden group">
                    <CardHeader className="p-0 relative">
                        <Image src="https://placehold.co/600x400.png" alt={item.name} width={600} height={400} className="object-cover" data-ai-hint={item.category.toLowerCase()} />
                        <Badge variant={item.stock < 10 ? 'destructive' : 'secondary'} className="absolute top-2 right-2">
                            {item.stock < 10 ? (item.stock > 0 ? `Low Stock (${item.stock})` : 'Out of Stock') : 'In Stock'}
                        </Badge>
                    </CardHeader>
                    <CardContent className="p-4 flex-grow">
                        <p className="text-xs text-muted-foreground">{item.category}</p>
                        <h3 className="font-semibold text-lg truncate">{item.name}</h3>
                        <p className="text-2xl font-bold">{formatCurrency(item.sellingPrice)}</p>
                    </CardContent>
                    <CardFooter className="p-2 border-t">
                        <Button className="w-full" onClick={() => handleOpenPurchaseDialog(item)} disabled={item.stock === 0}>
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            {item.stock > 0 ? 'Buy Now' : 'Out of Stock'}
                        </Button>
                    </CardFooter>
                </Card>
                ))
            ) : (
                <div className="col-span-full text-center py-16 text-muted-foreground">
                    <Package className="h-12 w-12 mx-auto mb-2" />
                    <p>No merchandise is currently available.</p>
                </div>
            )}
            </div>
        </CardContent>
      </Card>

      {/* Purchase Dialog */}
      <Dialog open={isPurchaseDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Purchase {selectedItem?.name}</DialogTitle>
            <DialogDescription>
              Confirm the quantity and proceed to payment. Current stock: {selectedItem?.stock}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="purchase-quantity">Quantity</Label>
              <Input
                id="purchase-quantity"
                type="number"
                value={quantity}
                onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
                max={selectedItem?.stock}
              />
            </div>
            <div className="text-2xl font-bold flex justify-between items-center">
                <span>Total:</span>
                <span>{formatCurrency(totalFee)}</span>
            </div>
             <div className="space-y-2 pt-4 border-t">
                <Label htmlFor="payment-link">Payment Link</Label>
                <div className="flex gap-2">
                    <Input id="payment-link" value={`https://your-academy.com/pay?item=${selectedItem?.id}&qty=${quantity}&amount=${totalFee}`} readOnly />
                    <Button onClick={handleCopyLink} variant="outline" size="icon"><Copy className="h-4 w-4" /></Button>
                </div>
                <p className="text-xs text-muted-foreground">
                    This is a simulated payment link. Click "Confirm Purchase" to complete the transaction.
                </p>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
            <Button onClick={handlePurchase} disabled={isPending}>
                {isPending ? <Loader2 className="animate-spin" /> : "Confirm Purchase"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
