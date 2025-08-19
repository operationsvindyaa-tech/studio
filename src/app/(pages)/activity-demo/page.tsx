
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Loader2, ClipboardCheck, ClipboardList, Check, X, Phone, MoreHorizontal, UserPlus } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { createDemoRequest, updateRequestStatus, assignTeacher } from "./actions";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getDemoRequests, type DemoRequest } from "@/lib/demo-requests-db";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { getTeachers, type Teacher } from "@/lib/teachers-db";
import { Label } from "@/components/ui/label";

const demoFormSchema = z.object({
  studentName: z.string().min(2, "Name must be at least 2 characters."),
  phone: z.string().min(10, "A valid phone number is required."),
  email: z.string().email("A valid email is required."),
  activityName: z.string({ required_error: "Please select an activity." }),
  preferredDate: z.date({ required_error: "Please select a date." }),
  branch: z.string({ required_error: "Please select a branch." }),
  personInCharge: z.string(),
});


type DemoFormValues = z.infer<typeof demoFormSchema>;

const initialState = {
    message: "",
    success: false,
};

const activities = [
    "Bharatanatyam", "Vocal Carnatic", "Keyboard/Piano", "Guitar",
    "Yoga", "Western Dance", "Art & Craft", "Karate", "Kalaripayattu", "Zumba", "Gymnastics"
];

const branches = {
  "Main Campus (Basavanapura)": "Mr. Anand Kumar",
  "Branch 2 (Marathahalli)": "Ms. Sunita Reddy",
  "Branch 3 (Koramangala)": "Mr. Rajesh Sharma",
  "Branch 4 (Indiranagar)": "Ms. Priya Menon",
  "Branch 5 (Jayanagar)": "Mr. Vijay Kumar",
};

const branchNames = Object.keys(branches);

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full">
            {pending ? <Loader2 className="animate-spin" /> : "Request Demo Class"}
        </Button>
    );
}

