'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CarWashList } from '@/components/car-wash-list';
import { SmartScheduler } from '@/components/smart-scheduler';
import { List, BrainCircuit, Map as MapIcon } from 'lucide-react';
import { MapView } from './map-view';
import { useEffect, useState, useMemo } from 'react';
import { CarWash } from '@/lib/types';
import { useLanguage } from '@/context/language-context';
import { useFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { useCollection, useMemoFirebase } from '@/firebase';
import { Skeleton } from './ui/skeleton';

const translations = {
  en: {
    nearbyWashes: 'Nearby Washes',
    mapView: 'Map View',
    smartScheduler: 'Smart Scheduler',
  },
  pt: {
    nearbyWashes: 'Lava-rápidos Próximos',
    mapView: 'Mapa',
    smartScheduler: 'Agendador Inteligente',
  },
};

function getDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return Infinity;
  const R = 6371; // Radius of the earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

function CarWashListSkeleton() {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="flex flex-col space-y-3">
                    <Skeleton className="h-[192px] w-full rounded-xl" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                </div>
            ))}
        </div>
    )
}

export function ClientDashboard() {
  const { language } = useLanguage();
  const t = translations[language];

  const { firestore } = useFirebase();
  const carWashesQuery = useMemoFirebase(() => firestore ? collection(firestore, 'carWashes') : null, [firestore]);
  const { data: carWashesData, isLoading, error: firestoreError } = useCollection<CarWash>(carWashesQuery);

  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLocationError(null);
        },
        (err) => {
          setLocationError(`Error: ${err.message}`);
        }
      );
    } else {
      setLocationError('Geolocation is not supported by this browser.');
    }
  }, []);

  const sortedCarWashes = useMemo(() => {
    if (!carWashesData) return [];
    if (location) {
      return [...carWashesData].sort((a, b) => {
        const distA = getDistance(
          location.latitude,
          location.longitude,
          a.coordinates.lat,
          a.coordinates.lng
        );
        const distB = getDistance(
          location.latitude,
          location.longitude,
          b.coordinates.lat,
          b.coordinates.lng
        );
        return distA - distB;
      });
    }
    return carWashesData;
  }, [location, carWashesData]);

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8">
      <div className="mx-auto w-full max-w-7xl">
        {(locationError || firestoreError) && (
          <p className="mb-4 text-center text-red-500">{locationError || firestoreError?.message}</p>
        )}
        <Tabs defaultValue="nearby">
          <TabsList className="grid w-full grid-cols-3 md:w-[600px]">
            <TabsTrigger value="nearby">
              <List className="mr-2" />
              {t.nearbyWashes}
            </TabsTrigger>
            <TabsTrigger value="map">
              <MapIcon className="mr-2" />
              {t.mapView}
            </TabsTrigger>
            <TabsTrigger value="scheduler">
              <BrainCircuit className="mr-2" />
              {t.smartScheduler}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="nearby" className="mt-6">
            {isLoading ? <CarWashListSkeleton /> : <CarWashList carWashes={sortedCarWashes} location={location} />}
          </TabsContent>
          <TabsContent value="map" className="mt-6">
            <MapView carWashes={sortedCarWashes} userLocation={location} />
          </TabsContent>
          <TabsContent value="scheduler" className="mt-6">
            <SmartScheduler />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
