import { TouchableOpacity, type TouchableOpacityProps } from 'react-native';

interface TouchableProps extends TouchableOpacityProps {}

export default function Touchable({ children, activeOpacity = 0.8, ...props }: TouchableProps) {
  return (
    <TouchableOpacity activeOpacity={activeOpacity} {...props}>
      {children}
    </TouchableOpacity>
  );
}
