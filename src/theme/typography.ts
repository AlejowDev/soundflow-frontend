import { TextStyle } from 'react-native';
import { colors } from './colors';

/** Familias de Outfit cargadas en App.tsx (en Android fontWeight no elige la variante, hay que nombrarla). */
export const fonts = {
  regular: 'Outfit_400Regular',
  medium: 'Outfit_500Medium',
  semibold: 'Outfit_600SemiBold',
  bold: 'Outfit_700Bold',
  extrabold: 'Outfit_800ExtraBold',
};

export const typography = {
  display: { fontFamily: fonts.bold, fontSize: 28, color: colors.text, letterSpacing: -0.4 } as TextStyle,
  title: { fontFamily: fonts.bold, fontSize: 20, color: colors.text } as TextStyle,
  subtitle: { fontFamily: fonts.semibold, fontSize: 16, color: colors.text } as TextStyle,
  body: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 21, color: colors.text } as TextStyle,
  caption: { fontFamily: fonts.regular, fontSize: 12, lineHeight: 17, color: colors.textMuted } as TextStyle,
  label: { fontFamily: fonts.semibold, fontSize: 11, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 1 } as TextStyle,
  accentLabel: { fontFamily: fonts.bold, fontSize: 11, color: colors.primary, textTransform: 'uppercase', letterSpacing: 1 } as TextStyle,
};
