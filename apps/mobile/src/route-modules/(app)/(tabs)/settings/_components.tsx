import { Pressable, Text, View } from 'react-native';
import { colors } from '~/src/design/tokens';
import { styles } from './_styles';
import type { SettingsRowProps } from './_types';

export function SettingsRow({
  label,
  value,
  onPress,
  destructive = false,
  rightSlot,
  disabled = false,
}: SettingsRowProps) {
  return (
    <Pressable
      style={[styles.row, disabled && styles.rowDisabled]}
      onPress={onPress}
      disabled={disabled || !onPress}
    >
      <Text style={[styles.rowLabel, destructive && styles.rowLabelDestructive]}>{label}</Text>
      {rightSlot ?? (
        <View style={styles.rowRight}>
          {value != null && (
            <Text style={styles.rowValue} numberOfLines={1}>
              {value}
            </Text>
          )}
          {onPress != null && <Text style={styles.rowChevron}>›</Text>}
        </View>
      )}
    </Pressable>
  );
}

export function MonobankStatusDot({ isConnected }: { isConnected: boolean }) {
  return (
    <View style={styles.statusRow}>
      <View
        style={[
          styles.statusDot,
          { backgroundColor: isConnected ? colors.success : colors.textMuted },
        ]}
      />
      <Text style={[styles.statusText, { color: isConnected ? colors.success : colors.textMuted }]}>
        {isConnected ? 'Connected' : 'Not connected'}
      </Text>
    </View>
  );
}
