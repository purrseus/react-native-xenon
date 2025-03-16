import { useContext, useMemo, useRef, useState, type MutableRefObject } from 'react';
import {
  Animated,
  PanResponder,
  StyleSheet,
  View,
  type PanResponderGestureState,
} from 'react-native';
import { MainContext } from '../../../contexts';
import { clamp, getVerticalSafeMargin } from '../../../core/utils';
import colors from '../../../theme/colors';
import icons from '../../../theme/icons';
import Icon from '../common/Icon';

interface BubbleProps {
  bubbleSize: number;
  idleBubbleOpacity: number;
  pan: MutableRefObject<Animated.ValueXY>;
  screenWidth: number;
  screenHeight: number;
}

export default function Bubble({
  bubbleSize,
  idleBubbleOpacity,
  pan,
  screenWidth,
  screenHeight,
}: BubbleProps) {
  const { setDebuggerState } = useContext(MainContext)!;
  const [idleOpacity, setIdleOpacity] = useState(idleBubbleOpacity);
  const opacityTimer = useRef<NodeJS.Timeout | null>(null);

  const panResponder = useMemo(() => {
    const clearTimer = () => {
      if (opacityTimer.current) clearTimeout(opacityTimer.current);
      opacityTimer.current = null;
    };

    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.current.setOffset({
          // @ts-ignore
          x: pan.current.x._value,
          // @ts-ignore
          y: pan.current.y._value,
        });

        pan.current.setValue({ x: 0, y: 0 });

        clearTimer();
        setIdleOpacity(1);
      },
      onPanResponderMove: Animated.event([null, { dx: pan.current.x, dy: pan.current.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (_, gesture: PanResponderGestureState) => {
        const isTapGesture =
          gesture.dx > -10 && gesture.dx < 10 && gesture.dy > -10 && gesture.dy < 10;

        if (isTapGesture)
          setDebuggerState(draft => {
            draft.visibility = 'panel';
          });

        pan.current.flattenOffset();

        const finalX =
          gesture.moveX < (screenWidth - bubbleSize) / 2 ? 0 : screenWidth - bubbleSize;

        const verticalSafeMargin = getVerticalSafeMargin(screenHeight);

        const finalY = clamp(
          gesture.moveY,
          verticalSafeMargin,
          screenHeight - verticalSafeMargin - bubbleSize,
        );

        Animated.spring(pan.current, {
          toValue: { x: finalX, y: finalY },
          useNativeDriver: false,
        }).start(({ finished }) => {
          if (!finished) return;

          opacityTimer.current = setTimeout(() => {
            setIdleOpacity(0.5);
            clearTimer();
          }, 1000);
        });
      },
    });
  }, [bubbleSize, pan, screenHeight, screenWidth, setDebuggerState]);

  return (
    <View style={styles.bubbleBackdrop}>
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.bubble,
          {
            width: bubbleSize,
            height: bubbleSize,
            borderRadius: bubbleSize / 2,
            transform: pan.current.getTranslateTransform(),
            opacity: idleOpacity,
          },
        ]}
      >
        <Icon source={icons.bug} size={bubbleSize * 0.65} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  bubbleBackdrop: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'box-none',
  },
  bubble: {
    backgroundColor: colors.lightGray,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
