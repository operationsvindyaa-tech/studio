
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookMarked } from "lucide-react";

export default function ContentLibraryPage() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
            <BookMarked className="h-6 w-6" />
            <div>
                <CardTitle>Content Library</CardTitle>
                <CardDescription>
                    Manage and organize all your academic resources, videos, and documents here.
                </CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground">Content Library Page - Coming Soon!</p>
        </div>
      </CardContent>
    </Card>
  );
}
