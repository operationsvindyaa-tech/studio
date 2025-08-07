import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarCheck } from "lucide-react";

export default function AttendancePage() {
  return (
    <Card className="flex flex-col items-center justify-center text-center p-8 m-auto max-w-lg h-96">
      <CardHeader>
        <div className="mx-auto bg-muted p-3 rounded-full">
            <CalendarCheck className="h-12 w-12 text-muted-foreground" />
        </div>
        <CardTitle className="mt-4">Attendance Tracking</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          This feature is coming soon. You will be able to manage student and staff attendance here.
        </p>
      </CardContent>
    </Card>
  );
}
