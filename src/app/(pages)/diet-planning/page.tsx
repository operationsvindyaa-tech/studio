
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
import { Salad, Utensils, Wheat, Beef, Soup, Loader2 } from "lucide-react";
import { getDietPlan, DietPlan } from "@/ai/flows/diet-plan-flow";
import { useToast } from "@/hooks/use-toast";

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

export default function DietPlanningPage() {
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
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Salad className="h-6 w-6" />
          <div>
            <CardTitle>AI-Powered Diet Planning & Chart</CardTitle>
            <CardDescription>
              Generate activity-specific diet plans for students to help them
              achieve their fitness goals.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
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
      </CardContent>
    </Card>
  );
}
