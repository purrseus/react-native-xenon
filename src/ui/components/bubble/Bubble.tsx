import { forwardRef, useMemo, useRef, useState } from 'react';
import {
  Animated,
  PanResponder,
  StyleSheet,
  View,
  type PanResponderGestureState,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import refs, { DebuggerVisibility } from '../../../core/refs';
import { clamp, getVerticalSafeMargin } from '../../../core/utils';
import colors from '../../../theme/colors';
import icons from '../../../theme/icons';
import Icon from '../common/Icon';

interface BubbleProps {
  bubbleSize: number;
  idleBubbleOpacity: number;
  screenWidth: number;
  screenHeight: number;
  style?: StyleProp<ViewStyle>;
}

const Bubble = forwardRef<View, BubbleProps>(
  ({ bubbleSize, idleBubbleOpacity, screenWidth, screenHeight, style }, ref) => {
    const [idleOpacity, setIdleOpacity] = useState(idleBubbleOpacity);
    const pan = useRef(new Animated.ValueXY({ x: 0, y: getVerticalSafeMargin(screenHeight) }));
    const opacityTimer = useRef<NodeJS.Timeout | null>(null);

    const panResponder = useMemo(() => {
      const clearTimer = () => {
        if (opacityTimer.current) clearTimeout(opacityTimer.current);
        opacityTimer.current = null;
      };

      const blur = () => {
        opacityTimer.current = setTimeout(() => {
          setIdleOpacity(0.5);
          clearTimer();
        }, 1000);
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
          pan.current.flattenOffset();

          const isTapGesture =
            gesture.dx > -10 && gesture.dx < 10 && gesture.dy > -10 && gesture.dy < 10;
          if (isTapGesture) {
            refs.debugger.current?.setCurrentIndex(DebuggerVisibility.Panel);
          }

          if (gesture.moveX === 0 && gesture.moveY === 0) {
            blur();
            return;
          }

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
            blur();
          });
        },
      });
    }, [bubbleSize, pan, screenHeight, screenWidth]);

    return (
      <View ref={ref} style={[styles.bubbleBackdrop, style]}>
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
  },
);

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

export default Bubble;
