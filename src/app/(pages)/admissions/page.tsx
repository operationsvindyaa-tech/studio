import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookUser, PlusCircle } from "lucide-react";
import Link from "next/link";

export default function AdmissionsPage() {
  return (
    <div className="flex justify-center items-center h-full">
        <Card className="text-center p-8 max-w-lg">
        <CardHeader>
            <div className="mx-auto bg-muted p-3 rounded-full w-fit">
                <BookUser className="h-12 w-12 text-muted-foreground" />
            </div>
            <CardTitle className="mt-4">Admissions & Enquiries</CardTitle>
            <CardDescription>
                Manage new student applications and track enquiries.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground mb-6">
                You can start a new admission application or view the status of existing ones.
            </p>
            <Button asChild size="lg">
                <Link href="/admissions/new">
                    <PlusCircle className="mr-2 h-5 w-5" />
                    New Admission Form
                </Link>
            </Button>
        </CardContent>
        <CardFooter>
            <p className="text-xs text-muted-foreground mx-auto">Click the button above to start a new application.</p>
        </CardFooter>
        </Card>
    </div>
  );
}
