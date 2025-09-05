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
import { MoreHorizontal, FileDown, UsersRound } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { useEffect, useState, useMemo } from "react";
import { getStudents, type Student } from "@/lib/db";
import { Skeleton } from "@/components/ui/skeleton";

export default function AlumniPage() {
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const alumniStudents = useMemo(() => {
    return allStudents.filter(student => student.status === 'Inactive' || student.status === 'Suspended');
  }, [allStudents]);

  useEffect(() => {
    async function fetchAlumni() {
      try {
        const studentData = await getStudents();
        setAllStudents(studentData);
      } catch (error) {
        console.error("Failed to fetch students", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAlumni();
  }, []);
  
  useEffect(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const filteredData = alumniStudents.filter(item => {
      return (
        item.name.toLowerCase().includes(lowercasedFilter) ||
        item.email.toLowerCase().includes(lowercasedFilter) ||
        item.id.toLowerCase().includes(lowercasedFilter)
      );
    });
    setFilteredStudents(filteredData);
  }, [searchTerm, alumniStudents]);

  const handleExport = () => {
    if (!filteredStudents.length) return;
    
    const headers = ["ID", "Name", "Email", "Date Joined", "Status", "Class Mode"];
    const csvContent = [
      headers.join(','),
      ...filteredStudents.map(student => [
        student.id,
        `"${student.name}"`,
        student.email,
        new Date(student.joined).toLocaleDateString(),
        student.status,
        student.classMode || 'N/A',
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', 'alumni.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <UsersRound className="h-6 w-6" />
            <div>
              <CardTitle>Alumni Network</CardTitle>
              <CardDescription>
                A list of students who have completed their courses or left the academy.
              </CardDescription>
            </div>
          </div>
          <div className="flex gap-2">
            <Input 
              placeholder="Search alumni..." 
              className="w-full max-w-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
            <Button variant="outline" onClick={handleExport}>
                <FileDown className="h-4 w-4 mr-2" />
                Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Date Joined</TableHead>
                <TableHead className="hidden md:table-cell">Last Class Mode</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                  Array.from({length: 5}).map((_, i) => (
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
                          <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-24" /></TableCell>
                          <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-20" /></TableCell>
                          <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                      </TableRow>
                  ))
              ) : filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                      <TableCell>
                      <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                          <AvatarImage src={student.avatar} alt={student.name} data-ai-hint="person" />
                          <AvatarFallback>{student.initials}</AvatarFallback>
                          </Avatar>
                          <div>
                          <div className="font-semibold">{student.name}</div>
                          <div className="text-sm text-muted-foreground">{student.id} | {student.email}</div>
                          </div>
                      </div>
                      </TableCell>
                      <TableCell>
                      <Badge 
                          variant={student.status === 'Suspended' ? 'destructive' : 'outline'}
                      >
                          {student.status}
                      </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{new Date(student.joined).toLocaleDateString()}</TableCell>
                      <TableCell className="hidden md:table-cell">{student.classMode || 'N/A'}</TableCell>
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
                          <DropdownMenuItem>Send Message</DropdownMenuItem>
                          </DropdownMenuContent>
                      </DropdownMenu>
                      </TableCell>
                  </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No alumni found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
       <CardFooter>
        <div className="text-xs text-muted-foreground">
          Showing <strong>{filteredStudents.length}</strong> of <strong>{alumniStudents.length}</strong> total alumni.
        </div>
      </CardFooter>
    </Card>
  )
}
