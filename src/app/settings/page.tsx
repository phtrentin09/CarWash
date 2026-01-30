import { AppShell } from '@/components/app-shell';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { LanguageSwitcher } from '@/components/language-switcher';
import { ThemeSwitch } from '@/components/theme-switch';

export default function SettingsPage() {
  return (
    <AppShell>
      <div className="flex-1 p-4 md:p-8">
        <div className="mx-auto w-full max-w-2xl space-y-6">
          <h1 className="text-3xl font-bold">Settings</h1>
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize the look and feel of the application.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="language" className="font-medium">
                  Language
                </Label>
                <LanguageSwitcher />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="theme" className="font-medium">
                  Dark Mode
                </Label>
                <ThemeSwitch />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
