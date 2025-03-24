
import React, { useState } from "react";
import { Camera, X, Upload, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface PhotoUploadProps {
  onPhotoUpload: (photo: File) => void;
  onPhotoRemove?: () => void;
  previewUrl?: string;
  className?: string;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({
  onPhotoUpload,
  onPhotoRemove,
  previewUrl,
  className,
}) => {
  const [preview, setPreview] = useState<string | null>(previewUrl || null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if it's an image
    if (!file.type.startsWith("image/")) {
      toast.error("Alleen afbeeldingen zijn toegestaan");
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Afbeelding is te groot (max 5MB)");
      return;
    }

    setIsUploading(true);

    // Create a preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
      setIsUploading(false);
      onPhotoUpload(file);
    };
    reader.readAsDataURL(file);

    // Reset the input value so the same file can be selected again
    e.target.value = "";
  };

  const handleRemove = () => {
    setPreview(null);
    if (onPhotoRemove) {
      onPhotoRemove();
    }
  };

  return (
    <div className={cn("relative", className)}>
      <input
        type="file"
        id="photo-upload"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        capture="environment"
      />

      {preview ? (
        <div className="relative rounded-md overflow-hidden border border-gray-200">
          <img 
            src={preview} 
            alt="Preview" 
            className="w-full h-auto max-h-48 object-cover"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-7 w-7 shadow-md"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <label 
          htmlFor="photo-upload" 
          className="flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-md p-4 hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <Camera className="h-8 w-8 text-muted-foreground mb-2" />
          <span className="text-sm text-muted-foreground">Foto toevoegen</span>
          <span className="text-xs text-muted-foreground mt-1">Klik om een foto te maken of uploaden</span>
        </label>
      )}

      {isUploading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-md">
          <div className="animate-pulse text-white">Uploading...</div>
        </div>
      )}
    </div>
  );
};

export default PhotoUpload;
