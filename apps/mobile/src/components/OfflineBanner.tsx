import { useNetInfo } from '@react-native-community/netinfo';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { colors, fontSize, fontWeight, spacing } from '~/src/design/tokens';

export function OfflineBanner() {
  const { isConnected, isInternetReachable } = useNetInfo();
  const isOffline = isConnected === false || isInternetReachable === false;

  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue:         isOffline ? 1 : 0,
      duration:        300,
      useNativeDriver: true,
    }).start();
  }, [isOffline, opacity]);

  // Always rendered so the fade-out animation plays when coming back online.
  return (
    <Animated.View style={[styles.banner, { opacity }]} pointerEvents="none">
      <Text style={styles.text}>⚡ No internet connection — showing cached data</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor:   colors.warning,
    paddingVertical:   spacing.sm,
    paddingHorizontal: spacing.base,
    alignItems:        'center',
  },
  text: {
    color:      '#1a1a1a',
    fontSize:   fontSize.sm,
    fontWeight: fontWeight.medium,
    textAlign:  'center',
  },
});
