import React, { Fragment } from 'react';
import { i18n, withTranslation } from '../../../i18n';
import { Formik, Field, Form, ErrorMessage, yupToFormErrors } from 'formik';
import * as Yup from 'yup';
import { Modal, Button } from "react-bootstrap";

class DropCreate extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            currentFile: null,
            isDropped: false,
            isCreate: false,
            resume: {},
            candidate: { firstName: '', lastName: '', email: '', phonenumber: '', file: null }
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

    render() {
        let validationSchema = {
            firstname: Yup.string().required(i18n.t('Validations.FirstNameValidationLabel')),
            lastname: Yup.string().required(i18n.t('Validations.LastNameValidationLabel')),
            email: Yup.string().required(i18n.t('Validations.EmailValidationLabel')).email(i18n.t('Validations.InvalidEmailValidationLabel')),
            phonenumber: Yup.string().required("Phone Number is Required."),
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
                                            <input type="file" onChange={(event) => {
                                                this.setState({ currentFile: event.currentTarget.files[0] });
                                                this.dropResume();
                                            }} className="form-control" />
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
                                    onSubmit={({ name, email, phonenumber }, { setStatus, setSubmitting }) => {
                                        setStatus();
                                        const formData = new FormData();
                                        formData.append("firstName", firstName);
                                        formData.append("lastName", lastName);
                                        formData.append("email", email);
                                        formData.append("phonenumber", phonenumber);
                                        formData.append("id", 0);
                                        formData.append("file", this.state.currentFile);
                                        console.log('formData firstName : ', formData.get("firstName"));
                                        console.log('formData lastName : ', formData.get("lastName"));
                                        console.log('formData email : ', formData.get("email"));
                                        console.log('formData phonenumber : ', formData.get("phonenumber"));
                                        console.log('formData id : ', formData.get("id"));
                                        console.log('formData file : ', formData.get("file"));
                                    }}
                                    render={({ errors, status, touched, isSubmitting }) => (
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
                                                        <label>First Name</label>
                                                        <Field name="firstName" type="text" className={'form-control' + (errors.firstName && touched.firstName ? ' is-invalid' : '')} />
                                                        <ErrorMessage name="firstName" component="div" className="invalid-feedback text text-danger" />
                                                    </li>
                                                    <li className="company-name-field">
                                                        <label>Last Name</label>
                                                        <Field name="lastName" type="text" className={'form-control' + (errors.lastName && touched.lastName ? ' is-invalid' : '')} />
                                                        <ErrorMessage name="lastName" component="div" className="invalid-feedback text text-danger" />
                                                    </li>
                                                    <li>
                                                        <label>Email</label>
                                                        <Field name="email" type="text" className={'form-control' + (errors.email && touched.email ? ' is-invalid' : '')} />
                                                        <ErrorMessage name="email" component="div" className="invalid-feedback text text-danger" />
                                                    </li>
                                                    <li>
                                                        <label>Phone Number:</label>
                                                        <Field name="phonenumber" type="text" className={'form-control' + (errors.phonenumber && touched.phonenumber ? ' is-invalid' : '')} />
                                                        <ErrorMessage name="phonenumber" component="div" className="invalid-feedback text text-danger" />
                                                    </li>
                                                    <li className="careerfy-user-form-coltwo-full">
                                                        <input type="submit" value="Save" />
                                                    </li>
                                                </ul>
                                            </div>

                                        </Form>
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                }
            </div>
        );
    }
}

export default withTranslation('translation')(DropCreate);