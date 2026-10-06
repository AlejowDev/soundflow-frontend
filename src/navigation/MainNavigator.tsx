import { createDrawerNavigator } from '@react-navigation/drawer';
import { SideMenu } from '../components/SideMenu';
import { PhotosScreen } from '../screens/Photos/PhotosScreen';
import { PlayerScreen } from '../screens/Player/PlayerScreen';
import { ProfileScreen } from '../screens/Profile/ProfileScreen';
import { VideoScreen } from '../screens/Video/VideoScreen';
import { WebScreen } from '../screens/Web/WebScreen';
import { colors } from '../theme';

export type MainParamList = {
  Perfil: undefined;
  Fotos: undefined;
  Video: undefined;
  Web: undefined;
  Botones: undefined;
};

const Drawer = createDrawerNavigator<MainParamList>();

const TITLES: Record<keyof MainParamList, string> = {
  Perfil: 'Mi perfil',
  Fotos: 'Galería musical',
  Video: 'Videos',
  Web: 'Navegador',
  Botones: 'Reproductor',
};

/**
 * Esquema maestro–detalle: el drawer "permanent" deja el menú siempre visible a la izquierda
 * y cada sección se pinta en el área de la derecha (RF01 / RF08).
 */
export function MainNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="Perfil"
      drawerContent={(props) => <SideMenu {...props} />}
      screenOptions={({ route }) => ({
        drawerType: 'permanent',
        drawerStyle: { width: 84, backgroundColor: colors.surface, borderRightWidth: 0 },
        headerTitle: TITLES[route.name],
        headerLeft: () => null,
        headerStyle: { backgroundColor: colors.background },
        headerShadowVisible: false,
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '700' },
        sceneStyle: { backgroundColor: colors.background },
      })}
    >
      <Drawer.Screen name="Perfil" component={ProfileScreen} />
      <Drawer.Screen name="Fotos" component={PhotosScreen} />
      <Drawer.Screen name="Video" component={VideoScreen} />
      <Drawer.Screen name="Web" component={WebScreen} />
      <Drawer.Screen name="Botones" component={PlayerScreen} />
    </Drawer.Navigator>
  );
}
