import React from 'react';
import { withTranslation, i18n } from '../i18n';
import Layout from '../app/components/Layout';

class ConfirmEmployerEmail extends React.Component {
    render() {
        return (
            <Layout>
                <div className="careerfy-main-content  contact-us">
                    <div className="careerfy-main-section map-full">
                        <div className="container-fluid ">
                            <div className="row">

                                <div className="banner-contact" style={{ position: 'relative', backgroundImage: 'url("/static/assets/images/contact-ban.jpg")', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPositionX: 'center', backgroundPositionY: '-150px', height: '420px', width: '100%' }}>
                                    <div className="careerfy-page-title contact-page-banner-title">
                                        {/* <h3>Un membre de notre équipe vous contactera</h3> */}
                                        <h3>{i18n.t('EmailConfirm.RegsiterThs')}</h3>
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

export default withTranslation('common')(ConfirmEmployerEmail);
