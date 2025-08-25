
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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  BookOpen,
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
  Target,
  Megaphone,
  Building,
  Video,
  ListOrdered,
  ChevronRight,
  Notebook,
  Ruler,
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
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
];

const studentPortalNavItems = [
    { href: "/student-attendance", icon: CalendarCheck, label: "Attendance" },
    { href: "/progress-report", icon: TrendingUp, label: "Progress" },
    { href: "/upcoming-events", icon: Calendar, label: "Upcoming Events and Activities" },
    { href: "/exam-updates", icon: ListOrdered, label: "Exams Updates" },
    { href: "/syllabus", icon: BookOpen, label: "Syllabus" },
    { href: "/notes", icon: Notebook, label: "Notes" },
    { href: "/online-class", icon: Video, label: "Online Class" },
    { href: "/my-payments", icon: Wallet, label: "My Payments" },
    { href: "/login", icon: LogIn, label: "Student Login" },
]

const operationsNavItems = [
    { href: "/enquiries", icon: ClipboardList, label: "Enquiries" },
    { href: "/activity-demo", icon: ClipboardCheck, label: "Demos" },
    { href: "/admissions", icon: BookUser, label: "Admissions" },
    { href: "/students", icon: Users, label: "Students" },
    { href: "/branches", icon: Building, label: "Branches" },
    { href: "/batches", icon: Users2, label: "Batches" },
    { href: "/attendance", icon: CalendarCheck, label: "Attendance" },
]

const academicsNavItems = [
    { href: "/courses", icon: BookOpen, label: "Courses" },
    { href: "/syllabus", icon: FilePenLine, label: "Syllabus" },
    { href: "/schedule", icon: Calendar, label: "Schedule" },
    { href: "/timetable", icon: CalendarClock, label: "Timetable" },
    { href: "/exam-students-list", icon: ListOrdered, label: "Exam List" },
    { href: "/certificates", icon: Award, label: "Certificates" },
    { href: "/ptm", icon: School, label: "PTM" },
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
]

const communicationsNavItems = [
    { href: "/announcements-hub", icon: MessageSquare, label: "Announcements Hub"},
    { href: "/photogallery", icon: Camera, label: "Photo Gallery" },
];

const otherNavItems = [
    { href: "/feedback", icon: MessageCircleQuestion, label: "Feedback" },
    { href: "/studio-booking", icon: Store, label: "Studio Booking" },
    { href: "/merchandise", icon: ShoppingCart, label: "Merchandise" },
    { href: "/kmd", icon: Ruler, label: "KMD" },
];

const managementNavItems = [
    { href: "/reports", icon: AreaChart, label: "Financial" },
    { href: "/student-enrollment-report", icon: UsersRound, label: "Student" },
    { href: "/instructor-staff-report", icon: UserCheckIcon, label: "Instructor" },
    { href: "/operations-report", icon: FilePieChart, label: "Operations" },
    { href: "/marketing-growth-report", icon: Megaphone, label: "Marketing" },
    { href: "/strategic-reports", icon: Target, label: "Strategic" },
];

const NavGroup = ({ label, items, pathname }: { label: string, items: { href: string, icon: React.ElementType, label: string }[], pathname: string }) => {
    const isExpanded = items.some(item => pathname.startsWith(item.href));
    return (
        <SidebarGroup>
            <Collapsible defaultOpen={isExpanded}>
                <CollapsibleTrigger asChild>
                    <SidebarGroupLabel className="w-full cursor-pointer">
                        <div className="flex justify-between items-center w-full">
                            <span>{label}</span>
                            <ChevronRight className="h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-90" />
                        </div>
                    </SidebarGroupLabel>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <SidebarMenu className="mt-2">
                        {items.map((item) => (
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
                </CollapsibleContent>
            </Collapsible>
        </SidebarGroup>
    );
}


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
            <NavGroup label="Student Portal" items={studentPortalNavItems} pathname={pathname} />
          <SidebarSeparator />
            <NavGroup label="Operations" items={operationsNavItems} pathname={pathname} />
          <SidebarSeparator />
            <NavGroup label="Academics" items={academicsNavItems} pathname={pathname} />
          <SidebarSeparator />
            <NavGroup label="HR" items={hrNavItems} pathname={pathname} />
          <SidebarSeparator />
            <NavGroup label="Finance" items={financeNavItems} pathname={pathname} />
          {userIsSeniorManagement && (
            <>
                <SidebarSeparator />
                <NavGroup label="Management" items={managementNavItems} pathname={pathname} />
            </>
          )}
          <SidebarSeparator />
            <NavGroup label="Communications" items={communicationsNavItems} pathname={pathname} />
          <SidebarSeparator />
            <NavGroup label="More" items={otherNavItems} pathname={pathname} />
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
                    [...navItems, ...studentPortalNavItems, ...operationsNavItems, ...academicsNavItems, ...hrNavItems, ...financeNavItems, ...communicationsNavItems, ...otherNavItems, ...managementNavItems].find((item) => pathname.startsWith(item.href) && (item.href.length > 1 || pathname === '/'))?.label || "VINDYAA"
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
