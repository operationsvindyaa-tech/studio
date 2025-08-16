
"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useReactToPrint } from "react-to-print";
import { Award, GraduationCap, Printer, Upload, FileText } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

export default function CertificatesPage() {
  // State for Achievement Certificate
  const [studentName, setStudentName] = useState("Jane Doe");
  const [activityName, setActivityName] = useState("Bharatanatyam");
  const [reason, setReason] = useState("for successful completion of the course");
  const [date, setDate] = useState(new Date().toLocaleDateString('en-CA')); // YYYY-MM-DD format
  const [signature, setSignature] = useState("Smt. Vani Ramesh");
  const [signatureTitle, setSignatureTitle] = useState("Artistic Director");
  const [logo, setLogo] = useState<string | null>(null);

  // State for Transfer Certificate
  const [tcStudentName, setTcStudentName] = useState("John Doe");
  const [tcFatherName, setTcFatherName] = useState("Robert Doe");
  const [tcNationality, setTcNationality] = useState("American");
  const [tcAdmissionDate, setTcAdmissionDate] = useState("2022-06-01");
  const [tcLeavingDate, setTcLeavingDate] = useState(new Date().toLocaleDateString('en-CA'));
  const [tcLastClass, setTcLastClass] = useState("Advanced Guitar");
  const [tcReasonForLeaving, setTcReasonForLeaving] = useState("Relocation");
  const [tcConduct, setTcConduct] = useState("Good");
  
  const achievementRef = useRef<HTMLDivElement>(null);
  const transferRef = useRef<HTMLDivElement>(null);

  const handlePrintAchievement = useReactToPrint({
    content: () => achievementRef.current,
    documentTitle: `Certificate-${studentName.replace(' ', '_')}-${activityName.replace(' ', '_')}`,
  });
  
  const handlePrintTransfer = useReactToPrint({
    content: () => transferRef.current,
    documentTitle: `Transfer_Certificate-${tcStudentName.replace(' ', '_')}`,
  });


  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Certificate Details</CardTitle>
            <CardDescription>
              Enter the details to generate the certificate.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="space-y-2">
              <Label>Institution Logo</Label>
              <Input
                id="logo-upload"
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="text-sm file:mr-2 file:text-foreground"
              />
            </div>
            <Tabs defaultValue="achievement">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="achievement">Achievement</TabsTrigger>
                    <TabsTrigger value="transfer">Transfer</TabsTrigger>
                </TabsList>
                <TabsContent value="achievement" className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="student-name">Student Name</Label>
                        <Input id="student-name" value={studentName} onChange={(e) => setStudentName(e.target.value)} placeholder="Enter student's full name" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="activity-name">Activity / Course Name</Label>
                        <Input id="activity-name" value={activityName} onChange={(e) => setActivityName(e.target.value)} placeholder="e.g., Advanced Guitar" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="reason">Reason for Award</Label>
                        <Select value={reason} onValueChange={setReason}>
                            <SelectTrigger id="reason"><SelectValue placeholder="Select a reason" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="for successful completion of the course">Successful Completion</SelectItem>
                                <SelectItem value="for outstanding performance in">Outstanding Performance</SelectItem>
                                <SelectItem value="for participation in the workshop">Workshop Participation</SelectItem>
                                <SelectItem value="as a token of appreciation for">Appreciation</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="date">Date of Issue</Label>
                        <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="signature">Authorizer's Name</Label>
                        <Input id="signature" value={signature} onChange={(e) => setSignature(e.target.value)} placeholder="e.g., Smt. Vani Ramesh" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="signature-title">Authorizer's Title</Label>
                        <Input id="signature-title" value={signatureTitle} onChange={(e) => setSignatureTitle(e.target.value)} placeholder="e.g., Artistic Director" />
                    </div>
                    <Button onClick={handlePrintAchievement} className="w-full">
                        <Printer className="mr-2 h-4 w-4" /> Print Achievement Certificate
                    </Button>
                </TabsContent>
                <TabsContent value="transfer" className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="tc-student-name">Student Name</Label>
                        <Input id="tc-student-name" value={tcStudentName} onChange={(e) => setTcStudentName(e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="tc-father-name">Father's Name</Label>
                        <Input id="tc-father-name" value={tcFatherName} onChange={(e) => setTcFatherName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="tc-nationality">Nationality</Label>
                        <Input id="tc-nationality" value={tcNationality} onChange={(e) => setTcNationality(e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="tc-admission-date">Date of Admission</Label>
                        <Input id="tc-admission-date" type="date" value={tcAdmissionDate} onChange={(e) => setTcAdmissionDate(e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="tc-leaving-date">Date of Leaving</Label>
                        <Input id="tc-leaving-date" type="date" value={tcLeavingDate} onChange={(e) => setTcLeavingDate(e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="tc-last-class">Last Enrolled Course</Label>
                        <Input id="tc-last-class" value={tcLastClass} onChange={(e) => setTcLastClass(e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="tc-reason">Reason for Leaving</Label>
                        <Textarea id="tc-reason" value={tcReasonForLeaving} onChange={(e) => setTcReasonForLeaving(e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="tc-conduct">Conduct</Label>
                        <Input id="tc-conduct" value={tcConduct} onChange={(e) => setTcConduct(e.target.value)} />
                    </div>
                    <Button onClick={handlePrintTransfer} className="w-full">
                        <Printer className="mr-2 h-4 w-4" /> Print Transfer Certificate
                    </Button>
                </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-2">
        <Tabs defaultValue="achievement">
            <TabsList className="hidden">
                <TabsTrigger value="achievement">Achievement</TabsTrigger>
                <TabsTrigger value="transfer">Transfer</TabsTrigger>
            </TabsList>
            <TabsContent value="achievement">
                <Card className="aspect-[sqrt(2)/1] w-full">
                    <CardContent className="p-0">
                        <div ref={achievementRef} className="p-8 border-8 border-primary/20 h-full relative flex flex-col justify-between bg-white text-black">
                            {/* Background watermark */}
                            <div className="absolute inset-0 flex items-center justify-center -z-0">
                                <GraduationCap className="h-64 w-64 text-primary/5" />
                            </div>
                        
                            <div className="z-10">
                                <header className="text-center mb-8">
                                    <div className="flex items-center justify-between gap-3 mb-2">
                                        {logo ? (
                                            <Image src={logo} alt="Institution Logo" width={80} height={80} className="object-contain" />
                                        ) : (
                                            <div className="w-20 h-20"></div> // Placeholder for spacing
                                        )}
                                        <div className="flex-grow">
                                            <div className="flex items-center justify-center gap-3">
                                                <GraduationCap className="h-10 w-10 text-primary" />
                                                <h1 className="text-3xl font-bold font-headline text-primary">VINDYAA - The Altitude of Art</h1>
                                            </div>
                                            <p className="text-xs text-slate-600 mt-2">
                                                #19, 1st Cross, 1st Main, Sri Manjunatha Layout, Basavanapura Main Rd, Near SBI Bank, Bengaluru, Karnataka 560049
                                                <br />
                                                Phone: +91 95909 59005 | Email: vindyaa.art@gmail.com
                                            </p>
                                        </div>
                                        <div className="w-20 h-20"></div>  // Placeholder for spacing
                                    </div>
                                </header>
                                <Separator />
                                <div className="text-center my-10">
                                    <p className="text-lg text-slate-700 font-headline uppercase tracking-widest">Certificate of Achievement</p>
                                    <Separator className="w-24 mx-auto my-2"/>
                                    <p className="text-base text-slate-600 mt-6">This certificate is proudly presented to</p>
                                    <h2 className="text-5xl font-bold font-headline text-primary my-4">{studentName || "Student Name"}</h2>
                                    <p className="text-base text-slate-600">{reason}
                                        <span className="font-bold font-headline text-primary"> {activityName || "the activity"}</span>.
                                    </p>
                                </div>
                            </div>

                            <footer className="z-10 flex justify-between items-end text-center">
                                <div>
                                    <p className="font-headline border-b-2 border-slate-400 pb-1 px-4">{new Date(date).toLocaleDateString()}</p>
                                    <p className="text-sm font-semibold text-slate-600 mt-2">Date</p>
                                </div>
                                <div className="flex-shrink-0 mb-4">
                                    <Award className="h-20 w-20 text-yellow-500" />
                                </div>
                                <div>
                                    <p className="font-headline border-b-2 border-slate-400 pb-1 px-4">{signature || "Signature"}</p>
                                    <p className="text-sm font-semibold text-slate-600 mt-2">{signatureTitle || "Title"}</p>
                                </div>
                            </footer>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="transfer">
                <Card className="aspect-[1/sqrt(2)] w-full">
                  <CardContent className="p-0">
                    <div ref={transferRef} className="p-8 bg-white text-black font-serif h-full flex flex-col">
                        <header className="text-center mb-6">
                            <div className="flex justify-center mb-2">
                            {logo ? (
                                <Image src={logo} alt="Institution Logo" width={60} height={60} className="object-contain" />
                            ) : (
                                <div className="w-16 h-16 flex items-center justify-center">
                                    <GraduationCap className="h-12 w-12 text-black" />
                                </div>
                            )}
                            </div>
                            <h1 className="text-3xl font-bold font-headline">VINDYAA - The Altitude of Art</h1>
                            <p className="text-xs text-slate-600 mt-1">
                                #19, 1st Cross, 1st Main, Basavanapura Main Rd, Bengaluru, 560049
                            </p>
                        </header>
                        <Separator />

                        <div className="text-right my-4 text-sm">
                            Date: {new Date().toLocaleDateString('en-GB')}
                        </div>

                        <div className="flex-grow space-y-4 text-sm leading-relaxed">
                            <h2 className="text-lg font-bold tracking-widest text-center underline">TRANSFER CERTIFICATE</h2>

                            <p className="pt-4">
                                This is to certify that <strong>{tcStudentName}</strong>, son/daughter of <strong>{tcFatherName}</strong>, 
                                was a bonafide student of this institution from <strong>{new Date(tcAdmissionDate).toLocaleDateString('en-GB')}</strong> to <strong>{new Date(tcLeavingDate).toLocaleDateString('en-GB')}</strong>.
                            </p>
                            
                            <p>
                                Details of the student as per our records are as follows:
                            </p>

                            <table className="w-full text-left border-collapse">
                                <tbody>
                                    <tr><td className="py-1 pr-2 font-semibold w-1/3">Nationality</td><td className="py-1">: {tcNationality}</td></tr>
                                    <tr><td className="py-1 pr-2 font-semibold">Last Course Enrolled</td><td className="py-1">: {tcLastClass}</td></tr>
                                    <tr><td className="py-1 pr-2 font-semibold">Reason for Leaving</td><td className="py-1">: {tcReasonForLeaving}</td></tr>
                                    <tr><td className="py-1 pr-2 font-semibold">General Conduct</td><td className="py-1">: {tcConduct}</td></tr>
                                    <tr><td className="py-1 pr-2 font-semibold">Remarks</td><td className="py-1">: All dues have been cleared.</td></tr>
                                </tbody>
                            </table>

                            <p className="pt-4">
                                We wish {tcStudentName} all the very best for their future endeavors.
                            </p>
                        </div>

                        <footer className="pt-16">
                            <div className="h-12"></div>
                            <p className="border-t border-black pt-1 font-semibold">Signature of Principal</p>
                            <p className="text-xs">(Seal of Institution)</p>
                        </footer>
                    </div>
                  </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

