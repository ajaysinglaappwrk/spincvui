import React from 'react';
import i18n from '../../../i18n';
import { authenticationService } from '../../services/authentication.service';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { withTranslation } from '../../../i18n';
import {  toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

class ChangePassword extends React.Component {
    constructor(props) {
        super(props);
       
    }

    toggle() {
        this.props.close();
    }


    render() {
        return (
            <div>
                <div className="careerfy-modal careerfy-typo-wrap fade-in">
                    <div className="modal-inner-area">&nbsp;</div>
                    <div className="modal-content-area">
                        <div className="modal-box-area">

                            <div className="careerfy-modal-title-box">
                                <h2>{i18n.t('ChangePassword.ChangePasswordLabel')}</h2>
                                <span className="modal-close" onClick={() => this.toggle()}><i className="fa fa-times"></i></span>
                            </div>
                            <Formik
                                initialValues={{
                                    password: '',
                                    confirmpassword: ''
                                }}
                                validationSchema={Yup.object().shape({
                                    password: Yup.string().required(i18n.t('Validations.PasswordValidationLabel')),
                                    confirmpassword: Yup.string().required(i18n.t('Validations.ConfirmPasswordValidationLabel')).test('passwords-match', i18n.t('Validations.ConfirmPasswordMatchValidationLabel'), function (value) {
                                        return this.parent.password === value;
                                    }),
                                })}
                                onSubmit={({ password, confirmpassword }, { setStatus, setSubmitting }) => {

                                    setStatus();
                                    const dataToSend = {
                                        userId: authenticationService.currentUserId,
                                        password: password,
                                        confirmPassword: confirmpassword
                                    }
                                    authenticationService.resetPassword(dataToSend)
                                        .then(
                                            user => {
                                                toast.success(i18n.t('Messages.ChangePasswordSuccess'));
                                                 this.toggle();
                                            },
                                            error => {
                                                setSubmitting(false);
                                                toast.error(i18n.t('Messages.ChangePasswordError'));
                                            }
                                        );
                                }}
                                render={({ errors, status, touched, isSubmitting }) => (
                                    <Form>

                                        <div className="careerfy-user-form">
                                            <ul>
                                                <li>
                                                    <label>
                                                        {i18n.t('ChangePassword.Username')}</label>
                                                    <label>{this.props.name} </label>
                                                    {/* <Field name="username" placeholder type="text" placeholder={i18n.t('Login.LoginLabel')} className={'form-control' + (errors.username && touched.username ? ' is-invalid' : '')} />
                                                    <i className="careerfy-icon careerfy-mail"></i>
                                                    <ErrorMessage name="username" component="div" className="invalid-feedback text text-danger" /> */}
                                                </li>
                                                <li>
                                                    <label>{i18n.t('Login.LoginLabel1')}</label>

                                                    <Field name="password" type="password" placeholder={i18n.t('Login.LoginLabel1')} className={'form-control' + (errors.password && touched.password ? ' is-invalid' : '')} />
                                                    <i className="careerfy-icon careerfy-multimedia" ></i>
                                                    <ErrorMessage name="password" component="div" className="invalid-feedback text text-danger" />
                                                </li>
                                                <li>
                                                    <label>{i18n.t('Register.RegisterLabel5')}</label>

                                                    <Field name="confirmpassword" type="password" placeholder={i18n.t('Register.RegisterLabel5')} className={'form-control' + (errors.confirmpassword && touched.confirmpassword ? ' is-invalid' : '')} />
                                                    <i className="careerfy-icon careerfy-multimedia" ></i>
                                                    <ErrorMessage name="confirmpassword" component="div" className="invalid-feedback text text-danger" />
                                                </li>
                                                <li><input type="submit" value={i18n.t('ChangePassword.SubmitBtnText')} /></li>
                                            </ul>
                                        </div>

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

export default withTranslation('translation')(ChangePassword);
