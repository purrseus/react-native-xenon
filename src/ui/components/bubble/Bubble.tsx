import { useContext, useMemo, type MutableRefObject } from 'react';
import {
  Animated,
  Image,
  PanResponder,
  StyleSheet,
  View,
  type PanResponderGestureState,
} from 'react-native';
import { MainContext } from '../../../contexts';
import icons from '../../../theme/icons';
import colors from '../../../theme/colors';
import { getVerticalSafeMargin } from '../../../core/utils';

interface BubbleProps {
  bubbleSize: number;
  pan: MutableRefObject<Animated.ValueXY>;
  screenWidth: number;
  screenHeight: number;
}

export default function Bubble({ bubbleSize, pan, screenWidth, screenHeight }: BubbleProps) {
  const iconSize = bubbleSize * 0.65;

  const { setDebuggerState } = useContext(MainContext)!;

  const panResponder = useMemo(
    () =>
      PanResponder.create({
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
        },
        onPanResponderMove: Animated.event([null, { dx: pan.current.x, dy: pan.current.y }], {
          useNativeDriver: false,
        }),
        onPanResponderRelease: (_, gesture: PanResponderGestureState) => {
          const isTapGesture =
            gesture.dx > -10 && gesture.dx < 10 && gesture.dy > -10 && gesture.dy < 10;

          if (isTapGesture) {
            setDebuggerState(draft => {
              draft.visibility = 'panel';
            });
          }

          pan.current.flattenOffset();

          const finalX =
            gesture.moveX < (screenWidth - bubbleSize) / 2 ? 0 : screenWidth - bubbleSize;

          const verticalSafeMargin = getVerticalSafeMargin(screenHeight);

          const finalY = Math.min(
            Math.max(verticalSafeMargin, gesture.moveY),
            screenHeight - verticalSafeMargin - bubbleSize,
          );

          Animated.spring(pan.current, {
            toValue: { x: finalX, y: finalY },
            useNativeDriver: false,
          }).start();
        },
      }),
    [bubbleSize, pan, screenHeight, screenWidth, setDebuggerState],
  );

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
          },
        ]}
      >
        <Image source={icons.bug} style={{ width: iconSize, height: iconSize }} />
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
