import { ActivityIndicator, Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, radius, spacing } from '../theme';
import { tap } from '../utils/haptics';

export type ButtonVariant = 'primary' | 'outline' | 'secondary' | 'ghost';

interface Props {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  icon?: keyof typeof Ionicons.glyphMap;
  loading?: boolean;
  disabled?: boolean;
  /** Fuerza el estado presionado (para mostrarlo en la galería de botones). */
  active?: boolean;
  uppercase?: boolean;
  size?: 'md' | 'lg';
  style?: StyleProp<ViewStyle>;
}

const TEXT_COLOR: Record<ButtonVariant, string> = {
  primary: colors.white,
  outline: colors.primary,
  secondary: colors.text,
  ghost: colors.textMuted,
};

export function Button({
  title,
  onPress,
  variant = 'primary',
  icon,
  loading,
  disabled,
  active,
  uppercase,
  size = 'md',
  style,
}: Props) {
  const isDisabled = disabled || loading;
  const textColor = isDisabled && variant === 'primary' ? 'rgba(255,255,255,0.45)' : TEXT_COLOR[variant];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!isDisabled }}
      onPress={() => {
        tap();
        onPress();
      }}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        size === 'lg' && styles.lg,
        styles[variant],
        isDisabled && (variant === 'primary' ? styles.primaryDisabled : styles.disabled),
        (pressed || active) && !isDisabled && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <View style={styles.content}>
          {icon ? <Ionicons name={icon} size={18} color={textColor} /> : null}
          <Text style={[styles.text, uppercase && styles.upper, { color: textColor }]} numberOfLines={1}>
            {title}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  lg: { minHeight: 54 },
  content: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  primary: { backgroundColor: colors.primary },
  outline: { borderColor: colors.primary, backgroundColor: 'transparent' },
  secondary: { backgroundColor: colors.surfaceHigh },
  ghost: { backgroundColor: 'transparent' },
  primaryDisabled: { backgroundColor: colors.primaryDark },
  disabled: { opacity: 0.45 },
  // Estado "Activo / Press" del diseño: borde blanco y ligera reducción.
  pressed: { borderColor: colors.white, transform: [{ scale: 0.98 }] },
  text: { fontFamily: fonts.semibold, fontSize: 15 },
  upper: { fontFamily: fonts.bold, fontSize: 13, textTransform: 'uppercase', letterSpacing: 0.8 },
});
