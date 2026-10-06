import { useState } from 'react';
import { Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button } from '../../components/Button';
import { FormError } from '../../components/FormError';
import { Input } from '../../components/Input';
import { useAuth } from '../../hooks/useAuth';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { isEmail } from '../../utils/validators';
import { AuthLayout, AuthSwitch } from './AuthLayout';

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
    <AuthLayout title="Bienvenido de nuevo" subtitle="Inicia sesión para seguir escuchando.">
      <Input label="Correo" icon="mail-outline" value={email} onChangeText={setEmail} placeholder="tu@correo.com"
        autoCapitalize="none" keyboardType="email-address" autoComplete="email" returnKeyType="next" />
      <Input label="Contraseña" icon="lock-closed-outline" password value={password} onChangeText={setPassword}
        placeholder="Tu contraseña" autoComplete="password" returnKeyType="go" onSubmitEditing={submit} />
      <FormError message={error} />
      <Button title="Entrar" icon="log-in-outline" size="lg" onPress={submit} loading={loading} />
      <Pressable onPress={() => navigation.navigate('Register')} hitSlop={8}>
        <AuthSwitch question="¿No tienes cuenta?" action="Regístrate" />
      </Pressable>
    </AuthLayout>
  );
}
