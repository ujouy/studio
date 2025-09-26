'use client';

import Image from 'next/image';
import { productTypes, ProductId, ProductColor } from '@/lib/product-types';
import { Loader2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductPreviewProps {
  imageUrl: string | null;
  isLoading: boolean;
  activeProduct: ProductId;
  activeColor: ProductColor;
  scale: number;
  offset: { x: number; y: number };
}

export default function ProductPreview({ 
  imageUrl, 
  isLoading, 
  activeProduct,
  activeColor,
  scale,
  offset
}: ProductPreviewProps) {
  
  const productInfo = productTypes.find(p => p.id === activeProduct);
  const variant = productInfo?.colors.find(c => c.name === activeColor);

  if (!productInfo || !variant) {
    // Fallback or error state
    return <div className="flex-1 flex items-center justify-center bg-grid-pattern">Error: Product or color not found.</div>;
  }
  
  const { mockupUrl, printArea } = variant;
  
  return (
    <div className="flex-1 p-4 sm:p-8 flex items-center justify-center bg-grid-pattern relative overflow-hidden">
      <div className="relative w-full max-w-lg aspect-square">
        {/* Layer 1: Base Mockup */}
        <Image
            key={mockupUrl} // Force re-render on change
            src={mockupUrl}
            alt={`${productInfo.name} in ${variant.name}`}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
        />
        
        {/* Layer 2: Design and Placeholders */}
        <div 
          className="absolute flex items-center justify-center"
          style={{
            top: printArea.top,
            left: printArea.left,
            width: printArea.width,
            height: printArea.height,
          }}
        >
          {isLoading && (
             <div className="absolute inset-0 flex items-center justify-center rounded-lg transition-all duration-300">
                <div className="w-1/2 h-1/2 bg-background/50 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
              </div>
          )}

          {imageUrl && !isLoading ? (
            <div 
              className={cn("w-full h-full transition-opacity duration-500", isLoading ? 'opacity-50' : 'opacity-100')}
              style={{
                transform: `scale(${scale}) translate(${offset.x}px, ${offset.y}px)`
              }}
            >
              <Image
                src={imageUrl}
                alt="Generated AI Graphic"
                fill
                className="object-contain"
                sizes="35vw"
              />
            </div>
          ) : !isLoading && (
              <div className="w-full h-full border-2 border-dashed border-muted-foreground/50 rounded-lg flex flex-col items-center justify-center animate-pulse">
                <Sparkles className="h-8 w-8 text-muted-foreground/50 mb-2" />
              </div>
          )}
        </div>
      </div>
    </div>
  );
}
