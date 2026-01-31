'use client';

import { useEffect, useState } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { useToast } from '@/hooks/use-toast';
import type { FirestorePermissionError } from '@/firebase/error-emitter';

/**
 * An invisible component that listens for globally emitted 'permission-error' events.
 * * An invisible component that listens for globally emitted 'permission-error' events
 * and surfaces them via a toast instead of throwing a global error.
 */
export function FirebaseErrorListener() {
  // Use the specific error type for the state for type safety.
  const [error, setError] = useState<FirestorePermissionError | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // The callback now expects a strongly-typed error, matching the event payload.
    const handleError = (error: FirestorePermissionError) => {
      // Set error in state to trigger a re-render.
      setError(error);
    };

    // The typed emitter will enforce that the callback for 'permission-error'
    // matches the expected payload type (FirestorePermissionError).
    errorEmitter.on('permission-error', handleError);

    // Unsubscribe on unmount to prevent memory leaks.
    return () => {
      errorEmitter.off('permission-error', handleError);
    };
  }, []);

 useEffect(() => {
    if (!error) {
      return;
    }

    console.error(error);
    toast({
      variant: 'destructive',
      title: 'Sem permissão para acessar dados',
      description: `Operação: ${error.request.method} • Caminho: ${error.request.path}`,
    });
  }, [error, toast]);

  // This component renders nothing.
  return null;
}
