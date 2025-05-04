import { forwardRef, useContext } from 'react';
import { Share, type ScrollView, type StyleProp, type ViewStyle } from 'react-native';
import { MainContext } from '../../../contexts';
import refs, { DebuggerVisibility, type PanelState } from '../../../core/refs';
import { convertToCurl, getNetworkUtils } from '../../../core/utils';
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

let isSharing = false;

const NetworkHeader = forwardRef<ScrollView, NetworkHeaderProps>(
  ({ selectedPanel, style }, ref) => {
    const {
      debuggerState: { detailsData },
      setDebuggerState,
    } = useContext(MainContext)!;

    const data = detailsData?.data as HttpRequest | WebSocketRequest | undefined;

    const { isHttp, overviewShown, headersShown, requestShown, responseShown, messagesShown } =
      getNetworkUtils(data);

    return (
      <HeaderComponents.Wrapper ref={ref} style={style}>
        <HeaderComponents.Back selectedPanel={selectedPanel} />
        <HeaderComponents.MainButtons />

        <Divider type="vertical" />

        {overviewShown && <HeaderComponents.TabItem tab="overview" label="Overview" />}
        {headersShown && <HeaderComponents.TabItem tab="headers" label="Headers" />}
        {requestShown && <HeaderComponents.TabItem tab="request" label="Request" />}
        {responseShown && <HeaderComponents.TabItem tab="response" label="Response" />}
        {messagesShown && <HeaderComponents.TabItem tab="messages" label="Messages" />}

        {isHttp && (
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
                if (isSharing || !data || data.type === NetworkType.WS) return;

                try {
                  isSharing = true;
                  refs.debugger.current?.setCurrentIndex(DebuggerVisibility.Bubble);

                  await Share.share({
                    message: convertToCurl(data.method, data.url, data.requestHeaders, data.body),
                  });
                } catch (error) {
                  // Handle error
                } finally {
                  isSharing = false;
                }
              }}
            />
          </>
        )}
      </HeaderComponents.Wrapper>
    );
  },
);

export default NetworkHeader;
