import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';
import { colors, fontSize, fontWeight } from '~/src/design/tokens';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];


interface TabIconProps {
  name: IoniconsName;
  focused: boolean;
  size: number;
}

function TabIcon({ name, focused, size }: TabIconProps) {
  return (
    <Ionicons name={name} size={size} color={focused ? colors.tabActive : colors.tabInactive} />
  );
}


const ICONS: Record<string, { focused: IoniconsName; default: IoniconsName }> = {
  dashboard: { focused: 'home', default: 'home-outline' },
  accounts: { focused: 'wallet', default: 'wallet-outline' },
  transactions: { focused: 'list', default: 'list-outline' },
  categories: { focused: 'grid', default: 'grid-outline' },
  settings: { focused: 'settings', default: 'settings-outline' },
};


export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => {
        const iconSet = ICONS[route.name];

        return {
          // Hide the navigator header globally by default, but allow screens to opt-in
          headerShown: false,

          // Header styles (for screens that set headerShown: true)
          headerStyle: { backgroundColor: colors.bgBase },
          headerTintColor: colors.textPrimary,
          headerShadowVisible: false,
          headerTitleAlign: 'left',

          // Tab bar
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: colors.tabActive,
          tabBarInactiveTintColor: colors.tabInactive,
          tabBarLabelStyle: styles.tabLabel,

          // Icon
          tabBarIcon: ({ focused, size }) =>
            iconSet ? (
              <TabIcon
                name={focused ? iconSet.focused : iconSet.default}
                focused={focused}
                size={size}
              />
            ) : null,
        };
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

const styles = StyleSheet.create({
  headerTitle: {
    fontWeight: fontWeight.semibold,
    fontSize: fontSize.lg,
    color: colors.textPrimary,
  },
  tabBar: {
    backgroundColor: colors.bgBase,
    borderTopColor: colors.border,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  tabLabel: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
  },
});
