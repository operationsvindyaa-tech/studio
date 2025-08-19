
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Video, Mic, MicOff, VideoOff, ScreenShare, PhoneOff, Users, MessageSquare } from "lucide-react";
import { getOnlineClasses, type OnlineClass } from "@/lib/online-class-db";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

export default function OnlineClassPage() {
    const [loading, setLoading] = useState(true);
    const [nextClass, setNextClass] = useState<OnlineClass | null>(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isCameraOff, setIsCameraOff] = useState(false);

    useEffect(() => {
        const fetchClassData = async () => {
            setLoading(true);
            const classes = await getOnlineClasses();
            // Find the next upcoming or ongoing class
            const now = new Date();
            const upcoming = classes
                .filter(c => new Date(c.startTime) > now)
                .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
            
            setNextClass(upcoming.length > 0 ? upcoming[0] : null);
            setLoading(false);
        };
        fetchClassData();
    }, []);

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <Video className="h-6 w-6" />
                        <div>
                            <CardTitle>Online Class Portal</CardTitle>
                            <CardDescription>
                                Join your scheduled online classes here.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            <div className="grid lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <CardContent className="p-0 relative aspect-video">
                        <Image src="https://placehold.co/1280x720.png" layout="fill" objectFit="cover" alt="Online class placeholder" className="rounded-t-lg" data-ai-hint="video conference" />
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
                            <div className="flex items-center gap-2 p-2 bg-black/50 rounded-full border border-white/20 backdrop-blur-sm">
                                <Button size="icon" variant="secondary" onClick={() => setIsMuted(!isMuted)}>
                                    {isMuted ? <MicOff /> : <Mic />}
                                </Button>
                                <Button size="icon" variant="secondary" onClick={() => setIsCameraOff(!isCameraOff)}>
                                    {isCameraOff ? <VideoOff /> : <Video />}
                                </Button>
                                <Button size="icon" variant="secondary">
                                    <ScreenShare />
                                </Button>
                                <Button size="icon" variant="destructive">
                                    <PhoneOff />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Next Class</CardTitle>
                        <CardDescription>Your next scheduled online session.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="space-y-4">
                                <Skeleton className="h-8 w-3/4" />
                                <Skeleton className="h-6 w-1/2" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        ) : nextClass ? (
                            <div className="space-y-4">
                                <Badge>{nextClass.status}</Badge>
                                <div>
                                    <h3 className="text-lg font-semibold">{nextClass.courseName}</h3>
                                    <p className="text-muted-foreground">with {nextClass.instructorName}</p>
                                </div>
                                <div>
                                    <p className="font-medium">{new Date(nextClass.startTime).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                    <p className="text-muted-foreground">{new Date(nextClass.startTime).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })} - {new Date(nextClass.endTime).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</p>
                                </div>
                                <Button className="w-full" asChild>
                                    <a href={nextClass.meetingLink} target="_blank" rel="noopener noreferrer">
                                        Join Class Now
                                    </a>
                                </Button>
                                <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t">
                                    <div className="flex items-center gap-2"><Users className="h-4 w-4" /> {nextClass.participants} Participants</div>
                                    <div className="flex items-center gap-2"><MessageSquare className="h-4 w-4" /> Chat</div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center text-muted-foreground py-8">
                                <p>No upcoming classes scheduled.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
