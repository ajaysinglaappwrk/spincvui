import React, { Fragment } from 'react';
import Layout from '../app/components/Layout';
import Head from 'next/head';
import { withTranslation, i18n } from '../i18n';
import TermConditionsEN from '../app/components/terms-conditions/terms-condition-en';
import TermConditionsFR from '../app/components/terms-conditions/terms-conditions-fr';

class TermConditions extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentLanguage: "fr"
        };
    }

    componentDidMount() {
        this.setState({ currentLanguage: localStorage.getItem("currentLang") });
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

                {
                    this.state.currentLanguage == "fr" &&
                    <TermConditionsFR></TermConditionsFR>
                }
                {
                    this.state.currentLanguage == "en" &&
                    <TermConditionsEN></TermConditionsEN>
                }

            </Layout>
        )
    }
}
export default withTranslation('common')(TermConditions);