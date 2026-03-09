import { Pressable, Text } from 'react-native';
import { tabHeaderStyles as styles } from '~/src/styles/tabHeader.styles';

export function SyncButton({
  isSyncing,
  onPress,
}: {
  isSyncing: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={[styles.syncBtn, isSyncing && styles.syncBtnDisabled]}
      onPress={onPress}
      disabled={isSyncing}
    >
      <Text style={styles.syncBtnText}>{isSyncing ? '…' : '↻'}</Text>
    </Pressable>
  );
}
