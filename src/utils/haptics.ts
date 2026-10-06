import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

/** Vibración corta al tocar un botón; en la vista web no hace nada. */
export function tap() {
  if (Platform.OS === 'web') return;
  Haptics.selectionAsync().catch(() => {});
}
