'use client';
import { useAuth, AuthenticatedUser } from '@/hooks/use-auth';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from './ui/skeleton';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { doc, updateDoc } from 'firebase/firestore';
import { useFirebase } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const profileSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters.'),
});

type ProfileValues = z.infer<typeof profileSchema>;

function ProfileSkeleton() {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-4">
                    <Skeleton className="h-20 w-20 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                </div>
                 <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </CardContent>
            <CardFooter>
                 <Skeleton className="h-10 w-32" />
            </CardFooter>
        </Card>
    )
}

export function ProfileClient() {
  const { user, loading } = useAuth();
  const { firestore } = useFirebase();
  const { toast } = useToast();

  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    values: {
        name: user?.name || ''
    }
  });

  const onSubmit = async (data: ProfileValues) => {
    if (!user || !firestore) return;
    const userRef = doc(firestore, 'users', user.uid);
    try {
        await updateDoc(userRef, { name: data.name });
        toast({ title: 'Success', description: 'Profile updated successfully.' });
    } catch (error) {
        console.error("Error updating profile:", error);
        toast({ title: 'Error', description: 'Failed to update profile.', variant: 'destructive' });
    }
  };

  if (loading || !user) {
    return <ProfileSkeleton />;
  }

  return (
    <Tabs defaultValue="account">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="history">Booking History</TabsTrigger>
        <TabsTrigger value="reviews">My Reviews</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <Card>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={user.photoURL ?? undefined} />
                    <AvatarFallback>{user.name?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-2xl">{user.name}</CardTitle>
                    <CardDescription>{user.email}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={user.email ?? ''} disabled />
                </div>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </TabsContent>
       <TabsContent value="history">
            <Card>
                <CardHeader>
                    <CardTitle>Booking History</CardTitle>
                    <CardDescription>Your past and upcoming appointments.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Booking history coming soon...</p>
                </CardContent>
            </Card>
       </TabsContent>
       <TabsContent value="reviews">
             <Card>
                <CardHeader>
                    <CardTitle>My Reviews</CardTitle>
                    <CardDescription>Reviews you have submitted.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Your submitted reviews will appear here...</p>
                </CardContent>
            </Card>
       </TabsContent>
    </Tabs>
  );
}

// Dummy Tabs components for structure
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
