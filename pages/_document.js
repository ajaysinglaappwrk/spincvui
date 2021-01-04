import React from 'react';
import Document, {
  Html,
  Head,
  Main,
  NextScript,
} from 'next/document';

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);

    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          <script async src="https://www.googletagmanager.com/gtag/js?id=UA-87124676-2"></script>
          <script
            dangerouslySetInnerHTML={{
              __html: `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'UA-87124676-2');
`}}
          />
         
          <link rel='stylesheet' href='https://my-cdn.azureedge.net/cdn/css/bootstrap.min.css?v=1'></link>
          <link rel='stylesheet' href='https://my-cdn.azureedge.net/cdn/css/fancybox.min.css?v=1'></link>
          <link rel='stylesheet' href='https://my-cdn.azureedge.net/cdn/css/font-awesome.min.css?v=1'></link>
          <link rel='stylesheet' href='https://my-cdn.azureedge.net/cdn/css/flaticon.min.css?v=1'></link>
          <link rel='stylesheet' href='https://my-cdn.azureedge.net/cdn/css/plugin.min.css?v=1'></link>
          <link rel='stylesheet' href='https://my-cdn.azureedge.net/cdn/css/color.min.css?v=1'></link>
          <link rel='stylesheet' href='https://my-cdn.azureedge.net/cdn/css/style.min.css?v=1'></link>
          <link rel='stylesheet' href='https://my-cdn.azureedge.net/cdn/css/common.min.css?v=1'></link>
          <link rel='stylesheet' href='https://my-cdn.azureedge.net/cdn/css/responsive.min.css?v=1'></link>
          <link rel='stylesheet' href='https://my-cdn.azureedge.net/cdn/css/slick.min.css?v=1'></link>
          <link rel='stylesheet' href='https://my-cdn.azureedge.net/cdn/css/slick-theme.min.css?v=1'></link>
          <link rel='stylesheet' href='https://cdn.jsdelivr.net/npm/react-toastify@5.5.0/dist/ReactToastify.css'></link>
        </Head>
        <body>
          <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KGKR5LW" height="0" width="0"
            style={{ display: 'none', visibility: 'hidden' }}></iframe></noscript>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
