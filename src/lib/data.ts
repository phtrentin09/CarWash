import { PlaceHolderImages } from './placeholder-images';

export type Service = {
  name: string;
  price: number;
};

export type CarWash = {
  id: number;
  name: string;
  address: string;
  rating: number;
  reviews: number;
  waitTime: number; // in minutes
  isOpen: boolean;
  services: Service[];
  imageUrl: string;
  imageHint: string;
  lat: number;
  lng: number;
};

export const carWashes: CarWash[] = [
  {
    id: 1,
    name: 'Sparkle & Shine',
    address: '123 Main St, Anytown, USA',
    rating: 4.8,
    reviews: 256,
    waitTime: 15,
    isOpen: true,
    services: [
      { name: 'Basic Wash', price: 10 },
      { name: 'Deluxe Wash', price: 20 },
      { name: 'Ultimate Shine', price: 30 },
      { name: 'Interior Detail', price: 45 },
    ],
    imageUrl: PlaceHolderImages[0].imageUrl,
    imageHint: PlaceHolderImages[0].imageHint,
    lat: 37.805,
    lng: -122.415,
  },
  {
    id: 2,
    name: 'Aqua Jet Car Wash',
    address: '456 Oak Ave, Sometown, USA',
    rating: 4.5,
    reviews: 189,
    waitTime: 5,
    isOpen: true,
    services: [
      { name: 'Express Wash', price: 12 },
      { name: 'Super Clean', price: 25 },
    ],
    imageUrl: PlaceHolderImages[1].imageUrl,
    imageHint: PlaceHolderImages[1].imageHint,
    lat: 37.77,
    lng: -122.49,
  },
  {
    id: 3,
    name: 'The Soap Suds',
    address: '789 Pine Ln, Yourtown, USA',
    rating: 4.2,
    reviews: 98,
    waitTime: 25,
    isOpen: true,
    services: [
      { name: 'Standard Wash', price: 15 },
      { name: 'Interior Detail', price: 50 },
      { name: 'Wax & Polish', price: 35 },
    ],
    imageUrl: PlaceHolderImages[2].imageUrl,
    imageHint: PlaceHolderImages[2].imageHint,
    lat: 37.76,
    lng: -122.42,
  },
  {
    id: 4,
    name: 'Closed for the Day',
    address: '000 Nowhere Blvd, Nocity, USA',
    rating: 4.0,
    reviews: 50,
    waitTime: 0,
    isOpen: false,
    services: [{ name: 'Any Wash', price: 10 }],
    imageUrl: PlaceHolderImages[3].imageUrl,
    imageHint: PlaceHolderImages[3].imageHint,
    lat: 37.79,
    lng: -122.4,
  },
];
