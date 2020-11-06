import React from 'react';
import i18n from '../../i18next';
import { authenticationService } from '../../services/authentication.service';
import { companyService } from '../employer-detail/services/company.service';
import { registerService } from '../register/services/register.service';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { withTranslation } from '../../../i18n';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

class ResetPassword extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loggedInUserName: '',
            loggedInCompanyName: '',
            isCandidateUser: false,
            isSocialLogin: false,
            selectedTabValue: 2,
            currentFile: null,
            isProcessing: false,
            userInfo: {},
            resume: {}
        }

    }

    setSelectedTab(value) {
        this.setState({ selectedTabValue: value });
    }

    componentDidMount() {
        authenticationService.currentUser.subscribe(user => {
            this.setState({
                loggedInUserName: authenticationService.currentUserName,
                loggedInCompanyName: authenticationService.currentCompanyName,
                isCandidateUser: authenticationService.isCandidateUser,
                isSocialLogin: authenticationService.isSocialLogin,
            })
        });

        registerService.getUserInfoByEmail(authenticationService.currentUserEmail).then((user) => {
            this.setState({ userInfo: user });
        });
        this.getUserResume();
    }

    deleteResume(id) {
        companyService.deleteResume(id).then(() => {
            toast.success(i18n.t('Messages.ResumeDeleteSuccess'));
            this.getUserResume();
        })
    }

    getUserResume() {
        companyService.getResume(authenticationService.currentUserEmail).then((result) => {
            this.setState({ resume: result })
        });
    }
    logoutUser() {
        authenticationService.logout();
        window.location.href = '/';
    }

    confirmResumeDelete(id) {
        confirmAlert({
            title: 'Confirmer pour supprimer',
            message: 'Êtes-vous sûr de le faire.',
            buttons: [
                {
                    label: 'Oui',
                    onClick: () => this.deleteResume(id)
                },
                {
                    label: 'Non',
                }
            ]
        });
    }

    confirmResumeReplace(values, actions) {
        confirmAlert({
            message: 'Remplacer le courant ' + this.state.resume.originalFileName,
            buttons: [
                {
                    label: 'Oui',
                    onClick: () => this.uploadResume(values, actions)
                },
                {
                    label: 'Non',
                }
            ]
        });
    }

    uploadResume(values, actions) {
        this.setState({ isProcessing: true });
        companyService.uploadResume(values.file).then(() => {
            toast.success(i18n.t('Messages.ResumeUploadSuccess'));
            actions.resetForm();
            actions.setFieldValue("file", null);
            document.getElementById("file").value = "";
            this.setState({ currentFile: null, isProcessing: false });
            this.getUserResume();
        });


    }
    render() {
        const { i18n } = this.props;
        let validationSchema = {
            firstname: Yup.string().required(i18n.t('Validations.FirstNameValidationLabel')),
            lastname: Yup.string().required(i18n.t('Validations.LastNameValidationLabel')),

        }
        return (
            <div>
                {
                    this.state.isProcessing &&
                    <div className="loader-outer"><div className="loader"></div></div>
                }
                <div className="careerfy-main-content">

                    <div className="careerfy-main-section careerfy-dashboard-full">
                        <div className="container">
                            <div className="row">

                                <aside className="careerfy-column-3">
                                    <div className="careerfy-typo-wrap">
                                        <div className="careerfy-employer-dashboard-nav">
                                            <figure>
                                                <a href="#" className="employer-dashboard-thumb"><img src="extra-images/candidate-dashboard-navthumb.jpg" alt="" /></a>
                                                <figcaption>
                                                    <h2>{this.state.isCandidateUser ? this.state.loggedInUserName : this.state.loggedInCompanyName}</h2>
                                                </figcaption>
                                            </figure>
                                            <ul>
                                                <li onClick={() => this.setSelectedTab(2)} className={this.state.selectedTabValue == 2 ? "active" : ""}><a><i className="careerfy-icon careerfy-arrows-2"></i> {i18n.t('General.UploadResumeHeader')}</a></li>
                                                <li onClick={() => this.setSelectedTab(1)} className={this.state.selectedTabValue == 1 ? "active" : ""}><a><i className="careerfy-icon careerfy-user"></i>Profil</a></li>

                                                {
                                                    !this.state.isSocialLogin &&
                                                    <li onClick={() => this.setSelectedTab(0)} className={this.state.selectedTabValue == 0 ? "active" : ""}><a><i className="careerfy-icon careerfy-multimedia"></i>Changer le mot de passe</a></li>

                                                }
                                                <li ><a  href="/jobs"><i className="fa fa-tasks"></i>{i18n.t('General.FindJobLabel')}</a></li>

                                                <li onClick={() => this.logoutUser()}><a  ><i className="careerfy-icon careerfy-logout"></i> Déconnexion</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                </aside>
                                {
                                    !this.state.isSocialLogin && this.state.selectedTabValue == 0 &&
                                    <div className="careerfy-column-9">
                                        <div className="careerfy-typo-wrap">
                                            <div className="careerfy-employer-box-section">
                                                <div className="careerfy-profile-title">
                                                    <h2>{i18n.t('ChangePassword.ChangePasswordLabel')}</h2>
                                                </div>

                                                <Formik
                                                    initialValues={{
                                                        password: '',
                                                        confirmpassword: ''
                                                    }}
                                                    validationSchema={Yup.object().shape({
                                                        password: Yup.string().required(i18n.t('Validations.NewPasswordLabel')),
                                                        confirmpassword: Yup.string().required(i18n.t('Validations.NewConfirmPasswordLabel')).test('passwords-match', i18n.t('Validations.ConfirmPasswordMatchValidationLabel'), function (value) {
                                                            return this.parent.password === value;
                                                        }),
                                                    })}
                                                    onSubmit={({ password, confirmpassword }, { setStatus, setSubmitting, resetForm }) => {

                                                        setStatus();
                                                        const dataToSend = {
                                                            userId: authenticationService.currentUserId,
                                                            password: password,
                                                            confirmPassword: confirmpassword
                                                        }
                                                        this.setState({ isProcessing: true });
                                                        authenticationService.resetPassword(dataToSend)
                                                            .then(
                                                                user => {
                                                                    resetForm();
                                                                    this.setState({ isProcessing: false });
                                                                    toast.success(i18n.t('Messages.ChangePasswordSuccess'));
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
                                                                <ul className="careerfy-row careerfy-employer-profile-form">
                                                                    <li>
                                                                        <label>{i18n.t('ChangePassword.NewPasswordLabel')}</label>

                                                                        <Field name="password" type="password" placeholder={i18n.t('ChangePassword.NewPasswordLabel')} className={'form-control' + (errors.password && touched.password ? ' is-invalid' : '')} />
                                                                        <i className="careerfy-icon careerfy-multimedia" ></i>
                                                                        <ErrorMessage name="password" component="div" className="invalid-feedback text text-danger" />
                                                                    </li>
                                                                    <li>
                                                                        <label>{i18n.t('ChangePassword.NewConfirmPasswordLabel')}</label>

                                                                        <Field name="confirmpassword" type="password" placeholder={i18n.t('ChangePassword.NewConfirmPasswordLabel')} className={'form-control' + (errors.confirmpassword && touched.confirmpassword ? ' is-invalid' : '')} />
                                                                        <i className="careerfy-icon careerfy-multimedia" ></i>
                                                                        <ErrorMessage name="confirmpassword" component="div" className="invalid-feedback text text-danger" />
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                            {
                                                                !this.state.isSocialLogin &&
                                                                <input type="submit" className="careerfy-employer-profile-submit" value={i18n.t('ChangePassword.SubmitBtnText')} />
                                                            }
                                                        </Form>
                                                    )}
                                                />
                                            </div>

                                        </div>
                                    </div>
                                }
                                {
                                    this.state.selectedTabValue == 1 &&
                                    <div className="careerfy-column-9">
                                        <div className="careerfy-typo-wrap">
                                            <div className="careerfy-employer-box-section">
                                                <div className="careerfy-profile-title">
                                                    <h2>Profil</h2>
                                                </div>

                                                <Formik
                                                    initialValues={{
                                                        lastname: this.state.userInfo.lastName,
                                                        firstname: this.state.userInfo.firstName,
                                                        phonenumber: this.state.userInfo.phoneNumber,
                                                        city: this.state.userInfo.city,
                                                    }}


                                                    validationSchema={Yup.object().shape(validationSchema)}
                                                    onSubmit={({ username, city, firstname, lastname, phonenumber }, { setStatus, setSubmitting }) => {
                                                        setStatus();
                                                        const dataToSend = {
                                                            email: authenticationService.currentUserEmail,
                                                            firstname: firstname,
                                                            lastname: lastname,
                                                            phonenumber: phonenumber,
                                                            city: city
                                                        };
                                                        this.setState({ isProcessing: true });
                                                        registerService.updateUserInfo(dataToSend).then((res) => {
                                                            this.setState({ userInfo: res, isProcessing: false });
                                                            toast.success(i18n.t('Messages.ProfileUpdateSuccess'));

                                                        });

                                                    }}
                                                    render={({ errors, status, touched, isSubmitting }) => (
                                                        <Form>


                                                            <div className="careerfy-user-form careerfy-user-form-coltwo">
                                                                <div className="text text-danger">{this.state.isLoginFailed ? 'Courriel déjà existant!' : ''} </div>
                                                                <ul>
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
                                                                        <label>{i18n.t('Register.RegisterLabel3')}</label>

                                                                        <Field name="phonenumber" type="text" placeholder={i18n.t('Register.RegisterLabel3')} className={'form-control' + (errors.phonenumber && touched.phonenumber ? ' is-invalid' : '')} />
                                                                        <i className="careerfy-icon careerfy-technology" ></i>
                                                                        <ErrorMessage name="phonenumber" component="div" className="invalid-feedback text text-danger" />
                                                                    </li>
                                                                    <li>
                                                                        <label>{i18n.t('General.CityLabel')}</label>

                                                                        <Field name="city" type="text" placeholder={i18n.t('General.CityLabel')} className={'form-control' + (errors.city && touched.city ? ' is-invalid' : '')} />
                                                                        <i className="careerfy-icon " ></i>
                                                                        <ErrorMessage name="city" component="div" className="invalid-feedback text text-danger" />
                                                                    </li>

                                                                </ul>

                                                            </div>
                                                            <input type="submit" className="careerfy-employer-profile-submit" value={i18n.t('General.ProfileUpdateBtnText')} />

                                                        </Form>
                                                    )}
                                                />
                                            </div>

                                        </div>
                                    </div>
                                }
                                {
                                    this.state.selectedTabValue == 2 &&
                                    <div className="careerfy-column-9">
                                        <div className="careerfy-column-9">
                                            <div className="careerfy-typo-wrap">
                                                <div className="careerfy-employer-box-section">
                                                    <div className="careerfy-profile-title">
                                                        <h2>{i18n.t('General.UploadResumeHeader')}</h2>
                                                    </div>

                                                    <Formik
                                                        initialValues={{
                                                            file: '',
                                                        }}

                                                        onSubmit={(values, actions) => {
                                                            if (!values.file) {
                                                                toast.error(i18n.t('Messages.SelectFileMessage'));
                                                                return false;
                                                            }

                                                            if (this.state.resume && this.state.resume.candidateResumeId > 0) {
                                                                this.confirmResumeReplace(values, actions);
                                                                return false;
                                                            }
                                                            var allowedExtensions = ["pdf", "doc", "docx"];
                                                            const fileExtensions = values.file.name.substr(values.file.name.lastIndexOf(".") + 1);
                                                            if (allowedExtensions.indexOf(fileExtensions) == -1) {
                                                                toast.error(i18n.t('Messages.InvalidFileError'));
                                                                return false;
                                                            }
                                                            this.uploadResume(values, actions);

                                                        }}
                                                        render={({ errors, status, touched, isSubmitting, setFieldValue }) => (
                                                            <Form>

                                                                <div className="careerfy-user-form upload-cv">
                                                                    <label>{i18n.t('EmployeeDetail.Attachment')}</label>

                                                                    <div class="file-upload">
                                                                        <div class="file-select">
                                                                            <div class="file-select-button" id="fileName">{i18n.t('FileUpload.BrowseBtnText')}</div>
                                                                            <div class="file-select-name" id="noFile"> {this.state.currentFile ? this.state.currentFile.name : i18n.t('FileUpload.ChooseFileLabel')}</div>
                                                                            <input id="file" name="file" type="file" style={{ height: '100%' }} onChange={(event) => {
                                                                                this.setState({ currentFile: event.currentTarget.files[0] });
                                                                                setFieldValue("file", event.currentTarget.files[0]);
                                                                            }} className="form-control" />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                
                                                                {
                                                                    <input type="submit" className="careerfy-employer-profile-submit" value={i18n.t('General.UploadResumeBtnText')} />
                                                                }
                                                                {
                                                                this.state.resume && this.state.resume.candidateResumeId > 0 &&
                                                                <p className="upload-file-name"> <a href={this.state.resume.fileName} target="_blank">{this.state.resume.originalFileName}</a>
                                                                    <a className="remove-btn" onClick={() => this.confirmResumeDelete(this.state.resume.candidateResumeId)}><i className="fa fa-remove"></i></a>
                                                                </p>
                                                            }
                                                            </Form>
                                                            
                                                        )}
                                                    />

                                                    


                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }
                                <ToastContainer autoClose={3000} />
                            </div>
                        </div>
                    </div>

                </div>

            </div>

        );
    }
}

export default withTranslation('translation')(ResetPassword);
