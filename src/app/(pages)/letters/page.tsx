
"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useReactToPrint } from "react-to-print";
import { Mail, Printer } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { getStaff, type Staff } from "@/lib/staff-db";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";

export default function LettersPage() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStaffId, setSelectedStaffId] = useState<string>("");

  // Appointment Letter State
  const [joiningDate, setJoiningDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [designation, setDesignation] = useState("");
  const [salary, setSalary] = useState("");
  const [probationPeriod, setProbationPeriod] = useState("3 months");
  const [customAppointmentBody, setCustomAppointmentBody] = useState("");

  // Relieving Letter State
  const [lastWorkingDate, setLastWorkingDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [resignationDate, setResignationDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  
  const appointmentLetterRef = useRef<HTMLDivElement>(null);
  const relievingLetterRef = useRef<HTMLDivElement>(null);

  const handlePrintAppointment = useReactToPrint({
    content: () => appointmentLetterRef.current,
  });

  const handlePrintRelieving = useReactToPrint({
    content: () => relievingLetterRef.current,
  });

  useEffect(() => {
    const fetchStaffData = async () => {
        setLoading(true);
        const data = await getStaff();
        setStaff(data);
        if (data.length > 0) {
            setSelectedStaffId(data[0].id);
        }
        setLoading(false);
    }
    fetchStaffData();
  }, []);

  const selectedStaff = staff.find(s => s.id === selectedStaffId);

  useEffect(() => {
    if (selectedStaff) {
        setDesignation(selectedStaff.jobDetails.role);
        setSalary(selectedStaff.payroll.salary.toString());
        setJoiningDate(format(new Date(selectedStaff.jobDetails.dateOfJoining), 'yyyy-MM-dd'));
    }
  }, [selectedStaff]);

  const appointmentLetterBody = customAppointmentBody || `Further to your application and the subsequent interview you had with us, we are pleased to appoint you as **${designation}** in our organization, on the following terms and conditions:

1.  **Date of Joining**: Your appointment will be effective from **${joiningDate ? format(new Date(joiningDate), 'MMMM dd, yyyy') : ''}**.

2.  **Probation**: You will be on probation for a period of **${probationPeriod}** from the date of your joining.

3.  **Remuneration**: Your salary will be **₹${salary} per month**.

4.  **Duties**: You will be expected to perform the duties assigned to you to the best of your abilities.

We welcome you to VINDYAA - The Altitude of Art and look forward to a long and successful association.

Yours sincerely,
Management`;
  
  const relievingLetterBody = `This letter is to confirm your official relieving from your duties as **${selectedStaff?.jobDetails.role || ''}** at VINDYAA - The Altitude of Art, effective at the close of business on **${lastWorkingDate ? format(new Date(lastWorkingDate), 'MMMM dd, yyyy') : ''}**.

This follows your resignation dated **${resignationDate ? format(new Date(resignationDate), 'MMMM dd, yyyy') : ''}**. We confirm that you have completed all your exit formalities, and all dues have been settled.

We thank you for your contribution to the organization and wish you all the best for your future endeavors.

Yours sincerely,
Management`;


  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Letter Generation</CardTitle>
            <CardDescription>
              Select staff and customize the letter content.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="space-y-2">
                <Label>Select Staff Member</Label>
                {loading ? <Skeleton className="h-10 w-full" /> : (
                    <Select value={selectedStaffId} onValueChange={setSelectedStaffId}>
                        <SelectTrigger><SelectValue placeholder="Select Staff" /></SelectTrigger>
                        <SelectContent>
                            {staff.map(s => <SelectItem key={s.id} value={s.id}>{s.fullName}</SelectItem>)}
                        </SelectContent>
                    </Select>
                )}
            </div>
            <Separator />
            <Tabs defaultValue="appointment">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="appointment">Appointment</TabsTrigger>
                    <TabsTrigger value="relieving">Relieving</TabsTrigger>
                </TabsList>
                <TabsContent value="appointment" className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="joining-date">Date of Joining</Label>
                        <Input id="joining-date" type="date" value={joiningDate} onChange={e => setJoiningDate(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="designation">Designation</Label>
                        <Input id="designation" value={designation} onChange={e => setDesignation(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="salary">Salary (per month)</Label>
                        <Input id="salary" type="number" value={salary} onChange={e => setSalary(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="probation">Probation Period</Label>
                        <Input id="probation" value={probationPeriod} onChange={e => setProbationPeriod(e.target.value)} />
                    </div>
                    <Button onClick={handlePrintAppointment} className="w-full">
                        <Printer className="mr-2 h-4 w-4" /> Print Appointment Letter
                    </Button>
                </TabsContent>
                <TabsContent value="relieving" className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="last-date">Last Working Date</Label>
                        <Input id="last-date" type="date" value={lastWorkingDate} onChange={e => setLastWorkingDate(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="resignation-date">Date of Resignation</Label>
                        <Input id="resignation-date" type="date" value={resignationDate} onChange={e => setResignationDate(e.target.value)} />
                    </div>
                    <Button onClick={handlePrintRelieving} className="w-full">
                        <Printer className="mr-2 h-4 w-4" /> Print Relieving Letter
                    </Button>
                </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-2">
        <Tabs defaultValue="appointment">
            <TabsList className="hidden">
                 <TabsTrigger value="appointment">Appointment</TabsTrigger>
                 <TabsTrigger value="relieving">Relieving</TabsTrigger>
            </TabsList>
            <TabsContent value="appointment">
                <Card className="min-h-[80vh]">
                  <CardHeader><CardTitle>Appointment Letter Preview</CardTitle></CardHeader>
                  <CardContent>
                    <div ref={appointmentLetterRef} className="p-4 bg-white text-black text-sm">
                      <p className="text-right font-semibold">Date: {format(new Date(), 'MMMM dd, yyyy')}</p>
                      <br />
                      <p>To,</p>
                      <p className="font-semibold">{selectedStaff?.fullName}</p>
                      <p>{selectedStaff?.personalInfo.address}</p>
                      <br />
                      <p className="font-semibold">Dear {selectedStaff?.fullName.split(' ')[0]},</p>
                      <br />
                      <p className="font-bold underline text-center">Subject: Letter of Appointment</p>
                      <br />
                       <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: appointmentLetterBody.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></div>
                    </div>
                  </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="relieving">
                 <Card className="min-h-[80vh]">
                  <CardHeader><CardTitle>Relieving Letter Preview</CardTitle></CardHeader>
                  <CardContent>
                    <div ref={relievingLetterRef} className="p-4 bg-white text-black text-sm">
                      <p className="text-right font-semibold">Date: {format(new Date(), 'MMMM dd, yyyy')}</p>
                      <br />
                      <p>To,</p>
                      <p className="font-semibold">{selectedStaff?.fullName}</p>
                      <p>{selectedStaff?.personalInfo.address}</p>
                      <br />
                      <p className="font-semibold">Dear {selectedStaff?.fullName.split(' ')[0]},</p>
                      <br />
                      <p className="font-bold underline text-center">Subject: Relieving Letter</p>
                      <br />
                      <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: relievingLetterBody.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></div>
                    </div>
                  </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
