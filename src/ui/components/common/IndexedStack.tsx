import { Children, createElement, useImperativeHandle, useRef, type JSX, type Ref } from 'react';
import { type NativeMethods } from 'react-native';

interface IndexedStackProps<T extends number> {
  children: JSX.Element[];
  id: string;
  defaultIndex: T;
  ref: Ref<IndexedStackMethods<T>>;
}

export type IndexedStackMethods<T extends number> = {
  getCurrentIndex: () => T;
  setCurrentIndex: (index: T) => void;
};

export default function IndexedStack<T extends number>({
  children,
  defaultIndex,
  id,
  ref,
}: IndexedStackProps<T>) {
  const currentIndex = useRef<T>(defaultIndex as T);
  const childrenRefs = useRef<NativeMethods[]>([]);

  useImperativeHandle(ref, () => ({
    getCurrentIndex: () => currentIndex.current,
    setCurrentIndex: (index: number) => {
      currentIndex.current = index as T;
      childrenRefs.current.forEach((childRef, i) => {
        if (childRef) {
          childRef.setNativeProps({
            style: { display: i === index ? 'flex' : 'none' },
          });
        }
      });
    },
  }));

  return Children.map(children, (child, i) => {
    return createElement(child.type, {
      ...child.props,
      key: `${id}-${i}`,
      style: [child.props.style, { display: i === defaultIndex ? 'flex' : 'none' }],
      ref: (childRef: NativeMethods | null) => {
        if (!childRef) return;
        childrenRefs.current[i] = childRef;
      },
    });
  });
}
