import React from 'react';
import { i18n, withTranslation } from '../../../i18n';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";
import Dropzone from 'react-dropzone';
import DropboxChooser from 'react-dropbox-chooser';
import { companyService } from '../../services/company.service';
import FacebookLogin from 'react-facebook-login';
import { LINKEDIN_URL } from "../../helpers/linked-in-auth";

class DropCreate extends React.Component {
    static getInitialProps = async ({ req }) => {
        const currentLanguage = req ? req.language : i18n.language;
        return { currentLanguage, namespacesRequired: ["common"] };
    };
    constructor(props) {
        super(props);
        this.state = {
            currentFile: null,
            isDropped: false,
            accessToken: null,
            filepath: null,
            fileId: "",
            authToken: "",
            isCreate: false,
            resume: {},
            candidate: { firstName: '', lastName: '', email: '', phonenumber: '', linkedInLink: '', facebookLink: '', instagramLink: '', twitterLink: '' },
            resumeUrl: ''
        }

        this.onDrop = (file) => {
            this.uploadFile(file);
            document.querySelector(".dropzone").style.border = "none";
        };
    }

    componentDidMount() {
        localStorage.setItem("userPageUrl", window.location.pathname)
        if (!!this.props.jobTitle) {
            localStorage.setItem("jobDetail", JSON.stringify({ jobTitle: this.props.jobTitle, jobNumber: this.props.jobNumber }));

        }
    }

    dropResume() {
        this.setState({ isDropped: !this.state.isDropped });
    }

    closeDropSection() {
        this.setState({
            isDropped: !this.state.isDropped,
            currentFile: '',
            resumeUrl: ''
        });
    }

    createResume() {
        this.setState({ isCreate: !this.state.isCreate });
    }

    closeCreateResumeSection() {
        this.setState({ isCreate: !this.state.isCreate });
    }

    uploadFile(file) {
        if (file.length == 1) {
            var file = file[0];
            var pattern = /\.(pdf|doc|docx)$/i;
            if (!file.name.match(pattern)) {
                toast.error(i18n.t('Messages.InvalidFileError'));
                return false;
            } else {
                this.setState({
                    currentFile: file
                });
                this.dropResume();
            }
        } else {
            toast.error(i18n.t('Messages.InvalidFileError'));
            return false;
        }
    }
    responseFacebook = (response) => {
        if (response != null && response != undefined) {
            var splittedName = response.name.split(" ");
            const formData = new FormData();
            formData.append("firstName", splittedName[0]);
            formData.append("lastName", splittedName[1]);
            formData.append("email", response.email);
            formData.append("phonenumber", "");

            if (!!this.props.companyName) {
                formData.append("companyName", this.props.companyName);
            }
            if (!!this.props.jobTitle) {
                formData.append("jobTitle", this.props.jobTitle);
            }
            if (!!this.props.jobNumber) {
                formData.append("jobNumber", this.props.jobNumber);
            }
            // formData.append("code", response.code);
            companyService.sendCVToCompany(formData).then((res) => {
                this.setState({
                    isDropped: false,
                    isCreate: false,
                    currentFile: '',
                });
            });
        }
    }

    responseInstagram = (response) => {
        if (response != null && response != undefined && response.length > 0) {

        }
    }

    handleSuccess(files) {
        if (files != null && files.length > 0) {
            var file = new File(files, files[0].name);
            var pattern = /\.(pdf|doc|docx)$/i;
            if (!file.name.match(pattern)) {
                toast.error(i18n.t('Messages.InvalidFileError'));
                return false;
            } else {
                this.setState({
                    currentFile: file,
                    resumeUrl: files[0].link
                });
                this.dropResume();
            }
        }
    }

