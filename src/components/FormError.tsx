import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, radius, spacing } from '../theme';

/** Mensaje de error de un formulario completo (por ejemplo, credenciales incorrectas). */
export function FormError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <View style={styles.box} accessibilityRole="alert">
      <Ionicons name="alert-circle" size={18} color={colors.danger} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: 'rgba(255,90,110,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,90,110,0.35)',
  },
  text: { flex: 1, color: colors.danger, fontFamily: fonts.medium, fontSize: 13 },
});
