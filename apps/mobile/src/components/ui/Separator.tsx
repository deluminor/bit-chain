import { View, StyleSheet } from 'react-native';
import { colors } from '~/src/design/tokens';

/**
 * Horizontal hairline separator.
 * Use between list items or to divide card sections.
 */
export function Separator() {
  return <View style={styles.line} />;
}

const styles = StyleSheet.create({
  line: {
    height:          StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
});
