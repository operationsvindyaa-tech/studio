
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Loader2, UserPlus } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useFormStatus } from "react-dom";
import { createStudent } from "./actions";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useRef, useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const studentFormSchema = z.object({
  photo: z.string().optional(),
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("A valid email is required."),
  dateOfJoining: z.date({ required_error: "Date of joining is required." }),
  status: z.enum(["Active", "Inactive", "Suspended"], { required_error: "Please select a status." }),
});


export type StudentFormValues = z.infer<typeof studentFormSchema>;

const initialState = {
    message: "",
    success: false,
};

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full">
        {pending ? <Loader2 className="animate-spin" /> : "Add Student"}
        </Button>
    );
}

export default function NewStudentPage() {
  const [state, formAction] = useActionState(createStudent, initialState);
  const { toast } = useToast();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      name: "",
      email: "",
      status: "Active",
    },
  });
  
  useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? "Success!" : "Error",
        description: state.message,
        variant: state.success ? "default" : "destructive",
      });
      if(state.success) {
        form.reset();
        setPhotoPreview(null);
        router.push('/students');
      }
    }
  }, [state, toast, form, router]);

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setPhotoPreview(dataUrl);
        form.setValue("photo", dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto bg-muted p-4 rounded-full w-fit mb-2">
            <UserPlus className="h-12 w-12 text-muted-foreground" />
        </div>
        <CardTitle>Add New Student</CardTitle>
        <CardDescription>
          Fill out the form below to add a new student to the system.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            ref={formRef}
            action={form.handleSubmit(data => formAction(data))}
            className="space-y-8"
          >
            <div className="flex flex-col items-center space-y-4">
                <FormField
                    control={form.control}
                    name="photo"
                    render={() => (
                        <FormItem className="flex flex-col items-center text-center">
                        <FormLabel className="sr-only">Student Photo</FormLabel>
                        <FormControl>
                            <div>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    id="photo-upload"
                                    onChange={handlePhotoChange}
                                />
                                <label htmlFor="photo-upload" className="cursor-pointer">
                                    <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center border-2 border-dashed mx-auto">
                                        {photoPreview ? (
                                            <Image src={photoPreview} alt="Student photo" width={128} height={128} className="rounded-full object-cover w-full h-full" />
                                        ) : (
                                            <span className="text-sm text-muted-foreground text-center">Upload Photo</span>
                                        )}
                                    </div>
                                </label>
                            </div>
                        </FormControl>
                        <FormDescription>Click to upload a profile picture.</FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
                <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem><FormLabel>Email ID</FormLabel><FormControl><Input type="email" placeholder="student@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="dateOfJoining" render={({ field }) => (
                    <FormItem className="flex flex-col"><FormLabel>Date of Joining</FormLabel>
                        <Popover><PopoverTrigger asChild>
                            <FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl>
                        </PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="status" render={({ field }) => (
                    <FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Active">Active</SelectItem><SelectItem value="Inactive">Inactive</SelectItem><SelectItem value="Suspended">Suspended</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                )} />
            </div>

            <SubmitButton />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
