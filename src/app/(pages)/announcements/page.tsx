
"use client";

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Send, Mail, MessageSquare, UserPlus, Trash2, FilePenLine, Edit } from "lucide-react"
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

type Template = {
    id: string;
    title: string;
    content: string;
};

const initialMessageTemplates: Template[] = [
    { id: 't1', title: 'Class Cancellation', content: 'Dear [Parent/Student Name],\n\nPlease note that the [Course Name] class scheduled for [Date] at [Time] has been cancelled due to unforeseen circumstances. We will inform you about the rescheduled class soon.\n\nSorry for the inconvenience.\n\nThank you,\nVINDYAA - The Altitude of Art.' },
    { id: 't2', title: 'Fee Reminder', content: 'Dear Parent,\n\nThis is a friendly reminder that the fee payment for the month of [Month] is due on [Due Date]. Kindly make the payment at your earliest convenience to avoid any late charges.\n\nThank you,\nAdministration, VINDYAA.' },
    { id: 't3', title: 'Event Announcement', content: 'Hello Everyone!\n\nWe are excited to announce our upcoming Annual Day on [Event Date]! We invite all students and parents to join us for a day of wonderful performances.\n\nMore details will be shared soon.\n\nWarm Regards,\nVINDYAA Team.' },
    { id: 't4', title: 'Holiday Notification', content: 'Dear All,\n\nPlease be informed that the academy will remain closed on [Date] on account of [Holiday Name]. Regular classes will resume from [Resume Date].\n\nThank you,\nVINDYAA.' },
];