    onDragEnter() {
        document.querySelector(".dropzone").style.border = "2px dashed #666";
    }
    onDragLeave() {
      document.querySelector(".dropzone").style.border = "none";
    }
    render() {
        let validationSchema = {
            firstName: Yup.string().required(i18n.t('Validations.FirstNameValidationLabel')),
            lastName: Yup.string().required(i18n.t('Validations.LastNameValidationLabel')),
            email: Yup.string().required(i18n.t('Validations.EmailValidationLabel')).email(i18n.t('Validations.InvalidEmailValidationLabel')),
            phonenumber: Yup.string(),
            linkedInLink: Yup.string(),
            facebookLink: Yup.string(),
            instagramLink: Yup.string(),
            twitterLink: Yup.string(),
        }
        return (
            <div>

                <div className="row">
                    <div className="drop-col">
                        <div className="careerfy-page-title">
                            <div className="post-banner-overlay-text">
                                <div className="post-text-left">
                                    <Dropzone onDrop={this.onDrop}
                                        maxFiles={1}
                                        multiple={false}
                                        canCancel={false}
                                        styles={{
                                            dropzone: { width: 400, height: 200 },
                                            dropzoneActive: { borderColor: 'green' },
                                        }} onDragEnter={() => this.onDragEnter()} onDragLeave={()=> this.onDragLeave()}>
                                        {({ getRootProps, getInputProps }) => (
                                            <section className="container">
                                                <div {...getRootProps({ className: 'dropzone' })}>
                                                    <input {...getInputProps()} />
                                                    <div className="drop-cv">
                                                        <span><img src="https://my-cdn.azureedge.net/cdn/images/cloud-storage-uploading-option.png"></img></span>

                                                    </div>
                                                    <h4>{i18n.t('DragOrDropComponent.DropCvHeaderTitle')}</h4></div>
                                            </section>
                                        )}
                                    </Dropzone>

                                    <DropboxChooser appKey="xxkzfq6nfv1w2ku"
                                        success={(files) => this.handleSuccess(files)}
                                        cancel={() => console.log('closed')}
                                        multiselect={false}>
                                        <button className="choose-dropbox">{i18n.t('DragOrDropComponent.DropboxChooseBtnText')}</button>
                                    </DropboxChooser>

                                    {/* <GooglePicker clientId={CLIENT_ID}
                                                developerKey={DEVELOPER_KEY}
                                                scope={SCOPE}
                                                onChange={data => {
                                                    data.docs ? this.setState({ fileId: data.docs[0].id }) : console.log('on change:', data);
                                                }}
                                                onAuthenticate={token => {
                                                    console.log('oauth token:', token);
                                                    this.setState({ authToken: token });
                                                }}
                                                onAuthFailed={data => console.log('on auth failed:', data)}
                                                multiselect={true}
                                                navHidden={true}
                                                authImmediate={false}
                                                mimeTypes={['application/vnd.google-apps.spreadsheet']}
                                                viewId={'SPREADSHEETS'}>
                                                <button>Click</button>
                                            </GooglePicker> */}
                                </div>
                                <div className="post-text-right">
                                    <div className="create-cv">
                                        <h3>{i18n.t('DragOrDropComponent.NoCVLabelText')}</h3>
                                        <Button variant="primary" onClick={() => this.createResume()}>
                                            {i18n.t('DragOrDropComponent.CreateCVBtnText')}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {
                    (this.state.isDropped || this.state.isCreate) && <div className="careerfy-modal fade-in careerfy-typo-wrap create-cv-model" id="JobSearchModalRegister">
                        <div className="modal-inner-area">&nbsp;</div>
                        <div className="modal-content-area">
                            <div className="modal-box-area">
                                <div className="careerfy-modal-title-box">
                                    {/* <h2>{i18n.t('Register.RegisterHeader')}</h2> */}
                                    {this.state.isDropped &&
                                        <div>
                                            <h2>{i18n.t('DragOrDropComponent.EnterDetailLabelText')}</h2>
                                            <span className="modal-close" onClick={() => this.closeDropSection()}><i className="fa fa-times"></i></span>
                                        </div>
                                    }
                                    {this.state.isCreate &&
                                        <div>
                                            <h2>{i18n.t('DragOrDropComponent.EnterDetailLabelText')}</h2>
                                            <span className="modal-close" onClick={() => this.closeCreateResumeSection()}><i className="fa fa-times"></i></span>
                                        </div>}
                                </div>
                                <Formik
                                    initialValues={this.state.candidate}
                                    validationSchema={Yup.object().shape(validationSchema)}
                                    onSubmit={({ firstName, lastName, email, phonenumber, linkedInLink, facebookLink, instagramLink, twitterLink }, { setStatus, resetForm }) => {
                                        setStatus();
                                        const formData = new FormData();
                                        formData.append("firstName", firstName);
                                        formData.append("lastName", lastName);
                                        formData.append("email", email);
                                        formData.append("phonenumber", phonenumber);
                                        formData.append("file", this.state.currentFile);
                                        formData.append("fileUrl", this.state.resumeUrl);

                                        if (!!this.props.companyName) {
                                            formData.append("companyName", this.props.companyName);
                                        }
                                        if (!!this.props.jobTitle) {
                                            formData.append("jobTitle", this.props.jobTitle);
                                        }
                                        if (!!this.props.jobNumber) {
                                            formData.append("jobNumber", this.props.jobNumber);
                                        }

                                        companyService.sendCVToCompany(formData).then((res) => {
                                            resetForm();
                                            if (this.state.isDropped) {
                                                this.closeDropSection();
                                            }
                                            if (this.state.isCreate) {
                                                this.closeCreateResumeSection();
                                            }
                                        })

                                    }}>
                                    {({ errors, status, touched, isSubmitting }) => (
                                        <Form>
                                            <div className="careerfy-user-form careerfy-user-form-coltwo">
                                                {
                                                    this.state.isDropped && <ul>
                                                        <li className="company-name-field">
                                                            {/* <strong>
                                                                <label>{this.state.currentFile ? 'Selected File : ' + this.state.currentFile.name : null} </label>
                                                            </strong> */}
                                                            <strong>
                                                                <label>{i18n.t('DragOrDropComponent.SelectedFileLabelText')} :
                                                                    <sapn className="file_name">{this.state.currentFile ? this.state.currentFile.name : null}</sapn>
                                                                </label>
                                                            </strong>
                                                            <div className="file-select-name"> </div>
                                                        </li>
                                                    </ul>
                                                }
                                                <ul>
                                                    <li>
                                                        <label>{i18n.t('Register.RegisterLabel')}</label>
                                                        <Field value={this.state.firstName} name="firstName" type="text" className={'form-control' + (errors.firstName && touched.firstName ? ' is-invalid' : '')} />
                                                        <ErrorMessage name="firstName" component="div" className="invalid-feedback text text-danger" />
                                                    </li>
                                                    <li>
                                                        <label>{i18n.t('Register.RegisterLabel1')}</label>
                                                        <Field name="lastName" type="text" className={'form-control' + (errors.lastName && touched.lastName ? ' is-invalid' : '')} />
                                                        <ErrorMessage name="lastName" component="div" className="invalid-feedback text text-danger" />
                                                    </li>
                                                    <li>
                                                        <label>{i18n.t('Login.LoginLabel')}</label>
                                                        <Field name="email" type="text" className={'form-control' + (errors.email && touched.email ? ' is-invalid' : '')} />
                                                        <ErrorMessage name="email" component="div" className="invalid-feedback text text-danger" />
                                                    </li>
                                                    <li>
                                                        <label>{i18n.t('Register.RegisterLabel3')}</label>
                                                        <Field name="phonenumber" type="text" className={'form-control' + (errors.phonenumber && touched.phonenumber ? ' is-invalid' : '')} />
                                                        <ErrorMessage name="phonenumber" component="div" className="invalid-feedback text text-danger" />
                                                    </li>
                                                    <li>
                                                        <span className="social-btns">
                                                            <i className="fa fa-facebook"></i>
                                                            <FacebookLogin
                                                                appId="862039167562137"
                                                                autoLoad={false}
                                                                fields="name,email,picture"
                                                                callback={this.responseFacebook} />
                                                        </span>
                                                    </li>
                                                    <li>
                                                        <a href={LINKEDIN_URL} >
                                                            <div type="submit" style={{ height: "40px", width: "215px" }}>
                                                                <img
                                                                    style={{ height: "100%", width: "100%" }}
                                                                    src={
                                                                        "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSk3pI2NNjzOZHDLDT5sdKXO1Aqc6sLdo-zZA&usqp=CAU"
                                                                    }
                                                                    alt={"LinkedIn authentification"}
                                                                />
                                                            </div>
                                                        </a>
                                                    </li>
                                                    {/* <li>
                                                        <span>
                                                            <i className="fa fa-instagram"></i>
                                                            <InstagramLogin
                                                                clientId="841726459950495"
                                                                scope="user_profile,user_media"
                                                                buttonText="Login"
                                                                redirectUri="https://spincv-demo.azurewebsites.net/"
                                                                fields="name,email,picture"
                                                                onSuccess={this.responseInstagram}
                                                                onFailure={this.responseInstagram} />,
                                                        </span>
                                                    </li> */}
                                                    <li className="careerfy-user-form-coltwo-full">
                                                        <input type="submit" value={i18n.t('EmployeeDetail.Submit')} />
                                                    </li>
                                                </ul>
                                            </div>

                                        </Form>
                                    )}
                                </Formik>
                            </div>
                        </div>
                    </div>
                }
            </div>
        );
    }
}

export default withTranslation('common')(DropCreate);