
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FilePenLine } from "lucide-react";

export default function SyllabusPage() {
  return (
    <Card className="flex flex-col items-center justify-center text-center p-8 m-auto max-w-lg h-96">
      <CardHeader>
        <div className="mx-auto bg-muted p-3 rounded-full">
            <FilePenLine className="h-12 w-12 text-muted-foreground" />
        </div>
        <CardTitle className="mt-4">Syllabus Management</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          This feature is coming soon. You will be able to create, manage, and share course syllabi here.
        </p>
      </CardContent>
    </Card>
  );
}
