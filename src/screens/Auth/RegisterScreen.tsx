import { useState } from 'react';
import { Pressable, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { useAuth } from '../../hooks/useAuth';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { colors, typography } from '../../theme';
import { isEmail } from '../../utils/validators';
import { AuthLayout } from './AuthLayout';

export function RegisterScreen({ navigation }: NativeStackScreenProps<AuthStackParamList, 'Register'>) {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!name.trim()) return setError('Ingresa tu nombre');
    if (!isEmail(email)) return setError('Ingresa un correo válido');
    if (password.length < 6) return setError('La contraseña debe tener mínimo 6 caracteres');
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
      <Input label="Nombre" value={name} onChangeText={setName} placeholder="Tu nombre" autoComplete="name" />
      <Input label="Correo" value={email} onChangeText={setEmail} placeholder="tu@correo.com"
        autoCapitalize="none" keyboardType="email-address" autoComplete="email" />
      <Input label="Contraseña" value={password} onChangeText={setPassword} placeholder="Mínimo 6 caracteres"
        secureTextEntry autoComplete="new-password" onSubmitEditing={submit} />
      {error ? <Text style={{ color: colors.danger }}>{error}</Text> : null}
      <Button title="Crear cuenta" onPress={submit} loading={loading} />
      <Pressable onPress={() => navigation.goBack()}>
        <Text style={[typography.body, { textAlign: 'center', color: colors.textMuted }]}>
          ¿Ya tienes cuenta? <Text style={{ color: colors.primary, fontWeight: '600' }}>Inicia sesión</Text>
        </Text>
      </Pressable>
    </AuthLayout>
  );
}
