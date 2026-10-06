import { Pressable, StyleSheet, Text, View } from 'react-native';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, spacing } from '../theme';

export const MENU_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  Perfil: 'person-circle',
  Fotos: 'images',
  Video: 'film',
  Web: 'globe',
  Botones: 'musical-notes',
};

/** Menú maestro: siempre visible a la izquierda (RF01 / RF08). */
export function SideMenu({ state, navigation }: DrawerContentComponentProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.lg, paddingBottom: insets.bottom + spacing.lg }]}>
      <View style={styles.logo}>
        <Ionicons name="pulse" size={22} color={colors.white} />
      </View>

      <View style={styles.items}>
        {state.routes.map((route, i) => {
          const active = state.index === i;
          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              onPress={() => navigation.navigate(route.name)}
              style={[styles.item, active && styles.itemActive]}
            >
              <Ionicons
                name={active ? MENU_ICONS[route.name] : (`${MENU_ICONS[route.name]}-outline` as keyof typeof Ionicons.glyphMap)}
                size={24}
                color={active ? colors.primary : colors.textMuted}
              />
              <Text style={[styles.label, active && { color: colors.text }]} numberOfLines={1}>
                {route.name}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', backgroundColor: colors.surface },
  logo: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  items: { gap: spacing.sm, width: '100%', paddingHorizontal: spacing.sm },
  item: { alignItems: 'center', paddingVertical: spacing.md, borderRadius: radius.md, gap: spacing.xs },
  itemActive: { backgroundColor: colors.primarySoft },
  label: { fontSize: 11, fontWeight: '600', color: colors.textMuted },
});
