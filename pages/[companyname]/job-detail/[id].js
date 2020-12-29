import React, { Fragment } from 'react';
import Axios from 'axios';
import { withTranslation, i18n } from '../../../i18n';
import "react-toastify/dist/ReactToastify.css";
import Iframe from 'react-iframe';
import ReactPlayer from 'react-player';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import {
    FacebookIcon,
    TwitterIcon,
    LinkedinIcon,
    EmailIcon,
    FacebookShareButton,
    TwitterShareButton,
    LinkedinShareButton,
    EmailShareButton
} from "react-share";
import 'react-image-lightbox/style.css'; // This only needs to be imported once in your app
import { connect } from 'react-redux';
import { ToastContainer, toast } from "react-toastify";

import { withRouter, useRouter } from 'next/router';
import Link from 'next/link';

import { companyService } from '../../../app/services/company.service';
import { authenticationService } from '../../../app/services/authentication.service';
import Login from '../../../app/components/login/login';
import Register from '../../../app/components/register/register';
import { apiUrl } from '../../../app/config';
import JobApply from '../../../app/components/apply-job/apply-job';
import Jobs from '../../../app/components/job-listing/jobs-list';
import Layout from '../../../app/components/Layout';
import initsStore from '../../../app/store';
import Head from 'next/head';
import DropCreate from '../../../app/components/apply-job/drop-create';
class JobDetail extends React.Component {

