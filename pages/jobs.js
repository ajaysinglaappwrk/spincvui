import React, { Component, Fragment } from "react";
import { withTranslation } from '../i18n';
import Layout from '../app/components/Layout';
import JobSearch from '../app/components/job-listing/job-search';
import Head from 'next/head';
class Jobs extends React.Component {


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
                <JobSearch></JobSearch>
            </Layout>
        );
    }
}
export default withTranslation('common')(Jobs);
