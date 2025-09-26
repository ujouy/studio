
'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';

// Dummy data for saved designs
const savedDesigns = [
    {
      "id": "saved-design-1",
      "description": "An abstract graphic with vibrant colors.",
      "imageUrl": "/mockups/gallery/abstract.png",
      "imageHint": "abstract graphic"
    },
    {
      "id": "saved-design-2",
      "description": "A graffiti-style street art design.",
      "imageUrl": "/mockups/gallery/street.png",
      "imageHint": "street art"
    },
    {
      "id": "saved-design-3",
      "description": "A detailed skull design with intricate patterns.",
      "imageUrl": "/mockups/gallery/skull.png",
      "imageHint": "skull design"
    },
    {
      "id": "saved-design-4",
      "description": "A futuristic cyberpunk art piece.",
      "imageUrl": "/mockups/gallery/cyberpunk.png",
      "imageHint": "cyberpunk art"
    },
    {
      "id": "saved-design-5",
      "description": "A surreal fantasy landscape.",
      "imageUrl": "/mockups/gallery/fantasy.png",
      "imageHint": "fantasy landscape"
    },
    {
      "id": "saved-design-6",
      "description": "A classic Japanese wave illustration.",
      "imageUrl": "/mockups/gallery/wave.png",
      "imageHint": "japanese wave"
    }
  ];


export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="container py-8">
        <div className="mb-8">
          <Skeleton className="h-10 w-48" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="aspect-square w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold font-headline">My Designs</h1>
        <p className="text-muted-foreground">Your collection of generated graphics.</p>
      </div>

      {savedDesigns.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {savedDesigns.map((design) => (
            <Card key={design.id} className="overflow-hidden transition-transform hover:scale-105">
              <CardContent className="p-0">
                <div className="aspect-square relative">
                  <Image
                    src={design.imageUrl}
                    alt={design.description}
                    fill
                    className="object-cover"
                    data-ai-hint={design.imageHint}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-dashed border-2 rounded-lg">
          <p className="text-muted-foreground">You haven&apos;t saved any designs yet.</p>
        </div>
      )}
    </div>
  );
}
