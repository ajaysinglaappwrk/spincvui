import React from 'react';
import { i18n, withTranslation } from '../../../i18n';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";
import Dropzone from 'react-dropzone';
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
            fileId: "",
            authToken: "",
            isCreate: false,
            resume: {},
            candidate: { firstName: '', lastName: '', email: '', phonenumber: '', linkedInLink: '', facebookLink: '', instagramLink: '', twitterLink: '' },
            imagePath: '../../../static/assets/images/favicon.ico',
        }

        this.onDrop = (file) => {
            this.uploadFile(file);
        };
    }
    
    componentDidMount() {
        if(!!window.location.search)
        {
            var code = window.location.search.substr(window.location.search.indexOf('=')+1, window.location.search.indexOf('&state')-6);
            const formData = new FormData();
            formData.append("code", code);
            companyService.sendCVToCompany(formData).then((res) => {

                window.history.pushState({}, "", "/");
            });
        }
     
    }

    dropResume() {
        this.setState({ isDropped: !this.state.isDropped });
    }

    closeDropSection() {
        this.setState({
            isDropped: !this.state.isDropped,
            currentFile: '',
        });
    }

    createResume() {
        this.setState({ isCreate: !this.state.isCreate });
    }

    closeCreateResumeSection() {
        this.setState({ isCreate: !this.state.isCreate });
    }

    getUploadParams = () => {
        return { url: 'https://httpbin.org/post' }
    }

    handleChangeStatus = ({ meta, remove }, status) => {
        if (status === 'headers_received') {
            toast(`${meta.name} uploaded!`)
            remove()
        } else if (status === 'aborted') {
            toast(`${meta.name}, upload failed...`)
        }
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
        var splittedName = response.name.split(" ");
        const formData = new FormData();
        formData.append("firstName", splittedName[0]);
        formData.append("lastName", splittedName[1]);
        formData.append("email", response.email);
        formData.append("phonenumber", "");
        // formData.append("code", response.code);
        companyService.sendCVToCompany(formData).then((res) => {
            this.setState({
                isDropped: false,
                isCreate: false,
                currentFile: '',
            });
        });

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
                <div className="page-with-bg">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="careerfy-page-title">
                                    <div className="post-banner-overlay-text">
                                        <div className="post-text-left">
                                            {/* <label for="file">fgdsfvbfdf</label>
                                            <input id="file" type="file" style={{width: "500px", height: "220px"}} onChange={(event) => {
                                                this.uploadFile(event);
                                            }} className="form-control" /> */}
                                            <Dropzone onDrop={this.onDrop}
                                                maxFiles={1}
                                                multiple={false}
                                                canCancel={false}
                                                styles={{
                                                    dropzone: { width: 400, height: 200 },
                                                    dropzoneActive: { borderColor: 'green' },
                                                }}>
                                                {({ getRootProps, getInputProps }) => (
                                                    <section className="container">
                                                        <div {...getRootProps({ className: 'dropzone' })}>
                                                            <input {...getInputProps()} />
                                                            <div className="drop-cv">
                                                                <span><img src="../../../static/assets/images/cloud-storage-uploading-option.png"></img></span>
                                                                <h4>{i18n.t('DragOrDropComponent.DropCvHeaderTitle')}</h4></div>
                                                        </div>
                                                    </section>
                                                )}
                                            </Dropzone>

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
                                                    Create CV
                                                </Button>
                                            </div>
                                        </div>
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
                                            <h2>Drop CV and details</h2>
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
                                        // formData.append("linkedInLink", linkedInLink);
                                        // formData.append("facebookLink", facebookLink);
                                        // formData.append("instagramLink", instagramLink);
                                        // formData.append("twitterLink", twitterLink);
                                        // formData.append("id", 0);
                                        formData.append("file", this.state.currentFile);

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
                                                                <label>Selected File :
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
                                                        <label>{i18n.t('Register.RegisterLabel1')}:</label>
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