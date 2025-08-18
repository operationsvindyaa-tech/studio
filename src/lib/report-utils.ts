import { Student } from "./db";
import { Enquiry } from "./enquiries-db";
import { BillingStatus, StudentBillingInfo } from "./billing-db";
import { MerchandiseSale } from "./merchandise-db";
import { Expense } from "./expenses-db";
import { Staff } from "./staff-db";
import { TeacherPerformance } from "./teacher-performance-db";

// Helper function to get a pseudo-random number for mock data
const getRandom = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

// Student & Enrollment Reports
export const analyzeEnrollmentTrends = (students: Student[]) => {
    const monthlyAdmissions: { [key: string]: number } = {};
    students.forEach(student => {
        const month = new Date(student.joined).toISOString().slice(0, 7);
        monthlyAdmissions[month] = (monthlyAdmissions[month] || 0) + 1;
    });
    return Object.entries(monthlyAdmissions)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => a.name.localeCompare(b.name));
};

export const getStudentDemographics = (students: Student[]) => {
    return students.reduce((acc, student) => {
        acc[student.status] = (acc[student.status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
};

export const getAttendanceOverview = () => ({
    mostAttended: [
        { course: "Bharatanatyam", rate: 95 },
        { course: "Yoga", rate: 92 },
    ],
    leastAttended: [
        { course: "Guitar", rate: 78 },
        { course: "Zumba", rate: 81 },
    ],
});

export const getRetentionRates = () => ({
    retentionRate: 88,
    dropoutRate: 12,
});

export const getPerformanceSummary = () => ({
    'A+': 15, 'A': 35, 'B+': 25, 'B': 15, 'C': 8, 'D': 2,
});


// Financial Reports
export const getRevenueBreakdown = (billing: StudentBillingInfo[], merchandise: MerchandiseSale[]) => {
    const tuitionFees = billing
        .filter(b => b.status === 'Paid')
        .reduce((sum, record) => sum + record.activities.reduce((s, a) => s + a.fee, 0), 0);
    const merchandiseSales = merchandise.reduce((sum, sale) => sum + sale.totalAmount, 0);
    const workshopFees = 50000; // Mock data for other revenue sources
    return [
        { name: 'Tuition Fees', value: tuitionFees },
        { name: 'Merchandise', value: merchandiseSales },
        { name: 'Workshops', value: workshopFees },
    ];
};

export const getExpenseAnalysis = (expenses: Expense[], staff: Staff[]) => {
    const salaries = staff.reduce((sum, s) => sum + s.payroll.salary, 0);
    const rent = expenses.filter(e => e.head === 'Rent').reduce((sum, e) => sum + e.amount, 0);
    const marketing = expenses.filter(e => e.head.includes('Marketing')).reduce((sum, e) => sum + e.amount, 0);
    const utilities = expenses.filter(e => e.head.includes('Utilities')).reduce((sum, e) => sum + e.amount, 0);
    return [
        { name: 'Salaries', value: salaries },
        { name: 'Rent', value: rent },
        { name: 'Marketing', value: marketing },
        { name: 'Utilities', value: utilities },
    ];
};

export const getOutstandingFees = (billing: StudentBillingInfo[]) => {
    return billing
        .filter(record => record.status === 'Overdue' || record.status === 'Due')
        .sort((a,b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
};

export const getClassProfitability = () => ([
    { name: 'Bharatanatyam', revenue: 150000, profit: 95000 },
    { name: 'Vocal Carnatic', revenue: 120000, profit: 70000 },
    { name: 'Guitar', revenue: 80000, profit: 45000 },
    { name: 'Yoga', revenue: 110000, profit: 80000 },
]);


// Instructor & Staff Reports
export const getInstructorUtilization = (staff: Staff[]) => {
    return staff
        .filter(s => s.jobDetails.department === 'Academics')
        .map(instructor => ({
            name: instructor.fullName,
            hoursTaught: getRandom(18, 22),
            contractedHours: 24,
        }));
};

export const getInstructorPerformance = (staff: Staff[], performance: TeacherPerformance[]) => {
    return staff
        .filter(s => s.jobDetails.department === 'Academics')
        .map(instructor => {
            const perfData = performance.find(p => p.teacherId === instructor.id);
            return {
                name: instructor.fullName,
                feedbackScore: perfData?.studentFeedbackScore || 0,
                studentsTaught: getRandom(40, 80),
                retentionRate: getRandom(85, 98),
            };
        });
};

export const getPayrollBreakdown = (staff: Staff[]) => {
    const breakdown = staff.reduce((acc, s) => {
        const dept = s.jobDetails.department;
        if (!acc[dept]) {
            acc[dept] = { department: dept, baseSalary: 0, pf: 0, allowances: 0, total: 0 };
        }
        
        const baseSalary = s.payroll.salary;
        const pf = baseSalary * 0.12; // 12% PF contribution
        const allowances = baseSalary * 0.15; // Assume 15% for other allowances

        acc[dept].baseSalary += baseSalary;
        acc[dept].pf += pf;
        acc[dept].allowances += allowances;
        acc[dept].total += baseSalary + pf + allowances;
        
        return acc;
    }, {} as Record<string, any>);
    
    return Object.values(breakdown);
};


// Operations Reports
export const analyzeRoomUsage = () => {
    return [
        { hour: '9 AM', usage: 30 }, { hour: '10 AM', usage: 50 }, { hour: '11 AM', usage: 60 },
        { hour: '4 PM', usage: 80 }, { hour: '5 PM', usage: 95 }, { hour: '6 PM', usage: 90 },
    ];
};

export const getCapacityReport = () => {
    return {
        overCapacity: [{ course: 'Bharatanatyam - Weekend Batch', actual: 25, capacity: 20 }],
        underCapacity: [{ course: 'Guitar - Weekday Batch', actual: 8, capacity: 15 }],
    };
};

export const getMaintenanceReport = (expenses: Expense[]) => {
    const maintenanceExpenses = expenses.filter(e => e.head.includes('Maintenance'));
    return {
        totalCost: maintenanceExpenses.reduce((sum, e) => sum + e.amount, 0),
        recentActivities: maintenanceExpenses.slice(0, 3),
    };
};
```
- src/components/layout/app-shell.tsx:
```tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarProvider,
  SidebarInset,
  SidebarHeader,
  SidebarTrigger,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  useSidebar,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  BookOpen,
  Bot,
  Calendar,
  LayoutDashboard,
  MessageSquare,
  Users,
  GraduationCap,
  Building2,
  Wallet,
  CalendarCheck,
  Camera,
  Award,
  UserSquare,
  ClipboardList,
  CalendarClock,
  MessageCircleQuestion,
  AreaChart,
  BookUser,
  School,
  FilePenLine,
  HeartHandshake,
  Banknote,
  UserCheck as UserCheckIcon,
  Users2,
  TrendingUp,
  LineChart,
  BookText,
  ReceiptText,
  Mail,
  Store,
  Shield,
  ShoppingCart,
  ClipboardCheck,
  LogIn,
  UsersRound,
  FilePieChart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "../ui/badge";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/chatbot", icon: Bot, label: "AI Chatbot" },
];

const studentPortalNavItems = [
    { href: "/student-attendance", icon: CalendarCheck, label: "My Attendance" },
    { href: "/progress-report", icon: TrendingUp, label: "My Progress" },
    { href: "/login", icon: LogIn, label: "Student Login" },
]

const operationsNavItems = [
    { href: "/enquiries", icon: ClipboardList, label: "Enquiries" },
    { href: "/activity-demo", icon: ClipboardCheck, label: "Activity Demo" },
    { href: "/admissions", icon: BookUser, label: "Admissions" },
    { href: "/students", icon: Users, label: "Students" },
    { href: "/batches", icon: Users2, label: "Batches" },
    { href: "/attendance", icon: CalendarCheck, label: "Student Attendance" },
    { href: "/communication", icon: MessageSquare, label: "Communication" },
]

const academicsNavItems = [
    { href: "/courses", icon: BookOpen, label: "Courses" },
    { href: "/syllabus", icon: FilePenLine, label: "Syllabus" },
    { href: "/schedule", icon: Calendar, label: "Schedule" },
    { href: "/timetable", icon: CalendarClock, label: "Time Table" },
    { href: "/certificates", icon: Award, label: "Certificates" },
    { href: "/ptm", icon: School, label: "PTM" },
    { href: "/progress-report", icon: TrendingUp, label: "Progress Report" },
];

const hrNavItems = [
    { href: "/teachers", icon: UserSquare, label: "Teachers" },
    { href: "/staff", icon: Building2, label: "Staff" },
    { href: "/teacher-attendance", icon: UserCheckIcon, label: "Teacher Attendance" },
    { href: "/staff-attendance", icon: UserCheckIcon, label: "Staff Attendance" },
    { href: "/letters", icon: Mail, label: "Letters" },
    { href: "/staff-login", icon: LogIn, label: "Staff Login" },
];

const financeNavItems = [
    { href: "/billing", icon: Banknote, label: "Billing" },
    { href: "/payroll", icon: Wallet, label: "Payroll" },
    { href: "/payment-status", icon: CalendarCheck, label: "Payment Tracker" },
    { href: "/accounts", icon: BookText, label: "Accounts" },
    { href: "/expenses", icon: ReceiptText, label: "Expenses" },
    { href: "/merchandise", icon: ShoppingCart, label: "Merchandise" },
]

const mediaNavItems = [
    { href: "/photogallery", icon: Camera, label: "Photo Gallery" },
];

const otherNavItems = [
    { href: "/feedback", icon: MessageCircleQuestion, label: "Feedback" },
    { href: "/studio-booking", icon: Store, label: "Studio Booking" },
];

const managementNavItems = [
    { href: "/reports", icon: AreaChart, label: "Financial Reports" },
    { href: "/student-enrollment-report", icon: UsersRound, label: "Student & Enrollment" },
    { href: "/instructor-staff-report", icon: UserCheckIcon, label: "Instructor & Staff" },
    { href: "/operations-report", icon: FilePieChart, label: "Operations Report" },
    { href: "/strategic-reports", icon: LineChart, label: "Strategic Reports" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; 
  }
  
  // TODO: Replace this with your actual authentication logic
  const userIsSeniorManagement = true;

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
            <div className="flex items-center gap-2">
                <div className="bg-primary p-2 rounded-lg text-primary-foreground">
                    <GraduationCap className="h-6 w-6" />
                </div>
                <div className="flex flex-col">
                    <h2 className="text-lg font-headline font-semibold">VINDYAA</h2>
                </div>
            </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} passHref>
                  <SidebarMenuButton
                    isActive={pathname.startsWith(item.href)}
                    asChild
                  >
                    <span>
                      <item.icon />
                      <span>{item.label}</span>
                    </span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
          <SidebarSeparator />
            <SidebarGroup>
                <SidebarGroupLabel>Student Portal</SidebarGroupLabel>
                <SidebarMenu>
                    {studentPortalNavItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                        <Link href={item.href} passHref>
                        <SidebarMenuButton
                            isActive={pathname.startsWith(item.href)}
                            asChild
                        >
                            <span>
                                <item.icon />
                                <span>{item.label}</span>
                            </span>
                        </SidebarMenuButton>
                        </Link>
                    </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroup>
          <SidebarSeparator />
            <SidebarGroup>
                <SidebarGroupLabel>Class Management</SidebarGroupLabel>
                <SidebarMenu>
                    {operationsNavItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                        <Link href={item.href} passHref>
                        <SidebarMenuButton
                            isActive={pathname.startsWith(item.href)}
                            asChild
                        >
                            <span>
                                <item.icon />
                                <span>{item.label}</span>
                            </span>
                        </SidebarMenuButton>
                        </Link>
                    </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroup>
          <SidebarSeparator />
            <SidebarGroup>
                <SidebarGroupLabel>Academics</SidebarGroupLabel>
                <SidebarMenu>
                    {academicsNavItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                        <Link href={item.href} passHref>
                        <SidebarMenuButton
                            isActive={pathname.startsWith(item.href)}
                            asChild
                        >
                            <span>
                                <item.icon />
                                <span>{item.label}</span>
                            </span>
                        </SidebarMenuButton>
                        </Link>
                    </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroup>
          <SidebarSeparator />
            <SidebarGroup>
                <SidebarGroupLabel>HR</SidebarGroupLabel>
                <SidebarMenu>
                    {hrNavItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                        <Link href={item.href} passHref>
                        <SidebarMenuButton
                            isActive={pathname.startsWith(item.href)}
                            asChild
                        >
                            <span>
                                <item.icon />
                                <span>{item.label}</span>
                            </span>
                        </SidebarMenuButton>
                        </Link>
                    </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroup>
          <SidebarSeparator />
            <SidebarGroup>
                <SidebarGroupLabel>Finance</SidebarGroupLabel>
                <SidebarMenu>
                    {financeNavItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                        <Link href={item.href} passHref>
                        <SidebarMenuButton
                            isActive={pathname.startsWith(item.href)}
                            asChild
                        >
                            <span>
                                <item.icon />
                                <span>{item.label}</span>
                            </span>
                        </SidebarMenuButton>
                        </Link>
                    </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroup>
            
          {userIsSeniorManagement && (
            <>
                <SidebarSeparator />
                <SidebarGroup>
                    <SidebarGroupLabel className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Senior Management
                    </SidebarGroupLabel>
                    <SidebarMenu>
                        {managementNavItems.map((item) => (
                        <SidebarMenuItem key={item.href}>
                            <Link href={item.href} passHref>
                            <SidebarMenuButton
                                isActive={pathname.startsWith(item.href)}
                                asChild
                            >
                                <span>
                                    <item.icon />
                                    <span>{item.label}</span>
                                </span>
                            </SidebarMenuButton>
                            </Link>
                        </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </>
          )}

          <SidebarSeparator />
            <SidebarGroup>
                <SidebarGroupLabel>Media</SidebarGroupLabel>
                <SidebarMenu>
                    {mediaNavItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                        <Link href={item.href} passHref>
                        <SidebarMenuButton
                            isActive={pathname.startsWith(item.href)}
                            asChild
                        >
                            <span>
                                <item.icon />
                                <span>{item.label}</span>
                            </span>
                        </SidebarMenuButton>
                        </Link>
                    </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroup>
          <SidebarSeparator />
            <SidebarGroup>
                <SidebarGroupLabel>More</SidebarGroupLabel>
                <SidebarMenu>
                    {otherNavItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                        <Link href={item.href} passHref>
                        <SidebarMenuButton
                            isActive={pathname.startsWith(item.href)}
                            asChild
                        >
                            <span>
                                <item.icon />
                                <span>{item.label}</span>
                            </span>
                        </SidebarMenuButton>
                        </Link>
                    </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="justify-start w-full p-2 h-auto">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://placehold.co/100x100.png" alt="Admin" data-ai-hint="person" />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <p className="font-medium text-sm">Admin User</p>
                    <p className="text-xs text-muted-foreground">admin@vindyaa.com</p>
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mb-2" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Admin User</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    admin@vindyaa.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-4">
                <SidebarTrigger className="md:hidden" />
                <h1 className="text-2xl font-headline font-semibold tracking-tight">
                {
                    [...navItems, ...studentPortalNavItems, ...operationsNavItems, ...academicsNavItems, ...hrNavItems, ...financeNavItems, ...mediaNavItems, ...otherNavItems, ...managementNavItems].find((item) => pathname.startsWith(item.href) && (item.href.length > 1 || pathname === '/'))?.label || "VINDYAA"
                }
                </h1>
            </div>
             <div className="flex items-center gap-2">
                <Button variant="outline">Need Help?</Button>
                <Badge variant="secondary" className="hidden sm:inline-flex">v1.0.0</Badge>
            </div>
        </header>
        <main className="p-4 sm:p-6 lg:p-8 bg-background">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
