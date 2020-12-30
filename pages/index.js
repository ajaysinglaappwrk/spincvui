import React from 'react';
import { connect } from 'react-redux';
import initsStore from '../app/store';

import Layout from '../app/components/Layout';
import Dashboard from '../app/components/dashboard/dashboard'
import { withTranslation, i18n } from "../i18n";
import Head from 'next/head';
import Router from 'next/router';
import { companyService } from '../app/services/company.service';
class Home extends React.Component {
  static getInitialProps = async ({ req }) => {
    const currentLanguage = req ? req.language : i18n.language;
    return { currentLanguage, namespacesRequired: ["common"] };
  };

  componentDidMount() {
    if (!!window.location.search) {
      var code = window.location.search.substr(window.location.search.indexOf('=') + 1, window.location.search.indexOf('&state') - 6);
      const formData = new FormData();
      formData.append("code", code);
      var url = localStorage.getItem("userPageUrl");
      var filteredUrl = url.substr(1);
      var companyName = filteredUrl.substr(0, filteredUrl.indexOf("/") > -1 ? filteredUrl.indexOf("/") : filteredUrl.length);
      formData.append("companyName", companyName);
      var jobdetail = localStorage.getItem("jobDetail");
      if (!!jobdetail) {
          var parsedJobDetail = JSON.parse(jobdetail);
          formData.append("jobTitle", parsedJobDetail.jobTitle);
          formData.append("jobNumber", parsedJobDetail.jobNumber);
      }
      companyService.sendCVToCompany(formData).then((res) => {
        Router.push(url);
        localStorage.removeItem("userPageUrl");
        localStorage.removeItem("jobDetail");

      });
    }
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
