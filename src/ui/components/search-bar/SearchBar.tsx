import { useContext, useState, type Ref } from 'react';
import {
  Keyboard,
  Platform,
  StyleSheet,
  TextInput,
  View,
  type NativeSyntheticEvent,
  type TextInputSubmitEditingEventData,
  type ViewProps,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MainContext } from '../../../contexts';
import refs, { DebuggerVisibility } from '../../../core/refs';
import colors from '../../../theme/colors';
import icons from '../../../theme/icons';
import Icon from '../common/Icon';
import Touchable from '../common/Touchable';
import SafeArea from '../common/SafeArea';

interface SearchBarProps extends ViewProps {
  ref?: Ref<View>;
}

const ICON_SIZE = 20;

export default function SearchBar({ style, ...props }: SearchBarProps) {
  const {
    debuggerState: { searchQuery },
    setDebuggerState,
  } = useContext(MainContext)!;

  const [value, setValue] = useState(searchQuery);

  const onHideSearchInput = () => {
    Keyboard.dismiss();
    refs.debugger.current?.setCurrentIndex(DebuggerVisibility.Panel);
  };

  const onClear = () => {
    setValue('');
  };

  const onSubmitEditing = ({
    nativeEvent: { text },
  }: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
    setDebuggerState(draft => {
      draft.searchQuery = text;
    });
    refs.debugger.current?.setCurrentIndex(DebuggerVisibility.Panel);
  };

  return (
    <View style={[styles.container, style]} {...props}>
      <SafeAreaProvider>
        <View style={styles.barView}>
          <SafeArea inset="top" />

          <View style={styles.inputWrapper}>
            <Icon source={icons.search} size={ICON_SIZE} />

            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              inputMode="search"
              returnKeyType="search"
              selectionColor={colors.black}
              ref={refs.searchInput}
              autoFocus
              style={styles.input}
              value={value}
              onChangeText={setValue}
              placeholder="Search..."
              placeholderTextColor={colors.gray}
              onSubmitEditing={onSubmitEditing}
            />

            {!!value.length && (
              <Touchable hitSlop={8} onPress={onClear}>
                <Icon source={icons.close} size={ICON_SIZE} color={colors.black} />
              </Touchable>
            )}
          </View>
        </View>

        <Touchable onPress={onHideSearchInput} style={styles.background}>
          <View />
        </Touchable>
      </SafeAreaProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    ...(Platform.OS === 'android' ? { zIndex: 9999 } : {}),
    backgroundColor: colors.black + '80', // 80 for 50% opacity
  },
  barView: {
    backgroundColor: colors.lightGray,
    padding: 8,
  },
  background: {
    flex: 1,
  },
  inputWrapper: {
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingHorizontal: 8,
    columnGap: 8,
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
  },
  input: {
    height: '100%',
    padding: 0,
    margin: 0,
    lineHeight: 20,
    fontSize: 16,
    color: colors.black,
    flex: 1,
  },
});
