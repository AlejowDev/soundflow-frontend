import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { colors } from '../theme';

/** Barra de progreso rosa con perilla; tocarla salta a esa posición (0–1). */
export function ProgressBar({ progress, onSeek }: { progress: number; onSeek?: (ratio: number) => void }) {
  const [width, setWidth] = useState(0);
  const pct = `${Math.max(0, Math.min(progress, 1)) * 100}%` as const;

  return (
    <Pressable
      accessibilityRole="adjustable"
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      onPress={(e) => width && onSeek?.(Math.max(0, Math.min(e.nativeEvent.locationX / width, 1)))}
      disabled={!onSeek}
      style={styles.hitArea}
    >
      {/* pointerEvents="none": locationX debe medirse sobre la barra completa, no sobre la perilla. */}
      <View style={styles.track} pointerEvents="none">
        <View style={[styles.fill, { width: pct }]} />
      </View>
      <View style={[styles.knob, { left: pct }]} pointerEvents="none" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hitArea: { paddingVertical: 10, justifyContent: 'center' },
  track: { height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.14)', overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: colors.primary },
  knob: {
    position: 'absolute',
    width: 12,
    height: 12,
    marginLeft: -6,
    borderRadius: 6,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.white,
  },
});
