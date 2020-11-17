import React from 'react';
import { withTranslation, i18n } from '../../../i18n';
import { authenticationService } from '../../services/authentication.service';
import { Formik, Field, Form, ErrorMessage, yupToFormErrors } from 'formik';
import * as Yup from 'yup';
import { companyService } from '../../services/company.service';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

class JobApply extends React.Component {
    static getInitialProps = async ({ req }) => {
        const currentLanguage = req ? req.language : i18n.language;
        return { currentLanguage, namespacesRequired: ["common"] };
    };
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            currentFile: null,
            resume: {},
            candidate: { firstname: '', lastname: '', email: '', phonenumber: '', file: null, description: '' }
        };
    }

    componentDidMount() {
        if (!!authenticationService.currentUserEmail) {
            companyService.getResume(authenticationService.currentUserEmail).then((result) => {
                this.setState({ resume: result });
            });
        }
        let data = {
            firstname: authenticationService.currentUserName,
            lastname: authenticationService.currentUserLastName,
            email: authenticationService.currentUserEmail,
            phonenumber: authenticationService.currentUserPhoneNumber,
            file: null,
            description: ''
        }
        this.setState({ candidate: data });
    }

    render() {
        const fillCurrentInfo = this.props.currentProfile && this.props.currentProfile.companyId ? this.props.currentProfile.companyId != authenticationService.currentCompanyId : false;
        // const isGexelProfile = window.location.hostname.substr(0, window.location.hostname.indexOf('.')).toLowerCase() == "gexel";
        return (
            <div className="widget widget_contact_form" style={{ marginTop: '20px' }}>
                <Formik
                    enableReinitialize={true}
                    initialValues={this.state.candidate}
                    // initialValues={{ file: null, firstname: !fillCurrentInfo ? '' : authenticationService.currentUserName, lastname: !fillCurrentInfo ? '' : authenticationService.currentUserLastName, email: !fillCurrentInfo ? '' : authenticationService.currentUserEmail, phonenumber: !fillCurrentInfo ? '' : authenticationService.currentUserPhoneNumber, description: '' }}
                    onSubmit={(values, actions) => {
                        if (values.file) {
                            var allowedExtensions = ["pdf", "doc", "docx"];
                            const fileExtensions = values.file.name.substr(values.file.name.lastIndexOf(".") + 1);
                            if (allowedExtensions.indexOf(fileExtensions) == -1) {
                                toast.error(i18n.t('Messages.InvalidFileError'));
                                return false;
                            }
                        }
                        this.setState({ loading: true });
                        values.description = document.getElementById("descrioption").value;
                        companyService.applyForJob(values, this.props.jobId, this.props.companyId)
                            .then(
                                result => {
                                    this.setState({ loading: false });
                                    actions.setSubmitting(false);
                                    if (result) {
                                        toast.success(i18n.t('Messages.ApplySucessMessage'));
                                        actions.resetForm();
                                        actions.setFieldValue("file", null);
                                        document.getElementById("file").value = "";
                                        document.getElementById("descrioption").value = "";
                                    }
                                    else
                                        toast.error(i18n.t('Messages.AlreadyAppliedMessage'));
                                },
                                error => {
                                }
                            );
                    }}
                    validationSchema={Yup.object().shape({
                        // file: Yup.mixed().required(),
                        firstname: Yup.string().required(i18n.t('Validations.FirstNameValidationLabel')),
                        lastname: Yup.string().required(i18n.t('Validations.LastNameValidationLabel')),
                        email: Yup.string().required(i18n.t('Validations.EmailValidationLabel')).email(i18n.t('Validations.InvalidEmailValidationLabel')),
                        // phonenumber: Yup.string().required(i18n.t('Validations.PhoneNumberValidationLabel')),
                    })}
                    render={({ values, handleSubmit, setFieldValue, errors, status, touched, actions }) => {
                       
                        return (
                            <form onSubmit={handleSubmit} className="apply_form">
                                <ul>
                                    <div className="careerfy-widget-title">
                                        {/* <h2 className="sub_heading">{isGexelProfile ? i18n.t('EmployeeDetail.Apply1') : i18n.t('EmployeeDetail.Apply')}</h2> */}
                                        <h2 className="sub_heading">{(!!this.props.jobId && this.props.jobId > 0) ? i18n.t('EmployeeDetail.Apply') : i18n.t('EmployeeDetail.Apply1')}</h2>
                                        {/* <p className="desc_text">{isGexelProfile ? i18n.t('EmployeeDetail.CompanyAdvertise1') : i18n.t('EmployeeDetail.CompanyAdvertise')}</p></div> */}
                                        <p className="desc_text">{(!!this.props.jobId && this.props.jobId > 0) ? i18n.t('EmployeeDetail.CompanyAdvertise') : i18n.t('EmployeeDetail.CompanyAdvertise1')}</p></div>
                                    <li style={{ width: '50%', paddingRight: '1%', }}>
                                        <label>{i18n.t('EmployeeDetail.UserName')}</label>
                                        <Field name="firstname" type="text" className={'form-control' + (errors.firstname && touched.firstname ? ' is-invalid' : '')} />
                                        <i className="careerfy-icon careerfy-user"></i>
                                        <ErrorMessage name="firstname" component="div" className="invalid-feedback text text-danger" />
                                    </li>
                                    <li style={{ width: '50%', paddingLeft: '1%', }}>
                                        <label>{i18n.t('EmployeeDetail.Family')}</label>
                                        <Field name="lastname" type="text" className={'form-control' + (errors.lastname && touched.lastname ? ' is-invalid' : '')} />
                                        <i className="careerfy-icon careerfy-user"></i>
                                        <ErrorMessage name="lastname" component="div" className="invalid-feedback text text-danger" />
                                    </li>
                                    <li>
                                        <label>{i18n.t('EmployeeDetail.Email')}</label>
                                        <Field name="email" type="text" className={'form-control' + (errors.email && touched.email ? ' is-invalid' : '')} />
                                        <i className="careerfy-icon careerfy-mail"></i>
                                        <ErrorMessage name="email" component="div" className="invalid-feedback text text-danger" />
                                    </li>
                                    <li>
                                        <label>{i18n.t('EmployeeDetail.PhoneNumber')}</label>
                                        <Field name="phonenumber" type="text" className={'form-control' + (errors.phonenumber && touched.phonenumber ? ' is-invalid' : '')} />
                                        <i className="careerfy-icon careerfy-technology"></i>
                                        <ErrorMessage name="phonenumber" component="div" className="invalid-feedback text text-danger" />
                                    </li>
                                    <li>
                                        {
                                            (!fillCurrentInfo || (!this.state.resume || !this.state.resume.candidateResumeId)) &&
                                            <label>{i18n.t('EmployeeDetail.Attachment')}</label>
                                        }

                                        {
                                            (this.state.resume.candidateResumeId > 0 && fillCurrentInfo) &&
                                            <label> Nous allons envoyez votre CV: <span className="candidate-cv">{this.state.resume.originalFileName}</span> ou sinon, choissisez un autre CV</label>
                                        }
                                        <div className="file-upload">
                                            <div className="file-select">
                                                <div className="file-select-button" id="fileName">{i18n.t('FileUpload.BrowseBtnText')}</div>
                                                <div className="file-select-name" id="noFile"> {this.state.currentFile ? this.state.currentFile.name : i18n.t('FileUpload.ChooseFileLabel')}</div>
                                                <input id="file" name="file" type="file" style={{ height: '100%' }} onChange={(event) => {
                                                    this.setState({ currentFile: event.currentTarget.files[0] });
                                                    setFieldValue("file", event.currentTarget.files[0]);
                                                }} className="form-control" />
                                            </div>
                                        </div>
                                        {/* Cliquez ici pour envoyer le CV déjà dans votre compte */}
                                    </li>
                                    <li>
                                        <label>{i18n.t('EmployeeDetail.Message')}</label>
                                        <textarea id="descrioption" name="description" rows="3" className=" description form-control apl" />
                                        {/* <Field name="description" type="text" className='form-control apply-description' /> */}
                                    </li>

                                    <li>
                                        <button type="submit" style={{ width: '100%' }} className="careerfy-option-btn careerfy-blue" disabled={this.state.loading}>{i18n.t('EmployeeDetail.Submit')}</button>
                                        <p className="terms-text">{i18n.t('General.AcceptTermConditionsText1')}  <a href="/conditions">{i18n.t('General.TermAndCondtionBtnText')}</a> {i18n.t('General.AcceptTermConditionsText2')} <a href="/confidentialite">{i18n.t('General.PrivacyPolicyBtnText')}</a> </p>
                                        <ToastContainer autoClose={3000} />
                                    </li>
                                </ul>
                            </form>
                        );
                    }} />
            </div>
        )
    }

}

export default withTranslation('translation')(JobApply);