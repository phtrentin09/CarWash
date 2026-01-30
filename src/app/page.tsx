import React from 'react';
import { Button } from '@/components/ui/button';
import { WashWiseLogo } from '@/components/wash-wise-logo';
import { Sparkles, Car, Gauge, CalendarCheck } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="container mx-auto flex h-20 items-center justify-between px-4">
        <WashWiseLogo />
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/auth/login">Entrar</Link>
          </Button>
          <Button asChild>
            <Link href="/auth/register">Cadastre-se</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        <section className="container mx-auto flex flex-col items-center px-4 py-20 text-center">
          <Badge variant="outline" className="mb-4">
            <Sparkles className="mr-2 h-4 w-4 text-accent" />
            Seu carro, sempre brilhando
          </Badge>
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            A forma mais inteligente de lavar seu carro.
          </h1>
          <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl">
            Encontre os melhores lava-rápidos perto de você, veja o tempo de
            espera em tempo real e agende seu horário com antecedência.
          </p>
          <div className="mt-8 flex gap-4">
            <Button size="lg" asChild>
              <Link href="/dashboard">Encontrar um Lava-Rápido</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/owner/carwash/new">Cadastrar meu Negócio</Link>
            </Button>
          </div>
        </section>

        <section id="features" className="bg-muted py-20">
          <div className="container mx-auto">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold">Por que escolher o WashWise?</h2>
              <p className="mt-2 text-muted-foreground">
                Tudo que você precisa para manter seu carro limpo, sem perder tempo.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              <FeatureCard
                icon={<Car />}
                title="Encontre os Melhores Lugares"
                description="Navegue por um mapa com os lava-rápidos mais bem avaliados da sua região."
              />
              <FeatureCard
                icon={<Gauge />}
                title="Sem Filas, Sem Surpresas"
                description="Veja o tempo de espera em tempo real e escolha o melhor momento para ir."
              />
              <FeatureCard
                icon={<CalendarCheck />}
                title="Agendamento Inteligente"
                description="Marque seu horário com antecedência e garanta seu atendimento sem estresse."
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} WashWise. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-4 rounded-full bg-primary/10 p-4 text-primary">
        {React.cloneElement(icon as React.ReactElement, { className: 'h-8 w-8' })}
      </div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-muted-foreground">{description}</p>
    </div>
  );
}

function Badge({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { variant: 'outline' }) {
  return (
    <div
      className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium"
      {...props}
    />
  );
}
