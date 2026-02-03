import { useState } from "react";
import { X, ChevronLeft, ChevronRight, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { InlineMedia, InlineMediaImage } from "@/hooks/useStoryDraft";

interface InlineGalleryProps {
  media: InlineMedia;
  onUpdateImage: (index: number, updates: Partial<InlineMediaImage>) => void;
  onRemove: () => void;
}

export function InlineGallery({ media, onUpdateImage, onRemove }: InlineGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCaption, setShowCaption] = useState(false);
  
  const images = media.images;
  const currentImage = images[currentIndex];

  if (!currentImage) return null;

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    setShowCaption(!!images[currentIndex > 0 ? currentIndex - 1 : images.length - 1]?.caption);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    setShowCaption(!!images[currentIndex < images.length - 1 ? currentIndex + 1 : 0]?.caption);
  };

  return (
    <div className="relative my-4 group">
      {/* Gallery container */}
      <div className="relative rounded-xl overflow-hidden">
        <img
          src={currentImage.url}
          alt={currentImage.caption || `Gallery image ${currentIndex + 1}`}
          className="w-full h-auto object-cover max-h-80"
        />
        
        {/* Remove button */}
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="sm"
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 h-8 w-8 bg-black/40 hover:bg-black/60 text-white rounded-full"
              onClick={goToPrev}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 h-8 w-8 bg-black/40 hover:bg-black/60 text-white rounded-full"
              onClick={goToNext}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        {/* Dots indicator */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-1.5 rounded-full transition-all ${
                  index === currentIndex
                    ? "w-4 bg-white"
                    : "w-1.5 bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Caption area */}
      {showCaption ? (
        <div className="mt-2">
          <Input
            value={currentImage.caption || ""}
            onChange={(e) => onUpdateImage(currentIndex, { caption: e.target.value })}
            placeholder={`Caption for image ${currentIndex + 1}...`}
            className="text-sm border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 bg-transparent"
          />
        </div>
      ) : (
        <button
          onClick={() => setShowCaption(true)}
          className="flex items-center gap-1.5 mt-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <MessageSquare className="h-3.5 w-3.5" />
          <span>Add caption</span>
        </button>
      )}

      {/* Image count badge */}
      <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 rounded-full text-white text-xs">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
}
