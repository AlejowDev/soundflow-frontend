import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { mediaUrl } from '../config/environment';
import { usePlayer } from '../hooks/usePlayer';
import { colors, radius, spacing, typography } from '../theme';

/** Barra compacta que muestra la canción actual mientras se navega por otras secciones. */
export function MiniPlayer() {
  const { current, isPlaying, togglePlay, next, position, duration } = usePlayer();
  if (!current) return null;
  const progress = duration > 0 ? Math.min(position / duration, 1) : 0;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Image source={{ uri: mediaUrl(current.coverUrl) }} style={styles.cover} contentFit="cover" />
        <View style={{ flex: 1 }}>
          <Text style={styles.title} numberOfLines={1}>{current.title}</Text>
          <Text style={typography.caption} numberOfLines={1}>{current.artist}</Text>
        </View>
        <Pressable accessibilityLabel={isPlaying ? 'Pausar' : 'Reproducir'} onPress={togglePlay} hitSlop={10}>
          <Ionicons name={isPlaying ? 'pause' : 'play'} size={24} color={colors.text} />
        </Pressable>
        <Pressable accessibilityLabel="Siguiente" onPress={next} hitSlop={10}>
          <Ionicons name="play-skip-forward" size={20} color={colors.text} />
        </Pressable>
      </View>
      <View style={styles.bar}>
        <View style={[styles.barFill, { width: `${progress * 100}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { margin: spacing.sm, backgroundColor: colors.surfaceAlt, borderRadius: radius.md, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.sm, paddingRight: spacing.md },
  cover: { width: 38, height: 38, borderRadius: radius.sm },
  title: { fontSize: 13, fontWeight: '600', color: colors.text },
  bar: { height: 2, backgroundColor: colors.border },
  barFill: { height: '100%', backgroundColor: colors.primary },
});
