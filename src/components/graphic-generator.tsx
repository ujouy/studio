'use client';

import { useEffect, useRef, useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { handleGenerate, handleIterate } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, Sparkles, Wand2 } from 'lucide-react';
import ProductPreview from './product-preview';
import Logo from './logo';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

function SubmitButton({ children, icon: Icon, formAction }: { children: React.ReactNode; icon: React.ElementType; formAction: (formData: FormData) => void; }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full" formAction={formAction}>
      {pending ? (
        <Loader2 className="animate-spin" />
      ) : (
        <Icon />
      )}
      {children}
    </Button>
  );
}

const styleModifiers = [
    { name: 'Vintage Comic', description: 'Classic comic book art style.' },
    { name: 'Minimalist Line Art', description: 'Clean, simple lines.' },
    { name: 'Photorealistic', description: 'Hyper-realistic imagery.' },
    { name: 'Chrome Effect', description: 'Shiny, metallic surfaces.' },
    { name: 'Glitch', description: 'Digital distortion effects.' },
    { name: 'Bauhaus', description: 'Geometric shapes and primary colors.' },
    { name: 'Psychedelic', description: 'Vibrant, swirling patterns.' },
    { name: 'Brutalist', description: 'Raw, blocky, and monolithic.' },
];

export default function GraphicGenerator() {
  const { toast } = useToast();
  const [prompt, setPrompt] = useState('');
  const [selectedModifiers, setSelectedModifiers] = useState<string[]>([]);
  const [showNegativePrompt, setShowNegativePrompt] = useState(false);
  
  const handleModifierClick = (modifier: string) => {
    setSelectedModifiers(prev =>
      prev.includes(modifier)
        ? prev.filter(m => m !== modifier)
        : [...prev, modifier]
    );
  };
  
  const getFullPrompt = () => {
    return [prompt, ...selectedModifiers].filter(Boolean).join(', ');
  };
  
  const initialState = { image: null, error: null, prompt: null };
  const [generateState, generateAction, isGenerating] = useActionState(handleGenerate, initialState);
  const [iterateState, iterateAction, isIterating] = useActionState(handleIterate, initialState);

  const formRef = useRef<HTMLFormElement>(null);
  const iterationFormRef = useRef<HTMLFormElement>(null);

  const currentState = generateState.image || iterateState.image ? iterateState : generateState;
  const isLoading = isGenerating || isIterating;

  useEffect(() => {
    if (generateState.error) {
      toast({ variant: 'destructive', title: 'Generation Failed', description: generateState.error });
    }
  }, [generateState.error, toast]);

  useEffect(() => {
    if (iterateState.error) {
      toast({ variant: 'destructive', title: 'Iteration Failed', description: iterateState.error });
    }
  }, [iterateState.error, toast]);

  return (
    <div className="grid h-full w-full flex-1 grid-cols-1 lg:grid-cols-[380px_1fr]">
      <TooltipProvider>
        <div className="flex flex-col border-r bg-sidebar p-4">
            <div className="mb-6 flex items-center gap-2">
              <Logo className="size-8 text-primary" />
              <h1 className="font-headline text-2xl font-semibold">Streetwear AI</h1>
            </div>

            <div className="flex flex-col gap-6 overflow-y-auto">
                <form ref={formRef} action={(formData) => {
                    formData.set('prompt', getFullPrompt());
                    generateAction(formData);
                }} className="space-y-4">
                  <div className="space-y-3">
                    <Label htmlFor="prompt" className="text-lg font-semibold font-headline tracking-tight">1. Describe your design</Label>
                    <Textarea
                      id="prompt"
                      name="prompt-base"
                      placeholder="e.g., A chrome wolf howling at a glitch art moon"
                      rows={4}
                      required
                      className="h-24 resize-none border-0 border-b-2 rounded-none focus-visible:ring-0 px-0"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                    />
                     <input type="hidden" name="prompt" value={getFullPrompt()} />
                  </div>
                   <div className="space-y-3">
                    <button type="button" onClick={() => setShowNegativePrompt(!showNegativePrompt)} className="text-sm text-muted-foreground hover:text-foreground">
                      + Add negative prompt
                    </button>
                    {showNegativePrompt && (
                       <Textarea
                          id="negativePrompt"
                          name="negativePrompt"
                          placeholder="e.g., text, blurry, extra limbs"
                          rows={2}
                          className="resize-none"
                        />
                    )}
                  </div>
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Style Modifiers</Label>
                    <div className="flex flex-wrap gap-2">
                        {styleModifiers.map(modifier => (
                          <Tooltip key={modifier.name} delayDuration={100}>
                            <TooltipTrigger asChild>
                                <Badge 
                                    variant={selectedModifiers.includes(modifier.name) ? 'default' : 'secondary'} 
                                    className="cursor-pointer"
                                    onClick={() => handleModifierClick(modifier.name)}
                                >
                                    {modifier.name}
                                </Badge>
                            </TooltipTrigger>
                             <TooltipContent>
                               <p>{modifier.description}</p>
                             </TooltipContent>
                          </Tooltip>
                        ))}
                    </div>
                  </div>
                  <SubmitButton icon={Sparkles} formAction={(formData) => {
                    formData.set('prompt', getFullPrompt());
                    generateAction(formData);
                }}>Create</SubmitButton>
                </form>

              {currentState.image && (
                <div className="space-y-4 border-t pt-6">
                    <form ref={iterationFormRef} className="space-y-4" action={iterateAction}>
                      <input type="hidden" name="previousImage" value={currentState.image ?? ''} />
                      <input type="hidden" name="prompt" value={currentState.prompt ?? ''} />
                       {showNegativePrompt && (
                        <input type="hidden" name="negativePrompt" value={formRef.current?.negativePrompt.value ?? ''} />
                      )}
                      <div className="space-y-2">
                        <Label htmlFor="feedback" className="text-lg font-semibold font-headline tracking-tight">2. Refine your design</Label>
                        <Textarea
                          id="feedback"
                          name="feedback"
                          placeholder="e.g., Make the wolf larger, add neon blue accents"
                          rows={4}
                          required
                          className="h-24 resize-none"
                        />
                      </div>
                      <SubmitButton icon={Wand2} formAction={iterateAction}>Refine</SubmitButton>
                    </form>
                </div>
              )}
            </div>
        </div>
      </TooltipProvider>

        <div className="flex flex-col bg-background">
            <ProductPreview imageUrl={currentState.image} isLoading={isLoading} />
        </div>
    </div>
  );
}
