import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Button } from '../../components/Button';
import { Card, SectionTitle } from '../../components/Card';
import { FormError } from '../../components/FormError';
import { IconButton } from '../../components/IconButton';
import { Input } from '../../components/Input';
import { ScreenContainer } from '../../components/ScreenContainer';
import { ScrollBox } from '../../components/ScrollBox';
import { mediaUrl } from '../../config/environment';
import { useAuth } from '../../hooks/useAuth';
import { usersService } from '../../services/users.service';
import { useAuthStore } from '../../store/authStore';
import { colors, fonts, radius, spacing, typography } from '../../theme';
import { UpdateUserInput, User } from '../../types';
import { parseEntries } from '../../utils/profile';

/** Perfil del usuario: foto, información académica, estudios y experiencia (RF02). */
export function ProfileScreen() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);

  if (!user) return null;

  return (
    <ScreenContainer
      title="Mi Perfil"
      subtitle={user.headline || 'Completa tu titular profesional'}
      right={
        editing ? null : <IconButton icon="create-outline" label="Editar perfil" size={42} onPress={() => setEditing(true)} />
      }
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <ProfileCard user={user} />

        {editing ? (
          <EditForm user={user} onDone={() => setEditing(false)} />
        ) : (
          <>
            <SectionTitle>Estudios y Certificaciones</SectionTitle>
            <EntryList text={user.studies} empty="Aún no has agregado estudios." icon="school" />

            <SectionTitle>Experiencia Profesional</SectionTitle>
            <EntryList text={user.experience} empty="Aún no has agregado experiencia." icon="briefcase" />
          </>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

function ProfileCard({ user }: { user: User }) {
  const handle = `@${user.email.split('@')[0]}`;
  return (
    <Card style={styles.profileCard}>
      <Avatar user={user} />
      <View style={{ flex: 1, gap: 4 }}>
        <Text style={typography.title} numberOfLines={2}>{user.name}</Text>
        <Text style={styles.handle} numberOfLines={1}>{handle}</Text>
        {user.university ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText} numberOfLines={1}>{user.university}</Text>
          </View>
        ) : null}
      </View>
    </Card>
  );
}

function Avatar({ user }: { user: User }) {
  const initials = user.name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('');
  return (
    <View style={styles.avatarRing}>
      {user.photoUrl ? (
        <Image source={{ uri: mediaUrl(user.photoUrl) }} style={styles.avatar} contentFit="cover" />
      ) : (
        <View style={[styles.avatar, styles.avatarFallback]}>
          <Text style={styles.initials}>{initials}</Text>
        </View>
      )}
    </View>
  );
}

/** Lista de entradas con su propio desplazamiento para no ocupar toda la pantalla (contenido extenso). */
function EntryList({ text, empty, icon }: { text: string | null; empty: string; icon: 'school' | 'briefcase' }) {
  const entries = parseEntries(text);
  if (!entries.length) {
    return (
      <Card>
        <Text style={[typography.body, { color: colors.textMuted }]}>{empty}</Text>
      </Card>
    );
  }
  return (
    <ScrollBox maxHeight={190}>
      {entries.map((e, i) => (
        <View key={i} style={[styles.entry, i > 0 && styles.entryDivider]}>
          <Text style={styles.entryTitle}>{e.title}</Text>
          {e.place ? <Text style={styles.entryPlace}>{e.place}</Text> : null}
          {e.detail ? <Text style={typography.caption}>{e.detail}</Text> : null}
        </View>
      ))}
    </ScrollBox>
  );
}

function EditForm({ user, onDone }: { user: User; onDone: () => void }) {
  const setUser = useAuthStore((s) => s.setUser);
  const [form, setForm] = useState<UpdateUserInput>({
    name: user.name,
    headline: user.headline ?? '',
    university: user.university ?? '',
    studies: user.studies ?? '',
    experience: user.experience ?? '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = (key: keyof UpdateUserInput) => (value: string) => setForm((f) => ({ ...f, [key]: value }));

  const save = async () => {
    if (!form.name?.trim()) return setError('El nombre es obligatorio');
    setSaving(true);
    setError(null);
    try {
      setUser(await usersService.updateMe(form));
      onDone();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo guardar');
      setSaving(false);
    }
  };

  const hint = 'Una entrada por línea: Título | Lugar | Detalle';

  return (
    <Card title="Editar perfil" style={{ gap: spacing.lg }}>
      <Input label="Nombre" icon="person-outline" value={form.name} onChangeText={update('name')} maxLength={80} />
      <Input label="Titular" icon="sparkles-outline" value={form.headline ?? ''} onChangeText={update('headline')}
        placeholder="Ej: Music Producer & Tech Researcher" maxLength={120} />
      <Input label="Universidad" icon="school-outline" value={form.university ?? ''} onChangeText={update('university')} maxLength={120} />
      <Input label="Estudios" value={form.studies ?? ''} onChangeText={update('studies')} multiline hint={hint} maxLength={3000} />
      <Input label="Experiencia profesional" value={form.experience ?? ''} onChangeText={update('experience')} multiline
        hint={hint} maxLength={3000} />
      <FormError message={error} />
      <View style={styles.actions}>
        <Button title="Cancelar" variant="secondary" onPress={onDone} style={{ flex: 1 }} />
        <Button title="Guardar" icon="checkmark" onPress={save} loading={saving} style={{ flex: 1 }} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xl },
  profileCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  avatarRing: { padding: 3, borderRadius: radius.pill, borderWidth: 2, borderColor: colors.primary },
  avatar: { width: 72, height: 72, borderRadius: radius.pill },
  avatarFallback: { backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  initials: { fontSize: 26, fontFamily: fonts.bold, color: colors.primary },
  handle: { fontSize: 13, fontFamily: fonts.medium, color: colors.primary },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.sm,
    backgroundColor: colors.primarySoft,
    maxWidth: '100%',
  },
  badgeText: { fontSize: 10, fontFamily: fonts.bold, color: colors.primary, textTransform: 'uppercase', letterSpacing: 0.6 },
  entry: { gap: 3, paddingVertical: spacing.md },
  entryDivider: { borderTopWidth: 1, borderTopColor: colors.border },
  entryTitle: { fontSize: 15, fontFamily: fonts.semibold, color: colors.text },
  entryPlace: { fontSize: 11, fontFamily: fonts.bold, color: colors.primary, textTransform: 'uppercase', letterSpacing: 0.6 },
  actions: { flexDirection: 'row', gap: spacing.md },
});
