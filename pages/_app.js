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
      <Container>
        <Provider store={store}>
          <div style={{
            maxWidth: '960px',
            margin: '50px auto',
          }}
          >
            <Link href="/">
              <a>Homepage</a>
            </Link>
            <Link href="/about">
              <a>About</a>
            </Link>
            <Component {...pageProps} />
          </div>
        </Provider>
      </Container>
    )
  }
}

export default withRedux(initsStore)(appWithTranslation(MyApp));
