'use client';
import { CarWash } from '@/lib/types';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, Star, Navigation } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';
import Link from 'next/link';
import { RatingStars } from './rating-stars';

function getDistanceInKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

export function CarWashList({
  carWashes,
  location,
}: {
  carWashes: CarWash[];
  location: { latitude: number; longitude: number } | null;
}) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {carWashes.map((wash) => (
        <CarWashCard key={wash.id} wash={wash} location={location} />
      ))}
    </div>
  );
}

function CarWashCard({
  wash,
  location,
}: {
  wash: CarWash;
  location: { latitude: number; longitude: number } | null;
}) {
  const distance = useMemo(() => {
    if (location && wash.coordinates) {
      return getDistanceInKm(
        location.latitude,
        location.longitude,
        wash.coordinates.lat,
        wash.coordinates.lng
      );
    }
    return null;
  }, [location, wash.coordinates]);

  const imageUrl = wash.images?.[0] || 'https://picsum.photos/seed/carwash/600/400';

  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
      <div className="relative h-48 w-full">
        <Image
          src={imageUrl}
          alt={`Image of ${wash.name}`}
          fill
          className="object-cover"
        />
        <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-card/80 px-2 py-1 text-xs font-medium backdrop-blur-sm">
          <div
            className={cn(
              'h-2 w-2 rounded-full',
              wash.isOpen ? 'bg-[hsl(var(--chart-2))]' : 'bg-destructive'
            )}
          />
          <span>{wash.isOpen ? 'Aberto' : 'Fechado'}</span>
        </div>
      </div>
      <CardHeader>
        <CardTitle>{wash.name}</CardTitle>
        <CardDescription className="flex items-center gap-2 pt-1">
          <MapPin className="h-4 w-4 flex-shrink-0" />{' '}
          <span>{wash.address}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div className="flex justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <RatingStars rating={wash.rating} />
            <span className="ml-1">({wash.reviewCount} reviews)</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>~{wash.waitTime} min espera</span>
          </div>
        </div>
        {distance !== null && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Navigation className="h-4 w-4" />
            <span>{distance.toFixed(1)} km de distância</span>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button className="w-full" variant="outline" asChild>
          <Link href={`/carwash/${wash.id}`}>Ver Detalhes</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
