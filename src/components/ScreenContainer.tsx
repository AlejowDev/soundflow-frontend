import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '../theme';
import { MiniPlayer } from './MiniPlayer';

interface Props {
  title: string;
  subtitle?: string;
  right?: ReactNode;
  children: ReactNode;
  hideMiniPlayer?: boolean;
}

/** Área de detalle de cada sección: encabezado grande (título + subtítulo), contenido y mini reproductor. */
export function ScreenContainer({ title, subtitle, right, children, hideMiniPlayer }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.lg }]}>
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={typography.display} numberOfLines={1}>{title}</Text>
          {subtitle ? <Text style={typography.caption} numberOfLines={1}>{subtitle}</Text> : null}
        </View>
        {right}
      </View>
      <View style={styles.content}>{children}</View>
      {hideMiniPlayer ? null : <MiniPlayer />}
      <View style={{ height: insets.bottom }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  content: { flex: 1 },
});
