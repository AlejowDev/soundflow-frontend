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

/**
 * Esquema maestro–detalle: el drawer "permanent" deja el menú siempre visible a la izquierda
 * y cada sección se pinta en el área de la derecha (RF01 / RF08). Cada pantalla dibuja su
 * propio encabezado (ScreenContainer), por eso el del navegador va oculto.
 */
export function MainNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="Perfil"
      drawerContent={(props) => <SideMenu {...props} />}
      screenOptions={{
        drawerType: 'permanent',
        drawerStyle: { width: 80, backgroundColor: colors.surface, borderRightWidth: 0 },
        headerShown: false,
        sceneStyle: { backgroundColor: colors.background },
      }}
    >
      <Drawer.Screen name="Perfil" component={ProfileScreen} />
      <Drawer.Screen name="Fotos" component={PhotosScreen} />
      <Drawer.Screen name="Video" component={VideoScreen} />
      <Drawer.Screen name="Web" component={WebScreen} />
      <Drawer.Screen name="Botones" component={PlayerScreen} />
    </Drawer.Navigator>
  );
}
