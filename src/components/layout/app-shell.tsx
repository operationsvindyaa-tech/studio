
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

const operationsNavItems = [
    { href: "/admissions", icon: BookUser, label: "Admissions" },
    { href: "/enquiries", icon: ClipboardList, label: "Enquiries" },
    { href: "/students", icon: Users, label: "Students" },
    { href: "/batches", icon: Users2, label: "Batches" },
    { href: "/attendance", icon: CalendarCheck, label: "Attendance" },
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
    { href: "/teacher-performance", icon: LineChart, label: "Teacher Performance" },
    { href: "/letters", icon: Mail, label: "Letters" },
];

const financeNavItems = [
    { href: "/billing", icon: Banknote, label: "Billing" },
    { href: "/payroll", icon: Wallet, label: "Payroll" },
    { href: "/payment-status", icon: CalendarCheck, label: "Payment Tracker" },
    { href: "/accounts", icon: BookText, label: "Accounts" },
    { href: "/expenses", icon: ReceiptText, label: "Expenses" },
    { href: "/reports", icon: AreaChart, label: "Reports" },
]

const mediaNavItems = [
    { href: "/photogallery", icon: Camera, label: "Photo Gallery" },
];

const otherNavItems = [
    { href: "/feedback", icon: MessageCircleQuestion, label: "Feedback" },
    { href: "/studio-booking", icon: Store, label: "Studio Booking" },
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
                <SidebarGroupLabel>Operations</SidebarGroupLabel>
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
                    [...navItems, ...operationsNavItems, ...academicsNavItems, ...hrNavItems, ...financeNavItems, ...mediaNavItems, ...otherNavItems].find((item) => pathname.startsWith(item.href) && (item.href.length > 1 || pathname === '/'))?.label || "VINDYAA"
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
