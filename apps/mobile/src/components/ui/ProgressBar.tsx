import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, radius } from '~/src/design/tokens';

interface ProgressBarProps {
  progress: number;
  color?: string;
  height?: number;
}

export function ProgressBar({ progress, color = colors.brand, height = 8 }: ProgressBarProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <View style={[styles.barContainer, { height }]}>
      <View style={[styles.fill, { width: `${clampedProgress}%`, backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  barContainer: {
    width: '100%',
    backgroundColor: colors.bgMuted,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: radius.full,
  },
});
