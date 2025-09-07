
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
import { Salad, Utensils, Wheat, Beef, Soup, Loader2, BookCopy, BrainCircuit, Droplets, TrendingUp, CalendarDays, Lightbulb, Bell, CheckCircle, Flame, Droplet, Zap, Search, Minus, Plus } from "lucide-react";
import { getDietPlan, DietPlan } from "@/ai/flows/diet-plan-flow";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Badge } from "@/components/ui/badge";


const activities = [
  "Yoga",
  "Bharatanatyam",
  "Zumba",
  "Karate",
  "Gymnastics",
  "Kalaripayattu",
  "Western Dance",
  "Vocal Carnatic Musician",
  "Keyboard/Piano Musician",
];

const dietaryPreferences = [
    "Balanced", "Vegetarian", "Vegan", "High-Protein", "Satvik (No onion/garlic)"
];

const mealIcons = {
    Breakfast: <Utensils className="h-6 w-6 text-yellow-500" />,
    Lunch: <Wheat className="h-6 w-6 text-orange-500" />,
    Snacks: <Beef className="h-6 w-6 text-red-500" />,
    Dinner: <Soup className="h-6 w-6 text-blue-500" />,
};


function AiDietPlanner() {
    const [selectedActivity, setSelectedActivity] = useState<string>("");
    const [dietaryPreference, setDietaryPreference] = useState<string>(dietaryPreferences[0]);
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
        const result = await getDietPlan({ activityName: selectedActivity, dietaryPreference: dietaryPreference });
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
                <CardDescription>Get a personalized diet plan suggestion based on your chosen activity and dietary preference.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row items-center gap-4 p-4 border rounded-lg bg-muted/50">
                    <div className="grid grid-cols-2 gap-4 flex-grow w-full">
                        <div className="space-y-2">
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
                         <div className="space-y-2">
                            <Label htmlFor="diet-select" className="text-sm font-medium">
                                Dietary Preference
                            </Label>
                            <Select value={dietaryPreference} onValueChange={setDietaryPreference}>
                            <SelectTrigger id="diet-select">
                                <SelectValue placeholder="Choose a diet type..." />
                            </SelectTrigger>
                            <SelectContent>
                                {dietaryPreferences.map((preference) => (
                                <SelectItem key={preference} value={preference}>
                                    {preference}
                                </SelectItem>
                                ))}
                            </SelectContent>
                            </Select>
                        </div>
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
                        Sample {dietaryPreference} Diet for {selectedActivity}
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

const allRecipes = [
    { title: "High-Energy Banana Smoothie", category: "Pre-class", description: "A quick and easy smoothie to fuel your workout.", tags: ["Yoga", "Zumba", "Dance"] },
    { title: "Protein-Packed Paneer Salad", category: "Post-class", description: "Helps muscle recovery after an intense session.", tags: ["Zumba", "Karate", "Gymnastics"] },
    { title: "Satvik Moong Dal Khichdi", category: "Main Course", description: "Light, digestible, and perfect for a yogi's diet.", tags: ["Yoga", "Musician"] },
    { title: "Brain-Boosting Almond Mix", category: "Snack", description: "A handful of nuts to improve focus for musicians.", tags: ["Musician"] },
];

function RecipesTab() {
    const [searchTerm, setSearchTerm] = useState("");
    const filteredRecipes = allRecipes.filter(recipe => 
        recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        recipe.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle>Recipe Library</CardTitle>
                <CardDescription>Browse healthy and delicious recipes tailored for your activity.</CardDescription>
                <div className="relative mt-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Search recipes..." 
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {filteredRecipes.map((recipe, index) => (
                    <Card key={index}>
                        <CardHeader>
                            <CardTitle>{recipe.title}</CardTitle>
                            <CardDescription>{recipe.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-2">
                                {recipe.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </CardContent>
        </Card>
    );
}

function HydrationTab() {
    const dailyGoal = 3000; // 3 Liters
    const [intake, setIntake] = useState(1250); // in ml

    const addIntake = (amount: number) => {
        setIntake(prev => Math.min(prev + amount, dailyGoal * 1.5));
    }
    const subtractIntake = (amount: number) => {
        setIntake(prev => Math.max(0, prev - amount));
    }

    const progress = (intake / dailyGoal) * 100;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Hydration Tracker</CardTitle>
                <CardDescription>Log your daily water intake to stay hydrated and perform your best.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-6">
                <div className="relative">
                    <Progress value={progress} className="w-64 h-6" />
                    <Droplet className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-primary h-8 w-8" style={{ opacity: Math.min(progress / 100, 1) }} />
                </div>
                <div className="text-center">
                    <p className="text-3xl font-bold">{intake} <span className="text-lg text-muted-foreground">/ {dailyGoal} ml</span></p>
                    <p className="text-sm text-muted-foreground">Today's Goal</p>
                </div>
                <div className="flex gap-4 items-center">
                    <Button variant="outline" size="icon" onClick={() => subtractIntake(250)}><Minus /></Button>
                    <div className="space-x-2">
                        <Button onClick={() => addIntake(250)}>+250ml Glass</Button>
                        <Button onClick={() => addIntake(500)}>+500ml Bottle</Button>
                    </div>
                    <Button variant="outline" size="icon" onClick={() => addIntake(250)}><Plus /></Button>
                </div>
            </CardContent>
        </Card>
    );
}

const progressData = [
  { day: "Mon", logged: 3, goal: 3 },
  { day: "Tue", logged: 2, goal: 3 },
  { day: "Wed", logged: 3, goal: 3 },
  { day: "Thu", logged: 3, goal: 3 },
  { day: "Fri", logged: 1, goal: 3 },
  { day: "Sat", logged: 2, goal: 3 },
  { day: "Sun", logged: 3, goal: 3 },
];

function ProgressTab() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Progress Tracking</CardTitle>
                <CardDescription>Monitor your goals, log your meals, and track your nutritional journey.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                 <div className="grid sm:grid-cols-2 gap-4">
                     <Card>
                        <CardHeader>
                            <CardTitle>This Week's Compliance</CardTitle>
                            <CardDescription>Meals logged vs. goal.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={200}>
                                <BarChart data={progressData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="day" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="logged" fill="hsl(var(--primary))" name="Logged Meals" />
                                    <Bar dataKey="goal" fill="hsl(var(--muted))" name="Goal" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                     </Card>
                     <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg text-center">
                        <h3 className="text-lg font-semibold">Meal Logging</h3>
                        <p className="text-sm text-muted-foreground mb-4">The ability to log meals is coming soon!</p>
                        <Button disabled>Log Today's Meal</Button>
                     </div>
                 </div>
            </CardContent>
        </Card>
    );
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
            <TabsTrigger value="plan"><CalendarDays className="mr-2 h-4 w-4" />Plan</TabsTrigger>
            <TabsTrigger value="recipes"><BookCopy className="mr-2 h-4 w-4" />Recipes</TabsTrigger>
            <TabsTrigger value="hydration"><Droplets className="mr-2 h-4 w-4" />Hydration</TabsTrigger>
            <TabsTrigger value="progress"><TrendingUp className="mr-2 h-4 w-4" />Progress</TabsTrigger>
          </TabsList>
          <TabsContent value="plan" className="pt-6">
            <PlanTab />
          </TabsContent>
          <TabsContent value="recipes" className="pt-6">
             <RecipesTab />
          </TabsContent>
          <TabsContent value="hydration" className="pt-6">
             <HydrationTab />
          </TabsContent>
          <TabsContent value="progress" className="pt-6">
             <ProgressTab />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
