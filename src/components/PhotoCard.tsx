import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { mediaUrl } from '../config/environment';
import { colors, radius, spacing, typography } from '../theme';
import { Photo } from '../types';

export function PhotoCard({ photo, onPress }: { photo: Photo; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && { opacity: 0.8 }]}>
      <Image source={{ uri: mediaUrl(photo.imageUrl) }} style={styles.image} contentFit="cover" transition={200} />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{photo.title}</Text>
        <Text style={typography.caption} numberOfLines={1}>{photo.subtitle}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, backgroundColor: colors.surface, borderRadius: radius.md, overflow: 'hidden' },
  image: { width: '100%', aspectRatio: 1, backgroundColor: colors.surfaceAlt },
  info: { padding: spacing.sm, gap: 2 },
  title: { fontSize: 13, fontWeight: '600', color: colors.text },
});
