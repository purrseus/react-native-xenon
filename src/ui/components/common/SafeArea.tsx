import { View } from 'react-native';
import { useSafeAreaInsets, type EdgeInsets } from 'react-native-safe-area-context';

export default function SafeArea({
  inset,
}: {
  inset: Extract<keyof EdgeInsets, 'top' | 'bottom'>;
}) {
  return <View style={{ height: useSafeAreaInsets()[inset] }} />;
}
