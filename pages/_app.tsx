import '../styles/global.css';
import 'highlight.js/styles/androidstudio.css';
import { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
