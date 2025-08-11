
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getStaffById, type Staff } from "@/lib/staff-db";
import { Building, Cake, CalendarDays, Edit, Hash, Home, Mail, MapPin, Phone, ShieldCheck, Trash2, User, UserCheck, Wallet, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

function InfoField({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value?: string | number | null }) {
    if (!value) return null;
    return (
        <div className="flex items-start gap-3">
            <Icon className="h-5 w-5 text-muted-foreground mt-1" />
            <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="font-medium">{value}</p>
            </div>
        </div>
    )
}

export default async function StaffProfilePage({ params }: { params: { id: string } }) {
    const staffMember = await getStaffById(params.id);

    if (!staffMember) {
        notFound();
    }

    const { fullName, initials, personalInfo, jobDetails, payroll } = staffMember;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
             <div className="flex justify-between items-center">
                <Button variant="outline" asChild>
                    <Link href="/staff">
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Back to Staff List
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
                                <AvatarImage src={personalInfo.photo} alt={fullName} data-ai-hint="person" />
                                <AvatarFallback>{initials}</AvatarFallback>
                            </Avatar>
                            <h2 className="text-2xl font-bold">{fullName}</h2>
                            <p className="text-muted-foreground">{jobDetails.role}</p>
                            <Badge className="mt-2">{jobDetails.employmentType}</Badge>
                        </CardContent>
                    </Card>
                </div>
                <div className="md:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Staff Details</CardTitle>
                            <CardDescription>Comprehensive information about the staff member.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            <div>
                                <h3 className="text-lg font-semibold mb-4 border-b pb-2">Personal Information</h3>
                                <div className="grid sm:grid-cols-2 gap-6">
                                    <InfoField icon={Hash} label="Staff ID" value={staffMember.id} />
                                    <InfoField icon={User} label="Gender" value={personalInfo.gender} />
                                    <InfoField icon={Cake} label="Date of Birth" value={new Date(personalInfo.dob).toLocaleDateString()} />
                                    <InfoField icon={Mail} label="Email Address" value={personalInfo.email} />
                                    <InfoField icon={Phone} label="Contact Number" value={personalInfo.contactNumber} />
                                    <InfoField icon={Home} label="Address" value={personalInfo.address} />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-4 border-b pb-2">Job Details</h3>
                                <div className="grid sm:grid-cols-2 gap-6">
                                    <InfoField icon={Building} label="Department" value={jobDetails.department} />
                                    <InfoField icon={UserCheck} label="Reporting Manager" value={jobDetails.reportingManager} />
                                    <InfoField icon={CalendarDays} label="Date of Joining" value={new Date(jobDetails.dateOfJoining).toLocaleDateString()} />
                                    <InfoField icon={MapPin} label="Work Location" value={jobDetails.workLocation} />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-4 border-b pb-2">Payroll Information</h3>
                                <div className="grid sm:grid-cols-2 gap-6">
                                    <InfoField icon={Wallet} label="Salary" value={`${formatCurrency(payroll.salary)} / month`} />
                                    <InfoField icon={ShieldCheck} label="PF/ESI Number" value={payroll.benefitsNumber} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
