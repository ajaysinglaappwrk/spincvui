import React from 'react';
import {i18n, withTranslation} from '../../../i18n';
import { authenticationService } from '../../services/authentication.service';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import FacebookLogin from 'react-facebook-login';
import { forgotPasswordUrl } from '../../config'

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoginFailed: false,
            selectedLoginoption: 0,
            isProcessing: false
        }
    }

    toggle() {
        this.props.close();
    }

    setSelectedOption(option) {
        this.setState({ selectedLoginoption: option });
    }

    login(data) {
        this.setState({ isProcessing: true });
        data.usertype = this.state.selectedLoginoption;
        authenticationService.login(data)
            .then(
                user => {
                    this.toggle();
                    this.setState({ isProcessing: false });
                    if (this.props.refreshFavJobs)
                        this.props.refreshFavJobs();
                    else {
                        if (window.location.pathname != "/email-confirmed")
                            window.location.reload();
                        else
                            window.location.href = "/";
                    }

                },
                error => {
                    this.setState({ isLoginFailed: true, isProcessing: false })
                }
            );

    }

    responseFacebook = (response) => {
        const dataToSend = {
            email: response.email,
            password: "",
            isSocialLogin: true,
            firstName: response.name
        }
        this.login(dataToSend);
    }
    responseGoogle = (response) => {
        console.log(response);
        if (!!response.tokenId) {
            if (response) {
                const dataToSend = {
                    email: response.profileObj.email,
                    password: "",
                    isSocialLogin: true,
                    firstName: response.profileObj.name
                }
                this.login(dataToSend);
            }
        }


    }
    handleSuccess = (data) => {
        const dataToSend = {
            email: "",
            password: "",
            isSocialLogin: true,
            code: data.code
        }
        this.login(dataToSend);

    }

    handleFailure = (error) => {
    }

    render() {
        return (

            <div>
                {
                    this.state.isProcessing &&
                    <div className="loader-outer"><div className="loader"></div></div>
                }
                <div className="careerfy-modal careerfy-typo-wrap fade-in" id="JobSearchModalSignup">


                    <div className="modal-inner-area">&nbsp;</div>
                    <div className="modal-content-area">
                        <div className="modal-box-area">

                            <div className="careerfy-modal-title-box">
                                <h2>{i18n.t('Login.LoginHeader')}</h2>
                                <span className="modal-close" onClick={() => this.toggle()}><i className="fa fa-times"></i></span>
                            </div>
                            <Formik
                                initialValues={{
                                    username: '',
                                    password: ''
                                }}
                                validationSchema={Yup.object().shape({
                                    username: Yup.string().required(i18n.t('Validations.EmailValidationLabel')).email(i18n.t('Validations.InvalidEmailValidationLabel')),
                                    password: Yup.string().required(i18n.t('Validations.PasswordValidationLabel'))
                                })}
                                onSubmit={({ username, password }, { setStatus, setSubmitting }) => {


                                    setStatus();
                                    const dataToSend = {
                                        email: username,
                                        password: password,
                                        isSocialLogin: false,
                                        usertype: this.state.selectedLoginoption,
                                    }
                                    this.setState({ isProcessing: true });
                                    authenticationService.login(dataToSend)
                                        .then(
                                            user => {
                                                this.toggle();
                                                this.setState({ isProcessing: false });
                                                if (this.props.refreshFavJobs)
                                                    this.props.refreshFavJobs();
                                                else {
                                                    if (window.location.pathname != "/email-confirmed")
                                                        window.location.reload();
                                                    else
                                                        window.location.href = "/";
                                                }


                                            },
                                            error => {
                                                this.setState({ isLoginFailed: true, isProcessing: false })
                                                setSubmitting(false);
                                            }
                                        );
                                }}
                                render={({ errors, status, touched, isSubmitting }) => (
                                    <Form>
                                        <div className="careerfy-box-title">
                                            <span>{i18n.t('Login.LoginParagraph')}</span>
                                        </div>
                                        <div className="careerfy-user-options" >
                                            <ul>
                                                <li className={this.state.selectedLoginoption == 0 ? "active" : ""} onClick={() => this.setSelectedOption(0)}>
                                                    <a href="#">
                                                        <i className="careerfy-icon careerfy-user"></i>
                                                        <span>{i18n.t('Login.AccountType')}</span>
                                                    </a>
                                                </li>
                                                <li className={this.state.selectedLoginoption == 1 ? "active" : ""} onClick={() => this.setSelectedOption(1)}>
                                                    <a href="#">
                                                        <i className="careerfy-icon careerfy-building"></i>
                                                        <span>{i18n.t('Login.AccountType1')}</span>
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="careerfy-user-form">
                                            <div className="text text-danger">{this.state.isLoginFailed ? i18n.t('Login.InvalidLoginLabel') : ''} </div>
                                            <ul>
                                                <li>
                                                    <label>
                                                        {i18n.t('Login.LoginLabel')}</label>
                                                    <Field name="username" placeholder type="text" placeholder={i18n.t('Login.LoginLabel')} className={'form-control' + (errors.username && touched.username ? ' is-invalid' : '')} />
                                                    <i className="careerfy-icon careerfy-mail"></i>
                                                    <ErrorMessage name="username" component="div" className="invalid-feedback text text-danger" />
                                                </li>
                                                <li>
                                                    <label>{i18n.t('Login.LoginLabel1')}</label>

                                                    <Field name="password" type="password" placeholder={i18n.t('Login.LoginLabel1')} className={'form-control' + (errors.password && touched.password ? ' is-invalid' : '')} />
                                                    <i className="careerfy-icon careerfy-multimedia" ></i>
                                                    <ErrorMessage name="password" component="div" className="invalid-feedback text text-danger" />
                                                </li>
                                                <li><input type="submit" value={i18n.t('Login.LoginButton')} /></li>
                                            </ul>
                                            <div className="clearfix"></div>
                                            <div className="careerfy-user-form-info"><p> <a href={forgotPasswordUrl}>{i18n.t('Login.LoginParagraph1')} </a></p><div className="careerfy-checkbox"><input type="checkbox" id="r10" name="rr" /><label></label></div></div>
                                        </div>
                                        {
                                            this.state.selectedLoginoption == 0 &&
                                            <div>
                                                <div className="careerfy-box-title careerfy-box-title-sub"><span>{i18n.t('Login.LoginParagraph2')}</span></div>
                                                <div className="clearfix"></div>
                                                <ul className="careerfy-login-media">
                                                    <li>
                                                        <span class="social-btns">
                                                            <i className="fa fa-facebook"></i>
                                                            <FacebookLogin
                                                                appId="565990523778657"
                                                                autoLoad={false}
                                                                textButton="Facebook"
                                                                fields="name,email,picture"
                                                                callback={this.responseFacebook} />
                                                        </span>
                                                    </li>



                                                </ul>
                                            </div>
                                        }
                                    </Form>
                                )}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withTranslation('common') (Login);
