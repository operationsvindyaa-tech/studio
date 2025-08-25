
"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, Check, X, MessageSquareWarning, Upload } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { getTeachers, type Teacher } from "@/lib/teachers-db";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { notifyTeacher } from "./actions";
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
import * as XLSX from "xlsx";

const departments = [
  "All Departments", "Academics", "Performing Arts", "Science", "Marketing", "Arts", "Wellness", "Martial Arts", "Administration", "Management"
];

type AttendanceStatus = "Present" | "Absent" | "Unmarked";
type AttendanceRecord = {
    [teacherId: string]: AttendanceStatus;
};

export default function TeacherAttendancePage() {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDepartment, setSelectedDepartment] = useState<string>("All Departments");
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [attendance, setAttendance] = useState<AttendanceRecord>({});
    const [teacherToNotify, setTeacherToNotify] = useState<Teacher | null>(null);
    const [isNotifyDialogOpen, setIsNotifyDialogOpen] = useState(false);
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchTeacherData = async () => {
            setLoading(true);
            try {
                const teacherData = await getTeachers();
                setTeachers(teacherData);
                setFilteredTeachers(teacherData);
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to load teacher data. Please try again.",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };
        fetchTeacherData();
    }, [toast]);

    useEffect(() => {
        if (selectedDepartment === "All Departments") {
            setFilteredTeachers(teachers);
        } else {
            setFilteredTeachers(teachers.filter(t => t.department === selectedDepartment));
        }
        // Reset attendance when filter changes
        setAttendance({});
    }, [selectedDepartment, teachers]);
    
    useEffect(() => {
        // Reset attendance when date changes
        setAttendance({});
    }, [selectedDate]);

    const handleAttendanceChange = (teacherId: string, status: AttendanceStatus) => {
        setAttendance(prev => ({
            ...prev,
            [teacherId]: status,
        }));
    };
    
    const handleNotifyClick = (teacher: Teacher) => {
        setTeacherToNotify(teacher);
        setIsNotifyDialogOpen(true);
    };

    const confirmSendNotification = async () => {
        if (!teacherToNotify) return;

        const result = await notifyTeacher(teacherToNotify, "Marked absent from duty.");
        
        toast({
            title: result.success ? "Success" : "Error",
            description: result.message,
            variant: result.success ? "default" : "destructive",
        });

        setIsNotifyDialogOpen(false);
        setTeacherToNotify(null);
    };

    const getStatusColor = (status: AttendanceStatus) => {
        switch (status) {
            case "Present":
                return "border-green-500 bg-green-50";
            case "Absent":
                return "border-red-500 bg-red-50";
            default:
                return "border-transparent";
        }
    }
    
    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = e.target?.result;
                const workbook = XLSX.read(data, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const json = XLSX.utils.sheet_to_json(worksheet) as any[];

                const newAttendance: AttendanceRecord = { ...attendance };
                let updatedCount = 0;

                json.forEach(row => {
                    const teacherId = row["Teacher ID"] || row.teacherId || row.ID;
                    if (teacherId) {
                        const teacher = teachers.find(t => t.id === teacherId);
                        if (teacher) {
                            newAttendance[teacher.id] = "Present";
                            updatedCount++;
                        }
                    }
                });

                setAttendance(newAttendance);
                toast({
                    title: "Import Successful",
                    description: `Updated attendance for ${updatedCount} teacher(s).`,
                });
            } catch (error) {
                console.error("Error processing file:", error);
                toast({
                    title: "Import Failed",
                    description: "Could not read the file. Please ensure it's a valid Excel file.",
                    variant: "destructive",
                });
            }
        };
        reader.readAsBinaryString(file);
        if(fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".xlsx, .xls, .csv"
            />
            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                        <div>
                            <CardTitle>Teacher Attendance</CardTitle>
                            <CardDescription>Mark teacher attendance for the selected date.</CardDescription>
                        </div>
                        <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
                             <Button variant="outline" onClick={handleImportClick}>
                                <Upload className="h-4 w-4 mr-2" />
                                Import Biometric Data
                            </Button>
                            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                                <SelectTrigger className="w-full md:w-[200px]">
                                    <SelectValue placeholder="Select a department" />
                                </SelectTrigger>
                                <SelectContent>
                                    {departments.map(department => (
                                        <SelectItem key={department} value={department}>{department}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn("w-full justify-start text-left font-normal md:w-[240px]", !selectedDate && "text-muted-foreground")}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={selectedDate}
                                        onSelect={(date) => date && setSelectedDate(date)}
                                        disabled={(date) => date > new Date()}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {loading ? (
                            Array.from({ length: 12 }).map((_, i) => (
                               <Card key={i} className="flex flex-col items-center p-4">
                                   <Skeleton className="h-20 w-20 rounded-full" />
                                   <Skeleton className="h-4 w-24 mt-2" />
                                   <Skeleton className="h-3 w-16 mt-1" />
                                   <div className="flex gap-2 mt-4">
                                       <Skeleton className="h-8 w-16 rounded-full" />
                                       <Skeleton className="h-8 w-16 rounded-full" />
                                   </div>
                               </Card>
                            ))
                        ) : filteredTeachers.length > 0 ? (
                            filteredTeachers.map(teacher => {
                                const status = attendance[teacher.id] || "Unmarked";
                                return (
                                    <Card key={teacher.id} className={cn("flex flex-col items-center text-center p-4 border-2 transition-colors", getStatusColor(status))}>
                                        <Avatar className="h-20 w-20 mb-2">
                                            <AvatarImage src={teacher.avatar} alt={teacher.name} data-ai-hint="person" />
                                            <AvatarFallback>{teacher.initials}</AvatarFallback>
                                        </Avatar>
                                        <p className="font-semibold text-sm">{teacher.name}</p>
                                        <p className="text-xs text-muted-foreground">{teacher.designation}</p>
                                        <div className="mt-4 flex flex-col gap-2 w-full">
                                            <div className="grid grid-cols-2 gap-2">
                                                <Button
                                                    size="sm"
                                                    variant={status === "Present" ? "default" : "outline"}
                                                    onClick={() => handleAttendanceChange(teacher.id, "Present")}
                                                    className="bg-green-500 hover:bg-green-600 text-white data-[variant=outline]:bg-transparent data-[variant=outline]:text-green-600 data-[variant=outline]:border-green-600"
                                                >
                                                    <Check className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant={status === "Absent" ? "destructive" : "outline"}
                                                    onClick={() => handleAttendanceChange(teacher.id, "Absent")}
                                                    className="data-[variant=outline]:text-red-600 data-[variant=outline]:border-red-600"
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            {status === 'Absent' && (
                                                <Button
                                                    size="sm"
                                                    variant="secondary"
                                                    className="w-full"
                                                    onClick={() => handleNotifyClick(teacher)}
                                                >
                                                    <MessageSquareWarning className="mr-2 h-4 w-4" /> Notify
                                                </Button>
                                            )}
                                        </div>
                                    </Card>
                                )
                            })
                        ) : (
                             <div className="col-span-full text-center py-10">
                                <p className="text-muted-foreground">No teachers found for this department.</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
            <AlertDialog open={isNotifyDialogOpen} onOpenChange={setIsNotifyDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Notification</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to send a notification to {teacherToNotify?.name} regarding their absence?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setTeacherToNotify(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmSendNotification}>
                            Send Notification
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
