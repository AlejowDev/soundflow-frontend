import { Pressable, StyleSheet, Text, View } from 'react-native';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../hooks/useAuth';
import { usePlayer } from '../hooks/usePlayer';
import { colors, fonts, radius, spacing } from '../theme';
import { tap } from '../utils/haptics';

type IconName = keyof typeof Ionicons.glyphMap;

export const MENU_ICONS: Record<string, IconName> = {
  Perfil: 'person-circle',
  Fotos: 'image',
  Video: 'play-circle',
  Web: 'globe',
  Botones: 'options',
};

/** Menú maestro: siempre visible a la izquierda (RF01 / RF08). */
export function SideMenu({ state, navigation }: DrawerContentComponentProps) {
  const insets = useSafeAreaInsets();
  const { logout } = useAuth();
  const { stop } = usePlayer();

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.lg, paddingBottom: insets.bottom + spacing.lg }]}>
      <LinearGradient colors={[colors.primary, '#B0186A']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.logo}>
        <Ionicons name="pulse" size={22} color={colors.white} />
      </LinearGradient>

      <View style={styles.items}>
        {state.routes.map((route, i) => {
          const active = state.index === i;
          const icon = MENU_ICONS[route.name];
          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityLabel={route.name}
              accessibilityState={{ selected: active }}
              onPress={() => {
                tap();
                navigation.navigate(route.name);
              }}
              style={({ pressed }) => [styles.item, pressed && { opacity: 0.7 }]}
            >
              {active ? <View style={styles.indicator} /> : null}
              <View style={[styles.iconWrap, active && styles.iconWrapActive]}>
                <Ionicons
                  name={active ? icon : (`${icon}-outline` as IconName)}
                  size={22}
                  color={active ? colors.primary : colors.textMuted}
                />
              </View>
              <Text style={[styles.label, active && styles.labelActive]} numberOfLines={1}>
                {route.name}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Cerrar sesión"
        onPress={async () => {
          tap();
          stop();
          await logout();
        }}
        style={({ pressed }) => [styles.item, pressed && { opacity: 0.7 }]}
      >
        <View style={styles.iconWrap}>
          <Ionicons name="log-out-outline" size={22} color={colors.textMuted} />
        </View>
        <Text style={styles.label}>Salir</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  logo: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  items: { flex: 1, gap: spacing.sm, width: '100%' },
  item: { width: '100%', alignItems: 'center', paddingVertical: spacing.sm, gap: 4 },
  indicator: {
    position: 'absolute',
    left: 0,
    top: 12,
    bottom: 26,
    width: 3,
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
    backgroundColor: colors.primary,
  },
  iconWrap: { width: 44, height: 40, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  iconWrapActive: { backgroundColor: colors.primarySoft },
  label: { fontSize: 11, fontFamily: fonts.medium, color: colors.textMuted },
  labelActive: { color: colors.primary, fontFamily: fonts.semibold },
});
