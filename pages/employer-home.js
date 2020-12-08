import React from 'react';
import { withTranslation, i18n } from '../i18n';
import Layout from '../app/components/Layout';
import Head from 'next/head';
class EmployerHome extends React.Component {
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
                <div className="careerfy-main-content  contact-us">
                    <div className="careerfy-main-section map-full">
                        <div className="container-fluid ">
                            <div className="row">

                                <div className="banner-contact" style={{ position: 'relative', backgroundImage: 'url("/static/assets/images/contact-ban.jpg")', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPositionX: 'center', backgroundPositionY: '-150px', height: '420px', width: '100%' }}>
                                    <div className="careerfy-page-title contact-page-banner-title">
                                        <h3>Merci de vous être enregistré.  Un membre de notre équipe vous contactera très bientôt pour la suite.</h3>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        )
    }
}

export default withTranslation('common')(EmployerHome);
