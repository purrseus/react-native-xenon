import {
  Children,
  createElement,
  forwardRef,
  useImperativeHandle,
  useRef,
  type ForwardedRef,
  type JSX,
  type RefAttributes,
} from 'react';
import { type NativeMethods } from 'react-native';

interface IndexedStackProps<T extends number> {
  children: JSX.Element[];
  id: string;
  defaultIndex: T;
}

export type IndexedStackMethods<T extends number> = {
  setCurrentIndex: (index: T) => void;
  getCurrentIndex: () => T;
};

function IndexedStackComponent<T extends number>(
  { children, defaultIndex, id }: IndexedStackProps<T>,
  ref: ForwardedRef<IndexedStackMethods<T>>,
) {
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

const IndexedStack = forwardRef(IndexedStackComponent) as <T extends number>(
  props: IndexedStackProps<T> & RefAttributes<IndexedStackMethods<T>>,
) => JSX.Element;

export default IndexedStack;
