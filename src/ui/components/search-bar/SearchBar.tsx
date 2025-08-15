import { forwardRef, useContext, useState } from 'react';
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
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import refs, { DebuggerVisibility } from '../../../core/refs';
import colors from '../../../theme/colors';
import Touchable from '../common/Touchable';
import Icon from '../common/Icon';
import icons from '../../../theme/icons';
import { MainContext } from '../../../contexts';

interface SearchBarProps extends ViewProps {}

const SearchBar = forwardRef<View, SearchBarProps>(({ style, ...props }, ref) => {
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
    refs.searchInput.current?.clear();
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
    <View ref={ref} style={[styles.container, style]} {...props}>
      <SafeAreaProvider>
        <SafeAreaView edges={['top']} style={styles.safeArea}>
          <View style={styles.inputWrapper}>
            <Icon source={icons.search} size={18} />

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

            <Touchable onPress={onClear} style={styles.closeButton}>
              <Icon source={icons.close} size={12} color={colors.black} />
            </Touchable>
          </View>
        </SafeAreaView>

        <Touchable onPress={onHideSearchInput} style={styles.background}>
          <View />
        </Touchable>
      </SafeAreaProvider>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    ...(Platform.OS === 'android' ? { zIndex: 9999 } : {}),
    backgroundColor: colors.black + '80', // 80 for 50% opacity
  },
  safeArea: {
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
  closeButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.gray,
  },
});

export default SearchBar;
