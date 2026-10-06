import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useVideoPlayer } from 'expo-video';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { SectionTitle } from '../../components/Card';
import { ScreenContainer } from '../../components/ScreenContainer';
import { ErrorState, Loading } from '../../components/ScreenState';
import { VideoPlayer } from '../../components/VideoPlayer';
import { mediaUrl } from '../../config/environment';
import { useFetch } from '../../hooks/useFetch';
import { usePlayer } from '../../hooks/usePlayer';
import { mediaService } from '../../services/media.service';
import { colors, fonts, radius, spacing, typography } from '../../theme';
import { Video } from '../../types';
import { formatTime } from '../../utils/formatTime';
import { tap } from '../../utils/haptics';

/** Reproducción de contenido audiovisual con controles básicos (RF05). */
export function VideoScreen() {
  const { data, loading, error, reload } = useFetch(mediaService.videos);

  return (
    <ScreenContainer title="Video Player" subtitle="Videoclips y directos en alta definición">
      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : data?.length ? (
        <VideoList videos={data} />
      ) : (
        <ErrorState message="No hay videos disponibles" icon="videocam-off-outline" />
      )}
    </ScreenContainer>
  );
}

function VideoList({ videos }: { videos: Video[] }) {
  const [selected, setSelected] = useState(videos[0]);
  const [initialSource] = useState(() => mediaUrl(videos[0].videoUrl));
  const player = useVideoPlayer(initialSource, (p) => {
    p.loop = false;
    p.timeUpdateEventInterval = 0.25;
  });

  // Al cambiar de video, cargamos la nueva fuente en el mismo reproductor y la reproducimos.
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    player
      .replaceAsync(mediaUrl(selected.videoUrl))
      .then(() => player.play())
      .catch(() => {});
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

  const related = videos.filter((v) => v.id !== selected.id);

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <VideoPlayer player={player} />

      <View style={styles.info}>
        <Text style={typography.title}>{selected.title}</Text>
        <Text style={styles.author}>{selected.author}</Text>
        <Text style={typography.caption}>{selected.description}</Text>
      </View>

      <View style={styles.divider} />

      <SectionTitle>Videos Relacionados</SectionTitle>
      {related.map((v) => (
        <Pressable
          key={v.id}
          accessibilityRole="button"
          accessibilityLabel={`Reproducir ${v.title}`}
          onPress={() => {
            tap();
            setSelected(v);
          }}
          style={({ pressed }) => [styles.item, pressed && { opacity: 0.75 }]}
        >
          <View>
            <Image source={{ uri: mediaUrl(v.thumbnailUrl) }} style={styles.thumb} contentFit="cover" transition={150} />
            <View style={styles.duration}>
              <Text style={styles.durationText}>{formatTime(v.duration)}</Text>
            </View>
          </View>
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={styles.itemTitle} numberOfLines={2}>{v.title}</Text>
            <Text style={typography.caption} numberOfLines={1}>{v.author}</Text>
          </View>
          <Ionicons name="play-circle" size={28} color={colors.primary} />
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xl },
  info: { gap: 4, marginTop: spacing.xs },
  author: { fontSize: 13, fontFamily: fonts.semibold, color: colors.primary },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.xs },
  item: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  thumb: { width: 112, aspectRatio: 16 / 9, borderRadius: radius.md, backgroundColor: colors.surfaceAlt },
  duration: {
    position: 'absolute',
    right: 6,
    bottom: 6,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
    backgroundColor: 'rgba(0,0,0,0.75)',
  },
  durationText: { fontSize: 10, fontFamily: fonts.semibold, color: colors.white },
  itemTitle: { fontSize: 14, fontFamily: fonts.semibold, color: colors.text },
});
