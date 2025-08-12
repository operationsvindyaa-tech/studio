
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PlusCircle, FileDown, Edit, Trash2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { getEnquiries, type Enquiry } from "@/lib/enquiries-db";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const data = await getEnquiries();
      setEnquiries(data);
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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Enquiries</CardTitle>
          <CardDescription>
            Track and manage all prospective student enquiries.
          </CardDescription>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" onClick={handleExport}>
                <FileDown className="h-4 w-4 mr-2" />
                Export
            </Button>
            <Button asChild>
                <Link href="/enquiries/new">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Enquiry
                </Link>
            </Button>
        </div>
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
  );
}
