import { useState, useCallback } from "react";

interface UseLoadingOptions {
  initialLoading?: boolean;
}

interface UseLoadingReturn {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
  withLoading: <T>(promise: Promise<T>) => Promise<T>;
}

/**
 * Custom hook for managing loading states
 *
 * @example
 * ```tsx
 * const { isLoading, withLoading } = useLoading();
 *
 * const handleSubmit = async (data) => {
 *   await withLoading(api.submitForm(data));
 * };
 *
 * if (isLoading) {
 *   return <LoadingScreen {...LoadingPresets.form} />;
 * }
 * ```
 */
export function useLoading(options: UseLoadingOptions = {}): UseLoadingReturn {
  const { initialLoading = false } = options;
  const [isLoading, setIsLoading] = useState(initialLoading);

  const startLoading = useCallback(() => {
    setIsLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  const withLoading = useCallback(
    async <T>(promise: Promise<T>): Promise<T> => {
      try {
        setIsLoading(true);
        const result = await promise;
        return result;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return {
    isLoading,
    startLoading,
    stopLoading,
    withLoading,
  };
}

export default useLoading;
