import { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts, radius, spacing, typography } from '../../theme';

export function AuthLayout({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <View style={styles.root}>
      {/* Resplandor rosa de fondo */}
      <LinearGradient
        colors={['rgba(255,46,146,0.28)', 'rgba(255,46,146,0.06)', 'transparent']}
        style={styles.glow}
        pointerEvents="none"
      />
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
            <View style={styles.brand}>
              <LinearGradient colors={[colors.primary, '#B0186A']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.logo}>
                <Ionicons name="pulse" size={32} color={colors.white} />
              </LinearGradient>
              <Text style={styles.brandName}>
                Sound<Text style={{ color: colors.primary }}>Flow</Text>
              </Text>
              <Text style={typography.caption}>Tu música, tus videos, tu perfil.</Text>
            </View>

            <View style={styles.card}>
              <View style={{ gap: spacing.xs }}>
                <Text style={typography.title}>{title}</Text>
                <Text style={[typography.body, { color: colors.textMuted }]}>{subtitle}</Text>
              </View>
              {children}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

/** Enlace inferior "¿No tienes cuenta? Regístrate". */
export function AuthSwitch({ question, action }: { question: string; action: string }) {
  return (
    <Text style={[typography.body, { textAlign: 'center', color: colors.textMuted }]}>
      {question} <Text style={{ color: colors.primary, fontFamily: fonts.semibold }}>{action}</Text>
    </Text>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  glow: { position: 'absolute', top: 0, left: 0, right: 0, height: 420 },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.xxl,
    maxWidth: 460,
    width: '100%',
    alignSelf: 'center',
  },
  brand: { alignItems: 'center', gap: spacing.sm },
  logo: {
    width: 68,
    height: 68,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  brandName: { fontSize: 32, fontFamily: fonts.extrabold, color: colors.text, letterSpacing: -0.5 },
  card: {
    gap: spacing.lg,
    backgroundColor: 'rgba(18,19,28,0.85)',
    borderRadius: radius.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
