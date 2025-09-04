import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HeartHandshake } from "lucide-react";

export default function EventsWorkshopsPage() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <HeartHandshake className="h-6 w-6" />
          <div>
            <CardTitle>Events & Workshops</CardTitle>
            <CardDescription>
              This is a placeholder page for managing events and workshops.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center py-16 text-muted-foreground">
          <p>Content for this page can be added here.</p>
        </div>
      </CardContent>
    </Card>
  );
}
