
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, FileDown, PlusCircle } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { useEffect, useState } from "react";
import { getStudents } from "@/lib/db";
import { Skeleton } from "@/components/ui/skeleton";

type Student = {
  id: string;
  name: string;
  email: string;
  joined: string;
  status: "Active" | "Inactive" | "Suspended";
  courses: number;
  avatar: string;
  initials: string;
};


export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStudents() {
      try {
        const studentData = await getStudents();
        setStudents(studentData);
      } catch (error) {
        console.error("Failed to fetch students", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStudents();
  }, []);

  const handleExport = () => {
    if (!students.length) return;
    
    const headers = ["ID", "Name", "Email", "Date Joined", "Status", "Courses Enrolled"];
    const csvContent = [
      headers.join(','),
      ...students.map(student => [
        student.id,
        `"${student.name}"`,
        student.email,
        new Date(student.joined).toLocaleDateString(),
        student.status,
        student.courses,
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.href) {
      URL.revokeObjectURL(link.href);
    }
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', 'students.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="w-full max-w-sm">
          <Input placeholder="Search students..." />
        </div>
        <div className="flex gap-2">
            <Button variant="outline" onClick={handleExport}>
                <FileDown className="h-4 w-4 mr-2" />
                Export
            </Button>
            <Button asChild>
                <Link href="/students/new">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Student
                </Link>
            </Button>
        </div>
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell text-center">Courses Enrolled</TableHead>
              <TableHead className="hidden md:table-cell">Date Joined</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
                Array.from({length: 6}).map((_, i) => (
                    <TableRow key={i}>
                        <TableCell>
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-9 w-9 rounded-full" />
                                <div className="space-y-1">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-3 w-32" />
                                </div>
                            </div>
                        </TableCell>
                        <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                        <TableCell className="hidden md:table-cell text-center"><Skeleton className="h-4 w-4 mx-auto" /></TableCell>
                        <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                    </TableRow>
                ))
            ) : (
                students.map((student) => (
                <TableRow key={student.id}>
                    <TableCell>
                    <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                        <AvatarImage src={student.avatar} alt={student.name} data-ai-hint="person" />
                        <AvatarFallback>{student.initials}</AvatarFallback>
                        </Avatar>
                        <div className="font-medium">
                        <div className="font-semibold">{student.name}</div>
                        <div className="text-sm text-muted-foreground">{student.email}</div>
                        </div>
                    </div>
                    </TableCell>
                    <TableCell>
                    <Badge 
                        variant={student.status === 'Active' ? 'secondary' : 'destructive'}
                        className={student.status === 'Active' ? 'bg-green-100 text-green-800' : student.status === 'Suspended' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}
                    >
                        {student.status}
                    </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-center">{student.courses}</TableCell>
                    <TableCell className="hidden md:table-cell">{new Date(student.joined).toLocaleDateString()}</TableCell>
                    <TableCell>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                        </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Send Message</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                            Delete
                        </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    </TableCell>
                </TableRow>
                ))
            )}
            
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
