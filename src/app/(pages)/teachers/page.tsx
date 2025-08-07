import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserSquare } from "lucide-react";

export default function TeachersPage() {
  return (
    <Card className="flex flex-col items-center justify-center text-center p-8 m-auto max-w-lg h-96">
      <CardHeader>
        <div className="mx-auto bg-muted p-3 rounded-full">
            <UserSquare className="h-12 w-12 text-muted-foreground" />
        </div>
        <CardTitle className="mt-4">Teachers Management</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          This feature is coming soon. You will be able to manage teacher profiles and assignments here.
        </p>
      </CardContent>
    </Card>
  );
}
