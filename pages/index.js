import React from 'react';
import { connect } from 'react-redux';
import initsStore from '../app/store';

import Layout from '../app/components/Layout';
import Dashboard from '../app/components/dashboard/dashboard'
import { withTranslation, i18n } from "../i18n";

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
        <Dashboard></Dashboard>
      </Layout>
    );
  }
}

export default connect(initsStore)(withTranslation("common")(Home));
