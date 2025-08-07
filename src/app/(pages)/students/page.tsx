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

const students = [
  { id: "S001", name: "Amelia Rodriguez", email: "amelia.r@example.com", joined: "2023-01-15", status: "Active", courses: 5, avatar: "https://placehold.co/100x100/E6C37B/4A4A4A.png", initials: "AR" },
  { id: "S002", name: "Benjamin Carter", email: "ben.c@example.com", joined: "2023-02-20", status: "Active", courses: 3, avatar: "https://placehold.co/100x100/7BB4E6/FFFFFF.png", initials: "BC" },
  { id: "S003", name: "Chloe Nguyen", email: "chloe.n@example.com", joined: "2023-03-10", status: "Inactive", courses: 1, avatar: "https://placehold.co/100x100/F0F4F7/4A4A4A.png", initials: "CN" },
  { id: "S004", name: "David Kim", email: "david.k@example.com", joined: "2023-04-05", status: "Active", courses: 8, avatar: "https://placehold.co/100x100/999999/FFFFFF.png", initials: "DK" },
  { id: "S005", name: "Emily Wang", email: "emily.w@example.com", joined: "2023-05-21", status: "Suspended", courses: 2, avatar: "https://placehold.co/100x100/E6C37B/4A4A4A.png", initials: "EW" },
  { id: "S006", name: "Franklin Garcia", email: "franklin.g@example.com", joined: "2023-06-18", status: "Active", courses: 6, avatar: "https://placehold.co/100x100/7BB4E6/FFFFFF.png", initials: "FG" },
];

export default function StudentsPage() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="w-full max-w-sm">
          <Input placeholder="Search students..." />
        </div>
        <div className="flex gap-2">
            <Button variant="outline">
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
              <TableHead className="hidden md:table-cell">Courses Enrolled</TableHead>
              <TableHead className="hidden md:table-cell">Date Joined</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
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
                <TableCell className="hidden md:table-cell">{student.joined}</TableCell>
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
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
