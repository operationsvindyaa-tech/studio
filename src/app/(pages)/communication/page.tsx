
"use client";

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Send, Mail, MessageSquare, UserPlus, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { getStudents, Student } from "@/lib/db";
import { getStaff, Staff } from "@/lib/staff-db";
import { useToast } from "@/hooks/use-toast";

type RecipientGroup = {
    id: string;
    name: string;
    members: (Student | Staff)[];
};

export default function CommunicationPage() {
    const [students, setStudents] = useState<Student[]>([]);
    const [staff, setStaff] = useState<Staff[]>([]);
    const [recipientGroups, setRecipientGroups] = useState<RecipientGroup[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const studentData = await getStudents();
                const staffData = await getStaff();
                setStudents(studentData);
                setStaff(staffData);

                // Create default groups
                const defaultGroups: RecipientGroup[] = [
                    { id: 'all-students', name: 'All Students', members: studentData },
                    { id: 'all-staff', name: 'All Staff', members: staffData },
                    { id: 'all-teachers', name: 'All Teachers', members: staffData.filter(s => s.jobDetails.department === 'Academics') },
                    { id: 'all-parents', name: 'All Parents', members: studentData },
                ];
                setRecipientGroups(defaultGroups);

            } catch (err) {
                toast({
                    title: "Error",
                    description: "Failed to load recipient data.",
                    variant: "destructive"
                });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [toast]);
    
    const handleSubmit = (e: React.FormEvent, type: 'Email' | 'SMS' | 'WhatsApp') => {
        e.preventDefault();
        toast({
            title: `${type} Sent!`,
            description: `Your message has been queued for delivery.`,
        });
    }

  return (
    <>
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
            <div>
                <CardTitle>Communication Hub</CardTitle>
                <CardDescription>
                Send announcements, reminders, and messages to students and staff.
                </CardDescription>
            </div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline">
                        <UserPlus className="w-4 h-4 mr-2" /> Manage Groups
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Manage Recipient Groups</DialogTitle>
                        <DialogDescription>
                            This feature is under development. Soon you'll be able to create and manage your own recipient groups here.
                        </DialogDescription>
                    </DialogHeader>
                     <div className="py-4 text-center text-muted-foreground">
                        <p>(Coming Soon)</p>
                     </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button>Close</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="whatsapp">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="email"><Mail className="w-4 h-4 mr-2" />Email</TabsTrigger>
            <TabsTrigger value="sms"><MessageSquare className="w-4 h-4 mr-2" />SMS</TabsTrigger>
            <TabsTrigger value="whatsapp">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                WhatsApp
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="email">
            <form className="space-y-4 mt-4" onSubmit={(e) => handleSubmit(e, 'Email')}>
              <div className="space-y-2">
                <Label htmlFor="email-recipients">Recipients</Label>
                <Select>
                    <SelectTrigger id="email-recipients">
                        <SelectValue placeholder="Select a group" />
                    </SelectTrigger>
                    <SelectContent>
                        {recipientGroups.map(g => <SelectItem key={g.id} value={g.id}>{g.name} ({g.members.length})</SelectItem>)}
                    </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-subject">Subject</Label>
                <Input id="email-subject" placeholder="Important Announcement" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-message">Message</Label>
                <Textarea id="email-message" placeholder="Type your message here..." rows={8} />
              </div>
              <Button type="submit" className="w-full">
                <Send className="w-4 h-4 mr-2" />
                Send Email
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="sms">
          <form className="space-y-4 mt-4" onSubmit={(e) => handleSubmit(e, 'SMS')}>
              <div className="space-y-2">
                <Label htmlFor="sms-recipients">Recipients</Label>
                <Select>
                    <SelectTrigger id="sms-recipients">
                        <SelectValue placeholder="Select a group" />
                    </SelectTrigger>
                     <SelectContent>
                        {recipientGroups.map(g => <SelectItem key={g.id} value={g.id}>{g.name} ({g.members.length})</SelectItem>)}
                    </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sms-message">Message (160 characters max)</Label>
                <Textarea id="sms-message" placeholder="Type your SMS here..." maxLength={160} rows={4} />
              </div>
              <Button type="submit" className="w-full">
                <Send className="w-4 h-4 mr-2" />
                Send SMS
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="whatsapp">
            <form className="space-y-4 mt-4" onSubmit={(e) => handleSubmit(e, 'WhatsApp')}>
                <div className="space-y-2">
                    <Label htmlFor="whatsapp-recipients">Recipients</Label>
                    <Select>
                        <SelectTrigger id="whatsapp-recipients">
                            <SelectValue placeholder="Select a group" />
                        </SelectTrigger>
                        <SelectContent>
                            {recipientGroups.map(g => <SelectItem key={g.id} value={g.id}>{g.name} ({g.members.length})</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="whatsapp-message">Message</Label>
                    <Textarea id="whatsapp-message" placeholder="Type your WhatsApp message here..." rows={6} />
                </div>
                <Button type="submit" className="w-full">
                    <Send className="w-4 h-4 mr-2" />
                    Send WhatsApp Message
                </Button>
                </form>
          </TabsContent>

        </Tabs>
      </CardContent>
    </Card>
    </>
  )
}

    