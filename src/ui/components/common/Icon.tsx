import { Image } from 'react-native';
import colors from '../../../theme/colors';

interface IconProps {
  source: any;
  size: number;
  color?: string;
}

export default function Icon({ source, size, color = colors.black }: IconProps) {
  return <Image source={source} style={{ width: size, height: size, tintColor: color }} />;
}
