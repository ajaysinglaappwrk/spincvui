import React from 'react';
import { connect } from 'react-redux';
import initsStore from '../app/store';

import Layout from '../app/components/Layout';
import Dashboard from '../app/components/dashboard/dashboard'
import { withTranslation, i18n } from "../i18n";
import Head from 'next/head';
class Home extends React.Component {
  static getInitialProps = async ({ req }) => {
    const currentLanguage = req ? req.language : i18n.language;
    return { currentLanguage, namespacesRequired: ["common"] };
  };

  componentDidMount() {
    i18n.changeLanguage("fr");
  }

  constructor(props) {
    super(props);
  }


  render() {
    return (
      <Layout>
        <Head>
          <meta property="og:title" content="Trouvez l’entreprise qui vous convient" />
          <meta property="og:image" content="https://opsoestorage.blob.core.windows.net/companybackground-stg/spin-preview.png" />
          <meta property="og:image:width" content="200" />
          <meta property="og:image:height" content="200" />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://www.spincv.com/" />
        </Head>
        <Dashboard></Dashboard>
      </Layout>
    );
  }
}

export default connect(initsStore)(withTranslation("common")(Home));
