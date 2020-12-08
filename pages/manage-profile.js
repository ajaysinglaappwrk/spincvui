import React from 'react';
import Layout from '../app/components/Layout';
import ResetPassword from '../app/components/profile-management/reset-password';
import { withTranslation, i18n } from "../i18n";
import Head from 'next/head';
class ManageProfile extends React.Component {
  static getInitialProps = async ({ req }) => {
    const currentLanguage = req ? req.language : i18n.language;

    return { currentLanguage, namespacesRequired: ["common"] };
  };

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
        <ResetPassword></ResetPassword>
      </Layout>
    );
  }
}

export default (withTranslation("common")(ManageProfile));
