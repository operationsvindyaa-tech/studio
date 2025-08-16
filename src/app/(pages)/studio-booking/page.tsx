
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Loader2, Store, Copy } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { createBooking } from "./actions";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";

const bookingFormSchema = z.object({
  center: z.string({ required_error: "Please select a center." }),
  bookingDate: z.date({ required_error: "Please select a date." }),
  timeSlot: z.string({ required_error: "Please select a time slot." }),
  fullName: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("A valid email is required."),
  phone: z.string().min(10, "A valid phone number is required."),
  purpose: z.string().min(3, "Please specify the purpose of the booking."),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

const initialState = {
    message: "",
    success: false,
};

const rentalCenters = [
  "Main Campus (Basavanapura)",
  "Branch 2 (Marathahalli)",
  "Branch 3 (Koramangala)",
  "Branch 4 (Indiranagar)",
  "Branch 5 (Jayanagar)",
];

const timeSlots = Array.from({ length: 14 }, (_, i) => { // 8 AM to 9 PM
    const hour = i + 8;
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour;
    return `${displayHour}:00 ${period} - ${displayHour + 1}:00 ${period}`;
});

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full">
            {pending ? <Loader2 className="animate-spin" /> : "Submit Booking Request"}
        </Button>
    );
}

export default function StudioBookingPage() {
    const [state, formAction] = useActionState(createBooking, initialState);
    const { toast } = useToast();
    const formRef = useRef<HTMLFormElement>(null);
    const [rentalFee, setRentalFee] = useState("1000");

    const form = useForm<BookingFormValues>({
        resolver: zodResolver(bookingFormSchema),
        defaultValues: {
            fullName: "",
            email: "",
            phone: "",
            purpose: "",
        },
    });

    useEffect(() => {
        if (state.message) {
            toast({
                title: state.success ? "Success!" : "Error",
                description: state.message,
                variant: state.success ? "default" : "destructive",
            });
            if (state.success) {
                form.reset();
            }
        }
    }, [state, toast, form]);

    const handleCopyLink = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            toast({
                title: "Link Copied!",
                description: "You can now share the booking link with your clients.",
            });
        });
    };

    return (
        <Card className="max-w-3xl mx-auto">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="bg-muted p-3 rounded-full">
                            <Store className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div>
                            <CardTitle>Studio Booking for Rental</CardTitle>
                            <CardDescription>
                                Book a studio for workshops or personal practice.
                            </CardDescription>
                        </div>
                    </div>
                    <Button variant="outline" onClick={handleCopyLink}>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy Booking Link
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-2 mb-8 p-4 border rounded-lg bg-muted/50">
                    <Label htmlFor="rental-fee">Rental Fee (per hour)</Label>
                    <Input 
                        id="rental-fee"
                        type="number"
                        value={rentalFee}
                        onChange={(e) => setRentalFee(e.target.value)}
                        className="max-w-xs"
                    />
                    <p className="text-xs text-muted-foreground">Set the hourly rental fee. This will be communicated to the client upon confirmation.</p>
                </div>

                <Form {...form}>
                    <form
                        ref={formRef}
                        action={form.handleSubmit(formAction)}
                        className="space-y-8"
                    >
                        <div className="space-y-6">
                             <h3 className="text-xl font-semibold border-b pb-2">Booking Details</h3>
                             <div className="grid md:grid-cols-3 gap-6">
                                <FormField control={form.control} name="center" render={({ field }) => (
                                    <FormItem><FormLabel>Center</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a center" /></SelectTrigger></FormControl><SelectContent>
                                        {rentalCenters.map(center => <SelectItem key={center} value={center}>{center}</SelectItem>)}
                                    </SelectContent></Select><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="bookingDate" render={({ field }) => (
                                    <FormItem className="flex flex-col"><FormLabel>Date</FormLabel>
                                        <Popover><PopoverTrigger asChild>
                                            <FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "dd-MM-yyyy") : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl>
                                        </PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date()} initialFocus /></PopoverContent></Popover><FormMessage />
                                    </FormItem>
                                )} />
                                 <FormField control={form.control} name="timeSlot" render={({ field }) => (
                                    <FormItem><FormLabel>Time Slot</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a time" /></SelectTrigger></FormControl><SelectContent>
                                        {timeSlots.map(slot => <SelectItem key={slot} value={slot}>{slot}</SelectItem>)}
                                    </SelectContent></Select><FormMessage /></FormItem>
                                )} />
                             </div>
                        </div>

                         <div className="space-y-6">
                             <h3 className="text-xl font-semibold border-b pb-2">Your Information</h3>
                             <div className="grid md:grid-cols-2 gap-6">
                                <FormField control={form.control} name="fullName" render={({ field }) => (
                                    <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="email" render={({ field }) => (
                                    <FormItem><FormLabel>Email Address</FormLabel><FormControl><Input type="email" placeholder="john.doe@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="phone" render={({ field }) => (
                                    <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input placeholder="(555) 123-4567" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                             </div>
                             <FormField control={form.control} name="purpose" render={({ field }) => (
                                <FormItem><FormLabel>Purpose of Booking</FormLabel><FormControl><Textarea placeholder="e.g., Dance workshop for 10 people, personal piano practice..." {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                        
                        <SubmitButton />
                    </form>
                </Form>
            </CardContent>
            <CardFooter>
                <div className="text-xs text-muted-foreground">
                    <p><strong>Note:</strong> Submission of this form is a request and does not guarantee a booking. Our team will contact you to confirm availability and process the payment. Payment can be made via UPI or Bank Transfer upon confirmation.</p>
                </div>
            </CardFooter>
        </Card>
    );
}
