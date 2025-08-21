
"use client";

import { useState, useEffect, useRef } from "react";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PlusCircle, FileDown, Edit, Trash2, TrendingUp, UserCheck, ClipboardList, Upload, Star, Send, Mail, MessageSquare, UserPlus, FilePenLine } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { getEnquiries, addEnquiriesBatch, type Enquiry } from "@/lib/enquiries-db";
import { Skeleton } from "@/components/ui/skeleton";
import { format, isThisWeek } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import * as XLSX from 'xlsx';
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getStudents, Student } from "@/lib/db";
import { getStaff, Staff } from "@/lib/staff-db";


type ChartData = {
    source: string;
    count: number;
};

// Communication Hub types
type RecipientGroup = {
    id: string;
    name: string;
    members: (Student | Staff | Enquiry)[];
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
    { id: 't5', title: 'Enquiry Follow-up', content: 'Dear [Parent Name],\n\nThank you for your enquiry about our [Course Interest] classes at VINDYAA. We would be happy to provide more details or schedule a free demo class for you.\n\nPlease let us know a convenient time to call you.\n\nBest regards,\nThe Admissions Team, VINDYAA.'}
];


function EnquiriesDashboard() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const data = await getEnquiries();
      setEnquiries(data);

      const sourceCounts = data.reduce((acc, enquiry) => {
        const sourceName = enquiry.source.charAt(0).toUpperCase() + enquiry.source.slice(1).replace('-', ' ');
        acc[sourceName] = (acc[sourceName] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const formattedData = Object.entries(sourceCounts).map(([source, count]) => ({
        source,
        count,
      }));
      setChartData(formattedData);

    } catch (error) {
      console.error("Failed to fetch enquiries", error);
       toast({
        title: "Error",
        description: "Failed to load enquiries data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);
  
  const handleExport = () => {
    if (!enquiries.length) return;
    
    const headers = ["ID", "Name", "Contact", "Email", "Course Interest", "Status", "Enquiry Date", "Source"];
    const csvContent = [
      headers.join(','),
      ...enquiries.map(e => [e.id, `"${e.name}"`, e.contact, e.email, e.courseInterest, e.status, format(new Date(e.enquiryDate), "yyyy-MM-dd"), e.source].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', 'enquiries.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet) as any[];

        const newEnquiries = json.map((row, index) => {
            const courseInterest = row["Course Interest"] || row.courseInterest || "Not Specified";
            const source = row.Source || row.source || "other";

            return {
                name: row.Name || row.name || `Enquirer ${index + 1}`,
                contact: String(row.Contact || row.contact || ""),
                email: row.Email || row.email || "",
                courseInterest: courseInterest,
                source: source.toLowerCase().replace(' ', '-'),
            };
        });

        await addEnquiriesBatch(newEnquiries);

        toast({
          title: "Import Successful",
          description: `${newEnquiries.length} enquiries have been imported.`,
        });
        fetchEnquiries(); // Refresh the list
      } catch (error) {
        console.error("Error parsing file:", error);
        toast({
          title: "Import Failed",
          description: "Could not parse the file. Please ensure it is a valid Excel or CSV file.",
          variant: "destructive",
        });
      }
    };
    reader.readAsBinaryString(file);
    if(fileInputRef.current) fileInputRef.current.value = "";
  };


  const getStatusVariant = (status: Enquiry["status"]): "default" | "secondary" | "destructive" | "outline" => {
    switch(status) {
        case "New": return "default";
        case "Contacted": return "outline";
        case "Enrolled": return "secondary";
        case "Closed": return "destructive";
        default: return "default";
    }
  }

  const getSatisfactionRating = (notes?: string) => {
    if (!notes) return null;
    const match = notes.match(/Satisfaction: (\d+)\/5/);
    return match ? parseInt(match[1], 10) : null;
  };
  
  const totalEnquiries = enquiries.length;
  const newEnquiriesThisWeek = enquiries.filter(e => isThisWeek(new Date(e.enquiryDate), { weekStartsOn: 1 })).length;
  const enrolledCount = enquiries.filter(e => e.status === "Enrolled").length;
  const conversionRate = totalEnquiries > 0 ? ((enrolledCount / totalEnquiries) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-6">
       <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".xlsx, .xls, .csv"
      />
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Enquiries Dashboard</h1>
        <div className="flex gap-2">
            <Button variant="outline" onClick={handleImportClick}>
                <Upload className="h-4 w-4 mr-2" />
                Import
            </Button>
           <Button variant="outline" onClick={handleExport}>
                <FileDown className="h-4 w-4 mr-2" />
                Export
            </Button>
            <Button asChild>
                <Link href="/enquiries/new">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add
                </Link>
            </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Enquiries</CardTitle>
                <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                {loading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{totalEnquiries}</div>}
                <p className="text-xs text-muted-foreground">All-time received enquiries</p>
            </CardContent>
        </Card>
         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">New This Week</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                {loading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">+{newEnquiriesThisWeek}</div>}
                <p className="text-xs text-muted-foreground">New enquiries in the last 7 days</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                {loading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{conversionRate}%</div>}
                <p className="text-xs text-muted-foreground">{enrolledCount} enquiries converted to students</p>
            </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
            <CardHeader>
                <CardTitle>Enquiries by Source</CardTitle>
                <CardDescription>
                    Breakdown of where your enquiries are coming from.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    {loading ? <Skeleton className="h-full w-full" /> : (
                        <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis type="category" dataKey="source" width={100} tickLine={false} axisLine={false} />
                            <Tooltip
                                cursor={{ fill: "hsl(var(--muted))" }}
                                contentStyle={{
                                    background: "hsl(var(--background))",
                                    borderColor: "hsl(var(--border))",
                                }}
                            />
                            <Bar dataKey="count" name="Enquiries" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    )}
                </ResponsiveContainer>
            </CardContent>
        </Card>
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>Recent Enquiries</CardTitle>
                <CardDescription>The latest 5 enquiries received.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                {loading ? Array.from({length: 5}).map((_, i) => <Skeleton key={i} className="h-10 w-full" />) :
                    enquiries.slice(0, 5).map(enquiry => (
                        <div key={enquiry.id} className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">{enquiry.name}</p>
                                <p className="text-sm text-muted-foreground">{enquiry.courseInterest}</p>
                            </div>
                            <Badge variant={getStatusVariant(enquiry.status)}>{enquiry.status}</Badge>
                        </div>
                    ))
                }
                </div>
            </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Enquiries</CardTitle>
          <CardDescription>
            Track and manage all prospective student enquiries.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Enquirer</TableHead>
                  <TableHead className="hidden md:table-cell">Course Interest</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Feedback</TableHead>
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
                              <div className="space-y-1">
                                  <Skeleton className="h-4 w-24" />
                                  <Skeleton className="h-3 w-32" />
                              </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-24" /></TableCell>
                          <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                          <TableCell><TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell></TableCell>
                      </TableRow>
                  ))
                ) : enquiries.length > 0 ? (
                  enquiries.map((enquiry) => {
                    const rating = getSatisfactionRating(enquiry.notes);
                    return (
                        <TableRow key={enquiry.id}>
                        <TableCell>
                            <div className="font-medium">{enquiry.name}</div>
                            <div className="text-sm text-muted-foreground">{enquiry.contact}</div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{enquiry.courseInterest}</TableCell>
                        <TableCell>
                            <Badge variant={getStatusVariant(enquiry.status)}>
                            {enquiry.status}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            {rating !== null ? (
                                <div className="flex items-center">
                                    {Array.from({ length: 5 }, (_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-4 w-4 ${
                                                i < rating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"
                                            }`}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <span className="text-muted-foreground text-xs">N/A</span>
                            )}
                        </TableCell>
                        <TableCell>
                            <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                        </TableRow>
                    )
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">
                      No enquiries found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
         <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing <strong>{enquiries.length}</strong> enquiries.
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}


function CommunicationHub() {
    const [students, setStudents] = useState<Student[]>([]);
    const [staff, setStaff] = useState<Staff[]>([]);
    const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
    const [recipientGroups, setRecipientGroups] = useState<RecipientGroup[]>([]);
    const [templates, setTemplates] = useState<Template[]>(initialMessageTemplates);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("whatsapp");
    const [emailSubject, setEmailSubject] = useState("");
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
                const [studentData, staffData, enquiryData] = await Promise.all([
                    getStudents(),
                    getStaff(),
                    getEnquiries()
                ]);

                setStudents(studentData);
                setStaff(staffData);
                setEnquiries(enquiryData);

                const defaultGroups: RecipientGroup[] = [
                    { id: 'all-students', name: 'All Students', members: studentData },
                    { id: 'all-staff', name: 'All Staff', members: staffData },
                    { id: 'all-teachers', name: 'All Teachers', members: staffData.filter(s => s.jobDetails.department === 'Academics') },
                    { id: 'all-parents', name: 'All Parents (Students)', members: studentData },
                    { id: 'all-enquiries', name: 'All Enquiries', members: enquiryData },
                    { id: 'new-enquiries', name: 'New Enquiries', members: enquiryData.filter(e => e.status === 'New') },
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

        if (type === 'Email') {
            setEmailContent('');
            setEmailSubject('');
        }
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
                setEmailSubject(template.title);
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
    <Card className="max-w-3xl mx-auto mt-6">
      <CardHeader>
        <div className="flex justify-between items-center">
            <div>
                <CardTitle>Communication Hub</CardTitle>
                <CardDescription>
                Send announcements, reminders, and messages.
                </CardDescription>
            </div>
            <div className="flex gap-2">
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
                <Select disabled={loading}>
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
                <Input id="email-subject" placeholder="Important Announcement" value={emailSubject} onChange={e => setEmailSubject(e.target.value)} />
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
                <Select disabled={loading}><SelectTrigger id="sms-recipients"><SelectValue placeholder="Select a group" /></SelectTrigger>
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
                    <Select disabled={loading}><SelectTrigger id="whatsapp-recipients"><SelectValue placeholder="Select a group" /></SelectTrigger>
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

export default function EnquiriesPage() {
    return (
        <Tabs defaultValue="dashboard">
            <TabsList className="grid w-full grid-cols-2 max-w-lg mx-auto">
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="communication">Communication</TabsTrigger>
            </TabsList>
            <TabsContent value="dashboard" className="pt-6">
                <EnquiriesDashboard />
            </TabsContent>
            <TabsContent value="communication" className="pt-6">
                <CommunicationHub />
            </TabsContent>
        </Tabs>
    );
}
