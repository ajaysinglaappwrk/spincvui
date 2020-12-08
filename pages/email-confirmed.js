import React from 'react';
import { withTranslation, i18n } from '../i18n';
import Layout from '../app/components/Layout';
import Login from '../app/components/login/login';
import Head from 'next/head';
class EmailConfirmed extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loginModal: false
        }
    }
    closeLoginModal = () => {
        const loginModal = false;
        this.setState({ loginModal });
        document.body.classList.remove('careerfy-modal-active');
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
                    this.state.loginModal &&
                    <Login modal={this.state.loginModal} close={this.closeLoginModal}
                    ></Login>
                }
                <div className="careerfy-main-content  contact-us">
                    <div className="careerfy-main-section map-full">
                        <div className="container-fluid ">
                            <div className="row">

                                <div className="banner-contact" style={{ position: 'relative', backgroundImage: 'url("/static/assets/images/glen-pc.jpg")', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPositionX: 'center', backgroundPositionY: '-150px', height: '420px', width: '100%' }}>
                                    <div className="careerfy-page-title contact-page-banner-title email-confrimed-page">
                                        <div>
                                            <h2>{i18n.t('EmailConfirm.ConfirmThs')}</h2>
                                            <button onClick={() => this.setState({ loginModal: true })}>{i18n.t('Login.LoginButton')}</button>
                                        </div>
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

export default withTranslation('common')(EmailConfirmed);
