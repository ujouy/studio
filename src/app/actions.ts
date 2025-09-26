// src/app/actions.ts
'use server';

import { z } from 'zod';
import { generateStreetwearGraphic } from '@/ai/flows/generate-streetwear-graphic';
import { iterateStreetwearGraphic } from '@/ai/flows/iterate-streetwear-graphic';

const generateSchema = z.object({
  prompt: z.string().min(3, { message: 'Prompt must be at least 3 characters long.' }),
});

const iterateSchema = z.object({
  prompt: z.string(),
  feedback: z.string().min(3, { message: 'Feedback must be at least 3 characters long.' }),
  previousImage: z.string(),
});

type FormState = {
  image: string | null;
  error: string | null;
  prompt: string | null;
};

export async function handleGenerate(prevState: FormState, formData: FormData): Promise<FormState> {
  const validatedFields = generateSchema.safeParse({
    prompt: formData.get('prompt'),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors.prompt?.[0] ?? 'Invalid prompt.',
      image: null,
      prompt: null,
    };
  }

  try {
    const result = await generateStreetwearGraphic({ description: validatedFields.data.prompt });
    return { image: result.graphicDataUri, error: null, prompt: validatedFields.data.prompt };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return {
      error: `Failed to generate graphic: ${errorMessage}`,
      image: null,
      prompt: validatedFields.data.prompt,
    };
  }
}

export async function handleIterate(prevState: FormState, formData: FormData): Promise<FormState> {
  const validatedFields = iterateSchema.safeParse({
    prompt: formData.get('prompt'),
    feedback: formData.get('feedback'),
    previousImage: formData.get('previousImage'),
  });

  const currentImage = formData.get('previousImage') as string | null;
  const currentPrompt = formData.get('prompt') as string | null;

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors.feedback?.[0] ?? 'Invalid feedback.',
      image: currentImage,
      prompt: currentPrompt,
    };
  }

  if (!validatedFields.data.previousImage) {
    return { error: 'No previous image found to iterate on.', image: null, prompt: currentPrompt };
  }
  
  if (!validatedFields.data.prompt) {
     return { error: 'Original prompt is missing.', image: currentImage, prompt: null };
  }

  try {
    const result = await iterateStreetwearGraphic({
      initialPrompt: validatedFields.data.prompt,
      feedback: validatedFields.data.feedback,
      previousImage: validatedFields.data.previousImage,
    });
    return { image: result.refinedImage, error: null, prompt: currentPrompt };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return {
      error: `Failed to refine graphic: ${errorMessage}`,
      image: currentImage,
      prompt: currentPrompt,
    };
  }
}
