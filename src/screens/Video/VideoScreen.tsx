import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../../components/ScreenContainer';
import { ErrorState, Loading } from '../../components/ScreenState';
import { mediaUrl } from '../../config/environment';
import { useFetch } from '../../hooks/useFetch';
import { usePlayer } from '../../hooks/usePlayer';
import { mediaService } from '../../services/media.service';
import { colors, radius, spacing, typography } from '../../theme';
import { Video } from '../../types';

/** Reproducción de contenido audiovisual con controles básicos (RF05). */
export function VideoScreen() {
  const { data, loading, error, reload } = useFetch(mediaService.videos);

  return (
    <ScreenContainer>
      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : data?.length ? (
        <VideoList videos={data} />
      ) : (
        <ErrorState message="No hay videos disponibles" />
      )}
    </ScreenContainer>
  );
}

function VideoList({ videos }: { videos: Video[] }) {
  const [selected, setSelected] = useState(videos[0]);
  const [initialSource] = useState(() => mediaUrl(videos[0].videoUrl));
  const player = useVideoPlayer(initialSource, (p) => {
    p.loop = false;
  });

  // Al cambiar de video, cargamos la nueva fuente en el mismo reproductor.
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    player.replaceAsync(mediaUrl(selected.videoUrl)).catch(() => {});
  }, [player, selected]);

  // Si suena música, la pausamos para que no se mezcle con el audio del video.
  const music = usePlayer();
  const musicRef = useRef(music);
  musicRef.current = music;
  useEffect(() => {
    const sub = player.addListener('playingChange', ({ isPlaying }) => {
      if (isPlaying && musicRef.current.isPlaying) musicRef.current.togglePlay();
    });
    return () => sub.remove();
  }, [player]);

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <VideoView player={player} style={styles.video} nativeControls contentFit="contain" />
      <View style={{ gap: spacing.xs }}>
        <Text style={typography.subtitle}>{selected.title}</Text>
        <Text style={[typography.body, { color: colors.textMuted }]}>{selected.description}</Text>
      </View>

      <Text style={[typography.label, { marginTop: spacing.sm }]}>Más videos</Text>
      {videos.map((v) => {
        const active = v.id === selected.id;
        return (
          <Pressable key={v.id} onPress={() => setSelected(v)} style={[styles.item, active && styles.itemActive]}>
            <Ionicons name={active ? 'play-circle' : 'play-circle-outline'} size={28} color={active ? colors.primary : colors.textMuted} />
            <Text style={[typography.body, { flex: 1 }, active && { color: colors.primary, fontWeight: '600' }]} numberOfLines={1}>
              {v.title}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: spacing.lg, gap: spacing.md },
  video: { width: '100%', aspectRatio: 16 / 9, borderRadius: radius.md, backgroundColor: '#000', overflow: 'hidden' },
  item: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md, borderRadius: radius.md, backgroundColor: colors.surface },
  itemActive: { backgroundColor: colors.primarySoft },
});
