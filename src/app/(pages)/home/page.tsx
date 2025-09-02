import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center justify-center text-center p-8 bg-muted/50 rounded-lg">
        <div className="mb-4 flex items-center gap-4">
            {/* Logo Placeholder */}
            <div className="bg-primary p-4 rounded-full text-primary-foreground">
                <GraduationCap className="h-12 w-12" />
            </div>
        </div>
        <h1 className="text-4xl font-bold font-headline text-primary">
          VINDYAA - The Altitude of Art
        </h1>
        <p className="mt-2 text-lg text-muted-foreground max-w-2xl">
          Welcome to your central hub for managing every aspect of the academy. From student enrollment to financial reporting, everything you need is right here.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <Image
              src="https://picsum.photos/600/400"
              alt="Dance"
              width={600}
              height={400}
              className="w-full h-full object-cover"
              data-ai-hint="dance class"
            />
          </CardContent>
        </Card>
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <Image
              src="https://picsum.photos/600/400"
              alt="Music"
              width={600}
              height={400}
              className="w-full h-full object-cover"
              data-ai-hint="music lesson"
            />
          </CardContent>
        </Card>
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <Image
              src="https://picsum.photos/600/400"
              alt="Art"
              width={600}
              height={400}
              className="w-full h-full object-cover"
              data-ai-hint="art craft"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
