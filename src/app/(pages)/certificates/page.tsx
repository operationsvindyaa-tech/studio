
"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useReactToPrint } from "react-to-print";
import { Award, GraduationCap, Printer } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

export default function CertificatesPage() {
  const [studentName, setStudentName] = useState("Jane Doe");
  const [activityName, setActivityName] = useState("Bharatanatyam");
  const [reason, setReason] = useState("For successful completion of the course");
  const [date, setDate] = useState(new Date().toLocaleDateString('en-CA')); // YYYY-MM-DD format
  const [signature, setSignature] = useState("Smt. Vani Ramesh");
  const [signatureTitle, setSignatureTitle] = useState("Artistic Director");

  const certificateRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => certificateRef.current,
    documentTitle: `Certificate-${studentName.replace(' ', '_')}-${activityName.replace(' ', '_')}`,
  });

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
              <Label htmlFor="student-name">Student Name</Label>
              <Input
                id="student-name"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Enter student's full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="activity-name">Activity / Course Name</Label>
              <Input
                id="activity-name"
                value={activityName}
                onChange={(e) => setActivityName(e.target.value)}
                placeholder="e.g., Advanced Guitar"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Award</Label>
              <Select value={reason} onValueChange={setReason}>
                <SelectTrigger id="reason">
                    <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
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
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
             <div className="space-y-2">
              <Label htmlFor="signature">Authorizer's Name</Label>
              <Input
                id="signature"
                value={signature}
                onChange={(e) => setSignature(e.target.value)}
                placeholder="e.g., Smt. Vani Ramesh"
              />
            </div>
             <div className="space-y-2">
              <Label htmlFor="signature-title">Authorizer's Title</Label>
              <Input
                id="signature-title"
                value={signatureTitle}
                onChange={(e) => setSignatureTitle(e.target.value)}
                placeholder="e.g., Artistic Director"
              />
            </div>
            <Button onClick={handlePrint} className="w-full">
              <Printer className="mr-2 h-4 w-4" />
              Print / Download Certificate
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-2">
        <Card className="aspect-[sqrt(2)/1] w-full">
          <CardContent className="p-0">
            <div ref={certificateRef} className="p-8 border-8 border-primary/20 h-full relative flex flex-col justify-between bg-white text-black">
                {/* Background watermark */}
                <div className="absolute inset-0 flex items-center justify-center -z-0">
                    <GraduationCap className="h-64 w-64 text-primary/5" />
                </div>
              
                <div className="z-10">
                    <header className="text-center mb-8">
                        <div className="flex items-center justify-center gap-3 mb-2">
                            <GraduationCap className="h-10 w-10 text-primary" />
                            <h1 className="text-3xl font-bold font-headline text-primary">VINDYAA - The Altitude of Art</h1>
                        </div>
                        <p className="text-xs text-slate-600">
                            #19, 1st Cross, 1st Main, Sri Manjunatha Layout, Basavanapura Main Rd, Near SBI Bank, Bengaluru, Karnataka 560049
                            <br />
                            Phone: +91 95909 59005 | Email: vindyaa.art@gmail.com
                        </p>
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
      </div>
    </div>
  );
}
