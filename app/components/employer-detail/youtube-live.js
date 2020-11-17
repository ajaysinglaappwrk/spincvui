import React from 'react';
import { withTranslation } from '../../../i18n';
import Iframe from 'react-iframe'
import ReactPlayer from 'react-player'
import Jobs from '../job-listing/cluster-jobs';
import JobApply from '../apply-job/apply-job';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { companyService } from '../../services/company.service';
import {  toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

let _this;
class YoutubeLive extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            teamDescription: "",
            followupDescription: "",
            sessionDetail: {},
            firstSessionData: {},
            previousLiveSessions: [],
            isOpen: false,
            url: '',
            isSubmitBlocked: false
        }

        _this = this;
    }
    openModal(url, value) {
        this.setState({ url: url });
        this.setState({ isOpen: value });
    }

    render() {
        const { profile, i18n, jobsCount } = this.props;
        var settings = {
            dots: false,
            centerMode: true,
            centerPadding: '60px',
            navigation: true,
            infinite: true,
            speed: 500,
            autoplay: true,
            slidesToShow: 3,
            slidesToScroll: 1,
            isOpenEventModel: false,
            isSubmitBlocked: false,
            responsive: [
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1,
                        arrows: true,
                        centerMode: true,
                        centerPadding: '40px'
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        arrows: true,
                        centerMode: true,
                        centerPadding: '40px',
                        slidesToShow: 1
                    }
                }

            ]
        };
        this.state.sessionDetail = profile.upcomingEvent

        return (
            <div className="container-fulid data-container whatWedo youtube-live-page" style={{ maxWidth: '91%', margin: 'auto' }} >
                {this.state.isOpenEventModel && <div>
                    <div className="careerfy-modal careerfy-typo-wrap fade-in">
                        <div className="modal-inner-area">&nbsp;</div>
                        <div className="modal-content-area reminder-pop">
                            <div className="modal-box-area video-modal">
                                <div className="careerfy-modal-title-box">
                                    <h2>{i18n.t('EmployeeDetail.ReminderPopupTitle')}</h2>
                                    <span className="modal-close" onClick={() => this.setState({ isOpenEventModel: false })}><i className="fa fa-times"></i></span>
                                </div>
                                <Formik
                                    initialValues={{
                                        username: '',
                                        name: ''
                                    }}
                                    validationSchema={Yup.object().shape({
                                        username: Yup.string().required(i18n.t('Validations.UserNameValidationLabel')).email(i18n.t('Validations.InvalidEmailValidationLabel')),
                                        name: Yup.string().required(i18n.t('Validations.NameValidationMessage')),
                                    })}
                                    onSubmit={({ username, name }, { setStatus, setSubmitting }) => {
                                        setStatus();
                                        if (!_this.state.isSubmitBlocked) {
                                            _this.setState({ isSubmitBlocked: true });
                                            companyService.sendReminder(username, _this.state.sessionDetail.id,name).then((result) => {
                                                _this.setState({ isSubmitBlocked: false });
                                                if (!result) {
                                                    toast.error("Déjà inscrit avec cet e-mail.");
                                                    return;
                                                }
                                                _this.setState({ isOpenEventModel: false });
                                                if (result) {
                                                    _this.setState({ authCode: null });
                                                    localStorage.removeItem("authCode");
                                                }

                                            })
                                        }

                                    }

                                    }>
                                    {({ errors, status, touched, isSubmitting }) => (

                                        <Form>


                                            <div className="careerfy-user-form">
                                                <ul>
                                                    <li>
                                                        <label>
                                                            {i18n.t('General.NameLabel')}</label>
                                                        <Field name="name" placeholder type="text" placeholder={i18n.t('General.NameLabel')} className={'form-control' + (errors.name && touched.name ? ' is-invalid' : '')} />
                                                        <i className="careerfy-icon careerfy-user"></i>
                                                        <ErrorMessage name="name" component="div" className="invalid-feedback text text-danger" />
                                                    </li>
                                                    <li>
                                                        <label>
                                                            {i18n.t('Login.LoginLabel')}</label>
                                                        <Field name="username" placeholder type="text" placeholder={i18n.t('Login.LoginLabel')} className={'form-control' + (errors.username && touched.username ? ' is-invalid' : '')} />
                                                        <i className="careerfy-icon careerfy-mail"></i>
                                                        <ErrorMessage name="username" component="div" className="invalid-feedback text text-danger" />
                                                    </li>
                                                    <li>
                                                        <input type="submit" value={i18n.t('EmployeeDetail.SendReminderBtnText')} />
                                                        <p className="terms-text" style={{ textAlign: "center" }}>{i18n.t('EmployeeDetail.ReminderPoupupParagraph')} </p>

                                                    </li>
                                                </ul>
                                            </div>

                                        </Form>
                                    )}
                                </Formik>
                            </div>
                        </div>
                    </div>
                </div>
                }

                {

                    <div className="activites">

                        <div className="activites_desc">
                            {/* <h2 className="underline main_heading">{this.state.sessionDetail.title} </h2> */}
                            <h2 className="underline main_heading">{i18n.t('LiveTab.MainHeader1')}, {profile.displayName} {i18n.t('LiveTab.MainHeader2')} !</h2>
                        </div>

                        <div className="meet-schedule">
                            {/* <h2 className="meet-title"> {this.state.sessionDetail.heading1} </h2> */}
                            <h2 className="meet-title"> {profile.displayName} </h2>
                            {/* <hr className="sub-title-border" /> */}
                            <p className="meet-content-text">
                                {i18n.t('EmployeeDetail.EventSlogan')}
                            </p>
                            {
                                <div className="meet-text-bg">
                                    <h2>{i18n.t('LiveTab.UpcomingEventLabel')} :{(this.state.sessionDetail && !!this.state.sessionDetail.displayTimeString) ? this.state.sessionDetail.displayTimeString : i18n.t('LiveTab.ComingSoonText')}</h2>
                                    <p>{profile.displayName} {i18n.t('LiveTab.EventHeaderSloganText1')} {(jobsCount && jobsCount > 0 ? + jobsCount : i18n.t('LiveTab.EventHeaderSloganText2'))} {i18n.t('LiveTab.EventHeaderSloganText3')}</p>
                                    {
                                        this.state.sessionDetail &&
                                        <React.Fragment>

                                            <label>{this.state.sessionDetail.eventName}</label>
                                            <p>{this.state.sessionDetail.description}</p>
                                            <a onClick={() => this.setState({ isOpenEventModel: true })} >{i18n.t('EmployeeDetail.EventRegisterBtnText')}</a>
                                        </React.Fragment>
                                    }

                                </div>
                            }
                        </div>
                        {/* <div className="our-project-sec live-page-slider">
                            <h2 className="underline main_heading">{this.state.sessionDetail.previousSessionHeaderTitle}</h2>
                            {
                                this.state.previousLiveSessions && this.state.previousLiveSessions.length > 0 ? <Slider {...settings}>
                                    {this.state.previousLiveSessions.map((x, i) => (
                                        <div className="slide" key={i}>
                                            <img src={x.mediaUrl} />
                                        </div>
                                    ))}
                                </Slider> : <h6>{i18n.t('Messages.NoLiveSessionMessage')}  </h6>
                            }
                        </div> */}
                    </div>
                }

                {/* sidebar content */}
                <aside className="careerfy-column-4 sidebar_tabs careerfy-typo-wrap wrksq_aside">

                    <JobApply companyId={this.props.profile.companyId}></JobApply>
                    <div className="careerfy-job wrksq_joblisting careerfy-joblisting-classic careerfy-jobdetail-joblisting">
                        <div className="careerfy-section-title"><h2 className="sub_heading">{i18n.t('EmployeeDetail.ActiveJobs')} {this.props.profile.name}</h2></div>
                        <ul className="careerfy-row " >
                            <Jobs size={3} companyId={this.props.profile.companyId} showFacet={false}></Jobs>

                        </ul>
                    </div>

                </aside>


                {this.state.isOpen && <div>
                    <div className="careerfy-modal careerfy-typo-wrap fade-in" id="JobSearchModalSignup">
                        <div className="modal-inner-area">&nbsp;</div>
                        <div className="modal-content-area">
                            <div className="modal-box-area video-modal">
                                <div className="careerfy-modal-title-box">
                                    <h2>Video</h2>
                                    <span className="modal-close" onClick={() => this.openModal(null, false)}><i className="fa fa-times"></i></span>
                                </div>
                                <div className="playerBox">
                                    {this.state.url.includes("youtu") ? <ReactPlayer url={this.state.url} playing width={1083} height={609} controls style={{ maxWidth: '100%', width: '100%' }} /> : <Iframe className="iframePlayer" url={this.state.url} />}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                }

            </div>

        );
    }
}
export default withTranslation('translation')(YoutubeLive);
