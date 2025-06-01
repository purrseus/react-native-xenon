import { Text, type TextProps } from 'react-native';
import { shareText } from '../../../core/utils';

interface ShareableTextProps extends TextProps {
  children: string | string[];
}

export default function ShareableText({ children, ...props }: ShareableTextProps) {
  return (
    <Text
      selectionColor={'transparent'}
      suppressHighlighting={true}
      onLongPress={async () => {
        shareText(Array.isArray(children) ? children.join('') : children);
      }}
      {...props}
    >
      {children}
    </Text>
  );
}
