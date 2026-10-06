import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { mediaUrl } from '../config/environment';
import { colors, fonts, radius, spacing, typography } from '../theme';
import { Song } from '../types';

interface Props {
  song: Song;
  active: boolean;
  playing: boolean;
  favorite: boolean;
  onPress: () => void;
}

export function SongCard({ song, active, playing, favorite, onPress }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Reproducir ${song.title}`}
      onPress={onPress}
      style={({ pressed }) => [styles.row, active && styles.active, pressed && { opacity: 0.75 }]}
    >
      <Image source={{ uri: mediaUrl(song.coverUrl) }} style={styles.cover} contentFit="cover" />
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={[styles.title, active && { color: colors.primary }]} numberOfLines={1}>{song.title}</Text>
        <Text style={typography.caption} numberOfLines={1}>{song.artist} · {song.album}</Text>
      </View>
      {favorite ? <Ionicons name="heart" size={16} color={colors.primary} /> : null}
      {active ? (
        <Ionicons name={playing ? 'volume-high' : 'pause'} size={18} color={colors.primary} />
      ) : (
        <Ionicons name="play" size={16} color={colors.textMuted} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.sm,
    paddingRight: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  active: { backgroundColor: colors.primarySoft, borderColor: 'rgba(255,46,146,0.3)' },
  cover: { width: 48, height: 48, borderRadius: radius.md, backgroundColor: colors.surfaceAlt },
  title: { fontSize: 14, fontFamily: fonts.semibold, color: colors.text },
});
