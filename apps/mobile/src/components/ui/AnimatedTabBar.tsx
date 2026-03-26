import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { colors } from '~/src/design/tokens';

// ─── Types ────────────────────────────────────────────────────────────────────

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

/** Extracted directly from expo-router so it always matches the actual contract. */
type TabBarProps = Parameters<NonNullable<React.ComponentProps<typeof Tabs>['tabBar']>>[0];

// ─── Constants ────────────────────────────────────────────────────────────────

const MARGIN_H = 0;
const BAR_H = 64;
const BUBBLE = 58;
const CORNER = 18;
const NOTCH_W = 25; // notch half-width at bar top edge
const NOTCH_D = 26; // notch depth into the bar

const OVERFLOW = Math.round(BUBBLE * 0.2);

const ICONS: Record<string, { active: IoniconsName; inactive: IoniconsName }> = {
  dashboard: { active: 'home', inactive: 'home-outline' },
  accounts: { active: 'wallet', inactive: 'wallet-outline' },
  transactions: { active: 'list', inactive: 'list-outline' },
  categories: { active: 'grid', inactive: 'grid-outline' },
  settings: { active: 'settings', inactive: 'settings-outline' },
};

function tabCX(index: number, count: number, barWidth: number): number {
  const tabW = barWidth / count;
  return MARGIN_H + tabW * index + tabW / 2;
}

function makePath(cx: number, barWidth: number): string {
  const x = cx - MARGIN_H; // bar-relative
  const W = barWidth;
  const H = BAR_H;
  const r = CORNER;
  // Clamp notch shoulders so they never bleed into the rounded corners
  const nL = Math.max(r + 2, x - NOTCH_W);
  const nR = Math.min(W - r - 2, x + NOTCH_W);

  return [
    `M ${r} 0`,
    `L ${nL} 0`,
    `C ${x - 10} 0 ${x - 5} ${NOTCH_D} ${x} ${NOTCH_D}`,
    `C ${x + 5} ${NOTCH_D} ${x + 10} 0 ${nR} 0`,
    `L ${W - r} 0`,
    `Q ${W} 0 ${W} ${r}`,
    `L ${W} ${H - r}`,
    `Q ${W} ${H} ${W - r} ${H}`,
    `L ${r} ${H}`,
    `Q 0 ${H} 0 ${H - r}`,
    `L 0 ${r}`,
    `Q 0 0 ${r} 0`,
    `Z`,
  ].join(' ');
}

export function AnimatedTabBar({ state, navigation }: TabBarProps) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const count = state.routes.length;
  const barWidth = width - MARGIN_H * 2;

  const initialX = tabCX(state.index, count, barWidth);

  const animX = useRef(new Animated.Value(initialX)).current;
  const bubbleScale = useRef(new Animated.Value(1)).current;

  const [path, setPath] = useState(() => makePath(initialX, barWidth));

  useEffect(() => {
    const id = animX.addListener(({ value }) => setPath(makePath(value, barWidth)));
    return () => animX.removeListener(id);
  }, [animX, barWidth]);

  useEffect(() => {
    Animated.spring(animX, {
      toValue: tabCX(state.index, count, barWidth),
      useNativeDriver: false,
      tension: 50,
      friction: 7,
    }).start();

    bubbleScale.setValue(0.82);
    Animated.spring(bubbleScale, {
      toValue: 1,
      useNativeDriver: true,
      tension: 140,
      friction: 6,
    }).start();
  }, [animX, barWidth, bubbleScale, count, state.index]);

  const containerH = BAR_H + insets.bottom;
  const bubbleLeft = Animated.subtract(animX, BUBBLE / 2);

  return (
    <>
      <View style={{ height: insets.bottom }} />

      <View style={[styles.container, { height: containerH }]}>
        {insets.bottom > 0 && (
          <View style={[styles.safeAreaFill, { top: BAR_H, height: insets.bottom }]} />
        )}

        <View style={[styles.barWrap, { top: 0 }]}>
          <Svg width={barWidth} height={BAR_H} style={styles.svgTransparent}>
            <Path d={path} fill={colors.bgSurface} />
          </Svg>
        </View>

        <View
          style={[styles.tabRow, { top: 0, height: BAR_H, width: barWidth }]}
          pointerEvents="box-none"
        >
          {state.routes.map((route, index) => {
            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            if (isFocused) {
              return <View key={route.key} style={styles.tabSlot} />;
            }

            const icons = ICONS[route.name as keyof typeof ICONS];
            return (
              <Pressable
                key={route.key}
                style={({ pressed }) => [styles.tabSlot, pressed && styles.tabSlotPressed]}
                onPress={onPress}
                hitSlop={8}
              >
                <Ionicons
                  name={icons?.inactive ?? 'ellipse-outline'}
                  size={22}
                  color={colors.textMuted}
                />
              </Pressable>
            );
          })}
        </View>

        <Animated.View style={[styles.bubbleOuter, { left: bubbleLeft, top: -OVERFLOW }]}>
          <Animated.View style={[styles.bubble, { transform: [{ scale: bubbleScale }] }]}>
            <Ionicons
              name={
                ICONS[state.routes[state.index]?.name as keyof typeof ICONS]?.active ?? 'ellipse'
              }
              size={26}
              color={colors.white}
            />
          </Animated.View>
        </Animated.View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    overflow: 'visible',
  },
  barWrap: {
    position: 'absolute',
    left: MARGIN_H,
    backgroundColor: 'transparent',
  },
  svgTransparent: {
    backgroundColor: 'transparent',
  },
  tabRow: {
    position: 'absolute',
    left: MARGIN_H,
    flexDirection: 'row',
  },
  tabSlot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabSlotPressed: {
    opacity: 0.5,
  },
  safeAreaFill: {
    position: 'absolute',
    left: MARGIN_H,
    right: MARGIN_H,
    borderTopLeftRadius: CORNER,
    borderTopRightRadius: CORNER,
    backgroundColor: colors.bgBase,
  },
  bubbleOuter: {
    position: 'absolute',
    width: BUBBLE,
    height: BUBBLE,
  },
  bubble: {
    width: BUBBLE,
    height: BUBBLE,
    borderRadius: BUBBLE / 2,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.brand,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 10,
  },
});
