import { createElement, Ref, useImperativeHandle, useState } from 'react';
import type { WebFrameHandle, WebNavState } from './WebFrame';

interface Props {
  url: string;
  ref?: Ref<WebFrameHandle>;
  onNavChange?: (state: WebNavState) => void;
}

/**
 * En la vista previa web no existe WebView nativo, así que usamos un iframe.
 * El historial de un iframe de otro dominio no es accesible: atrás/adelante solo funcionan en el celular.
 * Algunos sitios (Google, YouTube) bloquean iframes; en el celular sí cargan.
 */
export function WebFrame({ url, ref }: Props) {
  const [key, setKey] = useState(0);

  useImperativeHandle(ref, () => ({
    goBack: () => {},
    goForward: () => {},
    reload: () => setKey((k) => k + 1),
  }));

  return createElement('iframe', {
    key,
    src: url,
    style: { flex: 1, border: 0, width: '100%', height: '100%', backgroundColor: '#fff' },
  });
}
