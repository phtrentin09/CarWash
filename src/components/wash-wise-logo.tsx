import { Sparkles } from 'lucide-react';

export function WashWiseLogo() {
  return (
    <div className="flex items-center gap-2">
      <div className="rounded-lg bg-primary p-1.5">
        <Sparkles className="h-5 w-5 text-primary-foreground" />
      </div>
      <h1 className="text-xl font-bold text-foreground sm:text-2xl">
        WashWise
      </h1>
    </div>
  );
}
