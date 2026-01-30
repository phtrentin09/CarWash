import { Timestamp } from "firebase/firestore";

export interface User {
  uid: string;
  name: string;
  email: string;
  role: 'client' | 'owner' | 'admin';
  createdAt: Date | Timestamp;
  updatedAt: Date | Timestamp;
}

export interface CarWashService {
  id: string;
  name: string;
  price: number;
  duration: number; // in minutes
}

export interface OperatingHours {
    day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
    open: string; // "HH:mm"
    close: string; // "HH:mm"
}

export interface CarWash {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  geohash: string;
  images: string[];
  services: CarWashService[];
  operatingHours: OperatingHours[];
  rating: number;
  reviewCount: number;
  waitTime: number; // in minutes
  isOpen: boolean;
  createdAt: Date | Timestamp;
  updatedAt: Date | Timestamp;
}

export interface Booking {
  id: string;
  clientId: string;
  clientName: string;
  carWashId: string;
  carWashName: string;
  serviceId: string;
  serviceName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: Date | Timestamp;
}

export interface Review {
  id: string;
  clientId: string;
  clientName: string;
  carWashId: string;
  bookingId: string;
  rating: number;
  comment: string;
  createdAt: Date | Timestamp;
}
