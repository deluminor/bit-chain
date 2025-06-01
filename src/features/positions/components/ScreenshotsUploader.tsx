import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Camera, Info, XCircle } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { PositionFormValues, Screenshot } from '../types/position';

interface ScreenshotsUploaderProps {
  form: UseFormReturn<PositionFormValues>;
}

export function ScreenshotsUploader({ form }: ScreenshotsUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const MAX_SCREENSHOTS = 3;

  const screenshots = form.watch('screenshots') || [];
  const canAddMore = screenshots.length < MAX_SCREENSHOTS;

  // Convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  // Handle file upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      const newScreenshots: Screenshot[] = [];
      const newPreviewImages: string[] = [];

      // Calculate how many more screenshots we can add
      const remainingSlots = MAX_SCREENSHOTS - screenshots.length;
      const filesToProcess = Math.min(remainingSlots, files.length);

      for (let i = 0; i < filesToProcess; i++) {
        const file = files[i];
        if (!file) continue;

        const base64 = await fileToBase64(file);

        newScreenshots.push({
          id: `temp-${Date.now()}-${i}`,
          imageData: base64,
          order: screenshots.length + i,
          createdAt: new Date(),
        });

        newPreviewImages.push(base64);
      }

      // Update form with new screenshots
      form.setValue('screenshots', [...screenshots, ...newScreenshots]);
      setPreviewImages(prev => [...prev, ...newPreviewImages]);

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error converting file to base64:', error);
    }
  };

  // Handle screenshot removal
  const handleRemoveScreenshot = (index: number) => {
    const updatedScreenshots = [...screenshots];
    updatedScreenshots.splice(index, 1);

    // Update order for remaining screenshots
    const reorderedScreenshots = updatedScreenshots.map((screenshot, idx) => ({
      ...screenshot,
      order: idx,
    }));

    form.setValue('screenshots', reorderedScreenshots);
  };

  // Update preview images when screenshots change
  useEffect(() => {
    if (screenshots) {
      const images = screenshots.map(s => s.imageData);
      setPreviewImages(images);
    } else {
      setPreviewImages([]);
    }
  }, [screenshots]);

  return (
    <FormField
      control={form.control}
      name="screenshots"
      render={() => (
        <FormItem className="col-span-2">
          <div className="flex items-center gap-2">
            <FormLabel>Trade Screenshots</FormLabel>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Add up to 3 screenshots of your trade setup</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <FormControl>
            <div className="space-y-4">
              {/* Preview area */}
              {previewImages.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                  {previewImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <div className="relative h-36 w-full overflow-hidden rounded-md border bg-muted/20">
                        <Image
                          src={image}
                          alt={`Screenshot ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all" />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                        onClick={() => handleRemoveScreenshot(index)}
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                      <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md">
                        {index + 1}/{previewImages.length}
                      </div>
                    </div>
                  ))}

                  {/* Empty slots */}
                  {Array.from({ length: MAX_SCREENSHOTS - previewImages.length }).map(
                    (_, index) => (
                      <div
                        key={`empty-${index}`}
                        className="relative h-36 w-full rounded-md border border-dashed border-muted-foreground/30 bg-muted/10 flex items-center justify-center"
                      >
                        <span className="text-muted-foreground text-sm">Empty slot</span>
                      </div>
                    ),
                  )}
                </div>
              )}

              {/* Upload button */}
              <div className="flex justify-between items-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={!canAddMore}
                  className={canAddMore ? '' : 'opacity-50 cursor-not-allowed'}
                >
                  <Camera className="mr-2 h-4 w-4" />
                  {canAddMore
                    ? `Add Screenshot${screenshots.length === 0 ? 's' : ''}`
                    : 'Maximum screenshots reached'}
                </Button>
                <span className="text-sm text-muted-foreground">
                  {screenshots.length}/{MAX_SCREENSHOTS}
                </span>
              </div>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
