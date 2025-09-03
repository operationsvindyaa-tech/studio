"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, Upload } from "lucide-react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type GalleryImage = {
  id: number;
  src: string;
  alt: string;
  hint: string;
};

const initialGalleryImages: GalleryImage[] = [
  { id: 1, src: "https://picsum.photos/id/1018/600/400", alt: "Dance", hint: "dance class" },
  { id: 2, src: "https://picsum.photos/id/1015/600/400", alt: "Music", hint: "music lesson" },
  { id: 3, src: "https://picsum.photos/id/1025/600/400", alt: "Art", hint: "art craft" },
];

const LOCAL_STORAGE_KEYS = {
  logo: 'vindyaa-home-logo',
  gallery: 'vindyaa-home-gallery'
};

export default function HomePage() {
  const [logo, setLogo] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>(initialGalleryImages);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // Effect to load data from localStorage on component mount
  useEffect(() => {
    try {
      const savedLogo = localStorage.getItem(LOCAL_STORAGE_KEYS.logo);
      if (savedLogo) {
        setLogo(savedLogo);
      }

      const savedGallery = localStorage.getItem(LOCAL_STORAGE_KEYS.gallery);
      if (savedGallery) {
        setGalleryImages(JSON.parse(savedGallery));
      }
    } catch (error) {
      console.error("Failed to load from localStorage", error);
    }
  }, []);


  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setLogo(dataUrl);
        try {
          localStorage.setItem(LOCAL_STORAGE_KEYS.logo, dataUrl);
        } catch (error) {
          console.error("Failed to save logo to localStorage", error);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryImageChange = (event: React.ChangeEvent<HTMLInputElement>, id: number) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newSrc = reader.result as string;
        const updatedGallery = galleryImages.map(img => img.id === id ? { ...img, src: newSrc } : img);
        setGalleryImages(updatedGallery);
        try {
          localStorage.setItem(LOCAL_STORAGE_KEYS.gallery, JSON.stringify(updatedGallery));
        } catch (error) {
          console.error("Failed to save gallery to localStorage", error);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center justify-center text-center p-8 bg-muted/50 rounded-lg">
        <div className="mb-4">
          <Input
            type="file"
            accept="image/*"
            className="hidden"
            ref={logoInputRef}
            onChange={handleLogoChange}
            id="logo-upload"
          />
          <Card 
            className="relative group bg-primary p-2 rounded-xl text-primary-foreground h-auto w-auto max-w-full cursor-pointer"
            onClick={() => logoInputRef.current?.click()}
          >
            <Label htmlFor="logo-upload" className="cursor-pointer">
              {logo ? (
                <Image
                  src={logo}
                  alt="Uploaded Logo"
                  width={384}
                  height={96}
                  className="object-contain h-24 w-96"
                />
              ) : (
                <div className="w-96 h-24 flex items-center justify-center">
                  <div className="text-center">
                    <GraduationCap className="h-12 w-12 mx-auto" />
                    <p className="text-xs mt-2">Click to upload logo</p>
                  </div>
                </div>
              )}
            </Label>
          </Card>
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
                         <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Input 
                                type="file" 
                                accept="image/*" 
                                className="hidden" 
                                id={`gallery-upload-${image.id}`}
                                onChange={(e) => handleGalleryImageChange(e, image.id)}
                            />
                            <Button asChild variant="secondary">
                                <Label htmlFor={`gallery-upload-${image.id}`}>
                                    <Upload className="mr-2 h-4 w-4" />
                                    Change Image
                                </Label>
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        ))}
      </div>
    </div>
  );
}
