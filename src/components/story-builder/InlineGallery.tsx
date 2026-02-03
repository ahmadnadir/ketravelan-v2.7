import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { InlineMedia, InlineMediaImage } from "@/hooks/useStoryDrafts";

interface InlineGalleryProps {
  media: InlineMedia;
  onUpdateImage: (index: number, updates: Partial<InlineMediaImage>) => void;
  onRemove: () => void;
}

export function InlineGallery({ media, onUpdateImage, onRemove }: InlineGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const images = media.images;
  const currentImage = images[currentIndex];

  if (!currentImage) return null;

  const goToPrev = () => {
    setCurrentIndex(currentIndex > 0 ? currentIndex - 1 : images.length - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex < images.length - 1 ? currentIndex + 1 : 0);
  };

  return (
    <div className="relative my-8 group">
      {/* Gallery container - borderless, editorial */}
      <div className="relative">
        <img
          src={currentImage.url}
          alt={currentImage.caption || `Gallery image ${currentIndex + 1}`}
          className="w-full h-auto object-cover"
        />
        
        {/* Remove button */}
        <button
          onClick={onRemove}
          className="absolute top-3 right-3 p-1.5 bg-black/50 hover:bg-black/70 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Navigation arrows - minimal style */}
        {images.length > 1 && (
          <>
            <button
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={goToPrev}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={goToNext}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Dots indicator - minimal */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-1.5 rounded-full transition-all ${
                  index === currentIndex
                    ? "w-5 bg-white"
                    : "w-1.5 bg-white/60"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Caption - always visible */}
      <input
        type="text"
        value={currentImage.caption || ""}
        onChange={(e) => onUpdateImage(currentIndex, { caption: e.target.value })}
        placeholder="Add a caption..."
        className="w-full mt-2 text-sm text-muted-foreground text-center bg-transparent border-none outline-none placeholder:text-muted-foreground/50 italic"
      />

      {/* Image count - subtle */}
      <div className="absolute top-3 left-3 px-2 py-0.5 bg-black/50 rounded-full text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
}
