import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircleQuestion } from "lucide-react";

export default function FeedbackPage() {
  return (
    <Card className="flex flex-col items-center justify-center text-center p-8 m-auto max-w-lg h-96">
      <CardHeader>
        <div className="mx-auto bg-muted p-3 rounded-full">
            <MessageCircleQuestion className="h-12 w-12 text-muted-foreground" />
        </div>
        <CardTitle className="mt-4">Feedback</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          This feature is coming soon. You will be able to collect and review feedback from students and staff.
        </p>
      </CardContent>
    </Card>
  );
}
