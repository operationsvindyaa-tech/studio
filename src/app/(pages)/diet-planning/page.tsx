
"use client";

import { useState, useTransition } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Salad, Utensils, Wheat, Beef, Soup, Loader2, BookCopy, BrainCircuit, Droplets, TrendingUp, CalendarDays, Lightbulb, Bell, CheckCircle } from "lucide-react";
import { getDietPlan, DietPlan } from "@/ai/flows/diet-plan-flow";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";

const activities = [
  "Yoga",
  "Bharatanatyam",
  "Zumba",
  "Karate",
  "Gymnastics",
  "Kalaripayattu",
  "Western Dance",
];

const mealIcons = {
    Breakfast: <Utensils className="h-6 w-6 text-yellow-500" />,
    Lunch: <Wheat className="h-6 w-6 text-orange-500" />,
    Snacks: <Beef className="h-6 w-6 text-red-500" />,
    Dinner: <Soup className="h-6 w-6 text-blue-500" />,
};


function AiDietPlanner() {
    const [selectedActivity, setSelectedActivity] = useState<string>("");
    const [dietPlan, setDietPlan] = useState<DietPlan | null>(null);
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    const handleGeneratePlan = () => {
        if (!selectedActivity) {
        toast({
            title: "No Activity Selected",
            description: "Please select an activity to generate a diet plan.",
            variant: "destructive",
        });
        return;
        }

        startTransition(async () => {
        setDietPlan(null);
        const result = await getDietPlan({ activityName: selectedActivity });
        if (result) {
            setDietPlan(result);
            toast({
            title: "Diet Plan Generated!",
            description: `Here is a sample diet plan for ${selectedActivity}.`,
            });
        } else {
            toast({
            title: "Error",
            description: "Could not generate a diet plan. Please try again.",
            variant: "destructive",
            });
        }
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><BrainCircuit /> AI-Powered Diet Plan Generator</CardTitle>
                <CardDescription>Get a personalized diet plan suggestion based on your chosen activity.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row items-center gap-4 p-4 border rounded-lg bg-muted/50">
                    <div className="flex-grow w-full">
                        <Label htmlFor="activity-select" className="text-sm font-medium">
                        Select Activity
                        </Label>
                        <Select value={selectedActivity} onValueChange={setSelectedActivity}>
                        <SelectTrigger id="activity-select">
                            <SelectValue placeholder="Choose an activity..." />
                        </SelectTrigger>
                        <SelectContent>
                            {activities.map((activity) => (
                            <SelectItem key={activity} value={activity}>
                                {activity}
                            </SelectItem>
                            ))}
                        </SelectContent>
                        </Select>
                    </div>
                    <Button onClick={handleGeneratePlan} disabled={isPending} className="w-full sm:w-auto mt-4 sm:mt-0 self-end">
                        {isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating...
                        </>
                        ) : (
                        "Generate Diet Plan"
                        )}
                    </Button>
                </div>

                {isPending && (
                    <div className="grid md:grid-cols-2 gap-6">
                        <Skeleton className="h-48 w-full" />
                        <Skeleton className="h-48 w-full" />
                        <Skeleton className="h-48 w-full" />
                        <Skeleton className="h-48 w-full" />
                    </div>
                )}

                {dietPlan && (
                    <div>
                        <h2 className="text-2xl font-bold text-center mb-4">
                        Sample One-Day Diet Plan for {selectedActivity}
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                        {Object.entries(dietPlan.meals).map(([mealName, mealDetails]) => (
                            <Card key={mealName}>
                            <CardHeader className="flex flex-row items-center gap-4">
                                {mealIcons[mealName as keyof typeof mealIcons]}
                                <div>
                                <CardTitle>{mealName}</CardTitle>
                                <CardDescription>
                                    {mealDetails.time}
                                </CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h4 className="font-semibold">Suggested Items</h4>
                                    <ul className="list-disc list-inside text-muted-foreground">
                                        {mealDetails.items.map((item, index) => (
                                            <li key={index}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-semibold">Reasoning</h4>
                                    <p className="text-sm text-muted-foreground">{mealDetails.reasoning}</p>
                                </div>
                            </CardContent>
                            </Card>
                        ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

function PlanTab() {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Dashboard</CardTitle>
                </CardHeader>
                <CardContent className="grid sm:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                        <Lightbulb className="h-6 w-6 text-yellow-500" />
                        <div>
                            <p className="text-sm font-semibold">Daily Tip</p>
                            <p className="text-xs text-muted-foreground">Stay hydrated to improve muscle function and energy levels.</p>
                        </div>
                    </div>
                     <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                        <Bell className="h-6 w-6 text-blue-500" />
                        <div>
                            <p className="text-sm font-semibold">Quick Reminder</p>
                            <p className="text-xs text-muted-foreground">Have a light, carb-rich snack 30-60 minutes before your class.</p>
                        </div>
                    </div>
                     <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                        <CheckCircle className="h-6 w-6 text-green-500" />
                        <div>
                            <p className="text-sm font-semibold">Progress Summary</p>
                            <p className="text-xs text-muted-foreground">You followed your plan 5/7 days last week!</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <AiDietPlanner />
        </div>
    )
}

function PlaceholderTab({ title, description, icon: Icon }: { title: string, description: string, icon: React.ElementType }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg text-center">
                    <Icon className="h-16 w-16 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground font-semibold">Coming Soon!</p>
                    <p className="text-sm text-muted-foreground mt-1">This feature is under development.</p>
                </div>
            </CardContent>
        </Card>
    )
}


export default function DietPlanningPage() {
  return (
    <Card className="max-w-5xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Salad className="h-6 w-6" />
          <div>
            <CardTitle>Diet Planning & Chart</CardTitle>
            <CardDescription>
              A complete nutrition guide to support your artistic and fitness journey.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="plan">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="plan"><CalendarDays className="mr-2" />Plan</TabsTrigger>
            <TabsTrigger value="recipes"><BookCopy className="mr-2" />Recipes</TabsTrigger>
            <TabsTrigger value="hydration"><Droplets className="mr-2" />Hydration</TabsTrigger>
            <TabsTrigger value="progress"><TrendingUp className="mr-2" />Progress</TabsTrigger>
          </TabsList>
          <TabsContent value="plan" className="pt-6">
            <PlanTab />
          </TabsContent>
          <TabsContent value="recipes" className="pt-6">
             <PlaceholderTab 
                title="Recipe Library" 
                description="Browse healthy and delicious recipes tailored for your activity." 
                icon={BookCopy} 
            />
          </TabsContent>
          <TabsContent value="hydration" className="pt-6">
             <PlaceholderTab 
                title="Hydration Tracker" 
                description="Log your daily water intake to stay hydrated and perform your best." 
                icon={Droplets} 
            />
          </TabsContent>
          <TabsContent value="progress" className="pt-6">
             <PlaceholderTab 
                title="Progress Tracking" 
                description="Monitor your goals, log your meals, and track your nutritional journey." 
                icon={TrendingUp} 
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
