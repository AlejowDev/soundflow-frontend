import { Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../theme';
import { tap } from '../utils/haptics';

interface Props {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  active?: boolean;
  /** Color del ícono cuando está activo (por defecto el rosa de la marca). */
  activeColor?: string;
  size?: number;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** Botón circular solo con ícono; "active" lo resalta con borde y fondo de color. */
export function IconButton({ icon, label, onPress, active, activeColor = colors.primary, size = 52, disabled, style }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: !!active, disabled: !!disabled }}
      onPress={() => {
        tap();
        onPress();
      }}
      disabled={disabled}
      hitSlop={6}
      style={({ pressed }) => [
        styles.base,
        { width: size, height: size },
        active && { borderColor: activeColor, backgroundColor: `${activeColor}22` },
        pressed && { transform: [{ scale: 0.92 }] },
        disabled && { opacity: 0.4 },
        style,
      ]}
    >
      <Ionicons name={icon} size={Math.round(size * 0.42)} color={active ? activeColor : colors.text} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1.5,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
