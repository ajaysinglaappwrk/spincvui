import React from 'react';
import { withTranslation } from '../../../i18n';

class Footer extends React.Component {
    render() {
        const { i18n } = this.props;
        return (
            <footer id="careerfy-footer" className="careerfy-footer-one">
                <div className="container">
                    <div className="careerfy-footer-widget">
                        <div className="row">
                            <aside className="widget col-md-4 widget_contact_info">
                                <div className="widget_contact_wraps">
                                    <a className="careerfy-footer-logo" href="index.html">
                                        <img src="https://my-cdn.azureedge.net/cdn/images/minuscule_blanc.png" style={{maxWidth:200}} alt="" />
                                        </a>
                                        <p>{i18n.t('Footer.ShortDesc')}</p>
                                </div>
                            </aside>
                            <aside className="widget col-md-3 widget_nav_manu">
                            <div className="footer-widget-title"><h2>{i18n.t('Footer.TipsLabel')}</h2></div>
                                    <ul>
                                        <li><a href="/jobs"> {i18n.t('Footer.BrowseJobs')}</a></li>
                                        <li><a href="/post-a-job"> {i18n.t('Footer.Employers')}</a></li>
                                        <li><a href="/post-a-job">{i18n.t('Footer.AddJob')}</a></li>
                                    </ul>
                            </aside>
                            <aside className="widget col-md-3 widget_nav_manu">
                            <div className="footer-widget-title"><h2>{i18n.t('Footer.AboutUsLabel')}</h2></div>
                                <ul>
                                    {/* <li><a href="/contact-us">{i18n.t('Footer.AboutSpinCV')}</a></li> */}
                                    {/* <li><a href="#">{i18n.t('Footer.FAQ')}</a></li> */}
                                    <li><a href="/conditions">{i18n.t('Footer.TermsandConditions')}</a></li>
                                    <li><a href="/confidentialite">{i18n.t('Footer.PrivacyPolicy')}</a></li>
                                    <li><a href="/contact-us">{i18n.t('Footer.ContactUs')}</a></li>
                                </ul>
                            </aside>
                            <aside className="widget col-md-2">
                            <div className="footer-widget-title"><h2>{i18n.t('Footer.FollowupLabel')}</h2></div>
                                <ul className="careerfy-social-network">
                                    <li><a href="https://www.facebook.com/spincv/" className="careerfy-bgcolorhover fa fa-facebook" target="_blank"></a></li>
                                    <li><a href="https://twitter.com/CvSpin" className="careerfy-bgcolorhover fa fa-twitter" target="_blank"></a></li>
                                    {/* <li><a href="https://twitter.com/CvSpin" className="careerfy-bgcolorhover fa fa-linkedin"></a></li> */}
                                    <li><a href="https://www.youtube.com/channel/UCq86FG_t3ZpIsCUBglnsTvg/videos" className="careerfy-bgcolorhover fa fa-youtube" target="_blank"></a></li>
                                </ul>
                            {/* <div className="footer-widget-title"><h2>Languages</h2></div>
                                <ul className="careerfy-social-network language-icon-footer">
                                        <li onClick={() => i18n.changeLanguage('fr')}><a href="javascript:void(0)" className="careerfy-bgcolorhover" ><span>Fr</span></a></li>
                                        <li onClick={() => i18n.changeLanguage('en')}><a href="javascript:void(0)" className="careerfy-bgcolorhover" ><span>En</span></a></li>
                                    </ul> */}
                            </aside>
                        </div>
                    </div>
                </div>
                <div className="site-copyright">
                    <p>© 2016-{new Date().getFullYear()} - spincv<sup>{i18n.t('Footer.RightReserveShortLabel')} </sup> - {i18n.t('Footer.RightReserveLabel')} </p>
                </div>
            </footer>
        )
    }
}

export default withTranslation('translation')(Footer);
