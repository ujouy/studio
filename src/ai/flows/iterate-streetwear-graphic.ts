// src/ai/flows/iterate-streetwear-graphic.ts
'use server';

/**
 * @fileOverview Iteratively improves a streetwear graphic design based on user feedback.
 *
 * - iterateStreetwearGraphic - A function that handles the iterative graphic design process.
 * - IterateStreetwearGraphicInput - The input type for the iterateStreetwearGraphic function.
 * - IterateStreetwearGraphicOutput - The return type for the iterateStreetwearGraphic function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IterateStreetwearGraphicInputSchema = z.object({
  feedback: z.string().describe('User feedback on the generated graphic.'),
  previousImage: z.string().describe(
    "The previously generated image as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
  ),
   negativePrompt: z
    .string()
    .optional()
    .describe('A description of what to avoid in the refined graphic.'),
});
export type IterateStreetwearGraphicInput = z.infer<typeof IterateStreetwearGraphicInputSchema>;

const IterateStreetwearGraphicOutputSchema = z.object({
  refinedImage: z.string().describe(
    "The refined streetwear graphic as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
  ),
});
export type IterateStreetwearGraphicOutput = z.infer<typeof IterateStreetwearGraphicOutputSchema>;

export async function iterateStreetwearGraphic(input: IterateStreetwearGraphicInput): Promise<IterateStreetwearGraphicOutput> {
  return iterateStreetwearGraphicFlow(input);
}

const iterateStreetwearGraphicFlow = ai.defineFlow(
  {
    name: 'iterateStreetwearGraphicFlow',
    inputSchema: IterateStreetwearGraphicInputSchema,
    outputSchema: IterateStreetwearGraphicOutputSchema,
  },
  async input => {
    // Step 1: Use Gemini to describe a new image based on feedback (Describe)
    const { text: newDescription } = await ai.generate([
      {
        text: `Task: You are a creative assistant for a streetwear brand. Your goal is to create a new, detailed prompt for an image generation model based on user feedback on a previous design.\n\nReference Image Guidance: Analyze the provided image for its style, composition, and subject matter.\nUser's Creative Feedback: "${input.feedback}"\n\nYour task is to synthesize this feedback with the essence of the original image to generate a NEW, stand-alone prompt that will create a refined graphic. The new prompt should be descriptive and detailed enough for a text-to-image model to create a great result. Do not mention the previous image in your output prompt.`
      },
      { media: { url: input.previousImage } }
    ]);

    if (!newDescription) {
        throw new Error('Could not generate a new description based on feedback.');
    }
    
    // Step 2: Use the new description to generate an image with Imagen (Generate)
    const {media} = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: newDescription,
      config: {
        negativePrompt: input.negativePrompt,
      },
    });

    if (!media) {
      throw new Error('No image was generated during the refinement process.');
    }

    return {refinedImage: media.url!};
  }
);
