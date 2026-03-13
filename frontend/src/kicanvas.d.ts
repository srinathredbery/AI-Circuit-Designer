import 'react';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'kicanvas-embed': any;
      'kicanvas-source': any;
    }
  }
}
