'use client';

import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Loader2, Shirt } from 'lucide-react';

interface ProductPreviewProps {
  imageUrl: string | null;
  isLoading: boolean;
}

const productTypes = [
  { id: 'tshirt', name: 'T-Shirt', mockupId: 'tshirt-mockup' },
  { id: 'hoodie', name: 'Hoodie', mockupId: 'hoodie-mockup' },
  { id: 'hat', name: 'Hat', mockupId: 'hat-mockup' },
];

export default function ProductPreview({ imageUrl, isLoading }: ProductPreviewProps) {
  return (
    <div className="flex h-full flex-col">
      <Tabs defaultValue="tshirt" className="flex h-full flex-col">
        <div className="flex items-center justify-center p-4 border-b">
          <TabsList>
            {productTypes.map((product) => (
              <TabsTrigger key={product.id} value={product.id}>
                {product.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        <div className="flex-1 p-4 sm:p-8 flex items-center justify-center">
            {productTypes.map((product) => {
                const mockup = PlaceHolderImages.find((img) => img.id === product.mockupId);
                if (!mockup) return null;

                return (
                    <TabsContent key={product.id} value={product.id} className="w-full max-w-lg aspect-square m-0">
                         <div className="relative w-full h-full flex items-center justify-center">
                            <Image
                                src={mockup.imageUrl}
                                alt={mockup.description}
                                fill
                                className="object-contain"
                                data-ai-hint={mockup.imageHint}
                            />
                            {imageUrl && (
                                <div className="absolute w-[35%] h-[40%] top-[25%]">
                                <Image
                                    src={imageUrl}
                                    alt="Generated AI Graphic"
                                    fill
                                    className="object-contain"
                                />
                                </div>
                            )}
                            {isLoading && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                                </div>
                            )}
                            {!imageUrl && !isLoading && (
                                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center rounded-lg text-center p-4">
                                <Shirt className="h-12 w-12 text-muted-foreground mb-2" />
                                <p className="text-muted-foreground">Your generated design will appear here</p>
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
