
"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PlusCircle, UserPlus, FileDown, Eye } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { getTeachers, addTeacher, updateTeacher, deleteTeacher, type Teacher, type AddTeacherData } from "@/lib/teachers-db";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";
import { Form, FormDescription, FormControl, FormField } from "@/components/ui/form";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [teacherToDelete, setTeacherToDelete] = useState<Teacher | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const { toast } = useToast();
  const form = useForm();
  
  const workingDaysWatch = form.watch('workingDays');

  useEffect(() => {
    if (Array.isArray(workingDaysWatch)) {
      form.setValue('noOfWorkingDays', workingDaysWatch.length);
    }
  }, [workingDaysWatch, form]);


  const fetchTeachers = async () => {
    setLoading(true);
    const data = await getTeachers();
    setTeachers(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleOpenDialog = (teacher: Teacher | null) => {
    setEditingTeacher(teacher);
    if (teacher) {
        setPhotoPreview(teacher.avatar);
        form.reset({
            name: teacher.name,
            designation: teacher.designation,
            department: teacher.department,
            phone: teacher.phone,
            classCenter: teacher.classCenter,
            noOfBatches: teacher.noOfBatches,
            totalStudents: teacher.totalStudents,
            noOfWorkingDays: teacher.noOfWorkingDays,
            workingDays: teacher.workingDays || [],
        });
    } else {
        setPhotoPreview(null);
        form.reset({
            name: '',
            designation: '',
            department: '',
            phone: '',
            classCenter: '',
            noOfBatches: 0,
            totalStudents: 0,
            noOfWorkingDays: 0,
            workingDays: [],
        });
    }
    setPhotoDataUrl(null);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingTeacher(null);
    setPhotoPreview(null);
    setPhotoDataUrl(null);
    form.reset();
  };

  const handleDelete = (teacher: Teacher) => {
    setTeacherToDelete(teacher);
    setIsDeleteDialogOpen(true);
  }

  const confirmDelete = async () => {
    if (teacherToDelete) {
      await deleteTeacher(teacherToDelete.id);
      toast({
        title: "Teacher Deleted",
        description: `${teacherToDelete.name} has been removed from the system.`,
      });
      fetchTeachers();
      setIsDeleteDialogOpen(false);
      setTeacherToDelete(null);
    }
  };

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setPhotoPreview(dataUrl);
        setPhotoDataUrl(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = async (data: any) => {
    const teacherData: AddTeacherData = {
        name: data.name,
        designation: data.designation,
        department: data.department,
        phone: data.phone,
        classCenter: data.classCenter,
        noOfBatches: Number(data.noOfBatches),
        totalStudents: Number(data.totalStudents),
        noOfWorkingDays: data.workingDays.length,
        workingDays: data.workingDays,
        email: editingTeacher?.email || `${data.name.split(' ').join('.').toLowerCase()}@vindyaa.com`,
        photo: photoDataUrl || (editingTeacher ? editingTeacher.avatar : null),
    };

    try {
      if (editingTeacher) {
        // Update existing teacher
        const updatedTeacher = await updateTeacher(editingTeacher.id, teacherData);
        toast({
          title: "Teacher Updated",
          description: `${updatedTeacher.name}'s details have been updated.`,
        });
      } else {
        // Add new teacher
        const newTeacher = await addTeacher(teacherData);
        toast({
          title: "Teacher Added",
          description: `${newTeacher.name} has been added successfully.`,
        });
      }
      fetchTeachers();
      handleCloseDialog();
    } catch (error) {
       toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleExport = () => {
    if (!teachers.length) return;
    
    const headers = ["ID", "Name", "Designation", "Department", "Phone", "Class Center", "Batches", "Students", "Working Days", "Week Off"];
    const csvContent = [
      headers.join(','),
      ...teachers.map(t => [t.id, `"${t.name}"`, t.designation, t.department, t.phone, t.classCenter, t.noOfBatches, t.totalStudents, t.noOfWorkingDays, t.workingDays].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'teachers.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Teachers Management</CardTitle>
          <CardDescription>
            Manage teacher profiles, subjects, and contact information.
          </CardDescription>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" onClick={handleExport}>
                <FileDown className="h-4 w-4 mr-2" />
                Export
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <Button onClick={() => handleOpenDialog(null)}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Teacher
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-xl">
                    <DialogHeader>
                    <DialogTitle>{editingTeacher ? 'Edit Teacher' : 'Add New Teacher'}</DialogTitle>
                    <DialogDescription>
                        {editingTeacher ? 'Update the details for this teacher.' : 'Fill in the details to add a new teacher to the system.'}
                    </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form id="teacher-form" onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
                            <div className="flex flex-col items-center text-center">
                                <Input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    id="photo-upload"
                                    onChange={handlePhotoChange}
                                />
                                <label htmlFor="photo-upload" className="cursor-pointer">
                                    <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center border-2 border-dashed mx-auto">
                                        {photoPreview ? (
                                            <Image src={photoPreview} alt="Teacher photo" width={96} height={96} className="rounded-full object-cover w-full h-full" />
                                        ) : (
                                            <span className="text-xs text-muted-foreground text-center">Upload Photo</span>
                                        )}
                                    </div>
                                </label>
                                <FormDescription className="mt-2">Click above to upload a photo.</FormDescription>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Controller control={form.control} name="name" render={({ field }) => (
                                    <div className="space-y-2"><Label htmlFor="name">Name</Label><Input id="name" {...field} placeholder="e.g., Jane Smith" required/></div>
                                )} />
                                <Controller control={form.control} name="designation" render={({ field }) => (
                                    <div className="space-y-2"><Label htmlFor="designation">Designation</Label><Input id="designation" {...field} placeholder="e.g., Senior Instructor" required/></div>
                                )} />
                                <Controller control={form.control} name="department" render={({ field }) => (
                                    <div className="space-y-2"><Label htmlFor="department">Department</Label><Input id="department" {...field} placeholder="e.g., Academics" required/></div>
                                )} />
                                <Controller control={form.control} name="phone" render={({ field }) => (
                                    <div className="space-y-2"><Label htmlFor="phone">Contact Number</Label><Input id="phone" type="tel" {...field} placeholder="e.g., (555) 123-4567" required/></div>
                                )} />
                                <Controller control={form.control} name="classCenter" render={({ field }) => (
                                    <div className="space-y-2"><Label htmlFor="classCenter">Class Center</Label><Input id="classCenter" {...field} placeholder="e.g., Main Campus" required/></div>
                                )} />
                                <Controller control={form.control} name="noOfBatches" render={({ field }) => (
                                    <div className="space-y-2"><Label htmlFor="noOfBatches">No of Batches</Label><Input id="noOfBatches" type="number" {...field} placeholder="e.g., 5" required/></div>
                                )} />
                                <Controller control={form.control} name="totalStudents" render={({ field }) => (
                                    <div className="space-y-2"><Label htmlFor="totalStudents">Total Students</Label><Input id="totalStudents" type="number" {...field} placeholder="e.g., 50" required/></div>
                                )} />
                                 <Controller control={form.control} name="noOfWorkingDays" render={({ field }) => (
                                    <div className="space-y-2"><Label htmlFor="noOfWorkingDays">No of Working Days</Label><Input id="noOfWorkingDays" type="number" {...field} readOnly className="bg-muted" /></div>
                                )} />
                            </div>
                             <div className="space-y-2 col-span-2">
                                <Label>Working Days</Label>
                                <Controller
                                    name="workingDays"
                                    control={form.control}
                                    render={() => (
                                        <div className="flex flex-wrap gap-4">
                                            {daysOfWeek.map((day) => (
                                                <FormField
                                                    key={day}
                                                    control={form.control}
                                                    name="workingDays"
                                                    render={({ field }) => (
                                                        <div className="flex items-center space-x-2">
                                                            <Checkbox
                                                                checked={field.value?.includes(day)}
                                                                onCheckedChange={(checked) => {
                                                                    return checked
                                                                        ? field.onChange([...(field.value || []), day])
                                                                        : field.onChange((field.value || []).filter((value: string) => value !== day));
                                                                }}
                                                            />
                                                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{day}</label>
                                                        </div>
                                                    )}
                                                />
                                            ))}
                                        </div>
                                    )}
                                />
                            </div>
                        </form>
                    </Form>
                    <DialogFooter>
                        <Button variant="outline" onClick={handleCloseDialog}>Cancel</Button>
                        <Button type="submit" form="teacher-form">
                            {editingTeacher ? 'Save Changes' : 'Add Teacher'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Teacher</TableHead>
                <TableHead className="hidden md:table-cell">Workload</TableHead>
                <TableHead className="hidden md:table-cell">Contact</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                        <TableCell>
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-9 w-9 rounded-full" />
                                <div className="space-y-1">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-3 w-32" />
                                </div>
                            </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                            <Skeleton className="h-4 w-24" />
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                            <Skeleton className="h-4 w-32" />
                        </TableCell>
                        <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                    </TableRow>
                ))
              ) : teachers.length > 0 ? (
                teachers.map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={teacher.avatar} alt={teacher.name} data-ai-hint="person" />
                          <AvatarFallback>{teacher.initials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <Link href={`/teachers/${teacher.id}`} className="font-medium hover:underline">{teacher.name}</Link>
                          <div className="text-sm text-muted-foreground">
                            {teacher.designation}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                        <div>{teacher.noOfBatches} Batches</div>
                        <div className="text-sm text-muted-foreground">{teacher.totalStudents} Students</div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                        <div>{teacher.email}</div>
                        <div className="text-sm text-muted-foreground">{teacher.phone}</div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            aria-haspopup="true"
                            size="icon"
                            variant="ghost"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem asChild>
                            <Link href={`/teachers/${teacher.id}`}><Eye className="mr-2 h-4 w-4"/> View Profile</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleOpenDialog(teacher)}>Edit</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleDelete(teacher)} className="text-destructive">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center h-24">
                    No teachers found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
       <CardFooter>
        <div className="text-xs text-muted-foreground">
          Showing <strong>{teachers.length}</strong> teachers.
        </div>
      </CardFooter>
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the teacher's record
                and remove their data from our servers.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setTeacherToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">
                Delete
            </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    </Card>
  );
}