    static getInitialProps = async ({ query }) => {
        const res = await fetch(apiUrl + 'api/company/GetJobDetailById/' + query.id);
        const json = await res.json()
        return { jobDetail: json, namespacesRequired: ["common"] };
    };
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            jobDetail: {},
            jobs: [],
            companyPerks: [],
            text: '',
            perkTitle: '',
            activePerk: 1,
            companyProfile: {},
            innerPage: 0,
            url: '',
            isOpen: false,
            isLargeViewOpened: false,
            rightSideWidgets: [],
            leftSideWidgets: [],
            leftSideSecondWidgets: [],
            companyTopLeftWidget: [],
            companyMediaList: [],
            localFavJobIds: [],
            pendingJobIds: [],
            loginModal: false,
            registerModal: false,
            industryName: '',
            jobType: {},
            currentJobCompanyName: '',
            currentJobId: 0,
            openJobVideo: false,
            jobLocations: '',
            showDragDrop: true
        };
    }

    componentDidMount() {
        const { i18n } = this.props;
        window.scrollTo(0, 0);
        if (window.location.hostname.substr(0, window.location.hostname.indexOf('.')).toLowerCase() == "gexel") {
            document.body.classList.add('gexel-profile-jobdetail')
        }
        document.body.classList.add('all-profile-jobdetail')
        //TO-DO Need to move to service
        Axios.get(apiUrl + `api/company/GetJobDetailById/${this.props.router.query.id}`)
            .then((result) => {
                this.getCompanyPerks(result.data.companyId);
                var industry = result.data.industries.find(x => (i18n.language == "en" ? x.languageId == 1 : x.languageId == 2));
                this.setState({
                    data: result.data,
                    jobDetail: result.data.jobs.find(x => (i18n.language == "en" ? x.languageId == 1 : x.languageId == 2)),
                    industryName: industry != null ? industry.description : "",
                    jobType: result.data.jobTypes.find(x => (i18n.language == "en" ? x.languageId == 1 : x.languageId == 2))

                })
            });
        Axios.get(apiUrl + `api/company/GetRelavantJobs/${this.props.router.query.id}`)
            .then((result) => {
                this.setState({
                    jobs: result.data,
                })
            });

        this.fetchFavJobs();
    }

    getCompanyPerks(companyId) {
        const { i18n } = this.props;
        Axios.get(apiUrl + `api/company/GetPerksByCompanyIdAndJobId/${companyId}/${this.props.router.query.id}`)
            .then((result) => {
                let perks = result.data.filter(x => (i18n.language == "en" ? x.languageCode == 'en' : x.languageCode == 'fr'));
                this.setState({
                    companyPerks: perks,
                    activePerk: perks[0].id,
                    perkTitle: perks[0].title,
                    text: perks[0].companyPerkSubcategories.map((subcategory, catindex) => {
                        return (<div key={catindex} className="perksContent-text"><img src="/static/assets/images/perksicon.png" /> <h6 className="desc_text">{subcategory.title}</h6></div>)
                    })
                })
            });
    }

    onTabChange = (tabIndex, url) => {
        this.setState({ innerPage: tabIndex })
    }

    toPascal(o) {
        var newO, origKey, newKey, value
        newO = {}
        for (origKey in o) {
            if (o.hasOwnProperty(origKey)) {
                newKey = (origKey.charAt(0).toUpperCase() + origKey.slice(1) || origKey).toString()
                value = o[origKey]
                if (value instanceof Array || (value !== null && value.constructor === Object)) {
                    value = this.toPascal(value)
                }
                newO[newKey] = value
            }
        }
        return newO
    }

    isAlreadyExist(jobPostingId) {
        var job = this.state.localFavJobIds.find(x => x.JobPostingId == jobPostingId);
        return job != null;

    }
    fetchFavJobs = () => {
        if (authenticationService.isUserLoggedIn) {
            var items = localStorage.getItem("favouriteJobs");
            if (items != null) {
                this.setState({ localFavJobIds: JSON.parse(items), pendingJobIds: [] });
            }
            else {
                companyService.fetchFavouriteJobs(this.state.pendingJobIds.join(",")).then((res) => {
                    var jobs = [];
                    for (var i = 0; i < res.length; i++) {
                        var job = this.toPascal(res[i]);
                        jobs.push(job);
                    }
                    this.setState({ localFavJobIds: jobs, pendingJobIds: [] });
                });
            }
        }
    }

    closeSaveJobSection(jobId) {
        var jobs = this.state.pendingJobIds.filter(x => x != jobId);
        this.setState({ pendingJobIds: jobs });
    }

    setLocalFavItems(jobs) {
        localStorage.removeItem('favouriteJobs');
        localStorage.setItem('favouriteJobs', JSON.stringify(jobs));
    }

    setJobAsFavourite(jobdata, markAsFavourite) {
        var job = this.toPascal(jobdata);
        if (authenticationService.isUserLoggedIn) { // if user is logged in saving favourite jobs in db
            companyService.setJobAsFavourite(job.JobPostingId, markAsFavourite).then((res) => {
                toast.success("Job status updated sucessfully!");
                var jobs = [];
                if (!markAsFavourite) {
                    jobs = this.state.localFavJobIds.filter(x => x.JobPostingId != job.JobPostingId);
                    this.setState({ localFavJobIds: jobs });
                    this.setLocalFavItems(jobs);

                } else {
                    companyService.fetchFavouriteJobs(this.state.pendingJobIds.join(",")).then((res) => {
                        var jobs = [];
                        for (var i = 0; i < res.length; i++) {
                            var job = this.toPascal(res[i]);
                            jobs.push(job);
                        }
                        this.setState({ localFavJobIds: jobs, pendingJobIds: [] });
                        this.setLocalFavItems(jobs);
                    });
                }

            });



        } else { //if user is not logged in, saving  in localstorage  for specific user
            if (markAsFavourite) {
                var jobs = this.state.pendingJobIds;
                jobs.push(job.JobPostingId);
                this.setState({ pendingJobIds: jobs });
            }
        }
    }

    //for login method 
    login() {
        const loginModal = true;
        this.setState({ loginModal });
        document.body.classList.add('careerfy-modal-active');
    }

    closeLoginModal = () => {
        const loginModal = false;
        this.setState({ loginModal });
        document.body.classList.remove('careerfy-modal-active');
    }

    closeRegisterModal = () => {
        const registerModal = false;
        this.setState({ registerModal });
        document.body.classList.remove('careerfy-modal-active');
    }

    viewCompanyProfile(name) {
        window.open("/" + name, "_blank")
    }

    openJobVideoModal(url, value, job) {
        this.setState({ url: url });
        if (job) {
            this.setState({
                currentJobCompanyName: job.companyName,
                currentJobId: job.jobPostingId,
            });
        }
        this.setState({ openJobVideo: value });
    }

    viewCompanyProfile() {
        window.open("/" + this.state.currentJobCompanyName, "_blank")
    }

    makeJobSchema() {
        var jobLocations = [];
        var joblocationCities = [];
        if (this.state.data && this.state.data.jobPostingLocations && this.state.data.jobPostingLocations.length > 0) {
            this.state.data.jobPostingLocations.forEach(function (location) {
                joblocationCities.push(location.city);
                jobLocations.push({
                    "@type": "Place",
                    "address": {
                        "streetAddress": location.address,
                        "addressLocality": location.city,
                        "addressRegion": location.city,
                        "postalCode": location.postalCode,
                    }
                });
            });

        }
        this.state.jobLocations = joblocationCities.join(', ');
        return JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "JobPosting",
            "title": this.state.jobDetail.title,
            "description": this.state.jobDetail.jobDescription,
            "datePosted": this.state.data.lastModifiedDate,
            "employmentType": this.state.jobType.jobDescription,
            "validThrough": this.state.data.publishEndDate,
            "baseSalary": {
                "@type": "MonetaryAmount",
                "value": this.state.data.salaryMin,
                "currency": this.state.data.currency
            },
            "jobLocation": jobLocations,
            "hiringOrganization": {
                "@type": "Organization",
                "name": this.state.data.companyName,
                "logo": this.state.data.companyLogoUrl
            }
        });
    }

    render() {
        const { i18n, jobDetail } = this.props;
        var industry = jobDetail.industries.find(x => (i18n.language == "en" ? x.languageId == 1 : x.languageId == 2));
        this.state.data = jobDetail;
        this.state.jobDetail = jobDetail.jobs.find(x => (i18n.language == "en" ? x.languageId == 1 : x.languageId == 2))
        this.state.industryName = industry != null ? industry.description : "",
            this.state.jobType = jobDetail.jobTypes.find(x => (i18n.language == "en" ? x.languageId == 1 : x.languageId == 2))

        const url = '';
        var jobPostingSchema = this.makeJobSchema();

        const title = "Offre d’emploi | " + this.state.jobDetail.title + " | " + this.state.jobLocations + " | " + this.state.data.companyName;

        return (
            <Layout>
                <Head>
                    <meta property="og:title" content={title} />
                    <meta property="og:image" content={this.state.data.companyLogoUrl} />
                    <meta property="og:image:width" content="200" />
                    <meta property="og:image:height" content="200" />
                    <meta property="og:type" content="website" />
                    <meta property="og:url" content={"https://www.spincv.com/" + this.state.data.companyName + "/job-detail/" + this.state.data.jobPostingId} />
                    <meta property="og:description"
                        content="Le seul site d’emploi qui vous permet vraiment de découvrir une entreprise.  Vidéos, photos, visite 3D, drone, direct, et bien plus.  En 2020, ne vous fiez plus seulement aux offres écrites.  Totalement gratuit !" />
                    <script
                        // key={`jobJSON-${job.id}`}
                        type='application/ld+json'
                        dangerouslySetInnerHTML={{ __html: jobPostingSchema }}
                    />
                </Head>
                <div className="job-detail-pagee">

                    <div className="careerfy-job-subheader" style={{ backgroundImage: 'url(' + (!this.state.data.companyBackImgUrl ? 'https://opsoestorage.blob.core.windows.net/companybackground-stg/img_size.jpg' : this.state.data.companyBackImgUrl) + ')', }}>
                        {/* <img src="https://opsoestorage.blob.core.windows.net/companybackground-stg/img_size.jpg" /> */}
                        <span className="careerfy-banner-transparent"></span>
                        <div className="container">
                            <div className="row">
                                <div className="col-md-12">

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="careerfy-main-content job-details">

                        <div className="careerfy-main-section">
                            <div className="container-fluid data-container">
                                <div className="row">
                                    <div className="careerfy-column-12">
                                        <div className="careerfy-typo-wrap">
                                            <figure className="careerfy-jobdetail-list">
                                                <Link href={`/${this.state.data.companyName}`}>
                                                    <a className="careerfy-jobdetail-listthumb"><img src={this.state.data.companyLogoUrl} alt={this.state.data.companyName} /></a>
                                                </Link>
                                                <figcaption>
                                                    <h2 className="Jobtitle-jobdetail">
                                                        {this.state.jobDetail.title}
                                                        <span className="favBtndetail"
                                                            onClick={() => this.setJobAsFavourite(this.state.data, !(this.isAlreadyExist(this.state.data.jobPostingId)))}>
                                                            {this.isAlreadyExist(this.state.data.jobPostingId) ?
                                                                <i className="fa fa-heart" aria-hidden="true"></i> :
                                                                <i className="fa fa-heart-o" aria-hidden="true"></i>}
                                                        </span>
                                                    </h2>
                                                    <span ><small className=""> {this.state.jobType && <a href="#" style={{ float: 'none' }} className="careerfy-option-btn">{this.state.jobType.jobDescription}</a>}
                                                    </small> {this.state.data.companyName} </span>
                                                    {
                                                        this.state.pendingJobIds.indexOf(this.state.data.jobPostingId) > -1 &&
                                                        <div className="text-sign-in">
                                                            <div className="sign-content">
                                                                <p>Enregistrez vos offres préférées</p>
                                                                <p>Vous devez avoir un compte pour sauvegarder : <a onClick={() => this.setState({ registerModal: true })}>Enregistrez-vous (c’est gratuit et rapide).</a>&nbsp; <a onClick={() => this.login()}>Connectez-vous</a></p>
                                                                <p onClick={() => this.closeSaveJobSection(this.state.data.jobPostingId)}><i className="fa fa-times" aria-hidden="true"></i></p>
                                                            </div>
                                                        </div>
                                                    }
                                                    <ul className="careerfy-jobdetail-options">
                                                        <li><i className="fa fa-map-marker"></i> {this.state.data.locations} </li>
                                                    </ul>
                                                    <div className="socail-forgexel">
                                                        <ul className="careerfy-jobdetail-media">
                                                            <li>{i18n.t('General.ShareButtonLabel')}:</li>
                                                            <li><FacebookShareButton url={url} className="share">
                                                                <FacebookIcon size={25} round={true} />
                                                            </FacebookShareButton></li>
                                                            <li><TwitterShareButton url={url} className="share">
                                                                <TwitterIcon size={25} round={true} />
                                                            </TwitterShareButton></li>
                                                            <li><LinkedinShareButton url={url} className="share">
                                                                <LinkedinIcon size={25} round={true} />
                                                            </LinkedinShareButton></li>
                                                            <li><EmailShareButton url={url} className="share">
                                                                <EmailIcon size={25} round={true} />
                                                            </EmailShareButton></li>
                                                        </ul>
                                                    </div>
                                                </figcaption>

                                            </figure>
                                        </div>
                                    </div>

                                    {
                                        this.state.innerPage === 0 &&
                                        <div>
                                            <div className="careerfy-column-8">
                                                <div className="action-profiles">
                                                    <button type="submit" style={{ marginRight: "10px" }} className="careerfy-option-btn" onClick={() => this.viewCompanyProfile(this.state.data.companyName)}>{i18n.t('General.DiscoverTheCompany')}</button>
                                                    {
                                                        this.state.data && this.state.data.videoLink &&
                                                        <button className="careerfy-option-btn  video-viewCompanyProfile" onClick={() => this.openJobVideoModal(this.state.data.videoLink, true, this.state.data)}><i className="fa fa-youtube-play"></i> {i18n.t('General.ViewVideo')}</button>
                                                    }
                                                </div>
                                                <div className="careerfy-facility-titel " style={{ marginBottom: '10px' }}><h2 className="main_heading">Ce que nous offrons</h2></div>
                                                <div className="container-fulid m_0" style={{ marginBottom: '15px', marginRight: '0px' }}>
                                                    <div className="perksTab" >
                                                        <div className="perksSidebar">
                                                            <div className="perksSidebar-title">
                                                                <ul>
                                                                    {this.state.companyPerks.map((perks, index) => {
                                                                        const { title, companyPerkSubcategories, id } = perks;
                                                                        return <Fragment key={index}>
                                                                            <li className={this.state.activePerk === id ? "perksTabactive desc_text  " : "desc_text"}
                                                                                onClick={() =>
                                                                                    this.setState({
                                                                                        activePerk: id,
                                                                                        perkTitle: title,
                                                                                        text: companyPerkSubcategories.map((subcategory, catindex) => {
                                                                                            return (<div className="perksContent-text" key={catindex}><img src="/static/assets/images/perksicon.png" /> <h6 className="desc_text">{subcategory.title}</h6></div>)
                                                                                        })
                                                                                    })
                                                                                } onMouseEnter={() => this.setState({
                                                                                    activePerk: id,
                                                                                    perkTitle: title,
                                                                                    text: companyPerkSubcategories.map((subcategory, catindex) => {
                                                                                        return (<div className="perksContent-text" key={catindex}><img src="/static/assets/images/perksicon.png" /> <h6 className="desc_text">{subcategory.title}</h6></div>)
                                                                                    })
                                                                                })}><p></p>{title} </li>
                                                                        </Fragment >
                                                                    })}
                                                                </ul>
                                                            </div>
                                                        </div>
                                                        <div className="perksContent">
                                                            <h3 className="sub_heading">{this.state.perkTitle}</h3>
                                                            {this.state.text}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="careerfy-typo-wrap">
                                                    <div className="careerfy-jobdetail-content">
                                                        <div className="careerfy-content-title"><h2>Description de l'offre</h2></div>
                                                        <div className="careerfy-jobdetail-services">
                                                            <ul className="careerfy-row" style={{ display: 'flex', flexWrap: 'wrap' }} >
                                                                {
                                                                    this.state.salaryMax > 0 && this.state.salaryMin > 0 &&
                                                                    < li className="careerfy-column-3">
                                                                        <i className="careerfy-icon careerfy-salary"></i>
                                                                        <div className="careerfy-services-text">Salaire offert<small> {this.state.data.salaryMin}$ &#60; {this.state.data.salaryMax}$</small></div>
                                                                    </li>
                                                                }
                                                                <li className="careerfy-column-3">
                                                                    <i className="careerfy-icon careerfy-social-media"></i>
                                                                    <div className="careerfy-services-text">Titre du poste <small>{this.state.jobDetail.title}</small></div>
                                                                </li>
                                                                {
                                                                    this.state.data.workExperienceMin > 0 && this.state.data.workExperienceMax > 0 &&
                                                                    < li className="careerfy-column-3">
                                                                        <i className="careerfy-icon careerfy-briefcase"></i>
                                                                        <div className="careerfy-services-text">Expérience <small>{this.state.data.workExperienceMin} - {this.state.data.workExperienceMax} ans </small></div>
                                                                    </li>
                                                                }
                                                                <li className="careerfy-column-3">
                                                                    <i className="careerfy-icon careerfy-network"></i>
                                                                    <div className="careerfy-services-text">Industrie <small>{this.state.industryName}</small></div>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                        <div className="careerfy-content-title"><h2>Description de l'offre</h2></div>
                                                        <div className="careerfy-description">
                                                            {<div className="textWidget" dangerouslySetInnerHTML={{ __html: this.state.jobDetail.jobDescription }} />}
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>

                                            <aside className="careerfy-column-4 jobDetail_sidebar" style={{ marginTop: '-20px' }}>
                                                <div className="careerfy-typo-wrap">
                                                    {
                                                        this.state.showDragDrop == false &&
                                                        <JobApply jobId={this.props.router.query.id} currentProfile={this.state.companyProfile}></JobApply>
                                                    }

                                                    {
                                                        this.state.showDragDrop == true &&
                                                        <DropCreate></DropCreate>
                                                    }

                                                    <div className="widget job-ui-common widget_view_jobs">
                                                        <div className="careerfy-widget-title" style={{ margin: '0' }}><h2>D’autres opportunités chez  {this.state.data ? this.state.data.companyName : ''}</h2></div>
                                                        {
                                                            this.state.jobs && this.state.jobs.length > 0 &&
                                                            <Jobs jobs={this.state.jobs}></Jobs>
                                                        }
                                                        <a href={"/" + (this.state.data ? this.state.data.companyName : '') + "/jobs"} className="widget_view_jobs_btn">{i18n.t('EmployeeDetail.ViewAllJobs')} <i className="careerfy-icon careerfy-arrows32"></i></a>
                                                    </div>
                                                </div>
                                            </aside>
                                        </div>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {
                        this.state.loginModal &&
                        <Login modal={this.state.loginModal} close={this.closeLoginModal} refreshFavJobs={this.fetchFavJobs}
                        ></Login>
                    }
                    {
                        this.state.registerModal &&
                        <Register modal={this.state.registerModal} close={this.closeRegisterModal} saveBulkJobs={this.savePendingFavouriteJobs}
                        ></Register>
                    }
                    {this.state.openJobVideo && <div>
                        <div className="careerfy-modal careerfy-typo-wrap fade-in" id="JobSearchModalSignup">
                            <div className="modal-inner-area">&nbsp;</div>
                            <div className="modal-content-area">
                                <div className="modal-box-area video-modal">
                                    <div className="careerfy-modal-title-box">
                                        <h2>Video</h2>
                                        <span className="modal-close" onClick={() => this.openJobVideoModal(null, false)}><i className="fa fa-times"></i></span>
                                    </div>
                                    <div className="share-icon-video">
                                        <div className="copy-video-url">
                                            <input type="text" value={window.location.host + "/jobs" + "?url=" + this.state.url + "&jobpostingId=" + this.state.currentJobId + "&company=" + this.state.currentJobCompanyName + "&isvideo=true"} />  <CopyToClipboard text={window.location.host + "/jobs" + "?url=" + this.state.url + "&jobpostingId=" + this.state.currentJobId + "&company=" + this.state.currentJobCompanyName + "&isvideo=true"}>
                                                <i class="fa fa-clone" aria-hidden="true"></i>
                                            </CopyToClipboard>
                                        </div>
                                        <ul className="careerfy-jobdetail-media">
                                            <li>{i18n.t('General.ShareButtonLabel')}:</li>
                                            <li><FacebookShareButton url={window.location.host + "/jobs" + "?url=" + this.state.url + "&jobpostingId=" + this.state.currentJobId + "&company=" + this.state.currentJobCompanyName + "&isvideo=true"} className="share">
                                                <FacebookIcon size={25} round={true} />
                                            </FacebookShareButton></li>
                                            <li><TwitterShareButton url={window.location.host + "/jobs" + "?url=" + this.state.url + "&jobpostingId=" + this.state.currentJobId + "&company=" + this.state.currentJobCompanyName + "&isvideo=true"} className="share">
                                                <TwitterIcon size={25} round={true} />
                                            </TwitterShareButton></li>
                                            <li><LinkedinShareButton url={window.location.host + "/jobs" + "?url=" + this.state.url + "&jobpostingId=" + this.state.currentJobId + "&company=" + this.state.currentJobCompanyName + "&isvideo=true"} className="share">
                                                <LinkedinIcon size={25} round={true} />
                                            </LinkedinShareButton></li>
                                            <li><EmailShareButton url={window.location.host + "/jobs" + "?url=" + this.state.url + "&jobpostingId=" + this.state.currentJobId + "&company=" + this.state.currentJobCompanyName + "&isvideo=true"} className="share">
                                                <EmailIcon size={25} round={true} />
                                            </EmailShareButton></li>
                                        </ul>
                                    </div>
                                    <div className="playerBox">
                                        {this.state.url.includes("youtu") ?
                                            <ReactPlayer url={this.state.url} playing width={1083} height={609}
                                                controls style={{ maxWidth: '100%', width: '100%' }} /> :
                                            <Iframe className="iframePlayer" url={this.state.url} />}
                                    </div>
                                    <div className="Video-actions">
                                        <button type="submit" className="careerfy-option-btn video-applyJobBtn" onClick={() => this.viewCompanyProfile()}>{i18n.t('General.DiscoverTheCompany')}</button>
                                        <button type="submit" className="careerfy-option-btn  video-viewCompanyProfile" onClick={() => this.openJobVideoModal(null, false)}> {i18n.t('General.ApplyJob')}</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    }
                </div >
            </Layout>
        )
    }

}

export default connect(initsStore)(withTranslation('translation')(withRouter(JobDetail)));