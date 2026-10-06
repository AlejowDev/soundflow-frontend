import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, radius, spacing, typography } from '../theme';

interface Props extends TextInputProps {
  label?: string;
  error?: string | null;
  icon?: keyof typeof Ionicons.glyphMap;
  /** Campo de contraseña con botón de ojo para mostrarla u ocultarla. */
  password?: boolean;
  hint?: string;
}

export function Input({ label, error, icon, password, hint, style, multiline, onFocus, onBlur, ...props }: Props) {
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.wrapper}>
      {label ? <Text style={typography.label}>{label}</Text> : null}
      <View
        style={[
          styles.field,
          multiline && styles.multilineField,
          focused && styles.focused,
          error ? { borderColor: colors.danger } : null,
        ]}
      >
        {icon ? (
          <Ionicons name={icon} size={18} color={focused ? colors.primary : colors.textMuted} style={multiline && { marginTop: 14 }} />
        ) : null}
        <TextInput
          placeholderTextColor={colors.textSubtle}
          selectionColor={colors.primary}
          multiline={multiline}
          secureTextEntry={password && !visible}
          autoCapitalize={password ? 'none' : props.autoCapitalize}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          style={[styles.input, multiline && styles.multiline, style]}
          {...props}
        />
        {password ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            onPress={() => setVisible((v) => !v)}
            hitSlop={10}
          >
            <Ionicons name={visible ? 'eye-off-outline' : 'eye-outline'} size={20} color={visible ? colors.primary : colors.textMuted} />
          </Pressable>
        ) : null}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : hint ? <Text style={typography.caption}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: spacing.sm },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: 52,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
  },
  multilineField: { alignItems: 'flex-start' },
  focused: { borderColor: colors.primary, backgroundColor: colors.surfaceAlt },
  input: { flex: 1, minWidth: 0, minHeight: 50, color: colors.text, fontSize: 15, fontFamily: fonts.regular, outlineStyle: 'none' } as never,
  multiline: { minHeight: 110, paddingTop: 14, paddingBottom: 14, textAlignVertical: 'top', lineHeight: 21 },
  error: { color: colors.danger, fontSize: 12, fontFamily: fonts.medium },
});
