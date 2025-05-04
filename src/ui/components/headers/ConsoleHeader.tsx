import { forwardRef } from 'react';
import type { PanelState } from '../../../core/refs';
import Divider from '../common/Divider';
import HeaderComponents from './HeaderComponents';
import type { ScrollView, StyleProp, ViewStyle } from 'react-native';

interface ConsoleHeaderProps {
  selectedPanel: PanelState;
  style?: StyleProp<ViewStyle>;
}

const ConsoleHeader = forwardRef<ScrollView, ConsoleHeaderProps>(
  ({ selectedPanel, style }, ref) => {
    return (
      <HeaderComponents.Wrapper ref={ref} style={style}>
        <HeaderComponents.Back selectedPanel={selectedPanel} />
        <HeaderComponents.MainButtons />
        <Divider type="vertical" />
        <HeaderComponents.TabItem tab="logMessage" label="Console" />
      </HeaderComponents.Wrapper>
    );
  },
);

export default ConsoleHeader;
