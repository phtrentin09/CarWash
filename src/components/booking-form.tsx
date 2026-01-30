'use client';

import { useDoc, useFirebase, useMemoFirebase } from '@/firebase';
import { CarWash, Booking } from '@/lib/types';
import { doc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from './ui/card';
import { Button } from './ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Popover, PopoverTrigger, PopoverContent } from './ui/popover';
import { Calendar } from './ui/calendar';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';

const bookingSchema = z.object({
  serviceId: z.string().min(1, 'Selecione um serviço.'),
  date: z.date({ required_error: 'Selecione uma data.' }),
  time: z.string().min(1, 'Selecione um horário.'),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

export default function BookingForm({ carWashId }: { carWashId: string }) {
  const { firestore } = useFirebase();
  const { user, loading: userLoading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const carWashRef = useMemoFirebase(() => firestore ? doc(firestore, 'carWashes', carWashId) : null, [firestore, carWashId]);
  const { data: carWash, isLoading: isLoadingCarWash } = useDoc<CarWash>(carWashRef);
  
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
  });

  const onSubmit = async (data: BookingFormValues) => {
    if (!firestore || !user || !carWash) return;

    try {
        const bookingData: Omit<Booking, 'id'> = {
            clientId: user.uid,
            clientName: user.name,
            carWashId: carWash.id,
            carWashName: carWash.name,
            serviceId: data.serviceId,
            serviceName: carWash.services.find(s => s.id === data.serviceId)?.name || '',
            date: format(data.date, 'yyyy-MM-dd'),
            time: data.time,
            status: 'pending',
            createdAt: serverTimestamp(),
        }
        await addDoc(collection(firestore, 'bookings'), bookingData);
        toast({
            title: 'Agendamento solicitado!',
            description: 'Aguarde a confirmação do lava-rápido.'
        });
        router.push('/dashboard');

    } catch (error) {
        console.error("Error creating booking: ", error);
        toast({
            title: 'Erro',
            description: 'Não foi possível criar o agendamento.',
            variant: 'destructive'
        })
    }
  };

  if (isLoadingCarWash || userLoading) {
    return <div>Loading form...</div>;
  }

  const availableTimes = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

  return (
    <div className="container mx-auto max-w-2xl p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Agendar em {carWash?.name}</CardTitle>
          <CardDescription>Preencha os detalhes abaixo para marcar seu horário.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="serviceId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Serviço</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o serviço desejado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {carWash?.services.map((service) => (
                          <SelectItem key={service.id} value={service.id}>
                            {service.name} - R$ {service.price.toFixed(2)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Escolha uma data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date() || date < new Date('1900-01-01')}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Horário</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                       <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o horário" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableTimes.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Confirmar Agendamento
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
