import { forwardRef, useContext } from 'react';
import { type ScrollView, type StyleProp, type ViewStyle } from 'react-native';
import { MainContext } from '../../../contexts';
import { type PanelState } from '../../../core/refs';
import { convertToCurl, getNetworkUtils, shareText } from '../../../core/utils';
import colors from '../../../theme/colors';
import icons from '../../../theme/icons';
import { NetworkType, type HttpRequest, type WebSocketRequest } from '../../../types';
import Divider from '../common/Divider';
import DebuggerHeaderItem from '../items/DebuggerHeaderItem';
import HeaderComponents from './HeaderComponents';

interface NetworkHeaderProps {
  selectedPanel: PanelState;
  style?: StyleProp<ViewStyle>;
}

const NetworkHeader = forwardRef<ScrollView, NetworkHeaderProps>(
  ({ selectedPanel, style }, ref) => {
    const {
      debuggerState: { detailsData },
      setDebuggerState,
    } = useContext(MainContext)!;

    const data = detailsData?.data as HttpRequest | WebSocketRequest | undefined;

    const { isWS, overviewShown, headersShown, requestShown, responseShown, messagesShown } =
      getNetworkUtils(data);

    return (
      <HeaderComponents.Wrapper ref={ref} style={style}>
        <HeaderComponents.Back selectedPanel={selectedPanel} />
        <HeaderComponents.MainButtons />

        <Divider type="vertical" />

        {!!overviewShown && <HeaderComponents.TabItem tab="overview" label="Overview" />}
        {!!headersShown && <HeaderComponents.TabItem tab="headers" label="Headers" />}
        {!!requestShown && <HeaderComponents.TabItem tab="request" label="Request" />}
        {!!responseShown && <HeaderComponents.TabItem tab="response" label="Response" />}
        {!!messagesShown && <HeaderComponents.TabItem tab="messages" label="Messages" />}

        {!isWS && (
          <>
            <Divider type="vertical" />

            <DebuggerHeaderItem
              content={icons.beautify}
              isActive={detailsData?.beautified}
              activeColor={colors.green}
              onPress={() => {
                setDebuggerState(draft => {
                  draft.detailsData!.beautified = !draft.detailsData?.beautified;
                });
              }}
            />
            <DebuggerHeaderItem
              content={icons.share}
              onPress={async () => {
                if (data?.type === NetworkType.WS) return;
                await shareText(
                  convertToCurl(data!.method, data!.url, data!.requestHeaders, data!.body),
                );
              }}
            />
          </>
        )}
      </HeaderComponents.Wrapper>
    );
  },
);

export default NetworkHeader;
