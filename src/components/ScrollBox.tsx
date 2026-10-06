import { ReactNode, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { colors, radius, spacing } from '../theme';

/**
 * Tarjeta con desplazamiento interno y un indicador rosa a la derecha (como en el diseño),
 * para contenido extenso que no debe ocupar toda la pantalla.
 */
export function ScrollBox({ children, maxHeight }: { children: ReactNode; maxHeight: number }) {
  const [box, setBox] = useState(0);
  const [content, setContent] = useState(0);
  const [offset, setOffset] = useState(0);

  const scrollable = content > box + 1;
  const track = box - 24; // el riel deja 12 px arriba y abajo
  const thumb = scrollable ? Math.max((box / content) * track, 24) : 0;
  const top = scrollable ? (offset / (content - box)) * (track - thumb) : 0;

  return (
    <View style={[styles.card, { maxHeight }]}>
      <ScrollView
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
        onLayout={(e) => setBox(e.nativeEvent.layout.height)}
        onContentSizeChange={(_, h) => setContent(h)}
        onScroll={(e) => setOffset(e.nativeEvent.contentOffset.y)}
        scrollEventThrottle={16}
        contentContainerStyle={styles.content}
      >
        {children}
      </ScrollView>
      {scrollable ? (
        <View style={styles.track} pointerEvents="none">
          <View style={[styles.thumb, { height: thumb, top: Math.max(0, Math.min(top, track - thumb)) }]} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
  },
  content: { paddingHorizontal: spacing.lg, paddingRight: spacing.xl, paddingVertical: spacing.xs },
  track: { position: 'absolute', right: 8, top: 12, bottom: 12, width: 3 },
  thumb: { position: 'absolute', width: 3, borderRadius: 2, backgroundColor: colors.primary },
});
