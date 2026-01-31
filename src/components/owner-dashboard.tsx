'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/hooks/use-auth';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { CarWash } from '@/lib/types';
import { collection, query, where, updateDoc, doc } from 'firebase/firestore';
import { Edit, Loader2 } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Skeleton } from './ui/skeleton';

const analyticsData = [
  { name: 'Mon', customers: 65 },
  { name: 'Tue', customers: 59 },
  { name: 'Wed', customers: 80 },
  { name: 'Thu', customers: 81 },
  { name: 'Fri', customers: 120 },
  { name: 'Sat', customers: 190 },
  { name: 'Sun', customers: 210 },
];

function DashboardSkeleton() {
    return (
        <div className="mx-auto grid w-full max-w-6xl gap-6 p-4 lg:grid-cols-3 md:p-8">
            <div className="space-y-6 lg:col-span-2">
                <Skeleton className="h-48" />
                <Skeleton className="h-80" />
            </div>
            <div className="space-y-6">
                <Skeleton className="h-64" />
            </div>
        </div>
    )
}


export function OwnerDashboard() {
  const { user } = useAuth();
  const { firestore } = useFirebase();
  const { toast } = useToast();

  const carWashesQuery = useMemoFirebase(
    () =>
      user && firestore
        ? query(collection(firestore, 'car_washes'), where('ownerId', '==', user.uid))
        : null,
    [user, firestore]
  );
  const { data: carWashes, isLoading } = useCollection<CarWash>(carWashesQuery);
  const ownerBusiness = carWashes?.[0];

  const [waitTime, setWaitTime] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (ownerBusiness) {
      setWaitTime(ownerBusiness.waitTime || 0);
      setIsOpen(ownerBusiness.isOpen || false);
    }
  }, [ownerBusiness]);

  const handleSaveChanges = async () => {
    if (!firestore || !ownerBusiness) return;
    setIsSaving(true);
    try {
      const carWashRef = doc(firestore, 'car_washes', ownerBusiness.id);
      await updateDoc(carWashRef, {
        waitTime,
        isOpen,
      });
      toast({
        title: 'Sucesso!',
        description: 'Disponibilidade atualizada.',
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível atualizar a disponibilidade.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (!ownerBusiness) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
        <h2 className="text-2xl font-bold">Bem-vindo, {user?.name}!</h2>
        <p className="text-muted-foreground">Você ainda não cadastrou um lava-rápido.</p>
        <Button asChild>
          <Link href="/owner/carwash/new">Cadastrar meu Negócio</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto grid w-full max-w-6xl flex-1 gap-6 overflow-y-auto p-4 md:p-8">
      <div className="space-y-6 lg:col-span-2">
        <Card>
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle>Informações do Negócio</CardTitle>
              <CardDescription>
                Gerencie os detalhes do seu lava-rápido.
              </CardDescription>
            </div>
            <Button variant="outline" size="icon" asChild>
              <Link href={`/owner/carwash/${ownerBusiness.id}/edit`}>
                <Edit className="h-4 w-4" />
                <span className="sr-only">Editar Informações</span>
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <strong>Nome:</strong> {ownerBusiness.name}
            </p>
            <p>
              <strong>Endereço:</strong> {ownerBusiness.address}
            </p>
            <p>
              <strong>Serviços:</strong>{' '}
              {ownerBusiness.services
                .map((s) => `${s.name} (R$${s.price})`)
                .join(', ')}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Performance Semanal</CardTitle>
            <CardDescription>Clientes por dia nesta semana.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="name"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip
                  cursor={{ fill: 'hsl(var(--muted))' }}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    borderColor: 'hsl(var(--border))',
                  }}
                />
                <Bar
                  dataKey="customers"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <div className="space-y-6">
        <Card className="sticky top-20">
          <CardHeader>
            <CardTitle>Disponibilidade em Tempo Real</CardTitle>
            <CardDescription>Atualize seu status instantaneamente.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="waitTime">Tempo de Espera Atual</Label>
                <span className="font-bold">{waitTime} minutos</span>
              </div>
              <Slider
                id="waitTime"
                min={0}
                max={120}
                step={5}
                value={[waitTime]}
                onValueChange={(value) => setWaitTime(value[0])}
                disabled={isSaving}
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <Label htmlFor="isOpen" className="font-medium">
                Status do Negócio
              </Label>
              <div className="flex items-center gap-2">
                <Switch
                  id="isOpen"
                  checked={isOpen}
                  onCheckedChange={setIsOpen}
                  disabled={isSaving}
                />
                <span
                  className={`font-semibold ${
                    isOpen ? 'text-[hsl(var(--chart-2))]' : 'text-destructive'
                  }`}
                >
                  {isOpen ? 'Aberto' : 'Fechado'}
                </span>
              </div>
            </div>
            <Button className="w-full" onClick={handleSaveChanges} disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar Alterações
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
