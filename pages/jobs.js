import React, { Component, Fragment } from "react";
import { withTranslation } from '../i18n';

 import Layout from '../app/components/Layout';
 import JobSearch from '../app/components/job-listing/job-search';
class Jobs extends React.Component {
  
 
    render() {
        return (
            <Layout>
                <JobSearch></JobSearch>
            </Layout>
        );
    }
}
export default withTranslation('common')(Jobs);
