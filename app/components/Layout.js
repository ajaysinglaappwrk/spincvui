import React from 'react';
import Head from 'next/head';
import Header from '../components/header/header'
import Footer from '../components/footer/footer'

const Layout = ({ children }) => (
  <div>
    <Head>
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
    <Header></Header>
    <div>
      {children}
    </div>
    <Footer></Footer>
  </div>
);

export default Layout;
