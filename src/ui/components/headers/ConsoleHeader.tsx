import type { Ref } from 'react';
import type { ScrollView, StyleProp, ViewStyle } from 'react-native';
import type { PanelState } from '../../../core/refs';
import Divider from '../common/Divider';
import HeaderComponents from './HeaderComponents';

interface ConsoleHeaderProps {
  selectedPanel: PanelState;
  style?: StyleProp<ViewStyle>;
  ref?: Ref<ScrollView>;
}

export default function ConsoleHeader({ selectedPanel, style, ref }: ConsoleHeaderProps) {
  return (
    <HeaderComponents.Wrapper ref={ref} style={style}>
      <HeaderComponents.Back selectedPanel={selectedPanel} />
      <HeaderComponents.MainButtons />
      <Divider type="vertical" />
      <HeaderComponents.DetailTabItem tab="logMessage" label="Console" />
    </HeaderComponents.Wrapper>
  );
}
