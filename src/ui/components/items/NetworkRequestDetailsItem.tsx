import { StyleSheet, Text, View } from 'react-native';
import colors from '../../../theme/colors';
import { showNewLine } from '../../../core/utils';
import ShareableText from '../common/ShareableText';

interface NetworkRequestDetailsItemProps {
  label: string;
  content: string | [string, string][];
}

export default function NetworkRequestDetailsItem({
  label,
  content,
}: NetworkRequestDetailsItemProps) {
  const renderContent = () => {
    switch (true) {
      case typeof content === 'string':
        return (
          <ShareableText style={styles.text}>
            {content}
            {showNewLine(!content.endsWith('\n'))}
          </ShareableText>
        );
      case Array.isArray(content):
        return (
          <View>
            {content.map(([key, value], index) => (
              <View style={styles.pairContainer} key={`${key}-${index}`}>
                <Text style={[styles.label, styles.subLabel]}>
                  {key}
                  {':'}
                </Text>

                <ShareableText style={styles.text}>
                  {value}
                  {showNewLine(index === content.length - 1)}
                </ShareableText>
              </View>
            ))}
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    rowGap: 2,
  },
  pairContainer: {
    flexDirection: 'row',
    columnGap: 4,
  },
  text: {
    fontSize: 14,
    fontWeight: 'normal',
    color: colors.black,
    flexShrink: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.black,
  },
  subLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
