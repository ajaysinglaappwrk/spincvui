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
         
          <link rel='stylesheet' href='/static/assets/css/bootstrap.min.css'></link>
          <link rel='stylesheet' href='/static/assets/plugin-css/fancybox.min.css'></link>
          <link rel='stylesheet' href='/static/assets/css/font-awesome.min.css'></link>
          <link rel='stylesheet' href='/static/assets/css/flaticon.min.css'></link>
          <link rel='stylesheet' href='/static/assets/plugin-css/plugin.min.css'></link>
          <link rel='stylesheet' href='/static/assets/css/color.min.css'></link>
          <link rel='stylesheet' href='/static/assets/css/style.min.css'></link>
          <link rel='stylesheet' href='/static/assets/css/common.min.css'></link>
          <link rel='stylesheet' href='/static/assets/css/responsive.min.css'></link>
          <link rel='stylesheet' href='/static/assets/css/slick.min.css'></link>
          <link rel='stylesheet' href='/static/assets/css/slick-theme.min.css'></link>
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
