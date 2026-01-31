'use client';

import { useDoc, useCollection, useFirebase, useMemoFirebase } from '@/firebase';
import { CarWash, Review, CarWashService } from '@/lib/types';
import { doc, collection, query, orderBy } from 'firebase/firestore';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Clock, MapPin, Star, Sun, Tag, Users, Wallet } from 'lucide-react';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { RatingStars } from './rating-stars';
import Link from 'next/link';

export default function CarWashDetails({ carWashId }: { carWashId: string }) {
  const { firestore } = useFirebase();
   const carWashRef = useMemoFirebase(() => firestore ? doc(firestore, 'car_washes', carWashId) : null, [firestore, carWashId]);
  const { data: carWash, isLoading: isLoadingCarWash } = useDoc<CarWash>(carWashRef);
  
   const reviewsQuery = useMemoFirebase(
    () => firestore ? query(collection(firestore, 'car_washes', carWashId, 'reviews'), orderBy('createdAt', 'desc')) : null,
    [firestore, carWashId]
  );
  const { data: reviews, isLoading: isLoadingReviews } = useCollection<Review>(reviewsQuery);

  if (isLoadingCarWash) {
    return <div>Loading...</div>; // Replace with Skeleton
  }

  if (!carWash) {
    return <div className="text-center p-8">Car wash not found.</div>;
  }

  return (
    <div className="container mx-auto max-w-6xl p-4 md:p-8">
       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
                <Card className="overflow-hidden mb-8">
                    <div className="relative h-64 md:h-96 w-full">
                         <Image src={carWash.images?.[0] || '/placeholder.png'} alt={carWash.name} layout="fill" objectFit="cover" />
                    </div>
                     <CardHeader>
                        <CardTitle className="text-3xl font-bold">{carWash.name}</CardTitle>
                        <CardDescription className="flex items-center gap-2 pt-2">
                           <MapPin className="h-4 w-4" /> {carWash.address}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                             <div className="flex items-center gap-1">
                                <RatingStars rating={carWash.rating} />
                                <span className="ml-1 font-semibold">{carWash.rating.toFixed(1)}</span>
                                <span>({carWash.reviewCount} reviews)</span>
                            </div>
                            <Separator orientation="vertical" className="h-4" />
                             <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" /> 
                                <span>~{carWash.waitTime} min wait</span>
                            </div>
                        </div>
                        <p className="text-foreground/90">{carWash.description}</p>
                    </CardContent>
                </Card>
                
                 <Card>
                    <CardHeader>
                        <CardTitle>Avaliações de Clientes</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {isLoadingReviews && <p>Loading reviews...</p>}
                        {reviews && reviews.length > 0 ? reviews.map(review => (
                            <div key={review.id} className="flex gap-4">
                                <div className="mt-1">
                                    <Avatar className="h-10 w-10">
                                        <AvatarFallback>{review.clientName?.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center">
                                        <p className="font-semibold">{review.clientName}</p>
                                        <RatingStars rating={review.rating} />
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1">{review.comment}</p>
                                    <p className="text-xs text-muted-foreground mt-2">{new Date(review.createdAt.seconds * 1000).toLocaleDateString()}</p>
                                </div>
                            </div>
                        )) : <p>Nenhuma avaliação ainda.</p>}
                    </CardContent>
                </Card>

            </div>
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Agendar Serviço</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <div className="flex items-center justify-between font-semibold mb-4">
                            <div className={`flex items-center gap-2 ${carWash.isOpen ? 'text-green-600' : 'text-red-600'}`}>
                               <Sun className="h-5 w-5" />
                               <span>{carWash.isOpen ? 'Aberto agora' : 'Fechado'}</span>
                            </div>
                            <Button asChild>
                                <Link href={`/booking/${carWash.id}`}>Agendar</Link>
                            </Button>
                         </div>
                         <Separator className="my-4"/>
                         <h4 className="font-semibold mb-2 text-lg flex items-center gap-2"><Tag className="h-5 w-5"/> Serviços</h4>
                         <ul className="space-y-2">
                            {carWash.services.map(service => (
                                <li key={service.id} className="flex justify-between text-sm">
                                    <span>{service.name}</span>
                                    <span className="font-mono">R$ {service.price.toFixed(2)}</span>
                                </li>
                            ))}
                         </ul>
                          <Separator className="my-4"/>
                         <h4 className="font-semibold mb-2 text-lg flex items-center gap-2"><Clock className="h-5 w-5"/> Horários</h4>
                          <ul className="space-y-1 text-sm text-muted-foreground">
                            {carWash.operatingHours.map(oh => (
                                <li key={oh.day} className="flex justify-between">
                                    <span>{oh.day}</span>
                                    <span>{oh.open} - {oh.close}</span>
                                </li>
                            ))}
                         </ul>

                    </CardContent>
                </Card>
            </div>
       </div>
    </div>
  );
}

import { Avatar, AvatarFallback } from './ui/avatar';
