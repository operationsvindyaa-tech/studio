import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarClock } from "lucide-react";

export default function TimetablePage() {
  return (
    <Card className="flex flex-col items-center justify-center text-center p-8 m-auto max-w-lg h-96">
      <CardHeader>
        <div className="mx-auto bg-muted p-3 rounded-full">
            <CalendarClock className="h-12 w-12 text-muted-foreground" />
        </div>
        <CardTitle className="mt-4">School Time Table</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          This feature is coming soon. You will be able to view and manage class schedules here.
        </p>
      </CardContent>
    </Card>
  );
}
