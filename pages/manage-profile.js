import React from 'react';
import Layout from '../app/components/Layout';
import ResetPassword  from '../app/components/profile-management/reset-password';
import { withTranslation, i18n } from "../i18n";

class ManageProfile extends React.Component {
  static getInitialProps = async ({ req }) => {
    const currentLanguage = req ? req.language : i18n.language;

    return { currentLanguage, namespacesRequired: ["common"] };
  };

  render() {
    return (
      <Layout>
          <ResetPassword></ResetPassword>
      </Layout>
    );
  }
}

export default (withTranslation("common")(ManageProfile));
