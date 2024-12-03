import { useContext, useRef, type MutableRefObject } from 'react';
import { Animated, Image, PanResponder, StyleSheet } from 'react-native';
import InspectorContext from '../../contexts/InspectorContext';

interface InspectorBubbleProps {
  bubbleSize: number;
  pan: MutableRefObject<Animated.ValueXY>;
}

export default function InspectorBubble({ bubbleSize, pan }: InspectorBubbleProps) {
  const { setInspectorVisibility, screenWidth, screenHeight, verticalSafeValue } =
    useContext(InspectorContext)!;

  const panResponder = useRef(
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
      onPanResponderRelease: (_, gesture) => {
        if (!gesture.moveX && !gesture.moveY) showInspectorPanel();

        pan.current.flattenOffset();

        const finalX =
          gesture.moveX < (screenWidth - bubbleSize) / 2 ? 0 : screenWidth - bubbleSize;

        const finalY = Math.min(
          Math.max(verticalSafeValue, gesture.moveY),
          screenHeight - verticalSafeValue - bubbleSize,
        );

        Animated.spring(pan.current, {
          toValue: { x: finalX, y: finalY },
          useNativeDriver: false,
        }).start();
      },
    }),
  ).current;

  const showInspectorPanel = () => {
    setInspectorVisibility('panel');
  };

  return (
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
      <Image
        source={require('../../../assets/code.png')}
        style={{
          width: bubbleSize * 0.75,
          height: bubbleSize * 0.75,
        }}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    backgroundColor: '#AAAAAA',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
