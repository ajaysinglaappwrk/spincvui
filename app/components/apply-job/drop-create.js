import React, { Fragment } from 'react';
import { i18n, withTranslation } from '../../../i18n';
import { Formik, Field, Form, ErrorMessage, yupToFormErrors } from 'formik';
import * as Yup from 'yup';
import { Modal, Button } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import Dropzone from 'react-dropzone';
import { bindCallback } from 'rxjs';
import { companyService } from '../../services/company.service';

class DropCreate extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            currentFile: null,
            isDropped: false,
            isCreate: false,
            resume: {},
            candidate: { firstName: '', lastName: '', email: '', phonenumber: '', file: null },
            imagePath: '../../../static/assets/images/favicon.ico'
        }

        this.onDrop = (file) => {
            this.uploadFile(file);
        };
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

    render() {
        let validationSchema = {
            firstName: Yup.string().required(i18n.t('Validations.FirstNameValidationLabel')),
            lastName: Yup.string().required(i18n.t('Validations.LastNameValidationLabel')),
            email: Yup.string().required(i18n.t('Validations.EmailValidationLabel')).email(i18n.t('Validations.InvalidEmailValidationLabel')),
            phonenumber: Yup.string()
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
                                                            <p>Drop CV</p>
                                                        </div>
                                                    </section>
                                                )}
                                            </Dropzone>
                                        </div>
                                        <div className="post-text-right">
                                            <Button variant="primary" onClick={() => this.createResume()}>
                                                Launch Create modal
                                                </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {
                    (this.state.isDropped || this.state.isCreate) && <div className="careerfy-modal fade-in careerfy-typo-wrap" id="JobSearchModalRegister">
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
                                            <h2>Enter details</h2>
                                            <span className="modal-close" onClick={() => this.closeCreateResumeSection()}><i className="fa fa-times"></i></span>
                                        </div>}
                                </div>
                                <Formik
                                    initialValues={this.state.candidate}
                                    validationSchema={Yup.object().shape(validationSchema)}
                                    onSubmit={({ firstName, lastName, email, phonenumber }, { setStatus, resetForm }) => {
                                        setStatus();
                                        const formData = new FormData();
                                        formData.append("firstName", firstName);
                                        formData.append("lastName", lastName);
                                        formData.append("email", email);
                                        formData.append("phonenumber", phonenumber);
                                        // formData.append("id", 0);
                                        formData.append("file", this.state.currentFile);

                                        companyService.sendCVToCompany(formData).then((res)=>{
                                            resetForm();
                                        })

                                    }}>
                                    {({ errors, status, touched, isSubmitting }) => (
                                        <Form>
                                            <div className="careerfy-user-form careerfy-user-form-coltwo">
                                                {
                                                    this.state.isDropped && <ul>
                                                        <li className="company-name-field">
                                                            <strong>
                                                                <label>{this.state.currentFile ? 'Selected File : ' + this.state.currentFile.name : null} </label>
                                                            </strong>
                                                            <div className="file-select-name"> </div>
                                                        </li>
                                                    </ul>
                                                }
                                                <ul>
                                                    <li className="company-name-field">
                                                        <label>{i18n.t('Register.RegisterLabel')}</label>
                                                        <Field name="firstName" type="text" className={'form-control' + (errors.firstName && touched.firstName ? ' is-invalid' : '')} />
                                                        <ErrorMessage name="firstName" component="div" className="invalid-feedback text text-danger" />
                                                    </li>
                                                    <li className="company-name-field">
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

export default withTranslation('translation')(DropCreate);