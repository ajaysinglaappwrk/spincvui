import React from 'react';
import { connect } from 'react-redux';


import Layout from '../../app/components/Layout';
import { withTranslation, i18n } from "../../i18n";

import EmployerDetail from '../../app/components/employer-detail/employer-detail'

class EmployerDetailPage extends React.Component {
  static getInitialProps = async ({ req }) => {
    const currentLanguage = req ? req.language : i18n.language;

    return { currentLanguage, namespacesRequired: ["common"] };
  };

  constructor(props) {
    super(props);
    this.state = {
      searchPhrase: '',
      selectedFormat: 'standard',
    };
  }

  
  render() {
    return (
      <Layout>
         <EmployerDetail></EmployerDetail>
      </Layout>
    );
  }
}

export default (withTranslation("common")(EmployerDetailPage));
