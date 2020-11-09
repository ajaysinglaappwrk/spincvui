import React, { Component, Fragment } from "react";
import {
    ReactiveBase,
    ReactiveList,
    MultiList,
    SelectedFilters,
    DataSearch,
    ReactiveComponent
} from "@appbaseio/reactivesearch";
import { withTranslation } from '../i18n';
import { Tab, Tabs } from 'react-bootstrap';
import Iframe from 'react-iframe';
import ReactPlayer from 'react-player';
import { Button, Card, Accordion, ProgressBar } from 'react-bootstrap';
import { companyService } from '../app/services/company.service';
import { authenticationService } from '../app/services/authentication.service'
import { ToastContainer, toast } from "react-toastify";

import Login from '../app/components/login/login';
import Register from '../app/components/register/register';
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
import { CopyToClipboard } from 'react-copy-to-clipboard';

import Layout from '../app/components/Layout';
import Link from 'next/link'

class JobSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            url: '',
            openJobVideo: false,
            disableStoriesTab: false,
            selectedTabKey: "alljobs",
            selectedTabKeyFacets: "general",
            selectedIndustries: '',
            selectedLocations: '',
            selectedJobTypes: '',
            isFilterOpened: false,
            searchTerm: '',
            localFavJobIds: [],
            pendingJobIds: [],
            loginModal: false,
            registerModal: false,
            currentJobCompanyName: '',
            currentJobId: 0,
            isAnyFilterApplied: false,
            selectedSubCategories: '',
            selectedFoodFacets: '',
            selectedEnvironmentFacets: '',
            selectedAssurancesFacets: '',
            selectedTransportFacets: '',
            selectedOpenSpaceFacets: '',
            companyId: 0
        }
        this.customQuery.bind(this);
    }
    static getDerivedStateFromError(error) {
        debugger;
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }
    getParams(url) {
        var params = {};
        var parser = document.createElement('a');
        parser.href = url;
        var query = parser.search.substring(1);
        var vars = query.split('&');
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');
            params[pair[0]] = decodeURIComponent(pair[1]);
        }
        return params;
    };
    componentWillUnmount() {
        document.body.classList.remove('hide-header-search');
    }
    componentDidMount() {
        document.body.classList.add('hide-header-search');
        var params = this.getParams(window.location);
        if (params) {

            if (params.industries) {
                this.setState({ selectedIndustries: params.industries.split(",") });
            }
            if (params.locations) {
                this.setState({ selectedLocations: params.locations.split(",") });
            }
            if (!!params.searchterm) {
                this.setState({ searchTerm: params.searchterm })
            }
        }
        this.fetchFavJobs();

        //Checking if url contains url and video
        var params = this.getUrlParams();
        if (params && params.isvideo) {
            if (params.isvideo == "true") {
                this.state.url = params.url;
                this.state.currentJobCompanyName = params.company;
                this.state.currentJobId = params.jobpostingId;
                this.state.openJobVideo = true;
            }
        }

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

    savePendingFavouriteJobs = (id) => {
        companyService.saveBulkFavJobs(this.state.pendingJobIds.join(","), id).then((res) => {
            this.setState({ pendingJobIds: [] });
        });
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
    openJobVideoModal(url, value, job) {
        this.setState({ url: url });
        if (job) {
            this.setState({
                currentJobCompanyName: job.CompanyName,
                currentJobId: job.JobPostingId,
            });
        }
        this.setState({ openJobVideo: value });
    }
    intersperse(arr, sep) {
        if (arr.length === 0) {
            return [];
        }

        return arr.slice(1).reduce(function (xs, x, i) {
            return xs.concat([sep, x]);
        }, [arr[0]]);
    }
    handleSelect(value, accordianId) {
        if (!value) {
            document.getElementById(accordianId).children[0].children[0].classList.remove('active');
        }
        else {
            document.getElementById(accordianId).children[0].children[0].classList.add('active');

        }
    }
    setKey(key) {
        this.setState({ selectedTabKey: key });
    }
    setKeyFacetsTabs(key) {
        this.setState({ selectedTabKeyFacets: key });
    }
    setData(data) {
        if (data && data.data) {
            const jobStories = data.data.filter(x => !!x.VideoLink);
            this.setState({ disableStoriesTab: jobStories.length == 0, selectedTabKey: jobStories.length == 0 ? "alljobs" : this.state.selectedTabKey });
        }
    }
    setSelectedIndustries(industry) {
        let industries = this.state.selectedIndustries;
        if (!industries)
            industries = [];
        if (industries.indexOf(industry) == -1) {
            industries.push(industry);

            var finalIndustries = industries.join(',');
            this.setState({ selectedIndustries: finalIndustries.split(',') });
        }

    }
    setSelectedLocations(location) {
        let locations = this.state.selectedLocations;
        if (!locations)
            locations = [];
        if (locations.indexOf(location) == -1) {
            locations.push(location);
            this.setState({ selectedLocations: locations });
        }

    }
    setSelectedJobTypes(type) {
        let jobTypes = this.state.selectedJobTypes;
        if (!jobTypes)
            jobTypes = [];
        if (jobTypes.indexOf(type) == -1) {
            jobTypes.push(type);
            this.setState({ selectedJobTypes: jobTypes });
        }
    }
    toggleFilter() {
        if (!this.state.isFilterOpened) document.body.classList.add('modal-open');
        else document.body.classList.remove('modal-open');

        this.setState({ isFilterOpened: !this.state.isFilterOpened });
    }

    isAlreadyExist(jobPostingId) {
        var job = this.state.localFavJobIds.find(x => x.JobPostingId == jobPostingId);
        return job != null;

    }

    setJobAsFavourite(job, markAsFavourite) {
        if (authenticationService.isUserLoggedIn) { // if user is logged in saving favourite jobs in db
            companyService.setJobAsFavourite(job.JobPostingId, markAsFavourite).then((res) => {
            });
            var jobs = [];
            if (!markAsFavourite) {
                jobs = this.state.localFavJobIds.filter(x => x.JobPostingId != job.JobPostingId);
                this.setState({ localFavJobIds: jobs });
            } else {
                jobs = this.state.localFavJobIds;
                jobs.push(job);
                this.setState({ localFavJobIds: jobs });
            }

            this.setLocalFavItems(jobs);

        } else { //if user is not logged in, saving  in localstorage  for specific user
            if (markAsFavourite) {
                var jobs = this.state.pendingJobIds;
                jobs.push(job.JobPostingId);
                this.setState({ pendingJobIds: jobs });
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

    viewCompanyProfile() {
        window.open("/" + this.state.currentJobCompanyName, "_blank")
    }
    viewJobDetail() {
        const url = "/" + this.state.currentJobCompanyName + "/job-detail/" + this.state.currentJobId;
        this.props.history.push(url);
    }
    openJobDetail(url) {
        this.props.history.push(url);
    }
    renderJob(job) {
        const { i18n } = this.props;
        const jobDetailUrl = "/" + job.CompanyName + "/job-detail/" + job.JobPostingId
        const title = i18n.language == "en" ? job.TitleEN : job.TitleFR;
        const industry = i18n.language == "en" ? job.IndustryNameEN : job.IndustryNameFR;
        const jobTypes = i18n.language == "en" ? job.JobTypeEN : job.JobTypeFR;
        const companyProfileUrl = "/" + job.CompanyName

        // Change to update the UI
        return (
            <Fragment key={job.JobPostingId}>
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
                {
                    <div className="desktop-jobs">

                        <div className="careerfy-job careerfy-joblisting-classic">
                            <ul style={{ maxWidth: "100%" }}>
                                <li className="careerfy-column-12">
                                    <div className="careerfy-joblisting-classic-wrap job-list-main profile-job">
                                        <div className="figure_logo"><a href={companyProfileUrl}><img src={job.CompanyLogoUrl} alt="" /></a></div>
                                        <div className="careerfy-joblisting-text profile-job-desc">
                                            <div className="careerfy-list-option">
                                                <h2> <Link href={jobDetailUrl}> {title} </Link> </h2>
                                                <ul>
                                                    <li> <Link href={companyProfileUrl}> {job.CompanyName} </Link></li>
                                                    <div className="inline_li">
                                                        <li><i className="careerfy-icon careerfy-maps-and-flags"></i>

                                                            {
                                                                job.Locations != null && job.Locations.length > 0 &&
                                                                job.Locations.map((loc, index) => {

                                                                    return (<span key={index} onClick={() => this.setSelectedLocations(loc)}>{loc} &nbsp;</span>)
                                                                })
                                                            }
                                                        </li>
                                                        <li onClick={() => this.setSelectedIndustries(industry)}><i className="careerfy-icon careerfy-filter-tool-black-shape"></i> {industry}</li>
                                                    </div>
                                                </ul>
                                                <ul className="like-hide-job-icon">
                                                    <li onClick={() => this.setJobAsFavourite(job, !(this.isAlreadyExist(job.JobPostingId)))}>{this.isAlreadyExist(job.JobPostingId) ? <i className="fa fa-heart" aria-hidden="true"></i> : <i className="fa fa-heart-o" aria-hidden="true"></i>}</li>
                                                    {/* <li onClick={() => this.setJobAsHidden(job.JobPostingId)}><i className="fa fa-ban" aria-hidden="true"></i></li> */}
                                                </ul>
                                            </div>

                                            <div className="careerfy-job-userlist">
                                                {!!job.VideoLink &&
                                                    <button className="video-pop-btn" onClick={() => this.openJobVideoModal(job.VideoLink, true, job)}><i className="fa fa-youtube-play"></i> {i18n.t('General.ViewVideo')}</button>
                                                }
                                                {
                                                    jobTypes != null && jobTypes.length > 0 &&
                                                    <a onClick={() => this.setSelectedJobTypes(jobTypes[0])} className="careerfy-option-btn">{jobTypes[0]}</a>
                                                    // jobTypes.map((type, index) => {

                                                    //     return (<a onClick={() => this.setSelectedJobTypes(type)} className="careerfy-option-btn">{type}</a>)
                                                    // })
                                                }
                                            </div>
                                            <div className="clearfix"></div>

                                        </div>
                                        {
                                            this.state.pendingJobIds.indexOf(job.JobPostingId) > -1 &&
                                            <div className="text-sign-in">
                                                {/* Sign in</a> <a onClick={() => this.setState({ registerModal: true })}></a> */}
                                                <p>Enregistrez vos offres préférées</p>
                                                <p>Vous devez avoir un compte pour sauvegarder : <a onClick={() => this.setState({ registerModal: true })}>Enregistrez-vous (c’est gratuit et rapide).</a>&nbsp; <a onClick={() => this.login()}>Connectez-vous</a></p>
                                                <p onClick={() => this.closeSaveJobSection(job.JobPostingId)}><i className="fa fa-times" aria-hidden="true"></i></p>
                                            </div>
                                        }
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>

                }
                {/* MOBILE VIEW SECTION START*/}
                {
                    //FOR MOBILE VIEW ONLY    
                    <div className="mob-jobs">
                        <div className="careerfy-job careerfy-joblisting-classic" onClick={() => this.openJobDetail(jobDetailUrl)}>
                            <ul style={{ maxWidth: "100%" }}>
                                <li className="careerfy-column-12">
                                    <div className="careerfy-joblisting-classic-wrap job-list-main profile-job">
                                        <div className="figure_logo"><a><img src={job.CompanyLogoUrl} alt="" /></a></div>
                                        <div className="careerfy-joblisting-text profile-job-desc">
                                            <div className="careerfy-list-option">
                                                <h2> <Link href={jobDetailUrl}> {title} </Link> </h2>
                                                <ul>
                                                    <li> <Link > {job.CompanyName} </Link></li>
                                                    <div className="inline_li">
                                                        <li><i className="careerfy-icon careerfy-maps-and-flags"></i>

                                                            {
                                                                job.Locations != null && job.Locations.length > 0 &&
                                                                job.Locations.map((loc, index) => {

                                                                    return (<span key={index} >{loc} &nbsp;</span>)
                                                                })
                                                            }
                                                        </li>
                                                        <li ><i className="careerfy-icon careerfy-filter-tool-black-shape"></i> {industry}</li>
                                                    </div>
                                                </ul>
                                                <ul className="like-hide-job-icon">
                                                    <li >{this.isAlreadyExist(job.JobPostingId) ? <i className="fa fa-heart" aria-hidden="true"></i> : <i className="fa fa-heart-o" aria-hidden="true"></i>}</li>
                                                    {/* <li onClick={() => this.setJobAsHidden(job.JobPostingId)}><i className="fa fa-ban" aria-hidden="true"></i></li> */}
                                                </ul>
                                            </div>

                                            <div className="careerfy-job-userlist">
                                                {!!job.VideoLink &&
                                                    <button className="video-pop-btn"><i className="fa fa-youtube-play"></i> {i18n.t('General.ViewVideo')}</button>
                                                }
                                                {
                                                    jobTypes != null && jobTypes.length > 0 &&
                                                    <a className="careerfy-option-btn">{jobTypes[0]}</a>
                                                    // jobTypes.map((type, index) => {

                                                    //     return (<a onClick={() => this.setSelectedJobTypes(type)} className="careerfy-option-btn">{type}</a>)
                                                    // })
                                                }
                                            </div>
                                            <div className="clearfix"></div>

                                        </div>
                                        {
                                            this.state.pendingJobIds.indexOf(job.JobPostingId) > -1 &&
                                            <div className="text-sign-in">
                                                {/* Sign in</a> <a onClick={() => this.setState({ registerModal: true })}></a> */}
                                                <p>Enregistrez vos offres préférées</p>
                                                <p>Vous devez avoir un compte pour sauvegarder : <a onClick={() => this.setState({ registerModal: true })}>Enregistrez-vous (c’est gratuit et rapide).</a>&nbsp; <a onClick={() => this.login()}>Connectez-vous</a></p>
                                                <p onClick={() => this.closeSaveJobSection(job.JobPostingId)}><i className="fa fa-times" aria-hidden="true"></i></p>
                                            </div>
                                        }
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                }
                {/* MOBILE VIEW SECTION END*/}
            </Fragment>)
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

    getUrlParams() {
        var params = {};
        var parser = document.createElement('a');
        parser.href = window.location.href;
        var query = parser.search.substring(1);
        var vars = query.split('&');
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');
            params[pair[0]] = decodeURIComponent(pair[1]);
        }
        //removing query strings
        var uri = window.location.toString();
        if (uri.indexOf("?") > 0) {
            var clean_uri = uri.substring(0, uri.indexOf("?"));
            window.history.replaceState({}, document.title, clean_uri);
        }
        return params;
    }

    customQuery = function (companyId) {
        if (companyId && companyId > 0) {
            return {
                query: {
                    term: {
                        "CompanyId": companyId
                    }
                }
            }
        }

    }

    fetchJobStoriesQuery = function () {
        return {
            query: {
                exists: {
                    "field": "VideoLink"
                }
            }
        }
    }
    render() {
        const { i18n, companyId } = this.props;
        return (
            <Layout>
                <Fragment>
                    <div className="container">

                        <div className="row">
                            <div className="col-sm-12 " style={{ marginTop: '50px' }}>

                                <div className="Job-search-tabs-page">
                                    <ReactiveBase
                                        app="jobs"
                                        credentials="cP0z1rykF:9bd95720-8f69-4b0f-a58c-55f17bb3b5a8"
                                        enableAppbase
                                        url="https://readonly:spincv_2020!@sandboxjobs-ythbjhr-arc.searchbase.io"
                                    >
                                        <ReactiveComponent
                                            className="GlobalFilter"
                                            componentId="GlobalQuery"
                                            value={""}
                                            customQuery={() => this.customQuery(companyId)}
                                        />
                                        <ReactiveComponent
                                            className="GlobalFilter"
                                            componentId="JobStoriesQuery"
                                            value={""}
                                            customQuery={() => this.fetchJobStoriesQuery()}
                                        />
                                    </ReactiveBase>
                                </div>
                            </div>
                            <ToastContainer autoClose={3000} />
                        </div>


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
                                            {this.state.url.includes("youtu") ? <ReactPlayer url={this.state.url} playing width={1083} height={609} controls style={{ maxWidth: '100%', width: '100%' }} /> : <Iframe className="iframePlayer" url={this.state.url} />}
                                        </div>
                                        <div className="Video-actions">
                                            <button type="submit" className="careerfy-option-btn video-applyJobBtn" onClick={() => this.viewCompanyProfile()}>{i18n.t('General.DiscoverTheCompany')}</button>
                                            <button type="submit" className="careerfy-option-btn  video-viewCompanyProfile" onClick={() => this.viewJobDetail()}> {i18n.t('General.ApplyJob')}</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        }
                    </div>
                </Fragment>
            </Layout>
        );
    }
}
export default withTranslation('translation')(JobSearch);
