import { Ref, useImperativeHandle, useRef } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { colors } from '../theme';

export interface WebFrameHandle {
  goBack: () => void;
  goForward: () => void;
  reload: () => void;
}

export interface WebNavState {
  url: string;
  canGoBack: boolean;
  canGoForward: boolean;
  loading: boolean;
}

interface Props {
  url: string;
  ref?: Ref<WebFrameHandle>;
  onNavChange?: (state: WebNavState) => void;
}

/** Navegador embebido: la página se abre dentro de SoundFlow (RF06). */
export function WebFrame({ url, ref, onNavChange }: Props) {
  const web = useRef<WebView>(null);

  useImperativeHandle(ref, () => ({
    goBack: () => web.current?.goBack(),
    goForward: () => web.current?.goForward(),
    reload: () => web.current?.reload(),
  }));

  return (
    <WebView
      ref={web}
      source={{ uri: url }}
      style={styles.web}
      startInLoadingState
      onNavigationStateChange={(s) =>
        onNavChange?.({ url: s.url, canGoBack: s.canGoBack, canGoForward: s.canGoForward, loading: s.loading })
      }
      renderLoading={() => (
        <View style={styles.loading}>
          <ActivityIndicator color={colors.primary} />
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  web: { flex: 1, backgroundColor: colors.white },
  loading: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
});