export default function CommunicationPage() {
    const [students, setStudents] = useState<Student[]>([]);
    const [staff, setStaff] = useState<Staff[]>([]);
    const [recipientGroups, setRecipientGroups] = useState<RecipientGroup[]>([]);
    const [templates, setTemplates] = useState<Template[]>(initialMessageTemplates);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("whatsapp");
    const [emailContent, setEmailContent] = useState("");
    const [smsContent, setSmsContent] = useState("");
    const [whatsappContent, setWhatsappContent] = useState("");
    const [isManageTemplatesOpen, setIsManageTemplatesOpen] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
    const [isTemplateFormOpen, setIsTemplateFormOpen] = useState(false);
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

        // Clear the form
        if (type === 'Email') setEmailContent('');
        if (type === 'SMS') setSmsContent('');
        if (type === 'WhatsApp') setWhatsappContent('');
    }

    const handleSelectTemplate = (templateId: string) => {
        if (!templateId) return;
        const template = templates.find(t => t.id === templateId);
        if (!template) return;

        const content = template.content;
        switch (activeTab) {
            case 'email':
                setEmailContent(content);
                break;
            case 'sms':
                setSmsContent(content);
                break;
            case 'whatsapp':
                setWhatsappContent(content);
                break;
        }
        toast({
            title: "Template Applied",
            description: "The message content has been updated.",
        });
    };

    const handleOpenTemplateForm = (template: Template | null) => {
        setEditingTemplate(template);
        setIsTemplateFormOpen(true);
    }
    
    const handleSaveTemplate = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const title = formData.get('title') as string;
        const content = formData.get('content') as string;

        if (!title || !content) {
            toast({ title: "Error", description: "Title and content are required.", variant: "destructive"});
            return;
        }

        if (editingTemplate) {
            setTemplates(templates.map(t => t.id === editingTemplate.id ? { ...t, title, content } : t));
            toast({ title: "Template Updated", description: "Your template has been successfully updated." });
        } else {
            const newTemplate: Template = { id: crypto.randomUUID(), title, content };
            setTemplates([...templates, newTemplate]);
            toast({ title: "Template Created", description: "New template has been successfully added." });
        }
        setIsTemplateFormOpen(false);
        setEditingTemplate(null);
    }

    const handleDeleteTemplate = (templateId: string) => {
        setTemplates(templates.filter(t => t.id !== templateId));
        toast({ title: "Template Deleted", description: "The template has been removed." });
    }

  return (
    <>
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
            <div>
                <CardTitle>Announcements Hub</CardTitle>
                <CardDescription>
                Send announcements, reminders, and messages to students and staff.
                </CardDescription>
            </div>
            <div className="flex gap-2">
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
                <Button variant="outline" onClick={() => setIsManageTemplatesOpen(true)}>
                    <FilePenLine className="w-4 h-4 mr-2" /> Manage Templates
                </Button>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="whatsapp" onValueChange={setActiveTab}>
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
                    <SelectTrigger id="email-recipients"><SelectValue placeholder="Select a group" /></SelectTrigger>
                    <SelectContent>{recipientGroups.map(g => <SelectItem key={g.id} value={g.id}>{g.name} ({g.members.length})</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-template">Select Template</Label>
                <Select onValueChange={handleSelectTemplate}><SelectTrigger id="email-template"><SelectValue placeholder="Or select a template to use" /></SelectTrigger>
                    <SelectContent>{templates.map(t => <SelectItem key={t.id} value={t.id}>{t.title}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-subject">Subject</Label>
                <Input id="email-subject" placeholder="Important Announcement" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-message">Message</Label>
                <Textarea id="email-message" placeholder="Type your message here..." rows={8} value={emailContent} onChange={e => setEmailContent(e.target.value)} />
              </div>
              <Button type="submit" className="w-full"><Send className="w-4 h-4 mr-2" />Send Email</Button>
            </form>
          </TabsContent>

          <TabsContent value="sms">
          <form className="space-y-4 mt-4" onSubmit={(e) => handleSubmit(e, 'SMS')}>
              <div className="space-y-2">
                <Label htmlFor="sms-recipients">Recipients</Label>
                <Select><SelectTrigger id="sms-recipients"><SelectValue placeholder="Select a group" /></SelectTrigger>
                     <SelectContent>{recipientGroups.map(g => <SelectItem key={g.id} value={g.id}>{g.name} ({g.members.length})</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sms-template">Select Template</Label>
                <Select onValueChange={handleSelectTemplate}><SelectTrigger id="sms-template"><SelectValue placeholder="Or select a template to use" /></SelectTrigger>
                    <SelectContent>{templates.map(t => <SelectItem key={t.id} value={t.id}>{t.title}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sms-message">Message (160 characters max)</Label>
                <Textarea id="sms-message" placeholder="Type your SMS here..." maxLength={160} rows={4} value={smsContent} onChange={e => setSmsContent(e.target.value)} />
              </div>
              <Button type="submit" className="w-full"><Send className="w-4 h-4 mr-2" />Send SMS</Button>
            </form>
          </TabsContent>
          
          <TabsContent value="whatsapp">
            <form className="space-y-4 mt-4" onSubmit={(e) => handleSubmit(e, 'WhatsApp')}>
                <div className="space-y-2">
                    <Label htmlFor="whatsapp-recipients">Recipients</Label>
                    <Select><SelectTrigger id="whatsapp-recipients"><SelectValue placeholder="Select a group" /></SelectTrigger>
                        <SelectContent>{recipientGroups.map(g => <SelectItem key={g.id} value={g.id}>{g.name} ({g.members.length})</SelectItem>)}</SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="whatsapp-template">Select Template</Label>
                    <Select onValueChange={handleSelectTemplate}><SelectTrigger id="whatsapp-template"><SelectValue placeholder="Or select a template to use" /></SelectTrigger>
                        <SelectContent>{templates.map(t => <SelectItem key={t.id} value={t.id}>{t.title}</SelectItem>)}</SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="whatsapp-message">Message</Label>
                    <Textarea id="whatsapp-message" placeholder="Type your WhatsApp message here..." rows={6} value={whatsappContent} onChange={e => setWhatsappContent(e.target.value)} />
                </div>
                <Button type="submit" className="w-full"><Send className="w-4 h-4 mr-2" />Send WhatsApp Message</Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>

    {/* Manage Templates Dialog */}
    <Dialog open={isManageTemplatesOpen} onOpenChange={setIsManageTemplatesOpen}>
        <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
                <DialogTitle>Manage Message Templates</DialogTitle>
                <DialogDescription>Add, edit, or delete your reusable message templates.</DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                {templates.map(template => (
                    <Card key={template.id}>
                        <CardHeader className="p-4 flex flex-row justify-between items-center">
                            <CardTitle className="text-base">{template.title}</CardTitle>
                            <div className="flex gap-2">
                                <Button size="sm" variant="outline" onClick={() => handleOpenTemplateForm(template)}><Edit className="h-4 w-4 mr-2"/>Edit</Button>
                                <Button size="sm" variant="destructive" onClick={() => handleDeleteTemplate(template.id)}><Trash2 className="h-4 w-4 mr-2"/>Delete</Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 text-sm text-muted-foreground whitespace-pre-wrap">
                            {template.content}
                        </CardContent>
                    </Card>
                ))}
            </div>
            <DialogFooter className="sm:justify-between">
                <Button onClick={() => handleOpenTemplateForm(null)}>Create New Template</Button>
                <DialogClose asChild><Button variant="outline">Close</Button></DialogClose>
            </DialogFooter>
        </DialogContent>
    </Dialog>
    
    {/* Add/Edit Template Form Dialog */}
    <Dialog open={isTemplateFormOpen} onOpenChange={setIsTemplateFormOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{editingTemplate ? 'Edit Template' : 'Create New Template'}</DialogTitle>
                <DialogDescription>{editingTemplate ? 'Update the details for your template.' : 'Add a new reusable message template.'}</DialogDescription>
            </DialogHeader>
            <form id="template-form" onSubmit={handleSaveTemplate} className="space-y-4 py-4">
                <div className="space-y-2">
                    <Label htmlFor="title">Template Title</Label>
                    <Input id="title" name="title" defaultValue={editingTemplate?.title} placeholder="e.g., Holiday Notice" required/>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="content">Template Content</Label>
                    <Textarea id="content" name="content" defaultValue={editingTemplate?.content} rows={10} placeholder="Enter your message content here..." required/>
                </div>
            </form>
            <DialogFooter>
                <Button variant="outline" onClick={() => setIsTemplateFormOpen(false)}>Cancel</Button>
                <Button type="submit" form="template-form">Save Template</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
    </>
  )
}
