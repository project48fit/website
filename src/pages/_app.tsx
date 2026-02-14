import type { AppProps } from 'next/app';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import Script from 'next/script';
import '../styles/globals.css';
import '../styles/theme.css';

const LoaderOverlay = dynamic(() => import('../components/LoaderOverlay'), { ssr: false });

export default function MyApp({ Component, pageProps }: AppProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://projectfitness.co';
  const previewImage = `${siteUrl}/assets/images/1_logo.png`;

  return (
    <>
      <LoaderOverlay />
      <Script id="linkedin-insight-tag" strategy="afterInteractive">
        {`
_linkedin_partner_id = "9556041";
window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
window._linkedin_data_partner_ids.push(_linkedin_partner_id);

(function(l) {
if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
window.lintrk.q=[]}
var s = document.getElementsByTagName("script")[0];
var b = document.createElement("script");
b.type = "text/javascript";
b.async = true;
b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
s.parentNode.insertBefore(b, s);
})(window.lintrk);
`}
      </Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          alt=""
          src="https://px.ads.linkedin.com/collect/?pid=9556041&fmt=gif"
        />
      </noscript>
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
