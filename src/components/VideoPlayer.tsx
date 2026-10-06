import { useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useEvent, useEventListener } from 'expo';
import { VideoPlayer as ExpoVideoPlayer, VideoView } from 'expo-video';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, radius, spacing } from '../theme';
import { formatTime } from '../utils/formatTime';
import { tap } from '../utils/haptics';
import { ProgressBar } from './ProgressBar';

/** Video con controles propios del diseño: play rosa, barra de progreso, tiempo, silencio y pantalla completa. */
export function VideoPlayer({ player }: { player: ExpoVideoPlayer }) {
  const viewRef = useRef<VideoView>(null);
  const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });
  const { muted } = useEvent(player, 'mutedChange', { muted: player.muted });
  const { currentTime } = useEvent(player, 'timeUpdate', {
    currentTime: player.currentTime,
    currentLiveTimestamp: null,
    currentOffsetFromLive: null,
    bufferedPosition: 0,
  });
  const [duration, setDuration] = useState(player.duration);
  useEventListener(player, 'sourceLoad', (e) => setDuration(e.duration));
  const total = duration || player.duration;

  const toggle = () => {
    tap();
    if (isPlaying) {
      player.pause();
    } else {
      // Si terminó, vuelve a empezar.
      if (total && player.currentTime >= total - 0.3) player.currentTime = 0;
      player.play();
    }
  };

  return (
    <View style={{ gap: spacing.sm }}>
      <View style={styles.frame}>
        <VideoView
          ref={viewRef}
          player={player}
          style={StyleSheet.absoluteFill}
          nativeControls={false}
          contentFit="cover"
          onFirstFrameRender={() => setDuration(player.duration)}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={isPlaying ? 'Pausar video' : 'Reproducir video'}
          onPress={toggle}
          style={[StyleSheet.absoluteFill, styles.overlay, isPlaying && { backgroundColor: 'transparent' }]}
        >
          {isPlaying ? null : (
            <View style={styles.bigPlay}>
              <Ionicons name="play" size={30} color={colors.white} style={{ marginLeft: 4 }} />
            </View>
          )}
        </Pressable>
      </View>

      <ProgressBar
        progress={total ? currentTime / total : 0}
        onSeek={(ratio) => {
          if (total) player.currentTime = ratio * total;
        }}
      />

      <View style={styles.controls}>
        <Pressable accessibilityLabel={isPlaying ? 'Pausar' : 'Reproducir'} onPress={toggle} hitSlop={10}>
          <Ionicons name={isPlaying ? 'pause-circle-outline' : 'play-circle-outline'} size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.time}>
          {formatTime(currentTime)} / {formatTime(total)}
        </Text>
        <View style={{ flex: 1 }} />
        <Pressable
          accessibilityLabel={muted ? 'Activar sonido' : 'Silenciar'}
          onPress={() => {
            tap();
            player.muted = !muted;
          }}
          hitSlop={10}
        >
          <Ionicons name={muted ? 'volume-mute' : 'volume-high'} size={20} color={muted ? colors.primary : colors.text} />
        </Pressable>
        <Pressable accessibilityLabel="Pantalla completa" onPress={() => viewRef.current?.enterFullscreen()} hitSlop={10}>
          <Ionicons name="expand" size={20} color={colors.text} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: radius.xl,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  overlay: { alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.25)' },
  bigPlay: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOpacity: 0.6,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  controls: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg, marginTop: -spacing.xs },
  time: { fontSize: 12, fontFamily: fonts.medium, color: colors.textMuted, fontVariant: ['tabular-nums'] },
});
