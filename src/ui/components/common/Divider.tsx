import { StyleSheet, View } from 'react-native';
import colors from '../../../theme/colors';

export default function Divider({ type }: { type: 'horizontal' | 'vertical' }) {
  return (
    <View
      style={{
        [type === 'horizontal' ? 'height' : 'width']: StyleSheet.hairlineWidth,
        backgroundColor: colors.gray,
      }}
    />
  );
}
