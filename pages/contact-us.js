import React from 'react';
import { withTranslation } from '../i18n';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { companyService } from '../app/services/company.service';
import { toast, ToastContainer } from 'react-toastify';
import Layout from '../app/components/Layout';
import Head from 'next/head';
class ContactUS extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isProcessing: false
        }
    }
    render() {
        const { i18n } = this.props;
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
                <div>
                    {
                        this.state.isProcessing &&
                        <div className="loader-outer"><div className="loader"></div></div>
                    }
                    <div className="careerfy-main-content  contact-us">

                        <div className="careerfy-main-section map-full">
                            <div className="container-fluid ">
                                <div className="row">

                                    <div className="banner-contact" style={{ position: 'relative', backgroundImage: 'url("/static/assets/images/contact-ban.jpg")', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPositionX: 'center', backgroundPositionY: '-150px', height: '420px', width: '100%' }}>
                                        <div className="careerfy-page-title contact-page-banner-title">
                                            <h3 dangerouslySetInnerHTML={{ __html: i18n.t('ContactUs.BannerTitle') }} />
                                        </div>

                                    </div>

                                </div>
                            </div>
                        </div>
                        <div className="careerfy-main-section careerfy-contact-form-full-section">
                            <div className="container">
                                <div className="row">

                                    <div className="col-md-12" style={{ marginBottom: '80px' }}>
                                        {/* <div className="careerfy-contact-info-sec" style={{padding: '91px 24px 91px 30px'}}> */}
                                        <div className="careerfy-contact-info-sec">
                                            <h2>{i18n.t('ContactUs.FormLeftTitle')}</h2>
                                            <p> {i18n.t('ContactUs.FormLeftDescription')}</p>
                                            <ul className="careerfy-contact-info-list">
                                                <li><i className="careerfy-icon careerfy-placeholder"></i> Montréal, Québec, Canada</li>
                                                <li><i className="careerfy-icon careerfy-mail"></i> <a href="#"> Courriel: info@spincv.com</a></li>
                                                {/* <li><i className="careerfy-icon careerfy-technology"></i> Call: 123.456.78910</li>
                                        <li><i className="careerfy-icon careerfy-fax"></i> Fax: (800) 123 4567 89</li> */}
                                            </ul>
                                            <div className="careerfy-contact-media">
                                                <a href="https://www.facebook.com/spincv/" className="careerfy-icon careerfy-facebook-logo"></a>
                                                <a href="https://twitter.com/CvSpin" className="careerfy-icon careerfy-twitter-logo"></a>
                                                <a href="https://www.instagram.com/spin_cv/" className="careerfy-icon careerfy-instagram-logo"></a>
                                                {/* <a href="#" className="careerfy-icon careerfy-dribbble-logo"></a> */}
                                            </div>
                                        </div>
                                        <div className="careerfy-contact-form" >
                                            <h2>{i18n.t('ContactUs.FormTitle')}</h2>

                                            <Formik
                                                initialValues={{
                                                    username: '',
                                                    companyname: '',
                                                    email: '',
                                                    phone: ''

                                                }}
                                                validationSchema={Yup.object().shape({
                                                    email: Yup.string().required(i18n.t('Validations.EmailValidationLabel')).email(i18n.t('Validations.InvalidEmailValidationLabel')),
                                                    companyname: Yup.string().required(i18n.t('Validations.CompanyName')),
                                                    username: Yup.string().required(i18n.t('Validations.UserNameValidationLabel')),
                                                    phone: Yup.string().required(i18n.t('Validations.PhoneNumberValidationLabel')),
                                                })}
                                                onSubmit={(values, actions) => {
                                                    toast.success("Message sent sucessfully");
                                                    // let dataToSend = {
                                                    //     username: values.username,
                                                    //     companyname: values.companyname,
                                                    //     email: values.email,
                                                    //     phone: values.phone
                                                    // }
                                                    // this.setState({ isProcessing: true });
                                                    // companyService.contactUs(dataToSend).then((result) => {
                                                    //     debugger;
                                                    //     this.setState({ isProcessing: false });
                                                    //     if (result) {
                                                    //         actions.resetForm();
                                                    //         toast.success("Message sent sucessfully");
                                                    //     }
                                                    //     else {
                                                    //         toast.success("Something went wrong");
                                                    //     }
                                                    // })

                                                }}
                                                render={({ errors, status, touched, isSubmitting }) => (
                                                    <Form>
                                                        <div className="careerfy-user-form">
                                                            <ul>
                                                                <li>
                                                                    <Field name="username" placeholder type="text" placeholder="Entrez votre nom" className={'form-control' + (errors.username && touched.username ? ' is-invalid' : '')} />
                                                                    <i className="careerfy-icon careerfy-user"></i>
                                                                    <ErrorMessage name="username" component="div" className="invalid-feedback text text-danger" />
                                                                </li>
                                                                <li>
                                                                    <Field name="companyname" placeholder type="text" placeholder="Nom de votre compagnie" className={'form-control' + (errors.companyname && touched.companyname ? ' is-invalid' : '')} />
                                                                    <i className="careerfy-icon careerfy-user"></i>
                                                                    <ErrorMessage name="companyname" component="div" className="invalid-feedback text text-danger" />
                                                                </li>
                                                                <li>
                                                                    <Field name="email" placeholder type="text" placeholder="Entrez votre courriel" className={'form-control' + (errors.email && touched.email ? ' is-invalid' : '')} />
                                                                    <i className="careerfy-icon careerfy-mail"></i>
                                                                    <ErrorMessage name="email" component="div" className="invalid-feedback text text-danger" />
                                                                </li>
                                                                <li>
                                                                    <Field name="phone" placeholder type="text" placeholder="Entrez votre numéro de téléphone" className={'form-control' + (errors.phone && touched.phone ? ' is-invalid' : '')} />
                                                                    <i className="careerfy-icon careerfy-mail"></i>
                                                                    <ErrorMessage name="phone" component="div" className="invalid-feedback text text-danger" />
                                                                </li>
                                                                <li><input type="submit" value={i18n.t('EmployeeDetail.Submit')} /></li>
                                                            </ul>
                                                        </div>

                                                    </Form>
                                                )}
                                            />


                                            {/* <form className="contact-us-form">
                                        <ul>
                                            <li>
                                                <input placeholder="Entrez votre nom" className="form-control" type="text" />
                                                <i className="careerfy-icon careerfy-user"></i>
                                            </li>
                                            <li>
                                                <input placeholder="Nom de votre compagnie" className="form-control" type="text" />
                                                <i className="careerfy-icon careerfy-user"></i>
                                            </li>
                                            <li>
                                                <input placeholder="Entrez votre courriel" className="form-control" type="text" />
                                                <i className="careerfy-icon careerfy-mail"></i>
                                            </li>
                                            <li>
                                                <input placeholder="Entrez votre numéro de téléphone" className="form-control" type="text" />
                                                <i className="careerfy-icon careerfy-technology"></i>
                                            </li>
                                            {/* <li className="careerfy-contact-form-full">
                                                <textarea className="form-control" placeholder="Écrivez ici votre message" ></textarea>
                                            </li> 
                                    <li><input type="submit" value="Envoyez" /></li>
                                        </ul>
                                    </form> */}
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div >
                        {/* <div className="careerfy-main-section contact-service-full">
                    <div className="container">
                        <div className="row">

                            <div className="col-md-12">
                                <div className="contact-service">
                                    <ul className="row">
                                        <li className="col-md-4">
                                            <h2>Want to join us?</h2>
                                            <i className="careerfy-icon careerfy-user-2"></i>
                                            <a href="#">Careers</a>
                                        </li>
                                        <li className="col-md-4">
                                            <h2>Read our latest news</h2>
                                            <i className="careerfy-icon careerfy-newspaper"></i>
                                            <a href="#">Our Blog</a>
                                        </li>
                                        <li className="col-md-4">
                                            <h2>Have questions?</h2>
                                            <i className="careerfy-icon careerfy-discuss-issue"></i>
                                            <a href="#">Our FAQ</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                        </div>
                    </div>
                </div> */}
                    </div >
                </div>
            </Layout>
        )
    }
}

export default withTranslation('translation')(ContactUS);
