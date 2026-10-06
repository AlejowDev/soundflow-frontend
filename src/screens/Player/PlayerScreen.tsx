import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MusicPlayer } from '../../components/MusicPlayer';
import { ScreenContainer } from '../../components/ScreenContainer';
import { ErrorState, Loading } from '../../components/ScreenState';
import { SongCard } from '../../components/SongCard';
import { useFetch } from '../../hooks/useFetch';
import { usePlayer } from '../../hooks/usePlayer';
import { mediaService } from '../../services/media.service';
import { colors, radius, spacing, typography } from '../../theme';

/** Sección "Botones": controles de reproducción musical y lista de canciones (RF07). */
export function PlayerScreen() {
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState('');
  const { data, loading, error, reload } = useFetch(() => mediaService.songs(search), [search]);
  const { current, isPlaying, playSong, setQueue, queue } = usePlayer();

  // Debounce de la búsqueda para no llamar a la API en cada tecla.
  useEffect(() => {
    const t = setTimeout(() => setSearch(query.trim()), 350);
    return () => clearTimeout(t);
  }, [query]);

  // La primera carga (sin búsqueda) define la cola de reproducción.
  useEffect(() => {
    if (data && !search && queue.length === 0) setQueue(data);
  }, [data, search, queue.length, setQueue]);

  const songs = data ?? [];

  return (
    <ScreenContainer hideMiniPlayer>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <MusicPlayer />

        <View style={styles.search}>
          <Ionicons name="search" size={18} color={colors.textMuted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Buscar canción o artista"
            placeholderTextColor={colors.textMuted}
            style={styles.input}
            autoCorrect={false}
          />
        </View>

        <Text style={typography.label}>Canciones</Text>
        {loading && !data ? (
          <Loading />
        ) : error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : songs.length === 0 ? (
          <Text style={[typography.body, { color: colors.textMuted }]}>Sin resultados para “{search}”.</Text>
        ) : (
          songs.map((song) => (
            <SongCard
              key={song.id}
              song={song}
              active={current?.id === song.id}
              playing={isPlaying}
              onPress={() => {
                // Si se eligió desde una búsqueda, la cola pasa a ser esos resultados.
                if (!queue.some((s) => s.id === song.id) || search) setQueue(songs);
                playSong(song);
              }}
            />
          ))
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: spacing.lg, gap: spacing.md },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
  },
  input: { flex: 1, height: 42, color: colors.text, fontSize: 14 },
});
