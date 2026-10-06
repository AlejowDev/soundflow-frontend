import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../../components/ScreenContainer';
import { WebFrame } from '../../components/WebFrame';
import { colors, radius, spacing, typography } from '../../theme';
import { normalizeUrl } from '../../utils/validators';

const SUGGESTIONS = [
  { label: 'Wikipedia: Música', url: 'https://es.wikipedia.org/wiki/M%C3%BAsica' },
  { label: 'Billboard', url: 'https://www.billboard.com' },
  { label: 'SoundHelix', url: 'https://www.soundhelix.com' },
];

/** Carga una URL dentro de la app, sin abrir el navegador externo (RF06). */
export function WebScreen() {
  const [text, setText] = useState('');
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const open = (value: string) => {
    const normalized = normalizeUrl(value);
    if (!normalized) return setError('Ingresa una dirección válida, ej: wikipedia.org');
    setError(null);
    setText(normalized);
    setUrl(normalized);
  };

  return (
    <ScreenContainer>
      <View style={styles.bar}>
        <View style={styles.inputWrap}>
          <Ionicons name="globe-outline" size={18} color={colors.textMuted} />
          <TextInput
            value={text}
            onChangeText={setText}
            onSubmitEditing={() => open(text)}
            placeholder="Escribe una URL"
            placeholderTextColor={colors.textMuted}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
            returnKeyType="go"
            style={styles.input}
          />
        </View>
        <Pressable accessibilityLabel="Cargar página" onPress={() => open(text)} style={styles.go}>
          <Ionicons name="arrow-forward" size={20} color={colors.white} />
        </Pressable>
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {url ? (
        <WebFrame url={url} />
      ) : (
        <View style={styles.empty}>
          <Ionicons name="globe" size={48} color={colors.border} />
          <Text style={[typography.body, { color: colors.textMuted, textAlign: 'center' }]}>
            Escribe una dirección o prueba con una sugerencia:
          </Text>
          {SUGGESTIONS.map((s) => (
            <Pressable key={s.url} onPress={() => open(s.url)} style={styles.chip}>
              <Text style={{ color: colors.text, fontWeight: '600' }}>{s.label}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', gap: spacing.sm, padding: spacing.md },
  inputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
  },
  input: { flex: 1, height: 44, color: colors.text, fontSize: 14 },
  go: { width: 44, height: 44, borderRadius: radius.md, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  error: { color: colors.danger, fontSize: 12, paddingHorizontal: spacing.md, marginTop: -spacing.xs, marginBottom: spacing.sm },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md, padding: spacing.xl },
  chip: { paddingVertical: spacing.sm, paddingHorizontal: spacing.lg, borderRadius: radius.pill, backgroundColor: colors.surface },
});
