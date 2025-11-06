import type { AppProps } from 'next/app';
import Head from 'next/head';
import '../styles/globals.css';
import '../styles/theme.css';

export default function MyApp({ Component, pageProps }: AppProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://projectfitness.co';
  const previewImage = `${siteUrl}/assets/images/1_logo.png`;

  return (
    <>
      <Head>
        <meta property="og:image" content={previewImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={previewImage} />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
