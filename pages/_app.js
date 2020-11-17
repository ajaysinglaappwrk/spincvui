import React from 'react'
import Link from 'next/link';
import App, { Container } from 'next/app'
import { Provider } from 'react-redux';

import withRedux from 'next-redux-wrapper';
import initsStore from '../app/store';
import { appWithTranslation } from "../i18n";

class MyApp extends App {
 
  
  render () {
    const { Component, pageProps, store } = this.props

    return (
        <Provider store={store}>
          <div 
          >
            <Component {...pageProps} />
          </div>
        </Provider>
    )
  }
}

export default withRedux(initsStore)(appWithTranslation(MyApp));
