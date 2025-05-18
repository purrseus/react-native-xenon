import { TouchableOpacity, type StyleProp, type ViewStyle } from 'react-native';

interface TouchableProps {
  onPress: () => void;
  children: React.ReactNode;
  activeOpacity?: number;
  style?: StyleProp<ViewStyle>;
}

export default function Touchable({
  onPress,
  children,
  activeOpacity = 0.8,
  style,
}: TouchableProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={activeOpacity} style={style}>
      {children}
    </TouchableOpacity>
  );
}
