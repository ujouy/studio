'use client';

import { useEffect, useRef, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { handleGenerate, handleIterate } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarInset,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, Sparkles, Wand2 } from 'lucide-react';
import ProductPreview from './product-preview';
import Logo from './logo';

function SubmitButton({ children, icon: Icon }: { children: React.ReactNode; icon: React.ElementType }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <Loader2 className="animate-spin" />
      ) : (
        <Icon />
      )}
      {children}
    </Button>
  );
}

export default function GraphicGenerator() {
  const { toast } = useToast();

  const initialState = { image: null, error: null, prompt: null };
  const [generateState, generateAction] = useActionState(handleGenerate, initialState);
  const [iterateState, iterateAction] = useActionState(handleIterate, initialState);

  const formRef = useRef<HTMLFormElement>(null);
  const iterationFormRef = useRef<HTMLFormElement>(null);

  const currentState = generateState.image || iterateState.image ? iterateState : generateState;

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
  
  const { pending: isGenerating } = useFormStatus();
  const { pending: isIterating } = useFormStatus();
  const isLoading = isGenerating || isIterating;

  return (
    <div className="grid h-full w-full flex-1 grid-cols-1 lg:grid-cols-[380px_1fr]">
        <div className="flex flex-col border-r bg-sidebar p-4">
            <div className="mb-6 flex items-center gap-2">
              <Logo className="size-8 text-primary" />
              <h1 className="font-headline text-2xl font-semibold">Streetwear AI</h1>
            </div>

            <div className="flex flex-col gap-6 overflow-y-auto">
              <form action={generateAction} ref={formRef} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="prompt">1. Describe your design</Label>
                  <Textarea
                    id="prompt"
                    name="prompt"
                    placeholder="e.g., A minimalist skull wearing a crown, vintage comic book style"
                    rows={4}
                    required
                    className="h-24"
                  />
                </div>
                <SubmitButton icon={Sparkles}>Generate</SubmitButton>
              </form>

              {currentState.image && (
                <div className="space-y-4 border-t pt-6">
                  <form action={iterateAction} ref={iterationFormRef} className="space-y-4">
                    <input type="hidden" name="previousImage" value={currentState.image ?? ''} />
                    <input type="hidden" name="prompt" value={currentState.prompt ?? ''} />
                    <div className="space-y-2">
                      <Label htmlFor="feedback">2. Refine your design</Label>
                      <Textarea
                        id="feedback"
                        name="feedback"
                        placeholder="e.g., Make the crown bigger, add more vibrant colors"
                        rows={4}
                        required
                        className="h-24"
                      />
                    </div>
                    <SubmitButton icon={Wand2}>Refine</SubmitButton>
                  </form>
                </div>
              )}
            </div>
        </div>

        <div className="flex flex-col bg-background">
            <ProductPreview imageUrl={currentState.image} isLoading={isLoading} />
        </div>
    </div>
  );
}
