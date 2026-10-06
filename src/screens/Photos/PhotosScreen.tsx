import { useState } from 'react';
import { FlatList, Modal, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PhotoCard } from '../../components/PhotoCard';
import { ScreenContainer } from '../../components/ScreenContainer';
import { ErrorState, Loading } from '../../components/ScreenState';
import { mediaUrl } from '../../config/environment';
import { useFetch } from '../../hooks/useFetch';
import { mediaService } from '../../services/media.service';
import { colors, radius, spacing, typography } from '../../theme';
import { Photo } from '../../types';

/** Galería musical en lista vertical (RF03); al tocar una imagen se ve su descripción (RF04). */
export function PhotosScreen() {
  const { data, loading, error, reload } = useFetch(mediaService.photos);
  // undefined = el usuario aún no ha tocado nada: se muestra la primera imagen seleccionada.
  const [selectedId, setSelectedId] = useState<string | null | undefined>(undefined);
  const activeId = selectedId === undefined ? data?.[0]?.id : selectedId;
  const [expanded, setExpanded] = useState<Photo | null>(null);

  return (
    <ScreenContainer title="Galería Musical" subtitle="Lista vertical de imágenes inspiradoras">
      {loading && !data ? (
        <Loading />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : (
        <FlatList
          data={data ?? []}
          keyExtractor={(p) => p.id}
          extraData={activeId}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={reload} tintColor={colors.primary} colors={[colors.primary]} />}
          renderItem={({ item }) => (
            <PhotoCard
              photo={item}
              selected={item.id === activeId}
              onPress={() => setSelectedId(item.id === activeId ? null : item.id)}
              onExpand={() => setExpanded(item)}
            />
          )}
        />
      )}

      <Modal visible={!!expanded} animationType="fade" onRequestClose={() => setExpanded(null)}>
        {expanded ? (
          <SafeAreaView style={styles.modal}>
            <Pressable accessibilityLabel="Cerrar" onPress={() => setExpanded(null)} style={styles.close} hitSlop={12}>
              <Ionicons name="close" size={22} color={colors.text} />
            </Pressable>
            <ScrollView contentContainerStyle={{ gap: spacing.lg, padding: spacing.lg }}>
              <Image source={{ uri: mediaUrl(expanded.imageUrl) }} style={styles.detailImage} contentFit="cover" />
              <View style={{ gap: spacing.xs }}>
                <Text style={typography.accentLabel}>{expanded.subtitle}</Text>
                <Text style={typography.display}>{expanded.title}</Text>
              </View>
              <Text style={[typography.body, { fontSize: 15, lineHeight: 24, color: colors.textMuted }]}>{expanded.description}</Text>
            </ScrollView>
          </SafeAreaView>
        ) : null}
      </Modal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  list: { padding: spacing.lg, gap: spacing.lg },
  modal: { flex: 1, backgroundColor: colors.background },
  close: {
    alignSelf: 'flex-end',
    margin: spacing.lg,
    marginBottom: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailImage: { width: '100%', aspectRatio: 4 / 3, borderRadius: radius.xl, backgroundColor: colors.surfaceAlt },
});
