
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Upload } from "lucide-react";
import Image from "next/image";
import { useState, useRef } from "react";

type GalleryImage = {
  id: number;
  src: string;
  alt: string;
  hint: string;
};

export default function HomePage() {
  const [logoSrc, setLogoSrc] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([
    { id: 1, src: "https://picsum.photos/600/400", alt: "Dance", hint: "dance class" },
    { id: 2, src: "https://picsum.photos/600/400", alt: "Music", hint: "music lesson" },
    { id: 3, src: "https://picsum.photos/600/400", alt: "Art", hint: "art craft" },
  ]);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [editingImageId, setEditingImageId] = useState<number | null>(null);

  const handleLogoUploadClick = () => {
    logoInputRef.current?.click();
  };

  const handleGalleryUploadClick = (id: number) => {
    setEditingImageId(id);
    galleryInputRef.current?.click();
  };

  const handleLogoFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoSrc(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleGalleryFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (editingImageId === null) return;
    
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newSrc = e.target?.result as string;
        setGalleryImages(galleryImages.map(img => 
            img.id === editingImageId ? { ...img, src: newSrc } : img
        ));
      };
      reader.readAsDataURL(file);
    }
    // Reset file input to allow re-uploading the same file
    if(galleryInputRef.current) galleryInputRef.current.value = "";
  };

  return (
    <div className="space-y-8">
      <input
        type="file"
        ref={logoInputRef}
        onChange={handleLogoFileChange}
        className="hidden"
        accept="image/*"
      />
       <input
        type="file"
        ref={galleryInputRef}
        onChange={handleGalleryFileChange}
        className="hidden"
        accept="image/*"
      />
      <div className="flex flex-col items-center justify-center text-center p-8 bg-muted/50 rounded-lg">
        <div className="mb-4 flex items-center gap-4">
          <button onClick={handleLogoUploadClick} className="relative group bg-primary p-6 rounded-xl text-primary-foreground cursor-pointer h-24 w-48 flex items-center justify-center">
            {logoSrc ? (
              <Image src={logoSrc} alt="Company Logo" width={192} height={96} className="rounded-lg object-contain h-full w-full" />
            ) : (
              <GraduationCap className="h-12 w-12" />
            )}
            <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Upload className="h-8 w-8 text-white" />
            </div>
          </button>
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
                    <button onClick={() => handleGalleryUploadClick(image.id)} className="w-full h-full aspect-video relative group block">
                         <Image
                            src={image.src}
                            alt={image.alt}
                            width={600}
                            height={400}
                            className="w-full h-full object-cover"
                            data-ai-hint={image.hint}
                        />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Upload className="h-8 w-8 text-white" />
                        </div>
                    </button>
                </CardContent>
            </Card>
        ))}
      </div>
    </div>
  );
}
