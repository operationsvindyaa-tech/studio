
"use client";

import { useState, useEffect, useTransition, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { getMerchandise, type MerchandiseItem } from "@/lib/merchandise-db";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingCart, DollarSign, Link as LinkIcon, Copy, Loader2, Package, Plus, Minus, Trash2, X } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { purchaseMerchandise } from "./actions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

type CartItem = {
    item: MerchandiseItem;
    quantity: number;
    size: string;
};

export default function StudentMerchandisePage() {
  const [inventory, setInventory] = useState<MerchandiseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPurchaseDialogOpen, setIsPurchaseDialogOpen] = useState(false);
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MerchandiseItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [cart, setCart] = useState<CartItem[]>([]);
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

  const handleOpenAddItemDialog = (item: MerchandiseItem) => {
    setSelectedItem(item);
    setQuantity(1);
    setSelectedSize(item.sizes?.[0] || '');
    setIsAddItemDialogOpen(true);
  };
  
  const handleCloseDialogs = () => {
    setIsPurchaseDialogOpen(false);
    setIsAddItemDialogOpen(false);
    setSelectedItem(null);
    setQuantity(1);
    setSelectedSize('');
  };

  const handleAddToCart = () => {
    if (!selectedItem) return;
    
    // Check if item with the same size is already in cart
    const existingCartItemIndex = cart.findIndex(
      cartItem => cartItem.item.id === selectedItem.id && cartItem.size === selectedSize
    );

    if (existingCartItemIndex > -1) {
      const updatedCart = [...cart];
      updatedCart[existingCartItemIndex].quantity += quantity;
      setCart(updatedCart);
    } else {
      setCart([...cart, { item: selectedItem, quantity, size: selectedSize }]);
    }
    
    toast({
        title: "Added to Cart",
        description: `${quantity} x ${selectedItem.name} has been added to your cart.`,
    });

    handleCloseDialogs();
  };
  
  const handleUpdateCartQuantity = (itemId: string, size: string, newQuantity: number) => {
    if (newQuantity <= 0) {
        setCart(cart.filter(ci => !(ci.item.id === itemId && ci.size === size)));
    } else {
        setCart(cart.map(ci => 
            ci.item.id === itemId && ci.size === size 
            ? { ...ci, quantity: newQuantity } 
            : ci
        ));
    }
  };

  const handlePurchaseAll = () => {
    startTransition(async () => {
        // In a real app, this would be a single transaction.
        // For this demo, we'll process them one by one.
        for (const cartItem of cart) {
            await purchaseMerchandise(cartItem.item.id, cartItem.quantity);
        }
        
        toast({
            title: "Purchase Successful!",
            description: "Your order has been recorded.",
            variant: "default",
        });
        
        fetchInventory();
        setCart([]);
        setIsPurchaseDialogOpen(false);
    });
  };

  const cartSubtotal = useMemo(() => cart.reduce((total, ci) => total + ci.item.sellingPrice * ci.quantity, 0), [cart]);
  const cartTax = useMemo(() => cart.reduce((total, ci) => total + (ci.item.sellingPrice * ci.quantity * ((ci.item.taxRate || 0) / 100)), 0), [cart]);
  const cartTotalWithTax = useMemo(() => cartSubtotal + cartTax, [cartSubtotal, cartTax]);
  const cartItemCount = useMemo(() => cart.reduce((total, ci) => total + ci.quantity, 0), [cart]);

  const selectedItemSubtotal = selectedItem ? selectedItem.sellingPrice * quantity : 0;
  const selectedItemTax = selectedItemSubtotal * ((selectedItem?.taxRate || 0) / 100);
  const selectedItemTotal = selectedItemSubtotal + selectedItemTax;


  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <ShoppingCart className="h-6 w-6" />
              <div>
                <CardTitle>Merchandise Store</CardTitle>
                <CardDescription>Browse and purchase items from our academy store.</CardDescription>
              </div>
            </div>
            <Sheet>
                <SheetTrigger asChild>
                     <Button variant="outline" className="relative">
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        My Cart
                        {cartItemCount > 0 && (
                            <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">{cartItemCount}</Badge>
                        )}
                    </Button>
                </SheetTrigger>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Your Shopping Cart</SheetTitle>
                    </SheetHeader>
                    {cart.length > 0 ? (
                        <div className="flex flex-col h-full">
                            <div className="flex-grow overflow-y-auto -mx-6 px-6 py-4">
                                <div className="space-y-4">
                                {cart.map(cartItem => (
                                    <div key={`${cartItem.item.id}-${cartItem.size}`} className="flex items-start gap-4">
                                        <Image src="https://placehold.co/600x400.png" alt={cartItem.item.name} width={64} height={64} className="rounded-md object-cover" data-ai-hint={cartItem.item.category.toLowerCase()} />
                                        <div className="flex-grow">
                                            <p className="font-semibold">{cartItem.item.name}</p>
                                            {cartItem.size && <p className="text-sm text-muted-foreground">Size: {cartItem.size}</p>}
                                            <p className="text-sm">{formatCurrency(cartItem.item.sellingPrice)}</p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <Button size="icon" variant="outline" className="h-6 w-6" onClick={() => handleUpdateCartQuantity(cartItem.item.id, cartItem.size, cartItem.quantity - 1)}><Minus className="h-4 w-4" /></Button>
                                                <span>{cartItem.quantity}</span>
                                                <Button size="icon" variant="outline" className="h-6 w-6" onClick={() => handleUpdateCartQuantity(cartItem.item.id, cartItem.size, cartItem.quantity + 1)}><Plus className="h-4 w-4" /></Button>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold">{formatCurrency(cartItem.item.sellingPrice * cartItem.quantity)}</p>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 mt-2 text-muted-foreground" onClick={() => handleUpdateCartQuantity(cartItem.item.id, cartItem.size, 0)}><Trash2 className="h-4 w-4" /></Button>
                                        </div>
                                    </div>
                                ))}
                                </div>
                            </div>
                            <Separator />
                            <SheetFooter className="pt-4 flex flex-col gap-4">
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Subtotal</span>
                                        <span>{formatCurrency(cartSubtotal)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Tax</span>
                                        <span>{formatCurrency(cartTax)}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-lg">
                                        <span>Total</span>
                                        <span>{formatCurrency(cartTotalWithTax)}</span>
                                    </div>
                                </div>
                                <Button className="w-full" onClick={() => setIsPurchaseDialogOpen(true)}>Proceed to Checkout</Button>
                            </SheetFooter>
                        </div>
                    ) : (
                         <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                            <ShoppingCart className="h-16 w-16 mb-4" />
                            <p className="font-semibold">Your cart is empty.</p>
                            <p className="text-sm">Add items from the store to get started.</p>
                         </div>
                    )}
                </SheetContent>
            </Sheet>
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
                        {item.sizes && item.sizes.length > 0 && (
                            <div className="mt-2">
                                <span className="text-xs text-muted-foreground">Sizes: </span>
                                {item.sizes.map(size => <Badge key={size} variant="outline" className="mr-1">{size}</Badge>)}
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="p-2 border-t">
                        <Button className="w-full" onClick={() => handleOpenAddItemDialog(item)} disabled={item.stock === 0}>
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            {item.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
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

       {/* Add Item Dialog */}
      <Dialog open={isAddItemDialogOpen} onOpenChange={handleCloseDialogs}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add to Cart: {selectedItem?.name}</DialogTitle>
            <DialogDescription>
              Select size and quantity. Current stock: {selectedItem?.stock}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
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
                {selectedItem?.sizes && selectedItem.sizes.length > 0 && (
                     <div className="space-y-2">
                        <Label htmlFor="item-size">Size</Label>
                        <Select value={selectedSize} onValueChange={setSelectedSize}>
                            <SelectTrigger id="item-size"><SelectValue placeholder="Select size" /></SelectTrigger>
                            <SelectContent>
                                {selectedItem.sizes.map(size => <SelectItem key={size} value={size}>{size}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                )}
            </div>
             <Separator />
            <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatCurrency(selectedItemSubtotal)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax ({selectedItem?.taxRate || 0}%)</span>
                    <span>{formatCurrency(selectedItemTax)}</span>
                </div>
                 <div className="flex justify-between font-bold text-base">
                    <span>Total</span>
                    <span>{formatCurrency(selectedItemTotal)}</span>
                </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
            <Button onClick={handleAddToCart}>Add to Cart</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Checkout Dialog */}
      <Dialog open={isPurchaseDialogOpen} onOpenChange={setIsPurchaseDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Your Purchase</DialogTitle>
            <DialogDescription>
              Review your order and generate a payment link to complete the purchase.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
             <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatCurrency(cartSubtotal)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>{formatCurrency(cartTax)}</span>
                </div>
                 <div className="flex justify-between font-bold text-base">
                    <span>Total</span>
                    <span>{formatCurrency(cartTotalWithTax)}</span>
                </div>
            </div>
             <div className="space-y-2 pt-4 border-t">
                <Label htmlFor="payment-link">Payment Link</Label>
                <div className="flex gap-2">
                    <Input id="payment-link" value={`https://your-academy.com/pay?cart_id=123&amount=${cartTotalWithTax}`} readOnly />
                    <Button variant="outline" size="icon" onClick={() => {
                        const link = `https://your-academy.com/pay?cart_id=123&amount=${cartTotalWithTax}`;
                        navigator.clipboard.writeText(link);
                        toast({ title: "Link Copied!" });
                    }}><Copy className="h-4 w-4" /></Button>
                </div>
                <p className="text-xs text-muted-foreground">
                    This is a simulated payment link. Click "Confirm Purchase" to complete the transaction.
                </p>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
            <Button onClick={handlePurchaseAll} disabled={isPending}>
                {isPending ? <Loader2 className="animate-spin" /> : "Confirm Purchase"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
