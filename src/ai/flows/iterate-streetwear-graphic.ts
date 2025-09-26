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
  initialPrompt: z.string().describe('The initial prompt used to generate the streetwear graphic.'),
  feedback: z.string().describe('User feedback on the generated graphic.'),
  previousImage: z.string().describe(
    "The previously generated image as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
  ),
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

const iterateStreetwearGraphicPrompt = ai.definePrompt({
  name: 'iterateStreetwearGraphicPrompt',
  input: {schema: IterateStreetwearGraphicInputSchema},
  output: {schema: IterateStreetwearGraphicOutputSchema},
  prompt: `You are an AI assistant specializing in streetwear graphic design. Based on the user's feedback and the previously generated image, you will refine the graphic to better meet their needs.

  The initial prompt was: {{{initialPrompt}}}
  The user feedback is: {{{feedback}}}
  Previous Image: {{media url=previousImage}}

  Please generate a new image that incorporates the feedback while maintaining the core aesthetic of streetwear design.
  The output refinedImage should be a data URI representing the new image.
  `,
});

const iterateStreetwearGraphicFlow = ai.defineFlow(
  {
    name: 'iterateStreetwearGraphicFlow',
    inputSchema: IterateStreetwearGraphicInputSchema,
    outputSchema: IterateStreetwearGraphicOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.5-flash-image-preview',
      prompt: [
        {media: {url: input.previousImage}},
        {text: `Refine the image based on this feedback: ${input.feedback}`},
      ],
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    return {refinedImage: media.url!};
  }
);
