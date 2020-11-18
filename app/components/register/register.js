import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { registerService } from '../../services/register.service';
import FacebookLogin from 'react-facebook-login';
import { authenticationService } from '../../services/authentication.service';
import { forgotPasswordUrl } from '../../config'
import { toast } from 'react-toastify';
import {i18n, withTranslation} from '../../../i18n';

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedLoginoption: 0,
            isRegisterFailed: false,
            registrationErr: '',
            isProcessing: false,
            phoneRegExp: /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
        }
    }

    toggle() {
        this.props.close();
    }

    setSelectedOption(option) {
        this.setState({ selectedLoginoption: option });
    }

    login(data) {
        data.usertype = this.state.selectedLoginoption;
        this.setState({ isProcessing: true });
        authenticationService.login(data)
            .then(
                user => {
                    this.toggle();
                    this.setState({ isProcessing: false });
                    if (this.props.saveBulkJobs)
                        this.props.saveBulkJobs();
                    else {
                        if (authenticationService.isCandidateUser)
                            window.location.href = "/";
                        else
                            window.location.href = "/employer-home";
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
        let validationSchema = {
            username: Yup.string().required(i18n.t('Validations.EmailValidationLabel')).email(i18n.t('Validations.InvalidEmailValidationLabel')),
            password: Yup.string().required(i18n.t('Validations.PasswordValidationLabel')).matches(
                /^[ A-Za-z0-9_$!%?*()@./#&+-]{6,}/,
                "Doit contenir au moins 6 caractères"
            ),
            firstname: Yup.string().required(i18n.t('Validations.FirstNameValidationLabel')),
            lastname: Yup.string().required(i18n.t('Validations.LastNameValidationLabel')),
            confirmpassword: Yup.string().required(i18n.t('Validations.ConfirmPasswordValidationLabel')).test('passwords-match', i18n.t('Validations.ConfirmPasswordMatchValidationLabel'), function (value) {
                return this.parent.password === value;
            }),
            companyname: this.state.selectedLoginoption == 1 ? Yup.string().required(i18n.t('Validations.CompanyName')) : Yup.string(),
            // phonenumber: Yup.string().required('Phone number is required').matches(this.state.phoneRegExp, 'Phone number is not valid')
        }
        return (
            <div>
                {
                    this.state.isProcessing &&
                    <div className="loader-outer"><div className="loader"></div></div>
                }
                <div className="careerfy-modal fade-in careerfy-typo-wrap" id="JobSearchModalRegister">
                    <div className="modal-inner-area">&nbsp;</div>
                    <div className="modal-content-area">
                        <div className="modal-box-area">

                            <div className="careerfy-modal-title-box">
                                <h2>{i18n.t('Register.RegisterHeader')}</h2>
                                <span className="modal-close" onClick={() => this.toggle()}><i className="fa fa-times"></i></span>
                            </div>
                            <Formik
                                initialValues={{
                                    username: '',
                                    password: '',
                                    lastname: '',
                                    firstname: '',
                                    phonenumber: '',
                                    confirmpassword: '',
                                    companyname: '',
                                }}


                                validationSchema={Yup.object().shape(validationSchema)}
                                onSubmit={({ username, password, firstname, lastname, confirmpassword, companyname, phonenumber }, { setStatus, setSubmitting }) => {
                                    setStatus();
                                    const dataToSend = {
                                        email: username,
                                        password: password,
                                        isAcceptTerms: true,
                                        id: 0,
                                        usertype: this.state.selectedLoginoption,
                                        firstname: firstname,
                                        lastname: lastname,
                                        confirmpassword: confirmpassword,
                                        companyname: companyname,
                                        phonenumber: phonenumber
                                    };
                                    this.setState({ isProcessing: true });
                                    registerService.register(dataToSend)
                                        .then(
                                            result => {
                                                this.setState({ isProcessing: false });
                                                if (result && result.isSuccess==true) {
                                                    toast.success("Vérifiez vos courriels pour confirmer votre courriel");
                                                    this.toggle();
                                                    if (this.props.saveBulkJobs)
                                                        this.props.saveBulkJobs(result.data);
                                                    else {
                                                        if (this.state.selectedLoginoption == 0)
                                                            window.location.href = "/confirm-email";
                                                        else
                                                            window.location.href = "/confirm-company-email";
                                                    }
                                                }
                                                else
                                                {
                                                    this.setState({ isLoginFailed: true, registrationErr:result.error, isProcessing: false });
                                                }
                                            },
                                            error => {
                                                this.setState({ isLoginFailed: true, isProcessing: false });
                                                setSubmitting(false);
                                            }
                                        );
                                }}
                                render={({ errors, status, touched, isSubmitting }) => (
                                    <Form>
                                        <div className="careerfy-box-title">
                                            <span>{i18n.t('Login.LoginParagraph')}</span>
                                        </div>
                                        <div className="careerfy-user-options">
                                            <ul>
                                                <li className={this.state.selectedLoginoption == 0 ? "active" : ""} onClick={() => this.setSelectedOption(0)}>
                                                    <a href="#">
                                                        <i className="careerfy-icon careerfy-user"></i>
                                                        <span>{i18n.t('Login.AccountType')}</span>
                                                        <small>{i18n.t('Login.AccountTypeParagraph')}</small>
                                                    </a>
                                                </li>
                                                <li className={this.state.selectedLoginoption == 1 ? "active" : ""} onClick={() => this.setSelectedOption(1)}>
                                                    <a href="#">
                                                        <i className="careerfy-icon careerfy-building"></i>
                                                        <span>{i18n.t('Login.AccountType1')}</span>
                                                        <small>{i18n.t('Login.AccountTypeParagraph1')}</small>
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="careerfy-user-form careerfy-user-form-coltwo">
                                            <div className="text text-danger">{this.state.isLoginFailed ? this.state.registrationErr : ''} </div>
                                            <ul>
                                                {
                                                    this.state.selectedLoginoption == 1 &&
                                                    <li className="company-name-field">
                                                        <label>{i18n.t('Register.CompanyName')}</label>
                                                        <Field name="companyname" type="text" placeholder={i18n.t('Register.CompanyName')} className={'form-control' + (errors.companyname && touched.companyname ? ' is-invalid' : '')} />
                                                        <i className="careerfy-icon careerfy-building"></i>
                                                        <ErrorMessage name="companyname" component="div" className="invalid-feedback text text-danger" />
                                                    </li>
                                                }
                                                <li>
                                                    <label>{i18n.t('Register.RegisterLabel')}</label>
                                                    <Field name="firstname" type="text" placeholder={i18n.t('Register.RegisterLabel')} className={'form-control' + (errors.firstname && touched.firstname ? ' is-invalid' : '')} />
                                                    <i className="careerfy-icon careerfy-user"></i>
                                                    <ErrorMessage name="firstname" component="div" className="invalid-feedback text text-danger" />
                                                </li>
                                                <li>
                                                    <label>{i18n.t('Register.RegisterLabel1')}:</label>
                                                    <Field name="lastname" type="text" placeholder={i18n.t('Register.RegisterLabel1')} className={'form-control' + (errors.lastname && touched.lastname ? ' is-invalid' : '')} />
                                                    <i className="careerfy-icon careerfy-user"></i>
                                                    <ErrorMessage name="lastname" component="div" className="invalid-feedback text text-danger" />
                                                </li>
                                                <li>
                                                    <label>{i18n.t('Login.LoginLabel')}</label>
                                                    <Field name="username" placeholder={i18n.t('Login.LoginLabel')} type="text" className={'form-control' + (errors.username && touched.username ? ' is-invalid' : '')} />
                                                    <i className="careerfy-icon careerfy-mail"></i>
                                                    <ErrorMessage name="username" component="div" className="invalid-feedback text text-danger" />
                                                </li>
                                                <li>
                                                    <label>{i18n.t('Register.RegisterLabel3')}</label>

                                                    <Field name="phonenumber" type="text" placeholder={i18n.t('Register.RegisterLabel3')} className={'form-control' + (errors.phonenumber && touched.phonenumber ? ' is-invalid' : '')} />
                                                    <i className="careerfy-icon careerfy-technology" ></i>
                                                    <ErrorMessage name="phonenumber" component="div" className="invalid-feedback text text-danger" />
                                                </li>
                                                <li>
                                                    <label>{i18n.t('Login.LoginLabel1')}</label>

                                                    <Field name="password" type="password" placeholder={i18n.t('Login.LoginLabel1')} className={'form-control' + (errors.password && touched.password ? ' is-invalid' : '')} />
                                                    <i className="careerfy-icon careerfy-multimedia" ></i>
                                                    <ErrorMessage name="password" component="div" className="invalid-feedback text text-danger" />
                                                </li>
                                                <li>
                                                    <label>{i18n.t('Register.RegisterLabel5')}</label>

                                                    <Field name="confirmpassword" type="password" placeholder={i18n.t('Register.RegisterLabel5')} className={'form-control' + (errors.password && touched.password ? ' is-invalid' : '')} />
                                                    <i className="careerfy-icon careerfy-multimedia" ></i>
                                                    <ErrorMessage name="confirmpassword" component="div" className="invalid-feedback text text-danger" />
                                                </li>
                                                <li className="careerfy-user-form-coltwo-full">
                                                    <input type="submit" value={i18n.t('Login.LoginButton1')} />
                                                </li>
                                            </ul>
                                            <div className="clearfix"></div>
                                            <div className="careerfy-user-form-info"><p><a href={forgotPasswordUrl}>{i18n.t('Login.LoginParagraph1')}</a></p><div className="careerfy-checkbox"><input type="checkbox" id="r10" name="rr" /><label>
                                            </label></div></div>
                                        </div>
                                        {
                                            this.state.selectedLoginoption == 0 &&
                                            <div>
                                                <div className="careerfy-box-title careerfy-box-title-sub"><span>{i18n.t('Login.LoginParagraph2')}</span></div>
                                                <div className="clearfix"></div>
                                                <ul className="careerfy-login-media">
                                                    <li>
                                                        <span className="social-btns">
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

export default  withTranslation('common')(Register);
