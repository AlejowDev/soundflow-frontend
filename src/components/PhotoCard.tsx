import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { mediaUrl } from '../config/environment';
import { colors, fonts, radius, spacing, typography } from '../theme';
import { Photo } from '../types';

interface Props {
  photo: Photo;
  selected: boolean;
  onPress: () => void;
  onExpand: () => void;
}

/** Tarjeta de la galería; al seleccionarla se resalta y muestra la descripción completa (RF04). */
export function PhotoCard({ photo, selected, onPress, onExpand }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [styles.card, selected && styles.selected, pressed && { opacity: 0.9 }]}
    >
      <View>
        <Image source={{ uri: mediaUrl(photo.imageUrl) }} style={styles.image} contentFit="cover" transition={200} />
        {selected ? (
          <View style={styles.badge}>
            <View style={styles.dot} />
            <Text style={styles.badgeText}>Seleccionado</Text>
          </View>
        ) : null}
        <Pressable accessibilityLabel="Ver imagen completa" onPress={onExpand} hitSlop={8} style={styles.expand}>
          <Ionicons name="expand" size={16} color={colors.white} />
        </Pressable>
      </View>
      <View style={styles.info}>
        <Text style={styles.subtitle}>{photo.subtitle}</Text>
        <Text style={styles.title}>{photo.title}</Text>
        <Text style={typography.caption} numberOfLines={selected ? undefined : 2}>{photo.description}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selected: { borderColor: colors.primary, backgroundColor: colors.surfaceAlt },
  image: { width: '100%', aspectRatio: 16 / 10, backgroundColor: colors.surfaceAlt },
  badge: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
  },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.white },
  badgeText: { fontSize: 10, fontFamily: fonts.bold, color: colors.white, textTransform: 'uppercase', letterSpacing: 0.8 },
  expand: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { padding: spacing.lg, gap: 4 },
  subtitle: { fontSize: 11, fontFamily: fonts.bold, color: colors.primary, textTransform: 'uppercase', letterSpacing: 0.8 },
  title: { fontSize: 17, fontFamily: fonts.bold, color: colors.text },
});
