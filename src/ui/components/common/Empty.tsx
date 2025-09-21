import type { PropsWithChildren } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Empty({ children }: PropsWithChildren) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, alignItems: 'center', justifyContent: 'center' },
  text: { textAlign: 'center' },
});
