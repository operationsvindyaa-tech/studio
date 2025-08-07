import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet } from "lucide-react";

export default function BillingPage() {
  return (
    <Card className="flex flex-col items-center justify-center text-center p-8 m-auto max-w-lg h-96">
      <CardHeader>
        <div className="mx-auto bg-muted p-3 rounded-full">
            <Wallet className="h-12 w-12 text-muted-foreground" />
        </div>
        <CardTitle className="mt-4">Billing & Invoicing</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          This feature is coming soon. You will be able to manage student billing, invoices, and payments here.
        </p>
      </CardContent>
    </Card>
  );
}
