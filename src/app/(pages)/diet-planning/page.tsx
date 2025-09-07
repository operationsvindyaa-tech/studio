
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
import { Salad, Utensils, Wheat, Beef, Soup, Loader2, PlusCircle, BookCopy, BrainCircuit } from "lucide-react";
import { getDietPlan, DietPlan } from "@/ai/flows/diet-plan-flow";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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

type ManualDietPlan = {
  id: string;
  activityName: string;
  meals: {
    Breakfast: { time: string; items: string[]; reasoning: string };
    Lunch: { time: string; items: string[]; reasoning: string };
    Snacks: { time: string; items: string[]; reasoning: string };
    Dinner: { time: string; items: string[]; reasoning: string };
  };
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
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-4 p-4 border rounded-lg bg-muted/50">
                <div className="flex-grow w-full">
                    <label htmlFor="activity-select" className="text-sm font-medium">
                    Select Activity
                    </label>
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
                <Button onClick={handleGeneratePlan} disabled={isPending} className="w-full sm:w-auto mt-4 sm:mt-0">
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

             {!isPending && !dietPlan && (
                <div className="text-center py-16 text-muted-foreground">
                    <p>Select an activity and click "Generate" to see a diet plan.</p>
                </div>
            )}
        </div>
    );
}

function ManualDietPlanner() {
    const [manualPlans, setManualPlans] = useState<ManualDietPlan[]>([]);
    const [filter, setFilter] = useState("All Activities");
    const [isFormVisible, setIsFormVisible] = useState(false);
    const { toast } = useToast();

    const [activityName, setActivityName] = useState("");
    const [breakfastTime, setBreakfastTime] = useState("08:00 AM");
    const [breakfastItems, setBreakfastItems] = useState("");
    const [breakfastReason, setBreakfastReason] = useState("");
    // ... other meal states
    const [lunchTime, setLunchTime] = useState("01:00 PM");
    const [lunchItems, setLunchItems] = useState("");
    const [lunchReason, setLunchReason] = useState("");
    const [snacksTime, setSnacksTime] = useState("04:30 PM");
    const [snacksItems, setSnacksItems] = useState("");
    const [snacksReason, setSnacksReason] = useState("");
    const [dinnerTime, setDinnerTime] = useState("07:30 PM");
    const [dinnerItems, setDinnerItems] = useState("");
    const [dinnerReason, setDinnerReason] = useState("");

    const filteredPlans = manualPlans.filter(plan => filter === "All Activities" || plan.activityName === filter);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!activityName) {
            toast({ title: "Error", description: "Please select an activity.", variant: "destructive"});
            return;
        }
        
        const newPlan: ManualDietPlan = {
            id: crypto.randomUUID(),
            activityName,
            meals: {
                Breakfast: { time: breakfastTime, items: breakfastItems.split(',').map(i => i.trim()), reasoning: breakfastReason },
                Lunch: { time: lunchTime, items: lunchItems.split(',').map(i => i.trim()), reasoning: lunchReason },
                Snacks: { time: snacksTime, items: snacksItems.split(',').map(i => i.trim()), reasoning: snacksReason },
                Dinner: { time: dinnerTime, items: dinnerItems.split(',').map(i => i.trim()), reasoning: dinnerReason },
            }
        };
        setManualPlans([...manualPlans, newPlan]);
        toast({ title: "Plan Saved", description: `Diet plan for ${activityName} has been saved.`});
        setIsFormVisible(false);
        // Reset form
        setActivityName("");
        setBreakfastItems(""); setBreakfastReason("");
        setLunchItems(""); setLunchReason("");
        setSnacksItems(""); setSnacksReason("");
        setDinnerItems(""); setDinnerReason("");
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <Select value={filter} onValueChange={setFilter}>
                    <SelectTrigger className="w-[280px]">
                        <SelectValue placeholder="Filter by activity..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All Activities">All Activities</SelectItem>
                        {activities.map((activity) => (
                        <SelectItem key={activity} value={activity}>
                            {activity}
                        </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                 <Button onClick={() => setIsFormVisible(!isFormVisible)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    {isFormVisible ? 'Cancel' : 'Add New Plan'}
                </Button>
            </div>
            
            {isFormVisible && (
                <Card>
                    <CardHeader><CardTitle>Add a New Manual Diet Plan</CardTitle></CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-8">
                             <div className="space-y-2">
                                <Label htmlFor="manual-activity">Activity</Label>
                                <Select value={activityName} onValueChange={setActivityName}>
                                    <SelectTrigger id="manual-activity"><SelectValue placeholder="Select activity" /></SelectTrigger>
                                    <SelectContent>
                                        {activities.map(activity => <SelectItem key={activity} value={activity}>{activity}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            
                            {/* Meal Forms */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-4 p-4 border rounded-lg">
                                    <h4 className="font-semibold text-lg">Breakfast</h4>
                                    <div className="space-y-2"><Label>Time</Label><Input value={breakfastTime} onChange={e => setBreakfastTime(e.target.value)} /></div>
                                    <div className="space-y-2"><Label>Items (comma-separated)</Label><Textarea value={breakfastItems} onChange={e => setBreakfastItems(e.target.value)} /></div>
                                    <div className="space-y-2"><Label>Reasoning</Label><Textarea value={breakfastReason} onChange={e => setBreakfastReason(e.target.value)} /></div>
                                </div>
                                 <div className="space-y-4 p-4 border rounded-lg">
                                    <h4 className="font-semibold text-lg">Lunch</h4>
                                    <div className="space-y-2"><Label>Time</Label><Input value={lunchTime} onChange={e => setLunchTime(e.target.value)} /></div>
                                    <div className="space-y-2"><Label>Items (comma-separated)</Label><Textarea value={lunchItems} onChange={e => setLunchItems(e.target.value)} /></div>
                                    <div className="space-y-2"><Label>Reasoning</Label><Textarea value={lunchReason} onChange={e => setLunchReason(e.target.value)} /></div>
                                </div>
                                <div className="space-y-4 p-4 border rounded-lg">
                                    <h4 className="font-semibold text-lg">Snacks</h4>
                                    <div className="space-y-2"><Label>Time</Label><Input value={snacksTime} onChange={e => setSnacksTime(e.target.value)} /></div>
                                    <div className="space-y-2"><Label>Items (comma-separated)</Label><Textarea value={snacksItems} onChange={e => setSnacksItems(e.target.value)} /></div>
                                    <div className="space-y-2"><Label>Reasoning</Label><Textarea value={snacksReason} onChange={e => setSnacksReason(e.target.value)} /></div>
                                </div>
                                <div className="space-y-4 p-4 border rounded-lg">
                                    <h4 className="font-semibold text-lg">Dinner</h4>
                                    <div className="space-y-2"><Label>Time</Label><Input value={dinnerTime} onChange={e => setDinnerTime(e.target.value)} /></div>
                                    <div className="space-y-2"><Label>Items (comma-separated)</Label><Textarea value={dinnerItems} onChange={e => setDinnerItems(e.target.value)} /></div>
                                    <div className="space-y-2"><Label>Reasoning</Label><Textarea value={dinnerReason} onChange={e => setDinnerReason(e.target.value)} /></div>
                                </div>
                            </div>
                            
                            <Button type="submit" className="w-full">Save Manual Plan</Button>
                        </form>
                    </CardContent>
                </Card>
            )}

            {filteredPlans.length > 0 ? (
                filteredPlans.map(plan => (
                    <div key={plan.id}>
                        <h2 className="text-2xl font-bold text-center mb-4">
                            Manual Diet Plan for {plan.activityName}
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {Object.entries(plan.meals).map(([mealName, mealDetails]) => (
                                <Card key={mealName}>
                                <CardHeader className="flex flex-row items-center gap-4">
                                    {mealIcons[mealName as keyof typeof mealIcons]}
                                    <div>
                                    <CardTitle>{mealName}</CardTitle>
                                    <CardDescription>{mealDetails.time}</CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div><h4 className="font-semibold">Items</h4><ul className="list-disc list-inside text-muted-foreground">{mealDetails.items.map((item, index) => (<li key={index}>{item}</li>))}</ul></div>
                                    <div><h4 className="font-semibold">Reasoning</h4><p className="text-sm text-muted-foreground">{mealDetails.reasoning}</p></div>
                                </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center py-16 text-muted-foreground">
                    <p>No manual diet plans found. Add one to get started!</p>
                </div>
            )}
        </div>
    );
}

export default function DietPlanningPage() {
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Salad className="h-6 w-6" />
          <div>
            <CardTitle>Diet Planning & Chart</CardTitle>
            <CardDescription>
              Generate AI-powered or manually create activity-specific diet plans for students.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="ai-generator">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ai-generator"><BrainCircuit className="mr-2" />AI Generator</TabsTrigger>
            <TabsTrigger value="manual-entry"><BookCopy className="mr-2" />Manual Entry</TabsTrigger>
          </TabsList>
          <TabsContent value="ai-generator" className="pt-6">
            <AiDietPlanner />
          </TabsContent>
          <TabsContent value="manual-entry" className="pt-6">
            <ManualDietPlanner />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

    