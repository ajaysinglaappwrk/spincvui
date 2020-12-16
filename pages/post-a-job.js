import React, { Fragment } from 'react';
import { i18n, withTranslation } from '../i18n';
import Slider from "react-slick";
import Layout from '../app/components/Layout';
import Head from 'next/head';
import { companyService } from '../app/services/company.service'

class JobPosting extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            companies: [],
            imageData: [
                { path: '/static/assets/images/slide-img-1.png', title: "Montrez le visage humain de votre entreprise", listItems: "<li>Interview vidéo avec vos employés qui expliquent pourquoi rejoindre votre entreprise est super</li><li> Photo de vos employés dans leur environnement de travail</li>" },
                { path: '/static/assets/images/slide-img-2.png', title: "Faites voir votre environnement de travail", listItems: "<li>Vidéos et photos de vos bureaux, cafétériat, ….</li><li>Visite 3D (possibilité d'inclure dans google maps) </li><li> Vidéo de drône pour montrer votre building</li>" },
                { path: '/static/assets/images/slide-img-3.png', title: "Dites-leur vos avantages (perks)", listItems: "<li> Énumérez tous les avantages incroyable que votre compagnie offre</li><li>Nous permettons aux candidats d'effectuer des recherches d'emplois par avantages</li><li>Adaptez chacunes de vos offres avec les avantages qui s'y rattachent</li>" },
                { path: '/static/assets/images/slide-img-4.png', title: "Répondez en direct aux questions", listItems: "<li>Session en direct  sur notre site et YouTube</li><li>Répondez aux questions des candidats pour les convaincres d'envoyer leur CV </li><li>Les sessions en directes passées seront toujours disponible sur votre page</li>" },
                { path: '/static/assets/images/slide-img-5.png', title: "Publiez de courtes vidéos pour chacune de vos offres d'emploi", listItems: "<li>Montrez directement l'environnement de  travail de la personne que vous voulez recruter</li><li>Expliquez pourquoi cette position est fantastique</li>" },
                { path: '/static/assets/images/slide-img-6.png', title: "Publiez directement sur votre site web dans votre section carrière nos pages", listItems: "<li>Ayez accès à notre magnifique interface pour votre site web</li><li>Publiez le tout avec une seule ligne de code</li><li>Modifiez les vidéos, photos, …. autant de fois que vous le désirez</li>" },
                { path: '/static/assets/images/slide-img-7.png', title: "Automatisez vos publications d'offres d'emploi", listItems: "<li>Nous vous offrons un connecteur qui s'intègre dans votre ATS pour actualisez vos offres</li><li>Fini le copier/coller pour publier vos offres d'emploi</li>" },

            ],
            imageDataClients: [
                { path: '/static/assets/images/client-1.png', name: 'Joel Dudley', position: 'Web Designer' },
                { path: '/static/assets/images/client-2.png', name: 'David Stevens', position: 'Supervisor' },
                { path: '/static/assets/images/client-3.png', name: 'James Ray', position: 'Web Designer' },
                { path: '/static/assets/images/client-4.png', name: 'Noah Zimmerman', position: 'Web Designer' },
                { path: '/static/assets/images/client-5.png', name: 'Matt John', position: 'Web Designer' },
                { path: '/static/assets/images/client-6.png', name: 'Joel Dudley', position: 'Web Designer' }
            ]
        }
    }

    componentDidMount() {
        companyService.getDashboardCompanies().then((res) => {
            this.setState({ companies: res });
        })
    }

    render() {
        var settings = {
            dots: true,
            navigation: true,
            infinite: true,
            speed: 1200,
            autoplaySpeed: 6500,
            autoplay: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
            responsive: [
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 1
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 1
                    }
                }
            ]
        };
        var permanentClients = this.state.companies.filter(x => x.isFutureClient != true);
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
                <div className="post-a-job-page">
                    <div className="page-with-bg">
                        <div className="container">
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="careerfy-page-title">
                                        <div className="post-banner-overlay-text">
                                            <div className="post-text-left">
                                                <img src="/static/assets/images/Spincv-logo.png" alt="" />
                                                <h3 dangerouslySetInnerHTML={{ __html: i18n.t('PostJob.BannerTitle1') }} />
                                            </div>
                                            <div className="post-text-right">
                                                <h3 dangerouslySetInnerHTML={{ __html: i18n.t('PostJob.BannerTitle2') }} />
                                                <a href="/contact-us" className="post-action">{i18n.t('Menu.ForEmployers')}</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="careerfy-main-section careerfy-classic-services-full">
                        <div className="container">
                            <div className="row">
                                <div className="careerfy-typo-wrap">
                                    <section className="careerfy-fancy-title">
                                        <h2>{i18n.t('PostJob.SectionTitle1')}</h2>
                                    </section>
                                    <div className="careerfy-classic-services icons-section-title">
                                        <ul className="row">
                                            <li className="col-md-3 col-sm-6">
                                                <div className="image-icon">
                                                    <span>
                                                        <img src="/static/assets/images/operate-icon-1.png" alt="icon-1" />
                                                    </span>
                                                </div>
                                                <h2>{i18n.t('PostJob.HowItWorksInnerTitle1')}</h2>
                                                <h3>{i18n.t('PostJob.HowItWorksInnerSubTitle1')}</h3>
                                                <p>{i18n.t('PostJob.HowItWorksInnerDescription1')}</p>
                                            </li>
                                            <li className="col-md-3  col-sm-6">
                                                <div className="image-icon">
                                                    <span>
                                                        <img src="/static/assets/images/operate-icon-2.png" alt="icon-1" />
                                                    </span>
                                                </div>
                                                <h2>{i18n.t('PostJob.HowItWorksInnerTitle2')}</h2>
                                                <h3>{i18n.t('PostJob.HowItWorksInnerSubTitle2')}</h3>
                                                <p>{i18n.t('PostJob.HowItWorksInnerDescription2')}</p>
                                            </li>
                                            <li className="col-md-3  col-sm-6">
                                                <div className="image-icon">
                                                    <span>
                                                        <img src="/static/assets/images/operate-icon-3.png" alt="icon-1" />
                                                    </span>
                                                </div>
                                                <h2>{i18n.t('PostJob.HowItWorksInnerTitle3')}</h2>
                                                <h3>{i18n.t('PostJob.HowItWorksInnerSubTitle3')}</h3>
                                                <p>{i18n.t('PostJob.HowItWorksInnerDescription3')}</p>
                                            </li>
                                            <li className="col-md-3  col-sm-6">
                                                <div className="image-icon">
                                                    <span>
                                                        <img src="/static/assets/images/operate-icon-4.png" alt="icon-1" />
                                                    </span>
                                                </div>
                                                <h2>{i18n.t('PostJob.HowItWorksInnerTitle4')}</h2>
                                                <h3>{i18n.t('PostJob.HowItWorksInnerSubTitle4')}</h3>
                                                <p>{i18n.t('PostJob.HowItWorksInnerDescription4')}</p>
                                            </li>
                                        </ul>
                                        <a href="/contact-us" className="action-btn" >{i18n.t('PostJob.BtnText')}</a>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="careerfy-main-section careerfy-classic-services-full with-bg">
                        <div className="container">
                            <div className="row">
                                <div className="careerfy-typo-wrap">
                                    <section className="careerfy-fancy-title">
                                        <h2>{i18n.t('PostJob.SectionTitle2')}</h2>
                                    </section>
                                    <div className="video-section">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="video-image-help">
                                                    <img src="/static/assets/images/picture_1.jpg" />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <h2>{i18n.t('PostJob.HireInnerTitle1')}</h2>
                                                <p>{i18n.t('PostJob.HireInnerDescription1')}</p>

                                                <h2>{i18n.t('PostJob.HireInnerTitle2')}</h2>
                                                <p>{i18n.t('PostJob.HireInnerDescription2')}</p>
                                                <a href="/contact-us" className="action-btn" >{i18n.t('PostJob.BtnText')}</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="careerfy-main-section">
                        <div className="careerfy-testimonial-section" >
                            <Slider {...settings}>
                                {this.state.imageData && this.state.imageData.length > 0 && this.state.imageData.map((x, i) => (
                                    <div className="row" key={i}>
                                        <aside className="col-md-6" >
                                            <img src={x.path} />
                                        </aside>
                                        <aside className="col-md-6">
                                            <div className="testimonial-slider-content">
                                                <section className="careerfy-fancy-title">
                                                    <h2>{i18n.t('PostJob.SlideTitle')}</h2>
                                                </section>
                                                <h3>{x.title}</h3>
                                                <ul dangerouslySetInnerHTML={{ __html: x.listItems }} />
                                                <a href="/contact-us" className="action-btn" >{i18n.t('PostJob.BtnText')}</a>
                                            </div>
                                        </aside>

                                    </div>
                                ))}
                            </Slider>
                        </div>
                    </div>
                    <div className="careerfy-main-section careerfy-classic-services-full">
                        <div className="container">
                            <div className="row">
                                <div className="careerfy-typo-wrap">
                                    <section className="careerfy-fancy-title">
                                        <h2>{i18n.t('PostJob.SecurityMainTitle')}</h2>
                                    </section>
                                    <div className="careerfy-classic-services icons-section-title">
                                        <ul className="row">
                                            <li className="col-md-4  col-sm-6">
                                                <div className="image-icon">
                                                    <span>
                                                        <img src="/static/assets/images/security-icon-1.png" alt="icon-1" />
                                                    </span>
                                                </div>
                                                <h2>{i18n.t('Security.SecurityTitle1')}</h2>
                                                <p>{i18n.t('Security.SecurityContent1')}</p>
                                            </li>
                                            <li className="col-md-4  col-sm-6">
                                                <div className="image-icon">
                                                    <span>
                                                        <img src="/static/assets/images/security-icon-2.png" alt="icon-1" />
                                                    </span>
                                                </div>
                                                <h2>{i18n.t('Security.SecurityTitle2')}</h2>
                                                <p>{i18n.t('Security.SecurityContent2')}</p>
                                            </li>
                                            <li className="col-md-4  col-sm-6">
                                                <div className="image-icon">
                                                    <span>
                                                        <img src="/static/assets/images/security-icon-3.png" alt="icon-1" />
                                                    </span>
                                                </div>
                                                <h2>{i18n.t('Security.SecurityTitle3')}</h2>
                                                <p>{i18n.t('Security.SecurityContent3')}</p>
                                            </li>
                                            <li className="col-md-4  col-sm-6">
                                                <div className="image-icon">
                                                    <span>
                                                        <img src="/static/assets/images/security-icon-4.png" alt="icon-1" />
                                                    </span>
                                                </div>
                                                <h2>{i18n.t('Security.SecurityTitle4')}</h2>
                                                <p>{i18n.t('Security.SecurityContent4')}</p>
                                            </li>
                                            <li className="col-md-4  col-sm-6">
                                                <div className="image-icon">
                                                    <span>
                                                        <img src="/static/assets/images/security-icon-5.png" alt="icon-1" />
                                                    </span>
                                                </div>
                                                <h2>{i18n.t('Security.SecurityTitle5')}</h2>
                                                <p>{i18n.t('Security.SecurityContent5')}</p>
                                            </li>
                                            <li className="col-md-4  col-sm-6">
                                                <div className="image-icon">
                                                    <span>
                                                        <img src="/static/assets/images/security-icon-6.png" alt="icon-1" />
                                                    </span>
                                                </div>
                                                <h2>{i18n.t('Security.SecurityTitle6')}</h2>
                                                <p>{i18n.t('Security.SecurityContent6')}</p>
                                            </li>
                                        </ul>
                                        <a href="/contact-us" className="action-btn" >{i18n.t('PostJob.BtnText')}</a>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                    <div className="careerfy-main-section">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="careerfy-service-slider1">
                                    {
                                        permanentClients && permanentClients.length > 0 &&
                                        <Fragment>
                                            <section className="careerfy-fancy-title">
                                                <h2>{i18n.t('PostJob.ClientsTitle')}</h2>
                                            </section>
                                            <div className="post-job-clients permanent-clients-box">
                                                <ul className="clients-logo">
                                                    {
                                                        permanentClients.map((company, index) => {
                                                            return (
                                                                <li className="blog-home-item" key={index}>
                                                                    <a href={'/'+company.name}><img src={company.companyLogoUrl} alt="" />
                                                                    </a>
                                                                </li>
                                                            )
                                                        })
                                                    }
                                                </ul>
                                            </div>
                                        </Fragment>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        )
    }
}

export default withTranslation('translation')(JobPosting);
