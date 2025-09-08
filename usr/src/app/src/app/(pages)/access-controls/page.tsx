
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { MoreHorizontal, PlusCircle, Edit, Trash2, Shield, UserPlus, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getRoles, updateRole, addRole, deleteRole, type Role, type User, addUserToRole, deleteUserFromRole, availablePermissions } from "@/lib/access-controls-db";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";


export default function AccessControlsPage() {
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);
    const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<Role | null>(null);
    const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);
    const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
    const [activeRole, setActiveRole] = useState<Role | null>(null);

    const { toast } = useToast();

    const fetchRoles = async () => {
        setLoading(true);
        try {
            const data = await getRoles();
            setRoles(data);
            if (data.length > 0 && !activeRole) {
                setActiveRole(data[0]);
            }
        } catch (error) {
            toast({ title: "Error", description: "Failed to load roles.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    const handleOpenRoleDialog = (role: Role | null) => {
        setEditingRole(role);
        setIsRoleDialogOpen(true);
    };

    const handleSaveRole = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const name = formData.get('name') as string;

        try {
            if (editingRole) {
                await updateRole(editingRole.id, { name });
                toast({ title: "Success", description: "Role updated successfully." });
            } else {
                await addRole({ name });
                toast({ title: "Success", description: "New role created." });
            }
            fetchRoles();
            setIsRoleDialogOpen(false);
            setEditingRole(null);
        } catch (error) {
            toast({ title: "Error", description: "Could not save role.", variant: "destructive" });
        }
    };

    const handleDeleteRole = async () => {
        if (roleToDelete) {
            try {
                await deleteRole(roleToDelete.id);
                toast({ title: "Success", description: "Role deleted successfully." });
                fetchRoles();
                setRoleToDelete(null);
            } catch (error) {
                toast({ title: "Error", description: "Could not delete role.", variant: "destructive" });
            }
        }
    };

    const handlePermissionChange = async (roleId: string, permissionId: string, checked: boolean) => {
        const role = roles.find(r => r.id === roleId);
        if (!role) return;

        const updatedPermissions = checked
            ? [...role.permissions, permissionId]
            : role.permissions.filter(p => p !== permissionId);

        try {
            await updateRole(roleId, { permissions: updatedPermissions });
            fetchRoles();
             toast({ title: "Permissions Updated", description: `Permissions for ${role.name} have been updated.`, variant: "default" });
        } catch(e) {
             toast({ title: "Error", description: "Failed to update permissions.", variant: "destructive" });
        }
    };
    
    const handleAddUser = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!activeRole) return;
        
        const formData = new FormData(event.currentTarget);
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        
        try {
            await addUserToRole(activeRole.id, { name, email });
            toast({ title: "User Added", description: `${name} has been added to the ${activeRole.name} role.` });
            fetchRoles();
            setIsUserDialogOpen(false);
        } catch (error) {
            toast({ title: "Error", description: "Could not add user.", variant: "destructive" });
        }
    };

    const handleDeleteUser = async (user: User) => {
        if(!activeRole) return;
        
        try {
            await deleteUserFromRole(activeRole.id, user.id);
            toast({ title: "User Removed", description: `${user.name} has been removed from the role.` });
            fetchRoles();
        } catch (error) {
            toast({ title: "Error", description: "Could not remove user.", variant: "destructive" });
        }
    }


    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <Shield className="h-6 w-6" />
                            <div>
                                <CardTitle>Access Controls & Permissions</CardTitle>
                                <CardDescription>
                                    Manage user roles and what they can see and do within the application.
                                </CardDescription>
                            </div>
                        </div>
                        <Button onClick={() => handleOpenRoleDialog(null)}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Add New Role
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? <Skeleton className="h-64 w-full" /> : (
                        <Tabs value={activeRole?.id} onValueChange={(roleId) => setActiveRole(roles.find(r => r.id === roleId) || null)} className="vertical-tabs flex">
                            <TabsList className="flex-col h-auto mr-6">
                                {roles.map(role => (
                                    <TabsTrigger key={role.id} value={role.id} className="w-full justify-start gap-2">
                                        <Users className="h-4 w-4" />
                                        {role.name}
                                        <div className="ml-auto flex gap-1">
                                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); handleOpenRoleDialog(role); }}><Edit className="h-3 w-3"/></Button>
                                            <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-destructive hover:text-destructive-foreground" onClick={(e) => { e.stopPropagation(); setRoleToDelete(role); }}><Trash2 className="h-3 w-3"/></Button>
                                        </div>
                                    </TabsTrigger>
                                ))}
                            </TabsList>

                            {roles.map(role => (
                                <TabsContent key={role.id} value={role.id} className="flex-grow mt-0">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>{role.name} Permissions</CardTitle>
                                            <CardDescription>Select the pages and features this role can access.</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                {Object.entries(availablePermissions).map(([group, permissions]) => (
                                                    <div key={group}>
                                                        <h4 className="font-semibold mb-2">{group}</h4>
                                                        <div className="grid grid-cols-3 gap-4">
                                                            {permissions.map(permission => (
                                                                <div key={permission.id} className="flex items-center space-x-2">
                                                                    <Checkbox
                                                                        id={`${role.id}-${permission.id}`}
                                                                        checked={role.permissions.includes(permission.id)}
                                                                        onCheckedChange={(checked) => handlePermissionChange(role.id, permission.id, !!checked)}
                                                                    />
                                                                    <label htmlFor={`${role.id}-${permission.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                                        {permission.label}
                                                                    </label>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <Separator className="my-6" />
                                             <div>
                                                <div className="flex justify-between items-center mb-4">
                                                    <div>
                                                        <h4 className="font-semibold">Users in this Role</h4>
                                                        <p className="text-sm text-muted-foreground">Manage users assigned to the {role.name} role.</p>
                                                    </div>
                                                    <Button size="sm" onClick={() => setIsUserDialogOpen(true)}>
                                                        <UserPlus className="mr-2 h-4 w-4" /> Add User
                                                    </Button>
                                                </div>
                                                <div className="border rounded-lg">
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow>
                                                                <TableHead>Name</TableHead>
                                                                <TableHead>Email</TableHead>
                                                                <TableHead className="text-right">Actions</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {role.users.map(user => (
                                                                <TableRow key={user.id}>
                                                                    <TableCell>{user.name}</TableCell>
                                                                    <TableCell>{user.email}</TableCell>
                                                                    <TableCell className="text-right">
                                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDeleteUser(user)}>
                                                                            <Trash2 className="h-4 w-4" />
                                                                        </Button>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </div>
                                             </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            ))}
                        </Tabs>
                    )}
                </CardContent>
            </Card>

            <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingRole ? "Edit Role" : "Create New Role"}</DialogTitle>
                    </DialogHeader>
                    <form id="role-form" onSubmit={handleSaveRole}>
                        <div className="py-4">
                            <Label htmlFor="name">Role Name</Label>
                            <Input id="name" name="name" defaultValue={editingRole?.name} placeholder="e.g., Accountant" required />
                        </div>
                        <DialogFooter>
                            <DialogClose asChild><Button variant="outline" type="button">Cancel</Button></DialogClose>
                            <Button type="submit">Save Role</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
            
            <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add User to {activeRole?.name}</DialogTitle>
                    </DialogHeader>
                    <form id="user-form" onSubmit={handleAddUser}>
                        <div className="py-4 space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="user-name">Full Name</Label>
                                <Input id="user-name" name="name" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="user-email">Email Address</Label>
                                <Input id="user-email" name="email" type="email" required />
                            </div>
                        </div>
                         <DialogFooter>
                            <DialogClose asChild><Button variant="outline" type="button">Cancel</Button></DialogClose>
                            <Button type="submit">Add User</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <AlertDialog open={!!roleToDelete} onOpenChange={(open) => !open && setRoleToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the role "{roleToDelete?.name}". This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setRoleToDelete(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteRole} className="bg-destructive hover:bg-destructive/90">
                            Delete Role
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