function DemoRequestForm() {
    const [state, formAction] = useActionState(createDemoRequest, initialState);
    const { toast } = useToast();
    const formRef = useRef<HTMLFormElement>(null);
    const form = useForm<DemoFormValues>({
        resolver: zodResolver(demoFormSchema),
        defaultValues: {
            studentName: "",
            phone: "",
            email: "",
            personInCharge: "",
        },
    });
    
    const selectedBranch = form.watch("branch");

    useEffect(() => {
        if (selectedBranch) {
            form.setValue("personInCharge", branches[selectedBranch as keyof typeof branches]);
        }
    }, [selectedBranch, form]);

    useEffect(() => {
        if (state.message) {
            toast({
                title: state.success ? "Success!" : "Error",
                description: state.message,
                variant: state.success ? "default" : "destructive",
            });
            if (state.success) {
                form.reset();
            }
        }
    }, [state, toast, form]);
    
    return (
        <Card className="max-w-2xl mx-auto border-none shadow-none">
            <CardHeader className="text-center">
                 <div className="mx-auto bg-muted p-4 rounded-full w-fit mb-2">
                    <ClipboardCheck className="h-12 w-12 text-muted-foreground" />
                </div>
                <CardTitle>Request an Activity Demo</CardTitle>
                <CardDescription>
                    Fill out the form below to schedule a free trial class for any of our activities.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        ref={formRef}
                        action={form.handleSubmit(formAction)}
                        className="space-y-8"
                    >
                        <div className="grid md:grid-cols-2 gap-6">
                            <FormField control={form.control} name="studentName" render={({ field }) => (
                                <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="Your Full Name" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                             <FormField control={form.control} name="phone" render={({ field }) => (
                                <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input placeholder="(555) 123-4567" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                        <FormField control={form.control} name="email" render={({ field }) => (
                            <FormItem><FormLabel>Email Address</FormLabel><FormControl><Input type="email" placeholder="you@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />

                        <div className="grid md:grid-cols-2 gap-6">
                            <FormField control={form.control} name="activityName" render={({ field }) => (
                                <FormItem><FormLabel>Select Activity</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Choose an activity" /></SelectTrigger></FormControl><SelectContent>
                                    {activities.map(activity => <SelectItem key={activity} value={activity}>{activity}</SelectItem>)}
                                </SelectContent></Select><FormMessage /></FormItem>
                            )} />
                             <FormField control={form.control} name="preferredDate" render={({ field }) => (
                                <FormItem className="flex flex-col"><FormLabel>Preferred Date</FormLabel>
                                    <Popover><PopoverTrigger asChild>
                                        <FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl>
                                    </PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date()} initialFocus /></PopoverContent></Popover><FormMessage />
                                </FormItem>
                            )} />
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                             <FormField control={form.control} name="branch" render={({ field }) => (
                                <FormItem><FormLabel>Select Branch</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Choose a branch" /></SelectTrigger></FormControl><SelectContent>
                                    {branchNames.map(branch => <SelectItem key={branch} value={branch}>{branch}</SelectItem>)}
                                </SelectContent></Select><FormMessage /></FormItem>
                            )} />
                             <FormField control={form.control} name="personInCharge" render={({ field }) => (
                                <FormItem><FormLabel>Person In-Charge</FormLabel><FormControl><Input placeholder="Select a branch first" {...field} readOnly className="bg-muted" /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                        
                        <SubmitButton />
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}


function ManageRequests() {
    const [requests, setRequests] = useState<DemoRequest[]>([]);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [loading, setLoading] = useState(true);
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();
    const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<DemoRequest | null>(null);

    const [assignState, assignAction] = useActionState(assignTeacher, initialState);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [requestData, teacherData] = await Promise.all([
                    getDemoRequests(),
                    getTeachers()
                ]);
                setRequests(requestData);
                setTeachers(teacherData);
            } catch (error) {
                 toast({
                    title: "Error",
                    description: "Failed to load data. Please try again.",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [toast]);
    
    useEffect(() => {
        if(assignState.message) {
             toast({
                title: assignState.success ? "Success" : "Error",
                description: assignState.message,
                variant: assignState.success ? "default" : "destructive",
            });
            if (assignState.success) {
                // Manually update the state to reflect the change immediately
                setRequests(prev => prev.map(r => r.id === selectedRequest?.id ? { ...r, assignedTeacherName: (document.getElementById('teacher-select') as HTMLSelectElement)?.selectedOptions[0].text } : r));
                setIsAssignDialogOpen(false);
                setSelectedRequest(null);
            }
        }
    }, [assignState, toast, selectedRequest]);


    const handleStatusUpdate = async (id: string, status: DemoRequest['status']) => {
        startTransition(async () => {
            const result = await updateRequestStatus(id, status);
            toast({
                title: result.success ? "Status Updated" : "Error",
                description: result.message,
                variant: result.success ? "default" : "destructive",
            });
            if (result.success) {
                setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
            }
        });
    }
    
    const handleAssignClick = (request: DemoRequest) => {
        setSelectedRequest(request);
        setIsAssignDialogOpen(true);
    }

    const getStatusVariant = (status: DemoRequest['status']) => {
        switch (status) {
            case 'Pending': return 'default';
            case 'Confirmed': return 'secondary';
            case 'Completed': return 'outline';
            default: return 'default';
        }
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Manage Demo Requests</CardTitle>
                    <CardDescription>Review and update the status of incoming demo requests from prospective students.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Student</TableHead>
                                    <TableHead>Activity</TableHead>
                                    <TableHead>Preferred Date</TableHead>
                                    <TableHead>Assigned To</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    Array.from({length: 3}).map((_, i) => (
                                        <TableRow key={i}>
                                            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                            <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                                            <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : requests.length > 0 ? (
                                    requests.map(req => (
                                        <TableRow key={req.id}>
                                            <TableCell>
                                                <div className="font-medium">{req.studentName}</div>
                                                <div className="text-sm text-muted-foreground">{req.phone}</div>
                                            </TableCell>
                                            <TableCell>{req.activityName}</TableCell>
                                            <TableCell>{format(new Date(req.preferredDate), 'PPP')}</TableCell>
                                            <TableCell>
                                                {req.assignedTeacherName ? (
                                                    <Badge variant="outline">{req.assignedTeacherName}</Badge>
                                                ) : (
                                                    <Button variant="link" className="p-0 h-auto" onClick={() => handleAssignClick(req)}>Assign</Button>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={getStatusVariant(req.status)}>{req.status}</Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" disabled={isPending}>
                                                            {isPending ? <Loader2 className="animate-spin" /> : <MoreHorizontal />}
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent>
                                                        <DropdownMenuItem onClick={() => handleAssignClick(req)}>
                                                            <UserPlus className="mr-2 h-4 w-4" /> Assign Teacher
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleStatusUpdate(req.id, 'Confirmed')}>
                                                            <Check className="mr-2 h-4 w-4" /> Confirm
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleStatusUpdate(req.id, 'Completed')}>
                                                            <ClipboardCheck className="mr-2 h-4 w-4" /> Mark as Completed
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleStatusUpdate(req.id, 'Pending')}>
                                                            <X className="mr-2 h-4 w-4" /> Mark as Pending
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center h-24">
                                            No demo requests yet.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Assign Teacher to Demo</DialogTitle>
                        <DialogDescription>
                            Select a teacher to conduct the demo for {selectedRequest?.studentName}.
                        </DialogDescription>
                    </DialogHeader>
                    <form action={assignAction}>
                        <div className="py-4">
                             <input type="hidden" name="requestId" value={selectedRequest?.id} />
                            <div className="space-y-2">
                                <Label htmlFor="teacher-select">Teacher</Label>
                                <Select name="teacherId" required>
                                    <SelectTrigger id="teacher-select">
                                        <SelectValue placeholder="Select a teacher" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {teachers.map(teacher => (
                                            <SelectItem key={teacher.id} value={teacher.id}>
                                                {teacher.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <input type="hidden" name="teacherName" value={
                                    (document.getElementById('teacher-select') as HTMLSelectElement)?.selectedOptions[0]?.text
                                } />
                            </div>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button type="submit">Assign Teacher</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default function ActivityDemoPage() {
    return (
        <Tabs defaultValue="request">
            <TabsList className="grid w-full grid-cols-2 max-w-lg mx-auto">
                <TabsTrigger value="request"><ClipboardCheck className="mr-2"/>Request</TabsTrigger>
                <TabsTrigger value="manage"><ClipboardList className="mr-2"/>Manage</TabsTrigger>
            </TabsList>
            <TabsContent value="request">
                <DemoRequestForm />
            </TabsContent>
            <TabsContent value="manage">
                <ManageRequests />
            </TabsContent>
        </Tabs>
    );
}
