import { Tabs } from 'expo-router';
import { Animated, Easing } from 'react-native';
import { AnimatedTabBar } from '~/src/components/ui/AnimatedTabBar';
import { colors } from '~/src/design/tokens';

type SceneInterpolatorProps = { current: { progress: Animated.Value } };

function tabSceneInterpolator({ current }: SceneInterpolatorProps) {
  const opacity = current.progress.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [0, 1, 0],
    extrapolate: 'clamp',
  });
  const scale = current.progress.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [0.96, 1, 0.96],
    extrapolate: 'clamp',
  });
  return { sceneStyle: { opacity, transform: [{ scale }] } };
}

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={props => <AnimatedTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        headerStyle: { backgroundColor: colors.bgBase },
        headerTintColor: colors.textPrimary,
        headerShadowVisible: false,
        headerTitleAlign: 'left',
        sceneStyleInterpolator: tabSceneInterpolator,
        transitionSpec: {
          animation: 'timing',
          config: {
            duration: 240,
            easing: Easing.bezier(0.4, 0, 0.2, 1),
          },
        },
      }}
    >
      <Tabs.Screen name="dashboard" options={{ title: 'Dashboard' }} />
      <Tabs.Screen name="accounts" options={{ title: 'Accounts' }} />
      <Tabs.Screen name="transactions" options={{ title: 'Transactions' }} />
      <Tabs.Screen name="categories" options={{ title: 'Categories' }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
    </Tabs>
  );
}
