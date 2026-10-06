import { useState } from 'react';
import { FlatList, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
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

/** Galería musical (RF03); al tocar una imagen se ve su descripción (RF04). */
export function PhotosScreen() {
  const { data, loading, error, reload } = useFetch(mediaService.photos);
  const [selected, setSelected] = useState<Photo | null>(null);

  return (
    <ScreenContainer>
      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : (
        <FlatList
          data={data ?? []}
          keyExtractor={(p) => p.id}
          numColumns={2}
          contentContainerStyle={styles.list}
          columnWrapperStyle={{ gap: spacing.md }}
          renderItem={({ item }) => <PhotoCard photo={item} onPress={() => setSelected(item)} />}
        />
      )}

      <Modal visible={!!selected} animationType="slide" onRequestClose={() => setSelected(null)}>
        {selected ? (
          <SafeAreaView style={styles.modal}>
            <Pressable accessibilityLabel="Cerrar" onPress={() => setSelected(null)} style={styles.close} hitSlop={12}>
              <Ionicons name="close" size={26} color={colors.text} />
            </Pressable>
            <ScrollView contentContainerStyle={{ gap: spacing.lg, padding: spacing.lg }}>
              <Image source={{ uri: mediaUrl(selected.imageUrl) }} style={styles.detailImage} contentFit="cover" />
              <View style={{ gap: spacing.xs }}>
                <Text style={typography.label}>{selected.subtitle}</Text>
                <Text style={typography.title}>{selected.title}</Text>
              </View>
              <Text style={[typography.body, { fontSize: 15, lineHeight: 23 }]}>{selected.description}</Text>
            </ScrollView>
          </SafeAreaView>
        ) : null}
      </Modal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  list: { padding: spacing.md, gap: spacing.md },
  modal: { flex: 1, backgroundColor: colors.background },
  close: { alignSelf: 'flex-end', padding: spacing.lg, paddingBottom: 0 },
  detailImage: { width: '100%', aspectRatio: 4 / 3, borderRadius: radius.lg, backgroundColor: colors.surfaceAlt },
});
