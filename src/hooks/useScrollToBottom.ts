import { useEffect, useRef } from 'react';
import type { FlatList } from 'react-native';

export default function useScrollToBottom(listSize: number) {
  const currentSize = useRef(listSize);
  const listRef = useRef<FlatList | null>(null);

  useEffect(() => {
    if (listSize <= currentSize.current) return;

    currentSize.current = listSize;

    const timer = setTimeout(() => {
      if (listSize) listRef.current?.scrollToEnd();
    }, 0);

    return () => {
      clearTimeout(timer);
    };
  }, [listSize]);

  return listRef;
}
