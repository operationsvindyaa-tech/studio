
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star, MessageCircleQuestion, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getStudents, type Student } from "@/lib/db";
import { getStaff, type Staff } from "@/lib/staff-db";
import { Skeleton } from "@/components/ui/skeleton";

type User = {
  id: string;
  name: string;
};

const feedbackSubjects = [
    "General Feedback",
    "Course Content",
    "Instructor Performance",
    "Facilities & Environment",
    "Administration & Support",
    "Events & Activities",
    "Other",
];


export default function FeedbackPage() {
  const [feedbackType, setFeedbackType] = useState<"student" | "staff">("student");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
        setLoading(true);
        try {
            if (feedbackType === 'student') {
                const studentData = await getStudents();
                setUsers(studentData.map(s => ({ id: s.id, name: s.name })));
            } else {
                const staffData = await getStaff();
                setUsers(staffData.map(s => ({ id: s.id, name: s.fullName })));
            }
        } catch (error) {
             toast({
                title: "Error",
                description: "Failed to load user data.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
            setSelectedUser(""); // Reset selection on type change
        }
    };
    fetchUsers();
  }, [feedbackType, toast]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !subject || rating === 0 || !comments) {
        toast({
            title: "Incomplete Form",
            description: "Please fill out all fields before submitting.",
            variant: "destructive"
        });
        return;
    }

    console.log({
        type: feedbackType,
        userId: selectedUser,
        subject,
        rating,
        comments
    });

    toast({
        title: "Feedback Submitted!",
        description: "Thank you for your valuable input."
    });

    // Reset form
    setSelectedUser("");
    setSubject("");
    setRating(0);
    setComments("");
  };


  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto bg-muted p-4 rounded-full w-fit mb-2">
            <MessageCircleQuestion className="h-12 w-12 text-muted-foreground" />
        </div>
        <CardTitle>Submit Feedback</CardTitle>
        <CardDescription>
          We value your input. Please share your feedback to help us improve.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="feedback-type">I am a</Label>
                    <Select value={feedbackType} onValueChange={(value) => setFeedbackType(value as "student" | "staff")}>
                        <SelectTrigger id="feedback-type">
                            <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="student">Student</SelectItem>
                            <SelectItem value="staff">Staff Member</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="user-select">Select Your Name</Label>
                     {loading ? <Skeleton className="h-10 w-full" /> : (
                        <Select value={selectedUser} onValueChange={setSelectedUser} disabled={users.length === 0}>
                            <SelectTrigger id="user-select">
                                <SelectValue placeholder={`Select ${feedbackType}`} />
                            </SelectTrigger>
                            <SelectContent>
                                {users.map(user => (
                                    <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                     )}
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="subject">Feedback Subject</Label>
                <Select value={subject} onValueChange={setSubject}>
                    <SelectTrigger id="subject">
                        <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                        {feedbackSubjects.map(sub => (
                             <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label>Your Rating</Label>
                <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                            key={star}
                            className={`h-8 w-8 cursor-pointer transition-colors ${
                                rating >= star ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"
                            }`}
                            onClick={() => setRating(star)}
                        />
                    ))}
                </div>
            </div>
             <div className="space-y-2">
                <Label htmlFor="comments">Comments</Label>
                <Textarea
                    id="comments"
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder="Please provide details, suggestions, or any other thoughts..."
                    rows={6}
                />
            </div>
            <Button type="submit" className="w-full">
                <Send className="mr-2 h-4 w-4" />
                Submit Feedback
            </Button>
        </form>
      </CardContent>
    </Card>
  );
}
