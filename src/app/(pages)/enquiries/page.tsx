
"use client";

import { useState, useEffect } from "react";
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
import { MoreHorizontal, PlusCircle, FileDown, Edit, Trash2, TrendingUp, UserCheck, ClipboardList } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { getEnquiries, type Enquiry } from "@/lib/enquiries-db";
import { Skeleton } from "@/components/ui/skeleton";
import { format, isThisWeek } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";


type ChartData = {
    source: string;
    count: number;
};

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<ChartData[]>([]);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const data = await getEnquiries();
      setEnquiries(data);

      const sourceCounts = data.reduce((acc, enquiry) => {
        acc[enquiry.source] = (acc[enquiry.source] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const formattedData = Object.entries(sourceCounts).map(([source, count]) => ({
        source,
        count,
      }));
      setChartData(formattedData);

    } catch (error) {
      console.error("Failed to fetch enquiries", error);
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

  const getStatusVariant = (status: Enquiry["status"]): "default" | "secondary" | "destructive" | "outline" => {
    switch(status) {
        case "New": return "default";
        case "Contacted": return "outline";
        case "Enrolled": return "secondary";
        case "Closed": return "destructive";
        default: return "default";
    }
  }
  
  const totalEnquiries = enquiries.length;
  const newEnquiriesThisWeek = enquiries.filter(e => isThisWeek(new Date(e.enquiryDate), { weekStartsOn: 1 })).length;
  const enrolledCount = enquiries.filter(e => e.status === "Enrolled").length;
  const conversionRate = totalEnquiries > 0 ? ((enrolledCount / totalEnquiries) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Enquiries Management</h1>
        <div className="flex gap-2">
           <Button variant="outline" onClick={handleExport}>
                <FileDown className="h-4 w-4 mr-2" />
                Export CSV
            </Button>
            <Button asChild>
                <Link href="/enquiries/new">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Enquiry
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
                  <TableHead className="hidden lg:table-cell">Enquiry Date</TableHead>
                  <TableHead>Status</TableHead>
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
                          <TableCell className="hidden lg:table-cell"><Skeleton className="h-4 w-24" /></TableCell>
                          <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                          <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                      </TableRow>
                  ))
                ) : enquiries.length > 0 ? (
                  enquiries.map((enquiry) => (
                    <TableRow key={enquiry.id}>
                      <TableCell>
                        <div className="font-medium">{enquiry.name}</div>
                        <div className="text-sm text-muted-foreground">{enquiry.contact}</div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{enquiry.courseInterest}</TableCell>
                      <TableCell className="hidden lg:table-cell">{format(new Date(enquiry.enquiryDate), "dd MMM, yyyy")}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(enquiry.status)}>
                          {enquiry.status}
                        </Badge>
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
                  ))
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
