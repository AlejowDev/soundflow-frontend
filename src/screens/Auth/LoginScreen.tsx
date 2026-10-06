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

export function LoginScreen({ navigation }: NativeStackScreenProps<AuthStackParamList, 'Login'>) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!isEmail(email) || !password) return setError('Ingresa tu correo y contraseña');
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo iniciar sesión');
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Inicia sesión" subtitle="Explora y reproduce tu música favorita.">
      <Input label="Correo" value={email} onChangeText={setEmail} placeholder="tu@correo.com"
        autoCapitalize="none" keyboardType="email-address" autoComplete="email" />
      <Input label="Contraseña" value={password} onChangeText={setPassword} placeholder="••••••"
        secureTextEntry autoComplete="password" onSubmitEditing={submit} />
      {error ? <Text style={{ color: colors.danger }}>{error}</Text> : null}
      <Button title="Entrar" onPress={submit} loading={loading} />
      <Pressable onPress={() => navigation.navigate('Register')}>
        <Text style={[typography.body, { textAlign: 'center', color: colors.textMuted }]}>
          ¿No tienes cuenta? <Text style={{ color: colors.primary, fontWeight: '600' }}>Regístrate</Text>
        </Text>
      </Pressable>
    </AuthLayout>
  );
}
