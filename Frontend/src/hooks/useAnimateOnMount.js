import { useEffect, useState } from 'react';

export default function useAnimateOnMount(delay = 0) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);
  return mounted;
}
