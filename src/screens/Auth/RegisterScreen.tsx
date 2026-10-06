import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button } from '../../components/Button';
import { FormError } from '../../components/FormError';
import { Input } from '../../components/Input';
import { useAuth } from '../../hooks/useAuth';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { colors, fonts, spacing } from '../../theme';
import { isEmail, passwordStrength } from '../../utils/validators';
import { AuthLayout, AuthSwitch } from './AuthLayout';

const STRENGTH = [
  { label: 'Muy débil', color: colors.danger },
  { label: 'Débil', color: colors.danger },
  { label: 'Aceptable', color: colors.gold },
  { label: 'Buena', color: colors.success },
  { label: 'Fuerte', color: colors.success },
];

export function RegisterScreen({ navigation }: NativeStackScreenProps<AuthStackParamList, 'Register'>) {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const mismatch = confirm.length > 0 && confirm !== password;

  const submit = async () => {
    if (!name.trim()) return setError('Ingresa tu nombre');
    if (!isEmail(email)) return setError('Ingresa un correo válido');
    if (password.length < 6) return setError('La contraseña debe tener mínimo 6 caracteres');
    if (password !== confirm) return setError('Las contraseñas no coinciden');
    setError(null);
    setLoading(true);
    try {
      await register(name, email, password);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo crear la cuenta');
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Crea tu cuenta" subtitle="Solo necesitas un correo y una contraseña.">
      <Input label="Nombre" icon="person-outline" value={name} onChangeText={setName} placeholder="Tu nombre"
        autoComplete="name" maxLength={80} />
      <Input label="Correo" icon="mail-outline" value={email} onChangeText={setEmail} placeholder="tu@correo.com"
        autoCapitalize="none" keyboardType="email-address" autoComplete="email" maxLength={120} />
      <View style={{ gap: spacing.sm }}>
        <Input label="Contraseña" icon="lock-closed-outline" password value={password} onChangeText={setPassword}
          placeholder="Mínimo 6 caracteres" autoComplete="new-password" maxLength={72} />
        {password ? <StrengthMeter password={password} /> : null}
      </View>
      <Input label="Confirmar contraseña" icon="shield-checkmark-outline" password value={confirm} onChangeText={setConfirm}
        placeholder="Repite la contraseña" autoComplete="new-password" maxLength={72} onSubmitEditing={submit}
        error={mismatch ? 'Las contraseñas no coinciden' : null} />
      <FormError message={error} />
      <Button title="Crear cuenta" icon="person-add-outline" size="lg" onPress={submit} loading={loading} />
      <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
        <AuthSwitch question="¿Ya tienes cuenta?" action="Inicia sesión" />
      </Pressable>
    </AuthLayout>
  );
}

function StrengthMeter({ password }: { password: string }) {
  const score = passwordStrength(password);
  const { label, color } = STRENGTH[score];
  return (
    <View style={styles.meter}>
      <View style={styles.bars}>
        {[1, 2, 3, 4].map((i) => (
          <View key={i} style={[styles.bar, { backgroundColor: i <= score ? color : colors.surfaceHigh }]} />
        ))}
      </View>
      <Text style={[styles.meterLabel, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  meter: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  bars: { flex: 1, flexDirection: 'row', gap: 6 },
  bar: { flex: 1, height: 4, borderRadius: 2 },
  meterLabel: { fontSize: 12, fontFamily: fonts.semibold, minWidth: 70, textAlign: 'right' },
});
