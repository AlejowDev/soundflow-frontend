import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../theme';
import { MiniPlayer } from './MiniPlayer';

/** Área de contenido (detalle) de cada sección, con el mini reproductor abajo. */
export function ScreenContainer({ children, hideMiniPlayer }: { children: ReactNode; hideMiniPlayer?: boolean }) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>{children}</View>
      {hideMiniPlayer ? null : <MiniPlayer />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1 },
});
