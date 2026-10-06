import { createElement } from 'react';

/**
 * En la vista previa web no existe WebView nativo, así que usamos un iframe.
 * Algunos sitios (Google, YouTube) bloquean iframes; en el celular sí cargan.
 */
export function WebFrame({ url }: { url: string }) {
  return createElement('iframe', {
    src: url,
    style: { flex: 1, border: 0, width: '100%', height: '100%', backgroundColor: '#fff' },
  });
}
