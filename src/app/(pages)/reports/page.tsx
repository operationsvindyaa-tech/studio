import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart } from "lucide-react";

export default function ReportsPage() {
  return (
    <Card className="flex flex-col items-center justify-center text-center p-8 m-auto max-w-lg h-96">
      <CardHeader>
        <div className="mx-auto bg-muted p-3 rounded-full">
            <AreaChart className="h-12 w-12 text-muted-foreground" />
        </div>
        <CardTitle className="mt-4">Reports</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          This feature is coming soon. You will be able to generate and view various student and system reports.
        </p>
      </CardContent>
    </Card>
  );
}
