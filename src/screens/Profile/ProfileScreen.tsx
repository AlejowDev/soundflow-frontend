import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { ScreenContainer } from '../../components/ScreenContainer';
import { mediaUrl } from '../../config/environment';
import { useAuth } from '../../hooks/useAuth';
import { usePlayer } from '../../hooks/usePlayer';
import { usersService } from '../../services/users.service';
import { useAuthStore } from '../../store/authStore';
import { colors, radius, spacing, typography } from '../../theme';
import { UpdateUserInput, User } from '../../types';

/** Perfil del usuario: foto, información académica, estudios y experiencia (RF02). */
export function ProfileScreen() {
  const { user, logout } = useAuth();
  const { stop } = usePlayer();
  const [editing, setEditing] = useState(false);

  if (!user) return null;

  const handleLogout = async () => {
    stop();
    await logout();
  };

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Avatar user={user} />
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={typography.title} numberOfLines={2}>{user.name}</Text>
            <Text style={[typography.body, { color: colors.primary }]}>{user.headline || 'Sin titular'}</Text>
            <Text style={typography.caption}>{user.email}</Text>
          </View>
        </View>

        {editing ? (
          <EditForm user={user} onDone={() => setEditing(false)} />
        ) : (
          <>
            <Field label="Universidad" value={user.university} />
            <ScrollField label="Estudios" value={user.studies} />
            <ScrollField label="Experiencia profesional" value={user.experience} />
            <View style={styles.actions}>
              <Button title="Editar perfil" onPress={() => setEditing(true)} style={{ flex: 1 }} />
              <Button title="Salir" variant="ghost" onPress={handleLogout} style={{ flex: 1 }} />
            </View>
          </>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

function Avatar({ user }: { user: User }) {
  if (user.photoUrl) {
    return <Image source={{ uri: mediaUrl(user.photoUrl) }} style={styles.avatar} contentFit="cover" />;
  }
  const initials = user.name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('');
  return (
    <View style={[styles.avatar, styles.avatarFallback]}>
      <Text style={styles.initials}>{initials}</Text>
    </View>
  );
}

function Field({ label, value }: { label: string; value: string | null }) {
  return (
    <View style={styles.field}>
      <Text style={typography.label}>{label}</Text>
      <Text style={typography.body}>{value || '—'}</Text>
    </View>
  );
}

/** Campo de contenido extenso con su propio desplazamiento para no ocupar toda la pantalla. */
function ScrollField({ label, value }: { label: string; value: string | null }) {
  return (
    <View style={styles.field}>
      <Text style={typography.label}>{label}</Text>
      <ScrollView style={styles.scrollBox} nestedScrollEnabled>
        <Text style={typography.body}>{value || 'Aún no has agregado información.'}</Text>
      </ScrollView>
    </View>
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

  return (
    <View style={{ gap: spacing.md }}>
      <Input label="Nombre" value={form.name} onChangeText={update('name')} />
      <Input label="Titular" value={form.headline ?? ''} onChangeText={update('headline')} placeholder="Ej: Estudiante de Ingeniería" />
      <Input label="Universidad" value={form.university ?? ''} onChangeText={update('university')} />
      <Input label="Estudios" value={form.studies ?? ''} onChangeText={update('studies')} multiline />
      <Input label="Experiencia profesional" value={form.experience ?? ''} onChangeText={update('experience')} multiline />
      {error ? <Text style={{ color: colors.danger }}>{error}</Text> : null}
      <View style={styles.actions}>
        <Button title="Guardar" onPress={save} loading={saving} style={{ flex: 1 }} />
        <Button title="Cancelar" variant="ghost" onPress={onDone} style={{ flex: 1 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: spacing.lg, gap: spacing.lg },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  avatar: { width: 76, height: 76, borderRadius: radius.pill },
  avatarFallback: { backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  initials: { fontSize: 26, fontWeight: '700', color: colors.primary },
  field: { gap: spacing.xs, backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md },
  scrollBox: { maxHeight: 120 },
  actions: { flexDirection: 'row', gap: spacing.md },
});
