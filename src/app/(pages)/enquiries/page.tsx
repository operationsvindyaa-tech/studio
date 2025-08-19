
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
import { MoreHorizontal, PlusCircle, FileDown, Edit, Trash2, TrendingUp, UserCheck, ClipboardList, Upload, Star } from "lucide-react";
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


type ChartData = {
    source: string;
    count: number;
};

export default function EnquiriesPage() {
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
        <h1 className="text-2xl font-bold">Enquiries</h1>
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
                          <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
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
