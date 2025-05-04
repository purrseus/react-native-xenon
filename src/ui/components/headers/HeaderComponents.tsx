import { forwardRef, useContext, type PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { MainContext } from '../../../contexts';
import refs, { DebuggerVisibility, HeaderState, PanelState } from '../../../core/refs';
import colors from '../../../theme/colors';
import icons from '../../../theme/icons';
import type { DetailTab } from '../../../types';
import DebuggerHeaderItem from '../items/DebuggerHeaderItem';

const Back = ({ selectedPanel }: { selectedPanel: PanelState }) => {
  const { setDebuggerState } = useContext(MainContext)!;

  return (
    <DebuggerHeaderItem
      content={icons.arrowLeft}
      onPress={() => {
        refs.panel.current?.setCurrentIndex(selectedPanel);
        refs.header.current?.setCurrentIndex(HeaderState.Debugger);
        setDebuggerState(draft => {
          draft.detailsData = null;
        });
      }}
    />
  );
};

const TabItem = ({ tab, label }: { tab: DetailTab; label: string }) => {
  const {
    debuggerState: { detailsData },
    setDebuggerState,
  } = useContext(MainContext)!;

  return (
    <DebuggerHeaderItem
      isLabel
      isActive={detailsData?.selectedTab === tab}
      content={label}
      onPress={() => {
        setDebuggerState(draft => {
          draft.detailsData!.selectedTab = tab;
        });
      }}
    />
  );
};

const MainButtons = () => {
  const { setDebuggerState } = useContext(MainContext)!;

  const onHide = () => {
    refs.debugger.current?.setCurrentIndex(DebuggerVisibility.Bubble);
  };

  const onMove = () => {
    setDebuggerState(draft => {
      draft.position = draft.position === 'bottom' ? 'top' : 'bottom';
    });
  };

  return (
    <>
      <DebuggerHeaderItem onPress={onHide} content={icons.hide} />
      <DebuggerHeaderItem onPress={onMove} content={icons.move} />
    </>
  );
};

const Wrapper = forwardRef<ScrollView, PropsWithChildren<{ style?: StyleProp<ViewStyle> }>>(
  ({ children, style }, ref) => {
    return (
      <ScrollView
        ref={ref}
        horizontal
        style={[styles.container, style]}
        contentContainerStyle={styles.contentContainer}
        showsHorizontalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flexGrow: 0,
    borderTopColor: colors.gray,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.gray,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  contentContainer: {
    padding: 8,
    columnGap: 8,
  },
});

const HeaderComponents = { Back, TabItem, MainButtons, Wrapper };

export default HeaderComponents;
