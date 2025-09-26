'use client';

import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Loader2, Shirt, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  IconTshirt,
  IconHoodie,
  IconCap,
} from '@/components/product-icons';

interface ProductPreviewProps {
  imageUrl: string | null;
  isLoading: boolean;
}

const productTypes = [
  { id: 'tshirt', name: 'T-Shirt', mockupId: 'tshirt-mockup', icon: IconTshirt, position: 'absolute w-[35%] h-[40%] top-[30%]' },
  { id: 'hoodie', name: 'Hoodie', mockupId: 'hoodie-mockup', icon: IconHoodie, position: 'absolute w-[30%] h-[35%] top-[28%]' },
  { id: 'hat', name: 'Hat', mockupId: 'hat-mockup', icon: IconCap, position: 'absolute w-[40%] h-[25%] top-[35%]' },
];

export default function ProductPreview({ imageUrl, isLoading }: ProductPreviewProps) {
  return (
    <div className="flex h-full flex-col">
      <Tabs defaultValue="tshirt" className="flex h-full flex-col">
        <div className="flex items-center justify-center p-4 border-b">
          <TabsList className="grid grid-cols-3 gap-2 bg-transparent p-0">
            {productTypes.map((product) => (
              <TabsTrigger key={product.id} value={product.id} className="text-xs sm:text-sm data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none">
                 <product.icon className="w-5 h-5 mr-2" />
                {product.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        <div className="flex-1 p-4 sm:p-8 flex items-center justify-center bg-grid-pattern">
            {productTypes.map((product) => {
                const mockup = PlaceHolderImages.find((img) => img.id === product.mockupId);
                if (!mockup) return null;

                return (
                    <TabsContent key={product.id} value={product.id} className="w-full max-w-lg aspect-square m-0 transition-opacity duration-300">
                         <div className="relative w-full h-full flex items-center justify-center">
                           <div className="absolute inset-0 transition-opacity duration-300"
                                key={mockup.imageUrl}
                            >
                                <Image
                                    src={mockup.imageUrl}
                                    alt={mockup.description}
                                    fill
                                    className="object-contain"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    data-ai-hint={mockup.imageHint}
                                    priority
                                />
                            </div>

                            {imageUrl && (
                                <div className={cn("transition-opacity duration-500", product.position, isLoading ? 'opacity-50' : 'opacity-100')}>
                                <Image
                                    src={imageUrl}
                                    alt="Generated AI Graphic"
                                    fill
                                    className="object-contain"
                                    sizes="35vw"
                                />
                                </div>
                            )}
                            
                            {isLoading && (
                                <div className="absolute inset-0 flex items-center justify-center rounded-lg transition-all duration-300">
                                  <div className="w-1/2 h-1/2 bg-background/50 backdrop-blur-sm rounded-lg flex items-center justify-center">
                                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                                  </div>
                                </div>
                            )}

                            {!imageUrl && !isLoading && (
                                <div className="absolute w-[35%] h-[40%] top-[30%] border-2 border-dashed border-muted-foreground/50 rounded-lg flex flex-col items-center justify-center animate-pulse">
                                  <Sparkles className="h-8 w-8 text-muted-foreground/50 mb-2" />
                                </div>
                            )}
                        </div>
                    </TabsContent>
                );
            })}
        </div>
      </Tabs>
    </div>
  );
}
