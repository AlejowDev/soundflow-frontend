import { ReactNode, useEffect, useState } from 'react';
import { Linking, ScrollView, Share, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { IconButton } from '../../components/IconButton';
import { MusicPlayer } from '../../components/MusicPlayer';
import { ScreenContainer } from '../../components/ScreenContainer';
import { ErrorState, Loading } from '../../components/ScreenState';
import { SongCard } from '../../components/SongCard';
import { mediaUrl } from '../../config/environment';
import { useFetch } from '../../hooks/useFetch';
import { usePlayer } from '../../hooks/usePlayer';
import { mediaService } from '../../services/media.service';
import { colors, fonts, radius, spacing, typography } from '../../theme';

/**
 * Sección "Botones": galería de botones con sus variantes y estados (RF07). Todos son funcionales:
 * controlan la reproducción musical, la cola, favoritos, repetir y aleatorio.
 */
export function PlayerScreen() {
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState('');
  const { data, loading, error, reload } = useFetch(() => mediaService.songs(search), [search]);
  const { current, isPlaying, playSong, setQueue, queue, togglePlay, repeat, shuffle, toggleRepeat, toggleShuffle } = usePlayer();
  const [following, setFollowing] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [featured, setFeatured] = useState(false);
  const [lastPressed, setLastPressed] = useState<string | null>(null);

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
  const isFavorite = !!current && favorites.has(current.id);

  const toggleFavorite = () => {
    if (!current) return;
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(current.id)) next.delete(current.id);
      else next.add(current.id);
      return next;
    });
  };

  const share = () => {
    const message = current
      ? `Estoy escuchando "${current.title}" de ${current.artist} en SoundFlow 🎧`
      : 'Descubre música, videos y más en SoundFlow 🎧';
    Share.share({ message }).catch(() => {});
  };

  return (
    <ScreenContainer title="Galería de Botones" subtitle="Muestra organizada de variantes y estados" hideMiniPlayer>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Card>
          <MusicPlayer />
        </Card>

        <Card title="Botones de acción prácticos">
          <Button
            title={isPlaying ? 'Pausar' : 'Reproducir'}
            icon={isPlaying ? 'pause-circle-outline' : 'play-circle-outline'}
            uppercase
            onPress={togglePlay}
            disabled={queue.length === 0}
          />
          <View style={styles.row}>
            <Button
              title={following ? 'Siguiendo' : 'Seguir'}
              icon={following ? 'person-remove-outline' : 'person-add-outline'}
              variant={following ? 'primary' : 'outline'}
              uppercase
              onPress={() => setFollowing((f) => !f)}
              style={styles.flex}
            />
            <Button title="Compartir" icon="share-outline" variant="secondary" uppercase onPress={share} style={styles.flex} />
          </View>
          <Button
            title="Descargar pista"
            icon="download-outline"
            variant="secondary"
            uppercase
            disabled={!current}
            onPress={() => current && Linking.openURL(mediaUrl(current.audioUrl))}
          />
        </Card>

        <Card title="Variantes de diseño">
          <View style={styles.row}>
            <Button title="Primario" onPress={() => setLastPressed('Primario')} style={styles.flex} />
            <Button title="Secundario" variant="secondary" onPress={() => setLastPressed('Secundario')} style={styles.flex} />
          </View>
          <View style={styles.row}>
            <Button title="Activo / Press" active onPress={() => setLastPressed('Activo / Press')} style={styles.flex} />
            <Button title="Desactivado" disabled onPress={() => {}} style={styles.flex} />
          </View>
          <View style={styles.row}>
            <Button title="Contorno" variant="outline" onPress={() => setLastPressed('Contorno')} style={styles.flex} />
            <Button title="Cargando" loading onPress={() => {}} style={styles.flex} />
          </View>
          <Text style={styles.feedback}>
            {lastPressed ? `Pulsaste: ${lastPressed}` : 'Toca un botón para ver su estado presionado.'}
          </Text>
        </Card>

        <Card title="Botones iconográficos">
          <View style={styles.iconRow}>
            <IconItem label="Favorito">
              <IconButton
                icon={isFavorite ? 'heart' : 'heart-outline'}
                label="Favorito"
                active={isFavorite}
                disabled={!current}
                onPress={toggleFavorite}
              />
            </IconItem>
            <IconItem label="Destacar">
              <IconButton
                icon={featured ? 'ribbon' : 'ribbon-outline'}
                label="Destacar"
                active={featured}
                activeColor={colors.gold}
                onPress={() => setFeatured((f) => !f)}
              />
            </IconItem>
            <IconItem label="Repetir">
              <IconButton icon="repeat" label="Repetir canción" active={repeat} onPress={toggleRepeat} />
            </IconItem>
            <IconItem label="Aleatorio">
              <IconButton icon="shuffle" label="Reproducción aleatoria" active={shuffle} onPress={toggleShuffle} />
            </IconItem>
          </View>
        </Card>

        <Card title="Lista de canciones">
          <View style={styles.search}>
            <Ionicons name="search" size={18} color={colors.textMuted} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Buscar canción o artista"
              placeholderTextColor={colors.textSubtle}
              selectionColor={colors.primary}
              style={styles.input}
              autoCorrect={false}
            />
            {query ? <Ionicons name="close-circle" size={18} color={colors.textMuted} onPress={() => setQuery('')} /> : null}
          </View>

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
                favorite={favorites.has(song.id)}
                onPress={() => {
                  // Si se eligió desde una búsqueda, la cola pasa a ser esos resultados.
                  if (!queue.some((s) => s.id === song.id) || search) setQueue(songs);
                  playSong(song);
                }}
              />
            ))
          )}
        </Card>
      </ScrollView>
    </ScreenContainer>
  );
}

function IconItem({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View style={styles.iconItem}>
      {children}
      <Text style={styles.iconLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xl },
  row: { flexDirection: 'row', gap: spacing.md },
  flex: { flex: 1 },
  feedback: { ...typography.caption, textAlign: 'center' },
  iconRow: { flexDirection: 'row', justifyContent: 'space-between' },
  iconItem: { alignItems: 'center', gap: 6, flex: 1 },
  iconLabel: { fontSize: 11, fontFamily: fonts.medium, color: colors.textMuted },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
  },
  input: { flex: 1, minWidth: 0, height: 44, color: colors.text, fontSize: 14, fontFamily: fonts.regular, outlineStyle: 'none' } as never,
});
