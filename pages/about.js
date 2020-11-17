import React from 'react';
import { connect } from 'react-redux';
import initsStore from '../app/store';


import { fetchRandomCard } from '../app/actions/cardsActions';
import Layout from '../app/components/Layout';
import { withTranslation, i18n } from "../i18n";

class About extends React.Component {
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
          About page
            {this.props.t("description")} 
      </Layout>
    );
  }
}

export default connect(initsStore)(withTranslation("common")(About));
