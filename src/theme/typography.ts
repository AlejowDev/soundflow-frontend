import { TextStyle } from 'react-native';
import { colors } from './colors';

export const typography = {
  title: { fontSize: 22, fontWeight: '700', color: colors.text } as TextStyle,
  subtitle: { fontSize: 16, fontWeight: '600', color: colors.text } as TextStyle,
  body: { fontSize: 14, lineHeight: 21, color: colors.text } as TextStyle,
  caption: { fontSize: 12, color: colors.textMuted } as TextStyle,
  label: { fontSize: 12, fontWeight: '600', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.6 } as TextStyle,
};
