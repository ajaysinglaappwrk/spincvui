import React from 'react';
import Layout from '../../app/components/Layout';
import { withTranslation, i18n } from "../../i18n";
import EmployerDetail from '../../app/components/employer-detail/employer-detail'
import { apiUrl } from '../../app/config';
import Head from 'next/head';

class EmployerDetailPage extends React.Component {

  static getInitialProps = async ({ req, query }) => {
    const currentLanguage = req ? req.language : i18n.language;
    const res = await fetch(apiUrl + 'api/Company/GetCompanyByName/' + query.companyname);
    const json = await res.json()
    return { employerDetail: json, currentLanguage, namespacesRequired: ["common"] };
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
        <Head>
          <meta property="og:title" content="Trouvez l’entreprise qui vous convient" />
          <meta property="og:image" content={this.props.employerDetail.companyLogoUrl} />
          <meta property="og:image:width" content="200" />
          <meta property="og:image:height" content="200" />
          <meta property="og:type" content="website" />
          <meta property="og:url" content={"https://www.spincv.com/" + this.props.employerDetail.name} />
        </Head>
        <EmployerDetail></EmployerDetail>
      </Layout>
    );
  }
}

export default (withTranslation("common")(EmployerDetailPage));
