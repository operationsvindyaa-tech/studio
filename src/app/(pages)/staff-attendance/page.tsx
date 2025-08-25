
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
import { getStaff, type Staff } from "@/lib/staff-db";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { notifyStaffMember } from "./actions";
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
  "All Departments", "Academics", "Administration", "Support Staff", "Management"
];

type AttendanceStatus = "Present" | "Absent" | "Unmarked";
type AttendanceRecord = {
    [staffId: string]: AttendanceStatus;
};

export default function StaffAttendancePage() {
    const [staff, setStaff] = useState<Staff[]>([]);
    const [filteredStaff, setFilteredStaff] = useState<Staff[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDepartment, setSelectedDepartment] = useState<string>("All Departments");
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [attendance, setAttendance] = useState<AttendanceRecord>({});
    const [staffToNotify, setStaffToNotify] = useState<Staff | null>(null);
    const [isNotifyDialogOpen, setIsNotifyDialogOpen] = useState(false);
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchStaffData = async () => {
            setLoading(true);
            try {
                const staffData = await getStaff();
                setStaff(staffData);
                setFilteredStaff(staffData);
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to load staff data. Please try again.",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };
        fetchStaffData();
    }, [toast]);

    useEffect(() => {
        if (selectedDepartment === "All Departments") {
            setFilteredStaff(staff);
        } else {
            setFilteredStaff(staff.filter(s => s.jobDetails.department === selectedDepartment));
        }
        // Reset attendance when filter changes
        setAttendance({});
    }, [selectedDepartment, staff]);
    
    useEffect(() => {
        // Reset attendance when date changes
        setAttendance({});
    }, [selectedDate]);

    const handleAttendanceChange = (staffId: string, status: AttendanceStatus) => {
        setAttendance(prev => ({
            ...prev,
            [staffId]: status,
        }));
    };
    
    const handleNotifyClick = (staffMember: Staff) => {
        setStaffToNotify(staffMember);
        setIsNotifyDialogOpen(true);
    };

    const confirmSendNotification = async () => {
        if (!staffToNotify) return;

        const result = await notifyStaffMember(staffToNotify, "Marked absent from duty.");
        
        toast({
            title: result.success ? "Success" : "Error",
            description: result.message,
            variant: result.success ? "default" : "destructive",
        });

        setIsNotifyDialogOpen(false);
        setStaffToNotify(null);
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
                    const staffId = row["Staff ID"] || row.staffId || row.ID;
                    if (staffId) {
                        const staffMember = staff.find(s => s.id === staffId);
                        if (staffMember) {
                            newAttendance[staffMember.id] = "Present";
                            updatedCount++;
                        }
                    }
                });

                setAttendance(newAttendance);
                toast({
                    title: "Import Successful",
                    description: `Updated attendance for ${updatedCount} staff member(s).`,
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
        // Reset file input to allow uploading the same file again
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
                            <CardTitle>Staff Attendance</CardTitle>
                            <CardDescription>Mark staff attendance for the selected date.</CardDescription>
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
                        ) : filteredStaff.length > 0 ? (
                            filteredStaff.map(staffMember => {
                                const status = attendance[staffMember.id] || "Unmarked";
                                return (
                                    <Card key={staffMember.id} className={cn("flex flex-col items-center text-center p-4 border-2 transition-colors", getStatusColor(status))}>
                                        <Avatar className="h-20 w-20 mb-2">
                                            <AvatarImage src={staffMember.personalInfo.photo} alt={staffMember.fullName} data-ai-hint="person" />
                                            <AvatarFallback>{staffMember.initials}</AvatarFallback>
                                        </Avatar>
                                        <p className="font-semibold text-sm">{staffMember.fullName}</p>
                                        <p className="text-xs text-muted-foreground">{staffMember.jobDetails.role}</p>
                                        <div className="mt-4 flex flex-col gap-2 w-full">
                                            <div className="grid grid-cols-2 gap-2">
                                                <Button
                                                    size="sm"
                                                    variant={status === "Present" ? "default" : "outline"}
                                                    onClick={() => handleAttendanceChange(staffMember.id, "Present")}
                                                    className="bg-green-500 hover:bg-green-600 text-white data-[variant=outline]:bg-transparent data-[variant=outline]:text-green-600 data-[variant=outline]:border-green-600"
                                                >
                                                    <Check className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant={status === "Absent" ? "destructive" : "outline"}
                                                    onClick={() => handleAttendanceChange(staffMember.id, "Absent")}
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
                                                    onClick={() => handleNotifyClick(staffMember)}
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
                                <p className="text-muted-foreground">No staff found for this department.</p>
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
                            Are you sure you want to send a notification to {staffToNotify?.fullName} regarding their absence?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setStaffToNotify(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmSendNotification}>
                            Send Notification
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
