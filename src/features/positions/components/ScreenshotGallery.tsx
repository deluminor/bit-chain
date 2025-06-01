import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, ImageIcon, Maximize } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { Screenshot } from '../types/position';

interface ScreenshotGalleryProps {
  screenshots: Screenshot[];
  children: React.ReactNode;
  title?: string;
}

export function ScreenshotGallery({ screenshots, children, title }: ScreenshotGalleryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Sort screenshots by order
  const sortedScreenshots = [...screenshots].sort((a, b) => a.order - b.order);

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % sortedScreenshots.length);
  };

  const handlePrevious = () => {
    setCurrentIndex(prev => (prev - 1 + sortedScreenshots.length) % sortedScreenshots.length);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[80vw] sm:max-h-[80vh] p-0 gap-0">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle>{title || 'Trade Screenshots'}</DialogTitle>
        </DialogHeader>
        <div className="relative flex flex-col items-center justify-center p-4">
          {sortedScreenshots.length > 0 ? (
            <>
              <div className="relative h-[60vh] w-full bg-muted/10 rounded-md overflow-hidden">
                <Image
                  src={sortedScreenshots[currentIndex]?.imageData || ''}
                  alt={`Screenshot ${currentIndex + 1}`}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                  priority
                />

                {/* Navigation controls overlaid on image */}
                {sortedScreenshots.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handlePrevious}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white h-10 w-10 rounded-full opacity-70 hover:opacity-100 transition-opacity"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleNext}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white h-10 w-10 rounded-full opacity-70 hover:opacity-100 transition-opacity"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </Button>
                  </>
                )}

                {/* Image indicator */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                  {currentIndex + 1} / {sortedScreenshots.length}
                </div>
              </div>

              {/* Thumbnails */}
              {sortedScreenshots.length > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  {sortedScreenshots.map((screenshot, index) => (
                    <button
                      key={index}
                      className={`relative h-16 w-16 overflow-hidden rounded-md border-2 transition-all ${
                        index === currentIndex
                          ? 'border-primary opacity-100 scale-105'
                          : 'border-muted opacity-70 hover:opacity-100'
                      }`}
                      onClick={() => setCurrentIndex(index)}
                    >
                      <Image
                        src={screenshot.imageData}
                        alt={`Thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-muted-foreground">
              <ImageIcon className="h-12 w-12 mb-2 opacity-30" />
              <p>No screenshots available</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface ScreenshotThumbnailProps {
  screenshots: Screenshot[];
  className?: string;
}

export function ScreenshotThumbnail({ screenshots, className }: ScreenshotThumbnailProps) {
  if (!screenshots || screenshots.length === 0) return null;

  // Sort screenshots by order and get the first one
  const sortedScreenshots = [...screenshots].sort((a, b) => a.order - b.order);
  const firstScreenshot = sortedScreenshots[0];

  if (!firstScreenshot) return null;

  return (
    <ScreenshotGallery screenshots={screenshots}>
      <Button variant="ghost" size="icon" className={className}>
        <div className="relative h-8 w-8 rounded-full overflow-hidden border shadow-sm">
          <Image
            src={firstScreenshot.imageData}
            alt="Screenshot thumbnail"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors">
            <Maximize className="h-4 w-4 text-white" />
          </div>
        </div>
      </Button>
    </ScreenshotGallery>
  );
}
