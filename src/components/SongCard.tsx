import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { mediaUrl } from '../config/environment';
import { colors, radius, spacing, typography } from '../theme';
import { Song } from '../types';

interface Props {
  song: Song;
  active: boolean;
  playing: boolean;
  onPress: () => void;
}

export function SongCard({ song, active, playing, onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, active && styles.active, pressed && { opacity: 0.7 }]}>
      <Image source={{ uri: mediaUrl(song.coverUrl) }} style={styles.cover} contentFit="cover" />
      <View style={{ flex: 1 }}>
        <Text style={[styles.title, active && { color: colors.primary }]} numberOfLines={1}>{song.title}</Text>
        <Text style={typography.caption} numberOfLines={1}>{song.artist}</Text>
      </View>
      {active ? <Ionicons name={playing ? 'volume-high' : 'pause'} size={18} color={colors.primary} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.sm, borderRadius: radius.md },
  active: { backgroundColor: colors.surface },
  cover: { width: 44, height: 44, borderRadius: radius.sm, backgroundColor: colors.surfaceAlt },
  title: { fontSize: 14, fontWeight: '600', color: colors.text },
});
