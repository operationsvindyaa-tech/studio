
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PlusCircle, Edit, Trash2, Building, MapPin, User, Phone } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { getBranches, addBranch, updateBranch, deleteBranch, type Branch } from "@/lib/branches-db";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export default function BranchesPage() {
    const [branches, setBranches] = useState<Branch[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
    const [branchToDelete, setBranchToDelete] = useState<Branch | null>(null);
    const { toast } = useToast();

    const fetchBranches = async () => {
        setLoading(true);
        try {
            const data = await getBranches();
            setBranches(data);
        } catch (error) {
            toast({ title: "Error", description: "Failed to load branches.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBranches();
    }, []);

    const handleOpenDialog = (branch: Branch | null) => {
        setEditingBranch(branch);
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setEditingBranch(null);
    };

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const data = Object.fromEntries(formData.entries()) as Omit<Branch, 'id'>;

        try {
            if (editingBranch) {
                await updateBranch(editingBranch.id, data);
                toast({ title: "Success", description: "Branch updated successfully." });
            } else {
                await addBranch(data);
                toast({ title: "Success", description: "New branch added successfully." });
            }
            fetchBranches();
            handleCloseDialog();
        } catch (error) {
            toast({ title: "Error", description: "Could not save branch details.", variant: "destructive" });
        }
    };

    const handleDelete = (branch: Branch) => {
        setBranchToDelete(branch);
    };

    const confirmDelete = async () => {
        if (branchToDelete) {
            try {
                await deleteBranch(branchToDelete.id);
                toast({ title: "Success", description: "Branch deleted successfully." });
                fetchBranches();
            } catch (error) {
                toast({ title: "Error", description: "Could not delete branch.", variant: "destructive" });
            } finally {
                setBranchToDelete(null);
            }
        }
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Manage Branches</CardTitle>
                            <CardDescription>
                                Add, edit, or remove your academy's center locations.
                            </CardDescription>
                        </div>
                        <Button onClick={() => handleOpenDialog(null)}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Add Branch
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {loading ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <Card key={i}>
                                    <CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader>
                                    <CardContent className="space-y-3">
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-5/6" />
                                    </CardContent>
                                </Card>
                            ))
                        ) : branches.map(branch => (
                            <Card key={branch.id}>
                                <CardHeader className="flex flex-row justify-between items-start">
                                    <div>
                                        <CardTitle className="flex items-center gap-2">
                                            <Building className="h-5 w-5" />
                                            {branch.name}
                                        </CardTitle>
                                        <CardDescription>{branch.location}</CardDescription>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => handleOpenDialog(branch)}>
                                                <Edit className="mr-2 h-4 w-4" /> Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleDelete(branch)} className="text-destructive">
                                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </CardHeader>
                                <CardContent className="space-y-3 text-sm">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <User className="h-4 w-4" />
                                        <span>{branch.manager}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Phone className="h-4 w-4" />
                                        <span>{branch.contact}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </CardContent>
                 <CardFooter>
                    <div className="text-xs text-muted-foreground">
                        Showing <strong>{branches.length}</strong> branches.
                    </div>
                </CardFooter>
            </Card>

            <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingBranch ? "Edit Branch" : "Add New Branch"}</DialogTitle>
                        <DialogDescription>
                            {editingBranch ? "Update the details for this branch." : "Enter the details for the new branch."}
                        </DialogDescription>
                    </DialogHeader>
                    <form id="branch-form" onSubmit={handleFormSubmit} className="space-y-4 py-4">
                         <div className="space-y-2">
                            <Label htmlFor="name">Branch Name</Label>
                            <Input id="name" name="name" defaultValue={editingBranch?.name} placeholder="e.g., Main Campus" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Input id="location" name="location" defaultValue={editingBranch?.location} placeholder="e.g., Basavanapura" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="manager">Manager Name</Label>
                            <Input id="manager" name="manager" defaultValue={editingBranch?.manager} placeholder="e.g., Mr. Anand Kumar" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="contact">Contact Number</Label>
                            <Input id="contact" name="contact" defaultValue={editingBranch?.contact} placeholder="e.g., 9876543210" required />
                        </div>
                    </form>
                    <DialogFooter>
                        <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                        <Button type="submit" form="branch-form">Save Branch</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <AlertDialog open={!!branchToDelete} onOpenChange={(open) => !open && setBranchToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the branch "{branchToDelete?.name}". This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setBranchToDelete(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
