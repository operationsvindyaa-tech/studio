
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

type TaskStatus = "To Do" | "In Progress" | "Done";

type Task = {
  id: string;
  title: string;
  assignedTo: string;
  dueDate: string;
  status: TaskStatus;
  description?: string;
};

const initialTasks: Task[] = [
  { id: "TASK-001", title: "Prepare Annual Day Guest List", assignedTo: "Suresh Patil", dueDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(), status: "In Progress" },
  { id: "TASK-002", title: "Finalize Q3 Financial Report", assignedTo: "Deepa Nair", dueDate: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString(), status: "To Do" },
  { id: "TASK-003", title: "Order new costumes for Bharatanatyam", assignedTo: "Priya Sharma", dueDate: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(), status: "Done" },
  { id: "TASK-004", title: "Follow up with new enquiries", assignedTo: "Suresh Patil", dueDate: new Date().toISOString(), status: "In Progress" },
];

const staffMembers = ["Suresh Patil", "Deepa Nair", "Priya Sharma", "Meera Iyer", "Amit Verma"];

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState<Partial<Task>>({});
  const { toast } = useToast();

  const handleOpenDialog = (task: Task | null) => {
    setEditingTask(task);
    setFormData(task ? { ...task, dueDate: format(new Date(task.dueDate), 'yyyy-MM-dd') } : { status: "To Do", dueDate: format(new Date(), 'yyyy-MM-dd') });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingTask(null);
    setFormData({});
  };

  const handleFormChange = (field: keyof Task, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFormSubmit = () => {
    if (!formData.title || !formData.assignedTo || !formData.dueDate) {
      toast({ title: "Error", description: "Please fill all required fields.", variant: "destructive" });
      return;
    }

    if (editingTask) {
      setTasks(tasks.map(t => t.id === editingTask.id ? { ...t, ...formData } as Task : t));
      toast({ title: "Task Updated", description: "The task has been successfully updated." });
    } else {
      const newTask: Task = {
        id: `TASK-${String(tasks.length + 1).padStart(3, '0')}`,
        ...formData
      } as Task;
      setTasks([...tasks, newTask]);
      toast({ title: "Task Created", description: "A new task has been added." });
    }
    handleCloseDialog();
  };

  const handleDelete = (taskId: string) => {
    setTasks(tasks.filter(t => t.id !== taskId));
    toast({ title: "Task Deleted", description: "The task has been removed." });
  };

  const getStatusVariant = (status: TaskStatus) => {
    switch (status) {
      case "To Do": return "outline";
      case "In Progress": return "default";
      case "Done": return "secondary";
      default: return "default";
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Task Management</CardTitle>
              <CardDescription>Assign and track tasks for your team.</CardDescription>
            </div>
            <Button onClick={() => handleOpenDialog(null)}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Task
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map(task => (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium">{task.title}</TableCell>
                    <TableCell>{task.assignedTo}</TableCell>
                    <TableCell>{format(new Date(task.dueDate), "dd MMM, yyyy")}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(task.status)}>{task.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleOpenDialog(task)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(task.id)} className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter>
            <div className="text-xs text-muted-foreground">
                Showing <strong>{tasks.length}</strong> tasks.
            </div>
        </CardFooter>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTask ? "Edit Task" : "Add New Task"}</DialogTitle>
            <DialogDescription>
              {editingTask ? "Update the details for this task." : "Fill in the details to create a new task."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Task Title</Label>
              <Input id="title" value={formData.title || ''} onChange={(e) => handleFormChange('title', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea id="description" value={formData.description || ''} onChange={(e) => handleFormChange('description', e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="assignedTo">Assign To</Label>
                <Select value={formData.assignedTo} onValueChange={(value) => handleFormChange('assignedTo', value)}>
                    <SelectTrigger id="assignedTo"><SelectValue placeholder="Select staff" /></SelectTrigger>
                    <SelectContent>
                        {staffMembers.map(staff => <SelectItem key={staff} value={staff}>{staff}</SelectItem>)}
                    </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input id="dueDate" type="date" value={formData.dueDate || ''} onChange={(e) => handleFormChange('dueDate', e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleFormChange('status', value)}>
                <SelectTrigger id="status"><SelectValue placeholder="Select status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="To Do">To Do</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
            <Button onClick={handleFormSubmit}>Save Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
