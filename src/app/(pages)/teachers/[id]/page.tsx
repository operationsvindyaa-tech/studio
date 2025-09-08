
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getTeacherById } from "@/lib/teachers-db";
import { Building, CalendarDays, ChevronLeft, Edit, Hash, Mail, MapPin, Phone, Trash2, User, Users, Briefcase, BookOpen } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

function InfoField({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value?: string | number | null | string[] }) {
    if (!value && value !== 0) return null;
    return (
        <div className="flex items-start gap-3">
            <Icon className="h-5 w-5 text-muted-foreground mt-1" />
            <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="font-medium">{Array.isArray(value) ? value.join(', ') : value}</p>
            </div>
        </div>
    )
}

export default async function TeacherProfilePage({ params: { id } }: { params: { id: string } }) {
    const teacher = await getTeacherById(id);

    if (!teacher) {
        notFound();
    }

    const { name, initials, designation, avatar, department, phone, email, classCenter, noOfBatches, totalStudents, noOfWorkingDays, workingDays } = teacher;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
             <div className="flex justify-between items-center">
                <Button variant="outline" asChild>
                    <Link href="/teachers">
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Back to Teachers List
                    </Link>
                </Button>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                    </Button>
                    <Button>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                    </Button>
                </div>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                    <Card>
                        <CardContent className="pt-6 flex flex-col items-center text-center">
                            <Avatar className="h-24 w-24 mb-4">
                                <AvatarImage src={avatar} alt={name} data-ai-hint="person" />
                                <AvatarFallback>{initials}</AvatarFallback>
                            </Avatar>
                            <h2 className="text-2xl font-bold">{name}</h2>
                            <p className="text-muted-foreground">{designation}</p>
                        </CardContent>
                    </Card>
                </div>
                <div className="md:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Teacher Details</CardTitle>
                            <CardDescription>Comprehensive information about the teacher.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8">
                             <div>
                                <h3 className="text-lg font-semibold mb-4 border-b pb-2">Professional Information</h3>
                                <div className="grid sm:grid-cols-2 gap-6">
                                    <InfoField icon={Hash} label="Teacher ID" value={teacher.id} />
                                    <InfoField icon={Briefcase} label="Department" value={department} />
                                    <InfoField icon={MapPin} label="Class Center" value={classCenter} />
                                    <InfoField icon={BookOpen} label="Total Batches" value={noOfBatches} />
                                    <InfoField icon={Users} label="Total Students" value={totalStudents} />
                                    <InfoField icon={CalendarDays} label="Working Days" value={`${noOfWorkingDays} days`} />
                                    <InfoField icon={CalendarDays} label="Schedule" value={workingDays} />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-4 border-b pb-2">Contact Information</h3>
                                <div className="grid sm:grid-cols-2 gap-6">
                                    <InfoField icon={Mail} label="Email Address" value={email} />
                                    <InfoField icon={Phone} label="Contact Number" value={phone} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
