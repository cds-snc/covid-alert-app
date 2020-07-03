import {useRef, useEffect} from 'react';

export function usePrevious<T>(value: T): T | null {
  const ref = useRef<T>(null);
  useEffect(() => {
    Object.assign(ref, {current: value});
  }, [value]);
  return ref.current;
}
