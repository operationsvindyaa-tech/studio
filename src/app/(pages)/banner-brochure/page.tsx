"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Download, Trash2, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast";

type GalleryImage = {
  id: string;
  src: string;
  name: string;
  dataAiHint: string;
};

const initialImages: GalleryImage[] = [
    { id: "1", src: "https://placehold.co/600x400.png", name: "Annual Day 2023.png", dataAiHint: "stage performance" },
    { id: "2", src: "https://placehold.co/600x400.png", name: "Dance Competition.png", dataAiHint: "dance competition" },
    { id: "3", src: "https://placehold.co/600x400.png", name: "Music Recital.png", dataAiHint: "music concert" },
    { id: "4", src: "https://placehold.co/600x400.png", name: "Art Exhibition.png", dataAiHint: "art gallery" },
    { id: "5", src: "https://placehold.co/600x400.png", name: "Yoga Session.png", dataAiHint: "yoga class" },
    { id: "6", src: "https://placehold.co/600x400.png", name: "Karate Grading.png", dataAiHint: "karate children" },
];

export default function BannerBrochurePage() {
  const [images, setImages] = useState<GalleryImage[]>(initialImages);
  const [imageToDelete, setImageToDelete] = useState<GalleryImage | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newImages: GalleryImage[] = [];
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const src = e.target?.result as string;
        const newImage: GalleryImage = {
          id: crypto.randomUUID(),
          src,
          name: file.name,
          dataAiHint: 'user uploaded'
        };
        newImages.push(newImage);
        
        if (newImages.length === files.length) {
          setImages(prevImages => [...prevImages, ...newImages]);
          toast({
            title: "Upload Successful",
            description: `${files.length} image(s) have been added.`,
          });
        }
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDeleteClick = (image: GalleryImage) => {
    setImageToDelete(image);
  };

  const confirmDelete = () => {
    if (imageToDelete) {
      setImages(images.filter(img => img.id !== imageToDelete.id));
      toast({
        title: "Image Deleted",
        description: `${imageToDelete.name} has been removed.`,
      });
      setImageToDelete(null);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Banners & Brochures</CardTitle>
              <CardDescription>
                View, upload, and manage your academy's promotional materials.
              </CardDescription>
            </div>
            <Button onClick={handleUploadClick}>
              <Upload className="mr-2 h-4 w-4" />
              Upload Files
            </Button>
            <Input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*,application/pdf"
              multiple
            />
          </div>
        </CardHeader>
        <CardContent>
          {images.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map(image => (
                <Card key={image.id} className="overflow-hidden group">
                  <CardContent className="p-0 relative">
                    <Image
                      src={image.src}
                      alt={image.name}
                      width={600}
                      height={400}
                      className="aspect-video w-full h-full object-cover transition-transform group-hover:scale-105"
                      data-ai-hint={image.dataAiHint}
                    />
                  </CardContent>
                  <CardFooter className="p-3 flex flex-col items-start bg-muted/50">
                    <p className="text-sm font-medium truncate w-full" title={image.name}>{image.name}</p>
                    <div className="flex justify-end gap-2 w-full mt-2">
                        <Button variant="outline" size="sm" asChild>
                           <a href={image.src} download={image.name}>
                             <Download className="mr-2 h-4 w-4" /> Download
                           </a>
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(image)}>
                           <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-10 border-2 border-dashed rounded-lg">
                <ImageIcon className="h-16 w-16 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No Files Yet</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                Upload your first banner or brochure to get started.
                </p>
                <Button className="mt-6" onClick={handleUploadClick}>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Files
                </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      <AlertDialog open={!!imageToDelete} onOpenChange={(open) => !open && setImageToDelete(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the file
                "{imageToDelete?.name}".
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setImageToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">
                Delete
            </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
