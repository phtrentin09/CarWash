'use client';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarSeparator,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { WashWiseLogo } from './wash-wise-logo';
import { Home, Settings, LogOut, LayoutDashboard, User, Car, GanttChartSquare } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

import { useLanguage } from '@/context/language-context';
import { LanguageSwitcher } from './language-switcher';
import { Button } from './ui/button';
import { useAuth } from '@/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Skeleton } from './ui/skeleton';

const translations = {
  en: {
    home: 'Home',
    dashboard: 'Dashboard',
    settings: 'Settings',
    logout: 'Logout',
    myBusiness: 'My Business',
    bookings: 'Bookings',
    reviews: 'Reviews',
    login: 'Login',
    signUp: 'Sign Up',
    profile: 'Profile',
  },
  pt: {
    home: 'Início',
    dashboard: 'Painel',
    settings: 'Configurações',
    logout: 'Sair',
    myBusiness: 'Meu Negócio',
    bookings: 'Agendamentos',
    reviews: 'Avaliações',
    login: 'Entrar',
    signUp: 'Cadastre-se',
    profile: 'Perfil',
  },
};

function AppSidebar() {
  const pathname = usePathname();
  const { language } = useLanguage();
  const t = translations[language];
  const { user, signOut } = useAuth();
  const isOwner = user?.role === 'owner';

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader>
        <Link href="/">
          <WashWiseLogo />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip={t.home}
              isActive={pathname === '/'}
            >
              <Link href="/">
                <Home />
                <span>{t.home}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {user && (
            <>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip={isOwner ? t.dashboard : 'Find Washes'}
                  isActive={pathname.startsWith(isOwner ? '/owner/dashboard' : '/dashboard')}
                >
                  <Link href={isOwner ? '/owner/dashboard' : '/dashboard'}>
                    <LayoutDashboard />
                    <span>{t.dashboard}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {isOwner && (
                 <>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        tooltip={t.myBusiness}
                        isActive={pathname.startsWith('/owner/carwash')}
                      >
                        <Link href="/owner/carwash">
                          <Car />
                          <span>{t.myBusiness}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        tooltip={t.bookings}
                        isActive={pathname.startsWith('/owner/bookings')}
                      >
                        <Link href="/owner/bookings">
                          <GanttChartSquare />
                          <span>{t.bookings}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                 </>
              )}

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip={t.settings}
                  isActive={pathname.startsWith('/settings')}
                >
                  <Link href="/settings">
                    <Settings />
                    <span>{t.settings}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </>
          )}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarSeparator />
        <SidebarMenu>
          <SidebarMenuItem>
            <ThemeToggle />
          </SidebarMenuItem>
          {user && (
            <SidebarMenuItem>
              <SidebarMenuButton onClick={signOut} tooltip={t.logout}>
                <LogOut />
                <span>{t.logout}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

function UserNav() {
  const { user, loading, signOut } = useAuth();
  const { language } = useLanguage();
  const t = translations[language];

  if (loading) {
    return <Skeleton className="h-10 w-10 rounded-full" />;
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="ghost" asChild>
          <Link href="/auth/login">{t.login}</Link>
        </Button>
        <Button asChild>
          <Link href="/auth/register">{t.signUp}</Link>
        </Button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.photoURL ?? ''} alt={user.name ?? ''} />
            <AvatarFallback>
              {user.name
                ? user.name.charAt(0).toUpperCase()
                : user.email?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile">
            <User className="mr-2 h-4 w-4" />
            <span>{t.profile}</span>
          </Link>
        </DropdownMenuItem>
        {user.role === 'owner' && (
          <DropdownMenuItem asChild>
            <Link href="/owner/dashboard">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>{t.myBusiness}</span>
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>{t.logout}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function AppShellHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between gap-4 border-b bg-background/90 px-4 backdrop-blur-sm md:justify-end">
       <div className="md:hidden">
         <SidebarTrigger />
       </div>
      <div className="flex items-center gap-2 md:gap-4">
        <LanguageSwitcher />
        <UserNav />
      </div>
    </header>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  
  const isAuthPage = pathname.startsWith('/auth');
  const isOwnerPage = pathname.startsWith('/owner');
  const isClientPage = ['/dashboard', '/profile', '/carwash', '/booking'].some(p => pathname.startsWith(p));
  const isMarketingPage = pathname === '/';

  useEffect(() => {
    if (loading) return;

    if (!user && !isAuthPage && !isMarketingPage) {
        router.push('/auth/login');
        return;
    }

    if(user) {
      if(isAuthPage) {
        router.push(user.role === 'owner' ? '/owner/dashboard' : '/dashboard');
      } else if (user.role === 'owner' && isClientPage) {
        router.push('/owner/dashboard');
      } else if (user.role === 'client' && isOwnerPage) {
        router.push('/dashboard');
      }
    }
  }, [user, loading, pathname, router, isAuthPage, isClientPage, isMarketingPage, isOwnerPage]);
  
  if (isAuthPage || (isMarketingPage && !user) ) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex flex-col h-svh flex-1">
        <AppShellHeader />
        <SidebarInset>
            {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
