'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Loader2, Shirt, Sparkles, Plus, Minus, ArrowUp, ArrowDown, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  IconTshirt,
  IconHoodie,
  IconCap,
} from '@/components/product-icons';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';

interface ProductPreviewProps {
  imageUrl: string | null;
  isLoading: boolean;
}

const productTypes = [
  { 
    id: 'tshirt', name: 'T-Shirt', icon: IconTshirt, price: 75,
    colors: [
      { name: 'Black', color: '#000000', mockupId: 'tshirt-mockup-black' },
      { name: 'White', color: '#FFFFFF', mockupId: 'tshirt-mockup-white' },
      { name: 'Gray', color: '#808080', mockupId: 'tshirt-mockup-gray' },
    ],
    position: 'absolute w-[35%] h-[40%] top-[30%]' 
  },
  { 
    id: 'hoodie', name: 'Hoodie', icon: IconHoodie, price: 120,
    colors: [
      { name: 'Black', color: '#000000', mockupId: 'hoodie-mockup-black' },
      { name: 'White', color: '#FFFFFF', mockupId: 'hoodie-mockup-white' },
      { name: 'Gray', color: '#808080', mockupId: 'hoodie-mockup-gray' },
    ],
    position: 'absolute w-[30%] h-[35%] top-[28%]' 
  },
  { 
    id: 'hat', name: 'Hat', icon: IconCap, price: 45,
    colors: [
        { name: 'Black', color: '#000000', mockupId: 'hat-mockup-black' },
        { name: 'White', color: '#FFFFFF', mockupId: 'hat-mockup-white' },
    ],
    position: 'absolute w-[40%] h-[25%] top-[35%]' 
  },
];

export default function ProductPreview({ imageUrl, isLoading }: ProductPreviewProps) {
    const [activeTab, setActiveTab] = useState(productTypes[0].id);
    const [activeColor, setActiveColor] = useState(productTypes[0].colors[0].name);

    const [scale, setScale] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const { toast } = useToast();

    const handleSave = () => {
        toast({
        title: "Design Saved!",
        description: "Your masterpiece has been saved to your dashboard.",
        });
    };

    const activeProduct = productTypes.find(p => p.id === activeTab) || productTypes[0];
    const currentPrice = activeProduct.price;
    const mockupId = activeProduct.colors.find(c => c.name === activeColor)?.mockupId || activeProduct.colors[0].mockupId;

  return (
    <div className="flex h-full flex-col">
      <div className="border-b p-4">
        <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold font-headline tracking-tight">2. Preview &amp; Customize</h2>
            {imageUrl && (
              <Button onClick={handleSave} size="sm">
                <Save className="mr-2" />
                Save Design
              </Button>
            )}
        </div>
        <div className="text-2xl font-bold font-headline mt-2">${currentPrice.toFixed(2)}</div>
      </div>
      <Tabs value={activeTab} onValueChange={
        (value) => {
            setActiveTab(value);
            const product = productTypes.find(p => p.id === value);
            if (product) {
                setActiveColor(product.colors[0].name);
            }
        }
      } className="flex h-full flex-col">
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
        
        <div className="p-4 border-b">
            <div className="flex items-center gap-3 justify-center">
                {activeProduct.colors.map(color => (
                    <button key={color.name} 
                        onClick={() => setActiveColor(color.name)}
                        className={cn("w-8 h-8 rounded-full border-2 transition-transform", activeColor === color.name ? 'border-primary scale-110' : 'border-transparent')}
                        style={{backgroundColor: color.color}}
                        aria-label={`Select ${color.name} color`}
                    />
                ))}
            </div>
        </div>

        <div className="flex-1 p-4 sm:p-8 flex items-center justify-center bg-grid-pattern relative">
            {productTypes.map((product) => {
                const currentProductColor = product.colors.find(c => c.name === activeColor);
                const mockup = PlaceHolderImages.find((img) => img.id === (currentProductColor?.mockupId || product.colors[0].mockupId));

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
                                <div 
                                  className={cn("transition-opacity duration-500", product.position, isLoading ? 'opacity-50' : 'opacity-100')}
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
             {imageUrl && !isLoading && (
              <div className="absolute bottom-4 right-4 bg-card p-2 rounded-lg shadow-lg flex gap-2">
                <Button variant="outline" size="icon" onClick={() => setScale(s => s + 0.1)}><Plus /></Button>
                <Button variant="outline" size="icon" onClick={() => setScale(s => Math.max(0.1, s - 0.1))}><Minus /></Button>
                <Button variant="outline" size="icon" onClick={() => setOffset(o => ({ ...o, y: o.y - 10 }))}><ArrowUp /></Button>
                <Button variant="outline" size="icon" onClick={() => setOffset(o => ({ ...o, y: o.y + 10 }))}><ArrowDown /></Button>
              </div>
            )}
        </div>
      </Tabs>
    </div>
  );
}
