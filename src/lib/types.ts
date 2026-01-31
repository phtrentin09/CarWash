import { Timestamp } from "firebase/firestore";

// 🔥 Unificado: AppUser e User agora são uma só estrutura
export interface User {
  uid: string;
  name: string;
  email: string;
  // Combinamos os roles: 'client' do AppUser e 'owner'/'admin' do original
  role: 'client' | 'business' | 'owner' | 'admin'; 
  
  // No Firestore, usamos Timestamp para gravar e Date para ler no Front.
  // O tipo 'number' (Date.now()) também é uma opção válida.
  createdAt: Date | Timestamp | number;
  updatedAt: Date | Timestamp | number;
}

export interface CarWashService {
  id: string;
  name: string;
  price: number;
  duration: number; // em minutos
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
  waitTime: number; // em minutos
  isOpen: boolean;
  createdAt: Date | Timestamp | number;
  updatedAt: Date | Timestamp | number;
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
  createdAt: Date | Timestamp | number;
}

export interface Review {
  id: string;
  clientId: string;
  clientName: string;
  carWashId: string;
  bookingId: string;
  rating: number;
  comment: string;
  createdAt: Date | Timestamp | number;
}
