import { useEffect } from 'react';

export const emitDataChange = () => {
  window.dispatchEvent(new CustomEvent('flowtrack:data-changed'));
};

export const useOnDataChange = (callback) => {
  useEffect(() => {
    window.addEventListener('flowtrack:data-changed', callback);
    return () => window.removeEventListener('flowtrack:data-changed', callback);
  }, [callback]);
};
