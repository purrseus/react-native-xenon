import { useContext, useMemo, useRef } from 'react';
import { Animated, PanResponder, StyleSheet, View } from 'react-native';
import { MainContext } from '../../../contexts';
import refs from '../../../core/refs';
import { clamp } from '../../../core/utils';
import colors from '../../../theme/colors';

export default function Handle() {
  const pan = useRef(new Animated.Value(0));
  const {
    dimensions,
    debuggerState: { position },
  } = useContext(MainContext)!;

  const panResponder = useMemo(() => {
    const minPanelHeight = dimensions.height * 0.25;
    const maxPanelHeight = dimensions.height * 0.9;

    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gestureState) => {
        const value =
          position === 'bottom' ? dimensions.height - gestureState.moveY : gestureState.moveY;

        refs.panelSize.current?.setValue({
          x: dimensions.width,
          y: clamp(minPanelHeight, maxPanelHeight, value),
        });

        return Animated.event([null, { dy: pan.current }], {
          useNativeDriver: false,
        })(event, gestureState);
      },
    });
  }, [dimensions.height, dimensions.width, position]);

  return (
    <View style={styles.handleContainer}>
      <Animated.View {...panResponder.panHandlers} style={styles.handle} hitSlop={16} />
    </View>
  );
}

const styles = StyleSheet.create({
  handleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.lightGray,
    borderTopColor: colors.gray,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  handle: {
    width: 48,
    height: 4,
    marginVertical: 8,
    borderRadius: 2,
    backgroundColor: colors.gray,
  },
});
