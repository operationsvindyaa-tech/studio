import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap } from "lucide-react";
import Image from "next/image";

type GalleryImage = {
  id: number;
  src: string;
  alt: string;
  hint: string;
};

const galleryImages: GalleryImage[] = [
  { id: 1, src: "https://picsum.photos/seed/dance/600/400", alt: "Dance", hint: "dance class" },
  { id: 2, src: "https://picsum.photos/seed/music/600/400", alt: "Music", hint: "music lesson" },
  { id: 3, src: "https://picsum.photos/seed/art/600/400", alt: "Art", hint: "art craft" },
];

export default function HomePage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center justify-center text-center p-8 bg-muted/50 rounded-lg">
        <div className="mb-4">
          <div className="relative group bg-primary p-2 rounded-xl text-primary-foreground flex items-center justify-center h-24 w-96 max-w-full">
              <div className="w-full h-full flex items-center justify-center">
                <GraduationCap className="h-16 w-16" />
              </div>
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
        {galleryImages.map((image) => (
            <Card key={image.id} className="overflow-hidden">
                <CardContent className="p-0">
                    <div className="w-full h-full aspect-video relative group block">
                         <Image
                            src={image.src}
                            alt={image.alt}
                            width={600}
                            height={400}
                            className="w-full h-full object-cover"
                            data-ai-hint={image.hint}
                        />
                    </div>
                </CardContent>
            </Card>
        ))}
      </div>
    </div>
  );
}
