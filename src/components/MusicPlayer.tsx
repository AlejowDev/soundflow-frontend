import { useState } from 'react';
import { LayoutChangeEvent, Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { mediaUrl } from '../config/environment';
import { usePlayer } from '../hooks/usePlayer';
import { colors, radius, spacing, typography } from '../theme';
import { formatTime } from '../utils/formatTime';

/** Controles de reproducción: anterior, reproducir/pausar y siguiente (RF07). */
export function MusicPlayer() {
  const { current, isPlaying, position, duration, togglePlay, next, previous, seek, queue } = usePlayer();
  const [barWidth, setBarWidth] = useState(0);
  const progress = duration > 0 ? Math.min(position / duration, 1) : 0;
  const disabled = queue.length === 0;

  return (
    <View style={styles.container}>
      <View style={styles.coverWrap}>
        {current ? (
          <Image source={{ uri: mediaUrl(current.coverUrl) }} style={styles.cover} contentFit="cover" />
        ) : (
          <View style={[styles.cover, styles.placeholder]}>
            <Ionicons name="musical-notes" size={48} color={colors.textMuted} />
          </View>
        )}
      </View>

      <View style={{ alignItems: 'center', gap: 2 }}>
        <Text style={typography.subtitle} numberOfLines={1}>{current?.title ?? 'Nada sonando'}</Text>
        <Text style={typography.caption} numberOfLines={1}>
          {current ? `${current.artist} · ${current.album}` : 'Pulsa play o elige una canción'}
        </Text>
      </View>

      <View style={{ gap: spacing.xs }}>
        <Pressable
          onLayout={(e: LayoutChangeEvent) => setBarWidth(e.nativeEvent.layout.width)}
          onPress={(e) => current && barWidth && seek((e.nativeEvent.locationX / barWidth) * duration)}
          style={styles.barHitArea}
        >
          <View style={styles.bar}>
            <View style={[styles.barFill, { width: `${progress * 100}%` }]} />
          </View>
        </Pressable>
        <View style={styles.times}>
          <Text style={typography.caption}>{formatTime(position)}</Text>
          <Text style={typography.caption}>{formatTime(duration)}</Text>
        </View>
      </View>

      <View style={styles.controls}>
        <ControlButton icon="play-skip-back" label="Anterior" onPress={previous} disabled={disabled} />
        <Pressable
          accessibilityLabel={isPlaying ? 'Pausar' : 'Reproducir'}
          onPress={togglePlay}
          disabled={disabled}
          style={({ pressed }) => [styles.playButton, (pressed || disabled) && { opacity: 0.7 }]}
        >
          <Ionicons name={isPlaying ? 'pause' : 'play'} size={30} color={colors.white} style={!isPlaying && { marginLeft: 3 }} />
        </Pressable>
        <ControlButton icon="play-skip-forward" label="Siguiente" onPress={next} disabled={disabled} />
      </View>
    </View>
  );
}

function ControlButton({ icon, label, onPress, disabled }: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityLabel={label}
      onPress={onPress}
      disabled={disabled}
      hitSlop={12}
      style={({ pressed }) => [styles.sideButton, (pressed || disabled) && { opacity: 0.5 }]}
    >
      <Ionicons name={icon} size={26} color={colors.text} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.lg },
  coverWrap: { alignItems: 'center' },
  cover: { width: '80%', maxWidth: 260, aspectRatio: 1, borderRadius: radius.lg, backgroundColor: colors.surfaceAlt },
  placeholder: { alignItems: 'center', justifyContent: 'center' },
  barHitArea: { paddingVertical: spacing.sm },
  bar: { height: 4, borderRadius: 2, backgroundColor: colors.border, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: colors.primary },
  times: { flexDirection: 'row', justifyContent: 'space-between' },
  controls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xl },
  sideButton: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
