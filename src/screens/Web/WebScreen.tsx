import { useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { SectionTitle } from '../../components/Card';
import { ScreenContainer } from '../../components/ScreenContainer';
import { WebFrame, WebFrameHandle, WebNavState } from '../../components/WebFrame';
import { mediaUrl } from '../../config/environment';
import { colors, fonts, radius, spacing, typography } from '../../theme';
import { tap } from '../../utils/haptics';
import { normalizeUrl } from '../../utils/validators';

type IconName = keyof typeof Ionicons.glyphMap;

const FEATURED = {
  label: 'Campus musical virtual',
  title: 'Politécnico Grancolombiano',
  description:
    'Portal oficial de la institución. Accede a programas académicos, recursos de primer nivel y la comunidad estudiantil.',
  url: 'https://www.poli.edu.co',
  image: '/media/images/photo-4.jpg',
};

const RESOURCES: { label: string; url: string; icon: IconName; color: string }[] = [
  { label: 'Wikipedia: Música', url: 'https://es.wikipedia.org/wiki/M%C3%BAsica', icon: 'document-text', color: colors.primary },
  { label: 'Banco de muestras de audio gratis', url: 'https://freesound.org', icon: 'musical-notes', color: colors.success },
  { label: 'SoundHelix: música generada', url: 'https://www.soundhelix.com', icon: 'pulse', color: colors.gold },
  { label: 'Billboard: listas de éxitos', url: 'https://www.billboard.com', icon: 'trophy', color: '#7C8CFF' },
];

/** Carga una URL dentro de la app, sin abrir el navegador externo (RF06). */
export function WebScreen() {
  const frame = useRef<WebFrameHandle>(null);
  const [text, setText] = useState('');
  const [url, setUrl] = useState<string | null>(null);
  const [nav, setNav] = useState<WebNavState | null>(null);
  const [error, setError] = useState<string | null>(null);

  const open = (value: string) => {
    const normalized = normalizeUrl(value);
    if (!normalized) return setError('Ingresa una dirección válida, ej: wikipedia.org');
    setError(null);
    setText(normalized);
    setNav(null);
    setUrl(normalized);
  };

  const home = () => {
    setUrl(null);
    setText('');
    setNav(null);
  };

  const secure = (nav?.url ?? url ?? text).startsWith('https://');

  return (
    <ScreenContainer title="Navegador Web" subtitle="Explorador de recursos y webs de sonido">
      <View style={styles.bar}>
        <BarButton icon="chevron-back" label="Atrás" disabled={!nav?.canGoBack} onPress={() => frame.current?.goBack()} />
        <BarButton icon="chevron-forward" label="Adelante" disabled={!nav?.canGoForward} onPress={() => frame.current?.goForward()} />
        <View style={styles.inputWrap}>
          <Ionicons
            name={url ? (secure ? 'lock-closed' : 'lock-open') : 'search'}
            size={14}
            color={url ? (secure ? colors.success : colors.gold) : colors.textMuted}
          />
          <TextInput
            value={text}
            onChangeText={setText}
            onSubmitEditing={() => open(text)}
            placeholder="Escribe una URL"
            placeholderTextColor={colors.textSubtle}
            selectionColor={colors.primary}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
            returnKeyType="go"
            selectTextOnFocus
            style={styles.input}
          />
          {url ? (
            <Pressable accessibilityLabel="Recargar" onPress={() => frame.current?.reload()} hitSlop={8}>
              <Ionicons name="refresh" size={16} color={colors.textMuted} />
            </Pressable>
          ) : null}
        </View>
        {url ? (
          <BarButton icon="home-outline" label="Inicio" onPress={home} />
        ) : (
          <BarButton icon="arrow-forward" label="Abrir" primary onPress={() => open(text)} />
        )}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {url ? (
        <View style={styles.webWrap}>
          <WebFrame
            ref={frame}
            url={url}
            onNavChange={(s) => {
              setNav(s);
              if (!s.loading) setText(s.url);
            }}
          />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.start}>
          <Pressable
            accessibilityRole="link"
            onPress={() => open(FEATURED.url)}
            style={({ pressed }) => [styles.featured, pressed && { opacity: 0.85 }]}
          >
            <Image source={{ uri: mediaUrl(FEATURED.image) }} style={styles.featuredImage} contentFit="cover" />
            <View style={{ padding: spacing.lg, gap: 4 }}>
              <Text style={typography.accentLabel}>{FEATURED.label}</Text>
              <Text style={typography.title}>{FEATURED.title}</Text>
              <Text style={typography.caption}>{FEATURED.description}</Text>
            </View>
          </Pressable>

          <SectionTitle>Recursos del Portal</SectionTitle>
          {RESOURCES.map((r) => (
            <Pressable
              key={r.url}
              accessibilityRole="link"
              onPress={() => {
                tap();
                open(r.url);
              }}
              style={({ pressed }) => [styles.resource, pressed && { opacity: 0.75 }]}
            >
              <View style={[styles.resourceIcon, { backgroundColor: `${r.color}22` }]}>
                <Ionicons name={r.icon} size={16} color={r.color} />
              </View>
              <Text style={styles.resourceText} numberOfLines={1}>{r.label}</Text>
              <Ionicons name="open-outline" size={16} color={colors.textMuted} />
            </Pressable>
          ))}
        </ScrollView>
      )}
    </ScreenContainer>
  );
}

function BarButton({ icon, label, onPress, disabled, primary }: {
  icon: IconName;
  label: string;
  onPress: () => void;
  disabled?: boolean;
  primary?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      onPress={() => {
        tap();
        onPress();
      }}
      hitSlop={4}
      style={({ pressed }) => [styles.barButton, primary && styles.barButtonPrimary, pressed && { opacity: 0.7 }]}
    >
      <Ionicons name={icon} size={18} color={primary ? colors.white : disabled ? colors.textSubtle : colors.text} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', alignItems: 'center', gap: 6, padding: spacing.md },
  barButton: { width: 34, height: 40, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  barButtonPrimary: { width: 40, backgroundColor: colors.primary },
  inputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    height: 40,
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  input: { flex: 1, minWidth: 0, height: 40, color: colors.text, fontSize: 13, fontFamily: fonts.regular, outlineStyle: 'none' } as never,
  error: { color: colors.danger, fontSize: 12, fontFamily: fonts.medium, paddingHorizontal: spacing.lg, marginBottom: spacing.sm },
  webWrap: { flex: 1, marginHorizontal: spacing.md, marginBottom: spacing.sm, borderRadius: radius.lg, overflow: 'hidden' },
  start: { padding: spacing.lg, paddingTop: spacing.xs, gap: spacing.md, paddingBottom: spacing.xl },
  featured: { backgroundColor: colors.surface, borderRadius: radius.xl, overflow: 'hidden' },
  featuredImage: { width: '100%', aspectRatio: 16 / 8, backgroundColor: colors.surfaceAlt },
  resource: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
  },
  resourceIcon: { width: 32, height: 32, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center' },
  resourceText: { flex: 1, fontSize: 14, fontFamily: fonts.medium, color: colors.text },
});
