import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { mediaUrl } from '../config/environment';
import { usePlayer } from '../hooks/usePlayer';
import { colors, fonts, radius, spacing, typography } from '../theme';
import { formatTime } from '../utils/formatTime';
import { tap } from '../utils/haptics';
import { ProgressBar } from './ProgressBar';

/** Canción actual con controles de reproducción: anterior, reproducir/pausar y siguiente (RF07). */
export function MusicPlayer() {
  const { current, isPlaying, position, duration, togglePlay, next, previous, seek, queue } = usePlayer();
  const disabled = queue.length === 0;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {current ? (
          <Image source={{ uri: mediaUrl(current.coverUrl) }} style={styles.cover} contentFit="cover" />
        ) : (
          <View style={[styles.cover, styles.placeholder]}>
            <Ionicons name="musical-notes" size={28} color={colors.primary} />
          </View>
        )}
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={typography.accentLabel}>{isPlaying ? 'Sonando ahora' : current ? 'En pausa' : 'Reproductor'}</Text>
          <Text style={typography.subtitle} numberOfLines={1}>{current?.title ?? 'Nada sonando'}</Text>
          <Text style={typography.caption} numberOfLines={1}>
            {current ? `${current.artist} · ${current.album}` : 'Pulsa reproducir o elige una canción'}
          </Text>
        </View>
      </View>

      <View>
        <ProgressBar progress={duration > 0 ? position / duration : 0} onSeek={current ? (r) => seek(r * duration) : undefined} />
        <View style={styles.times}>
          <Text style={styles.time}>{formatTime(position)}</Text>
          <Text style={styles.time}>{formatTime(duration)}</Text>
        </View>
      </View>

      <View style={styles.controls}>
        <ControlButton icon="play-skip-back" label="Anterior" onPress={previous} disabled={disabled} />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={isPlaying ? 'Pausar' : 'Reproducir'}
          onPress={() => {
            tap();
            togglePlay();
          }}
          disabled={disabled}
          style={({ pressed }) => [styles.playButton, pressed && { transform: [{ scale: 0.94 }] }, disabled && { opacity: 0.5 }]}
        >
          <Ionicons name={isPlaying ? 'pause' : 'play'} size={28} color={colors.white} style={!isPlaying && { marginLeft: 3 }} />
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
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={() => {
        tap();
        onPress();
      }}
      disabled={disabled}
      hitSlop={12}
      style={({ pressed }) => [styles.sideButton, (pressed || disabled) && { opacity: 0.5 }]}
    >
      <Ionicons name={icon} size={24} color={colors.text} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  cover: { width: 76, height: 76, borderRadius: radius.lg, backgroundColor: colors.surfaceAlt },
  placeholder: { alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primarySoft },
  times: { flexDirection: 'row', justifyContent: 'space-between', marginTop: -4 },
  time: { fontSize: 11, fontFamily: fonts.medium, color: colors.textMuted, fontVariant: ['tabular-nums'] },
  controls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xxl },
  sideButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOpacity: 0.5,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
});
