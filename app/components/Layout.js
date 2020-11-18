import React from 'react';
import Head from 'next/head';
import Header from '../components/header/header'
import Footer from '../components/footer/footer'

const Layout = ({ children }) => (
  <div>
    <Head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>spincv.com | Home</title>
      <link rel="icon" href="/static/favicon.ico" />
      <link href="" rel="stylesheet" />
      <link rel="apple-touch-icon" sizes="57x57" href="/static/assets/images/apple-icon-57x57.png" />
      <link rel="apple-touch-icon" sizes="60x60" href="/static/assets/images/apple-icon-60x60.png" />
      <link rel="apple-touch-icon" sizes="72x72" href="/static/assets/images/apple-icon-72x72.png" />
      <link rel="apple-touch-icon" sizes="76x76" href="/static/assets/images/apple-icon-76x76.png" />
      <link rel="apple-touch-icon" sizes="114x114" href="/static/assets/images/apple-icon-114x114.png" />
      <link rel="apple-touch-icon" sizes="120x120" href="/static/assets/images/apple-icon-120x120.png" />
      <link rel="apple-touch-icon" sizes="144x144" href="/static/assets/images/apple-icon-144x144.png" />
      <link rel="apple-touch-icon" sizes="152x152" href="/static/assets/images/apple-icon-152x152.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/static/assets/images/apple-icon-180x180.png" />
      <link rel="icon" type="image/png" sizes="192x192" href="/static/assets/images/android-icon-192x192.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/static/assets/images/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="96x96" href="/static/assets/images/favicon-96x96.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/static/assets/images/favicon-16x16.png" />
    </Head>
    <Header></Header>
    <div>
      {children}
    </div>
    <Footer></Footer>
  </div>
);

export default Layout;
