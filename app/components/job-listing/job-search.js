import React, { Component, Fragment } from "react";
import {
    ReactiveBase,
    ReactiveList,
    MultiList,
    SelectedFilters,
    DataSearch,
    ReactiveComponent
} from "@appbaseio/reactivesearch";
import { withTranslation } from '../../../i18n';
import { Tab, Tabs } from 'react-bootstrap';
import Iframe from 'react-iframe';
import ReactPlayer from 'react-player';
import { Card, Accordion } from 'react-bootstrap';
import { companyService } from '../../services/company.service';
import { authenticationService } from '../../services/authentication.service'
import { ToastContainer, toast } from "react-toastify";

import Login from '../login/login';
import Register from '../register/register';
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

class JobSearch extends React.Component {
    static getInitialProps = async ({ req }) => {
        const currentLanguage = req ? req.language : i18n.language;
        return { currentLanguage, namespacesRequired: ["common"] };
    };
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
            companyId: 0,
            latitude: null,
            longitude: null
        }
        this.customQuery.bind(this);
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

        
        //fetching the latitude and longitudes using navigator method
        navigator.geolocation.watchPosition((position) => {
            this.setState({ latitude: position.coords.latitude, longitude: position.coords.longitude });
        });

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
                                                <h2> <a href={jobDetailUrl}> {title} </a> </h2>
                                                <ul>
                                                    <li> <a href={companyProfileUrl}> {job.CompanyName} </a></li>
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
                                                <h2> <a href={jobDetailUrl}> {title} </a> </h2>
                                                <ul>
                                                    <li> <a > {job.CompanyName} </a></li>
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



    customQuery = function (companyId, props) {
        if (companyId && companyId > 0) {
            return {
                query: {
                    term: {
                        "CompanyId": companyId
                    }
                }
            }
        }

        if (!this.state.selectedLocations
            && !this.state.selectedJobTypes
            && !this.state.selectedSubCategories
            && !this.state.selectedIndustries
            && !this.state.selectedFoodFacets
            && !this.state.selectedEnvironmentFacets
            && !this.state.selectedAssurancesFacets
            && !this.state.selectedTransportFacets
            && !this.state.selectedOpenSpaceFacets && (this.state.latitude && this.state.longitude)) {
            return {
                query: {
                    bool: {
                        should: [
                            {
                                geo_distance: {
                                    distance: "25km",
                                    location: {
                                        lat: 45.60,
                                        lon: -73.50
                                    },
                                    "_name": "point 1"
                                }
                            }
                        ]
                    }
                }
            }
        }
        // else {
        //     return {
        //         "sort": {
        //             "_score": { "order": "desc" }
        //         },
        //         "query": {
        //             "bool": {
        //                 "must": []
        //             }
        //         }
        //     };
        // }


    }
    // customQuery = function (companyId) {
    //     // if (companyId && companyId > 0) {
    //     //     return {
    //     //         query: {
    //     //             term: {
    //     //                 "CompanyId": companyId
    //     //             }
    //     //         }
    //     //     }
    //     // }

    // }

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
            <Fragment>
                <div className="container">

                    <div className="row">
                        <div className="col-sm-12 " style={{ marginTop: '50px' }}>

                            <div className="Job-search-tabs-page">

                                {
                                    this.state.latitude && this.state.longitude &&
                                    <ReactiveBase
                                        app="jobs"
                                        credentials="LqovKbCGD:35e56a57-a426-4b1d-827c-8cb45cd12772"
                                        enableAppbase
                                        url="https://arc-cluster-spincvalpha-ne22bm.searchbase.io"
                                    >
                                        {
                                            <ReactiveComponent
                                                className="GlobalFilter"
                                                componentId="GlobalQuery"
                                                value={""}
                                                customQuery={props => this.customQuery(companyId, props)}

                                            />
                                        }

                                        <ReactiveComponent
                                            className="GlobalFilter"
                                            componentId="JobStoriesQuery"
                                            value={""}
                                            customQuery={() => this.fetchJobStoriesQuery()}
                                        />
                                        <div className="row">
                                            <div className="col-sm-4 fixed-filter">
                                                <div className="desktop-filters">
                                                    <div className="tab-facets-title">
                                                        <h2>Filtrer par:</h2>
                                                    </div>
                                                    <Tabs transition={false} id="facetstab" onSelect={(k) => this.setKeyFacetsTabs(k)} activeKey={this.state.selectedTabKeyFacets}>
                                                        <Tab eventKey="general" title={i18n.t('Facets.GeneralFacelLabel')}>
                                                            <div className="general">
                                                                <Accordion id="locationAccordian" defaultActiveKey="0" onSelect={e => this.handleSelect(e, "locationAccordian")}>
                                                                    <Card>
                                                                        <Accordion.Toggle className="active" as={Card.Header} eventKey="0">
                                                                            {i18n.t('Facets.LocationFacetLabel')}
                                                                        </Accordion.Toggle>
                                                                        <Accordion.Collapse eventKey="0">
                                                                            <Card.Body>
                                                                                <div className="side-list-bar-jobs custm-checkbox-filters">
                                                                                    <MultiList filterLabel="Locations" componentId="Locations" dataField="Locations.keyword"
                                                                                        react={{
                                                                                            "and": ["SearchSensor", "JobTypeSensor",
                                                                                                "IndustryfacetSensor", "SubCategoryfacetSensor", "FoodfacetSensor", "EnviromentFacetSensor",
                                                                                                "AssurancesFacetSensor", "TransportFacetSensor", "OpenSpaceFacetSensor", "GlobalQuery"]
                                                                                        }}
                                                                                        value={this.state.selectedLocations}
                                                                                        showLoadMore={true} size={1000}
                                                                                        loadMoreLabel="Plus de résultats"
                                                                                        placeholder={i18n.t('General.SearchLabel')}
                                                                                        onChange={(result) => {
                                                                                            this.setState({ selectedLocations: result })
                                                                                        }

                                                                                        }
                                                                                        render={({
                                                                                            loading,
                                                                                            error,
                                                                                            data,
                                                                                            handleChange,
                                                                                        }) => {
                                                                                            var selectedLocations = this.state.selectedLocations;
                                                                                            return (
                                                                                                <ul>
                                                                                                    {
                                                                                                        data.map(item => (
                                                                                                            <li>
                                                                                                                <input
                                                                                                                    id={item.key}
                                                                                                                    type="checkbox"
                                                                                                                    value={item.key}
                                                                                                                    onChange={handleChange}
                                                                                                                    checked={selectedLocations != null && selectedLocations.length > 0 && selectedLocations.indexOf(item.key) > -1}
                                                                                                                />
                                                                                                                <label for={item.key} className="job-checkbox-title">{item.key}<span>{item.doc_count}</span></label>
                                                                                                            </li>
                                                                                                        ))
                                                                                                    }
                                                                                                </ul>
                                                                                            )
                                                                                        }}

                                                                                    />
                                                                                </div>
                                                                            </Card.Body>
                                                                        </Accordion.Collapse>
                                                                    </Card>
                                                                </Accordion>
                                                                <Accordion defaultActiveKey="-1" id="jobTypeAccordian" onSelect={e => this.handleSelect(e, "jobTypeAccordian")}>
                                                                    <Card>
                                                                        <Accordion.Toggle as={Card.Header} eventKey="0">
                                                                            {i18n.t('Facets.JobTypeFacetLabel')}
                                                                        </Accordion.Toggle>
                                                                        <Accordion.Collapse eventKey="0">
                                                                            <Card.Body>
                                                                                <div className="side-list-bar-jobs custm-checkbox-filters">
                                                                                    <MultiList id="jobTypes" filterLabel="Types d’emplois" componentId="JobTypeSensor" dataField={i18n.language == "en" ? "JobTypeEN.keyword" : "JobTypeFR.keyword"}
                                                                                        showSearch={false}
                                                                                        value={this.state.selectedJobTypes}
                                                                                        onChange={(result) => {
                                                                                            this.setState({ selectedJobTypes: result })
                                                                                        }}
                                                                                        react={{
                                                                                            "and": ["SearchSensor", "Locations",
                                                                                                "IndustryfacetSensor", "SubCategoryfacetSensor", "FoodfacetSensor", "EnviromentFacetSensor",
                                                                                                "AssurancesFacetSensor", "TransportFacetSensor", "OpenSpaceFacetSensor", "GlobalQuery"]
                                                                                        }}

                                                                                        render={({
                                                                                            loading,
                                                                                            error,
                                                                                            data,
                                                                                            handleChange,
                                                                                        }) => {
                                                                                            var selectedJobTypes = this.state.selectedJobTypes;
                                                                                            return (
                                                                                                <ul>
                                                                                                    {
                                                                                                        data.map(item => (
                                                                                                            <li>
                                                                                                                <input
                                                                                                                    id={item.key}
                                                                                                                    type="checkbox"
                                                                                                                    value={item.key}
                                                                                                                    onChange={handleChange}
                                                                                                                    checked={selectedJobTypes != null && selectedJobTypes.length > 0 && selectedJobTypes.indexOf(item.key) > -1}
                                                                                                                />
                                                                                                                <label for={item.key} className="job-checkbox-title">{item.key}<span>{item.doc_count}</span></label>
                                                                                                            </li>
                                                                                                        ))
                                                                                                    }
                                                                                                </ul>
                                                                                            )
                                                                                        }} />
                                                                                </div>
                                                                            </Card.Body>
                                                                        </Accordion.Collapse>
                                                                    </Card>
                                                                </Accordion>
                                                                <Accordion defaultActiveKey="-1" id="IndustriesAccordian" onSelect={e => this.handleSelect(e, "IndustriesAccordian")}>
                                                                    <Card>
                                                                        <Accordion.Toggle as={Card.Header} eventKey="0">
                                                                            {i18n.t('Facets.ActivityFacetLabel')}
                                                                        </Accordion.Toggle>
                                                                        <Accordion.Collapse eventKey="0">
                                                                            <Card.Body>
                                                                                <div className="side-list-bar-jobs custm-checkbox-filters">
                                                                                    <MultiList filterLabel="Industries" componentId="IndustryfacetSensor" dataField={i18n.language == "en" ? "IndustryNameEN.keyword" : "IndustryNameFR.keyword"}
                                                                                        showSearch={true} showLoadMore={true} size={1000}
                                                                                        loadMoreLabel="Plus de résultats"
                                                                                        value={this.state.selectedIndustries}
                                                                                        placeholder={i18n.t('General.SearchLabel')}
                                                                                        onChange={(result) => {
                                                                                            this.setState({ selectedIndustries: result })
                                                                                        }
                                                                                        }
                                                                                        react={{
                                                                                            "and": ["SearchSensor", "Locations",
                                                                                                "JobTypeSensor", "SubCategoryfacetSensor", "FoodfacetSensor", "EnviromentFacetSensor",
                                                                                                "AssurancesFacetSensor", "TransportFacetSensor", "OpenSpaceFacetSensor", "GlobalQuery"]
                                                                                        }}
                                                                                        render={({
                                                                                            loading,
                                                                                            error,
                                                                                            data,
                                                                                            handleChange,
                                                                                        }) => {
                                                                                            var selectedIndustries = this.state.selectedIndustries;
                                                                                            return (
                                                                                                <ul>
                                                                                                    {
                                                                                                        data.map(item => (
                                                                                                            <li>
                                                                                                                <input
                                                                                                                    id={item.key}
                                                                                                                    type="checkbox"
                                                                                                                    value={item.key}
                                                                                                                    onChange={handleChange}
                                                                                                                    checked={selectedIndustries != null && selectedIndustries.length > 0 && selectedIndustries.indexOf(item.key) > -1}
                                                                                                                />
                                                                                                                <label for={item.key} className="job-checkbox-title">{item.key}<span>{item.doc_count}</span></label>
                                                                                                            </li>
                                                                                                        ))
                                                                                                    }
                                                                                                </ul>
                                                                                            )
                                                                                        }}
                                                                                    />
                                                                                </div>
                                                                            </Card.Body>
                                                                        </Accordion.Collapse>
                                                                    </Card>
                                                                </Accordion>

                                                                <Accordion defaultActiveKey="-1" id="SubCategoriesAccordian" onSelect={e => this.handleSelect(e, "SubCategoriesAccordian")}>
                                                                    <Card>
                                                                        <Accordion.Toggle as={Card.Header} eventKey="0">
                                                                            {i18n.t('Facets.SubcategoryFaceLabel')}
                                                                        </Accordion.Toggle>
                                                                        <Accordion.Collapse eventKey="0">
                                                                            <Card.Body>
                                                                                <div className="side-list-bar-jobs custm-checkbox-filters">
                                                                                    <MultiList filterLabel="Sub Cateogries" componentId="SubCategoryfacetSensor" dataField={i18n.language == "en" ? "SubCategoriesEN.keyword" : "SubCategoriesFR.keyword"}
                                                                                        showSearch={true} showLoadMore={true} size={1000}
                                                                                        loadMoreLabel="Plus de résultats"
                                                                                        value={this.state.selectedSubCategories}
                                                                                        onChange={(result) => {
                                                                                            this.setState({ selectedSubCategories: result })
                                                                                        }
                                                                                        }
                                                                                        placeholder={i18n.t('General.SearchLabel')}
                                                                                        react={{
                                                                                            "and": ["SearchSensor", "Locations",
                                                                                                "JobTypeSensor", "IndustryfacetSensor", "FoodfacetSensor", "EnviromentFacetSensor",
                                                                                                "AssurancesFacetSensor", "TransportFacetSensor", "OpenSpaceFacetSensor", "GlobalQuery"]
                                                                                        }}
                                                                                        render={({
                                                                                            loading,
                                                                                            error,
                                                                                            data,
                                                                                            handleChange,
                                                                                        }) => {
                                                                                            var selectedSubCategories = this.state.selectedSubCategories;
                                                                                            return (
                                                                                                <ul>
                                                                                                    {
                                                                                                        data.map(item => (
                                                                                                            <li>
                                                                                                                <input
                                                                                                                    id={item.key}
                                                                                                                    type="checkbox"
                                                                                                                    value={item.key}
                                                                                                                    onChange={handleChange}
                                                                                                                    checked={selectedSubCategories != null && selectedSubCategories.length > 0 && selectedSubCategories.indexOf(item.key) > -1}
                                                                                                                />
                                                                                                                <label for={item.key} className="job-checkbox-title">{item.key}<span>{item.doc_count}</span></label>
                                                                                                            </li>
                                                                                                        ))
                                                                                                    }
                                                                                                </ul>
                                                                                            )
                                                                                        }}

                                                                                    />
                                                                                </div>
                                                                            </Card.Body>
                                                                        </Accordion.Collapse>
                                                                    </Card>
                                                                </Accordion>

                                                            </div>
                                                        </Tab>
                                                        <Tab eventKey="Avantages" title={i18n.t('Facets.AvantageFacelLabel')} >
                                                            <div className="Avantages">
                                                                <Accordion defaultActiveKey="0" id="FoodDrinkAccordian" onSelect={e => this.handleSelect(e, "FoodDrinkAccordian")}>
                                                                    <Card>
                                                                        <Accordion.Toggle className="active" as={Card.Header} eventKey="0">
                                                                            {i18n.t('Facets.FoodDrinkFacet')}
                                                                        </Accordion.Toggle>
                                                                        <Accordion.Collapse eventKey="0">
                                                                            <Card.Body>
                                                                                <div className="side-list-bar-jobs">
                                                                                    <MultiList filterLabel={i18n.t('Facets.FoodDrinkFacet')} componentId="FoodfacetSensor" dataField={i18n.language == "en" ? "FoodDrinkFacetEN.keyword" : "FoodDrinkFacetFR.keyword"}
                                                                                        value={this.state.selectedFoodFacets}
                                                                                        onChange={(result) => {
                                                                                            this.setState({ selectedFoodFacets: result })
                                                                                        }
                                                                                        }
                                                                                        showSearch={false}
                                                                                        react={{
                                                                                            "and": ["SearchSensor", "Locations",
                                                                                                "JobTypeSensor", "IndustryfacetSensor", "SubCategoryfacetSensor", "EnviromentFacetSensor",
                                                                                                "AssurancesFacetSensor", "TransportFacetSensor", "OpenSpaceFacetSensor", "GlobalQuery"]
                                                                                        }} />
                                                                                </div>
                                                                            </Card.Body>
                                                                        </Accordion.Collapse>
                                                                    </Card>
                                                                </Accordion>

                                                                <Accordion defaultActiveKey="-1" id="EnviromentAccordian" onSelect={e => this.handleSelect(e, "EnviromentAccordian")}>
                                                                    <Card>
                                                                        <Accordion.Toggle as={Card.Header} eventKey="0">
                                                                            {i18n.t('Facets.EnviromentFacet')}
                                                                        </Accordion.Toggle>
                                                                        <Accordion.Collapse eventKey="0">
                                                                            <Card.Body>
                                                                                <div className="side-list-bar-jobs">
                                                                                    <MultiList filterLabel={i18n.t('Facets.EnviromentFacet')} componentId="EnviromentFacetSensor" dataField={i18n.language == "en" ? "EnviromentFacetEN.keyword" : "EnviromentFacetFR.keyword"}
                                                                                        value={this.state.selectedEnvironmentFacets}
                                                                                        onChange={(result) => {
                                                                                            this.setState({ selectedEnvironmentFacets: result })
                                                                                        }
                                                                                        }
                                                                                        react={{
                                                                                            "and": ["SearchSensor", "Locations",
                                                                                                "JobTypeSensor", "IndustryfacetSensor", "SubCategoryfacetSensor", "FoodfacetSensor",
                                                                                                "AssurancesFacetSensor", "TransportFacetSensor", "OpenSpaceFacetSensor", "GlobalQuery"]
                                                                                        }} showSearch={false} />
                                                                                </div>
                                                                            </Card.Body>
                                                                        </Accordion.Collapse>
                                                                    </Card>
                                                                </Accordion>
                                                                <Accordion defaultActiveKey="-1" id="AssurancesFacetAccordian" onSelect={e => this.handleSelect(e, "AssurancesFacetAccordian")}>
                                                                    <Card>
                                                                        <Accordion.Toggle as={Card.Header} eventKey="0">
                                                                            {i18n.t('Facets.AssurancesFacet')}
                                                                        </Accordion.Toggle>
                                                                        <Accordion.Collapse eventKey="0">
                                                                            <Card.Body>

                                                                                <div className="side-list-bar-jobs">

                                                                                    <MultiList filterLabel={i18n.t('Facets.AssurancesFacet')} componentId="AssurancesFacetSensor" dataField={i18n.language == "en" ? "AssurancesFacetEN.keyword" : "AssurancesFacetFR.keyword"}
                                                                                        value={this.state.selectedAssurancesFacets}
                                                                                        onChange={(result) => {
                                                                                            this.setState({ selectedAssurancesFacets: result })
                                                                                        }
                                                                                        }
                                                                                        react={{
                                                                                            "and": ["SearchSensor", "Locations",
                                                                                                "JobTypeSensor", "IndustryfacetSensor", "SubCategoryfacetSensor", "FoodfacetSensor",
                                                                                                "EnviromentFacetSensor", "TransportFacetSensor", "OpenSpaceFacetSensor", "GlobalQuery"]
                                                                                        }} showSearch={false} />
                                                                                </div>
                                                                            </Card.Body>
                                                                        </Accordion.Collapse>
                                                                    </Card>
                                                                </Accordion>

                                                                <Accordion defaultActiveKey="-1" id="TransportFacetAccordian" onSelect={e => this.handleSelect(e, "TransportFacetAccordian")}>
                                                                    <Card>
                                                                        <Accordion.Toggle as={Card.Header} eventKey="0">
                                                                            {i18n.t('Facets.TransportFacet')}
                                                                        </Accordion.Toggle>
                                                                        <Accordion.Collapse eventKey="0">
                                                                            <Card.Body>
                                                                                <div className="side-list-bar-jobs">
                                                                                    <MultiList filterLabel={i18n.t('Facets.TransportFacet')} componentId="TransportFacetSensor" dataField={i18n.language == "en" ? "TransportFacetEN.keyword" : "TransportFacetFR.keyword"}
                                                                                        value={this.state.selectedTransportFacets}
                                                                                        onChange={(result) => {
                                                                                            this.setState({ selectedTransportFacets: result })
                                                                                        }
                                                                                        }
                                                                                        react={{
                                                                                            "and": ["SearchSensor", "Locations",
                                                                                                "JobTypeSensor", "IndustryfacetSensor", "SubCategoryfacetSensor", "FoodfacetSensor",
                                                                                                "EnviromentFacetSensor", "AssurancesFacetSensor", "OpenSpaceFacetSensor", "GlobalQuery"]
                                                                                        }} showSearch={false} />
                                                                                </div>
                                                                            </Card.Body>
                                                                        </Accordion.Collapse>
                                                                    </Card>
                                                                </Accordion>


                                                                <Accordion defaultActiveKey="-1" id="OpenSpaceFacetAccordian" onSelect={e => this.handleSelect(e, "OpenSpaceFacetAccordian")}>
                                                                    <Card>
                                                                        <Accordion.Toggle as={Card.Header} eventKey="0">
                                                                            {i18n.t('Facets.OpenSpaceFacet')}
                                                                        </Accordion.Toggle>
                                                                        <Accordion.Collapse eventKey="0">
                                                                            <Card.Body>
                                                                                <div className="side-list-bar-jobs">
                                                                                    <MultiList filterLabel={i18n.t('Facets.OpenSpaceFacet')} componentId="OpenSpaceFacetSensor" dataField={i18n.language == "en" ? "OpenSpaceEN.keyword" : "OpenSpaceFR.keyword"}
                                                                                        value={this.state.selectedOpenSpaceFacets}
                                                                                        onChange={(result) => {
                                                                                            this.setState({ selectedOpenSpaceFacets: result })
                                                                                        }
                                                                                        }

                                                                                        react={{
                                                                                            "and": ["SearchSensor", "Locations",
                                                                                                "JobTypeSensor", "IndustryfacetSensor", "SubCategoryfacetSensor", "FoodfacetSensor",
                                                                                                "EnviromentFacetSensor", "AssurancesFacetSensor", "TransportFacetSensor", "GlobalQuery"]
                                                                                        }} showSearch={false}
                                                                                    />
                                                                                </div>
                                                                            </Card.Body>
                                                                        </Accordion.Collapse>
                                                                    </Card>
                                                                </Accordion>
                                                            </div>
                                                        </Tab>
                                                    </Tabs>




                                                </div>
                                                <button className="filter-mob-btn" onClick={() => this.toggleFilter()}>Filter</button>
                                            </div>

                                            {
                                                this.state.isFilterOpened &&
                                                <div className={this.state.isFilterOpened ? "mobile-filters fixed-filter mob-fil" : "mob-fil fixed-filter col-sm-4"}>
                                                    <div className="pop-actionss">
                                                        <h3>Filtrer par:</h3>
                                                        <button className="close-mob-btn" onClick={() => this.toggleFilter()}><i className="fa fa-times"></i></button>
                                                    </div>
                                                    <Tabs transition={false} id="facetstab" onSelect={(k) => this.setKeyFacetsTabs(k)} activeKey={this.state.selectedTabKeyFacets}>
                                                        <Tab eventKey="general" title={i18n.t('Facets.GeneralFacelLabel')}>
                                                            <div className="general">
                                                                <Accordion id="locationAccordianMob" defaultActiveKey="0" onSelect={e => this.handleSelect(e, "locationAccordianMob")}>
                                                                    <Card>
                                                                        <Accordion.Toggle className="active" as={Card.Header} eventKey="0">
                                                                            {i18n.t('Facets.LocationFacetLabel')}
                                                                        </Accordion.Toggle>
                                                                        <Accordion.Collapse eventKey="0">
                                                                            <Card.Body>
                                                                                <div className="side-list-bar-jobs  custm-checkbox-filters">
                                                                                    <MultiList filterLabel="Locations" componentId="LocationsMob" dataField="Locations.keyword"
                                                                                        react={{
                                                                                            "and": ["SearchSensor", "JobTypeSensorMob",
                                                                                                "IndustryfacetSensorMob", "SubCategoryfacetSensorMob", "FoodfacetSensorMob", "EnviromentFacetSensorMob",
                                                                                                "AssurancesFacetSensorMob", "TransportFacetSensorMob", "OpenSpaceFacetSensorMob", "GlobalQuery"]
                                                                                        }}
                                                                                        size={1000}
                                                                                        value={this.state.selectedLocations}
                                                                                        onChange={(result) => {
                                                                                            this.setState({ selectedLocations: result })
                                                                                        }
                                                                                        }
                                                                                        render={({
                                                                                            loading,
                                                                                            error,
                                                                                            data,
                                                                                            handleChange,
                                                                                        }) => {
                                                                                            var selectedLocations = this.state.selectedLocations;
                                                                                            return (
                                                                                                <ul>
                                                                                                    {
                                                                                                        data.map(item => (
                                                                                                            <li>
                                                                                                                <input
                                                                                                                    id={item.key}
                                                                                                                    type="checkbox"
                                                                                                                    value={item.key}
                                                                                                                    onChange={handleChange}
                                                                                                                    checked={selectedLocations != null && selectedLocations.length > 0 && selectedLocations.indexOf(item.key) > -1}
                                                                                                                />
                                                                                                                <label for={item.key} className="job-checkbox-title">{item.key}<span>{item.doc_count}</span></label>
                                                                                                            </li>
                                                                                                        ))
                                                                                                    }
                                                                                                </ul>
                                                                                            )
                                                                                        }}
                                                                                    />
                                                                                </div>
                                                                            </Card.Body>
                                                                        </Accordion.Collapse>
                                                                    </Card>
                                                                </Accordion>
                                                                <Accordion defaultActiveKey="0" id="jobTypeAccordianMob" onSelect={e => this.handleSelect(e, "jobTypeAccordianMob")}>
                                                                    <Card>
                                                                        <Accordion.Toggle className="active" as={Card.Header} eventKey="0">
                                                                            {i18n.t('Facets.JobTypeFacetLabel')}
                                                                        </Accordion.Toggle>
                                                                        <Accordion.Collapse eventKey="0">
                                                                            <Card.Body>
                                                                                <div className="side-list-bar-jobs  custm-checkbox-filters">
                                                                                    <MultiList filterLabel=" Types d’emplois" componentId="JobTypeSensorMob" dataField={i18n.language == "en" ? "JobTypeEN.keyword" : "JobTypeFR.keyword"}
                                                                                        showSearch={false}
                                                                                        value={this.state.selectedJobTypes}
                                                                                        onChange={(result) => {
                                                                                            this.setState({ selectedJobTypes: result })
                                                                                        }}
                                                                                        react={{
                                                                                            "and": ["SearchSensor", "LocationsMob",
                                                                                                "IndustryfacetSensorMob", "SubCategoryfacetSensorMob", "FoodfacetSensorMob", "EnviromentFacetSensorMob",
                                                                                                "AssurancesFacetSensorMob", "TransportFacetSensorMob", "OpenSpaceFacetSensorMob", "GlobalQuery"]
                                                                                        }}
                                                                                        size={1000}
                                                                                        render={({
                                                                                            loading,
                                                                                            error,
                                                                                            data,
                                                                                            handleChange,
                                                                                        }) => {
                                                                                            var selectedJobTypes = this.state.selectedJobTypes;
                                                                                            return (
                                                                                                <ul>
                                                                                                    {
                                                                                                        data.map(item => (
                                                                                                            <li>
                                                                                                                <input
                                                                                                                    id={item.key}
                                                                                                                    type="checkbox"
                                                                                                                    value={item.key}
                                                                                                                    onChange={handleChange}
                                                                                                                    checked={selectedJobTypes != null && selectedJobTypes.length > 0 && selectedJobTypes.indexOf(item.key) > -1}
                                                                                                                />
                                                                                                                <label for={item.key} className="job-checkbox-title">{item.key}<span>{item.doc_count}</span></label>
                                                                                                            </li>
                                                                                                        ))
                                                                                                    }
                                                                                                </ul>
                                                                                            )
                                                                                        }}

                                                                                    />
                                                                                </div>
                                                                            </Card.Body>
                                                                        </Accordion.Collapse>
                                                                    </Card>
                                                                </Accordion>
                                                                {/* <Accordion defaultActiveKey="0">
    <Card>
        <Accordion.Toggle as={Card.Header} eventKey="0">
            Salary Range
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="0">
            <Card.Body>
                <div className="side-list-bar-jobs">
                    <MultiRange
                        title="MultiRange"
                        componentId="SalaryRangeSensor"
                        dataField="SalaryMin"
                        data={[
                            { start: 0, end: 3, label: 'Rating < 3' },
                            { start: 3, end: 4, label: 'Rating 3 to 4' },
                            { start: 4, end: 5, label: 'Rating > 4' },
                        ]}
                    />
                </div>
            </Card.Body>
        </Accordion.Collapse>
    </Card>
</Accordion> */}
                                                                <Accordion defaultActiveKey="-1" id="IndustriesAccordianMob" onSelect={e => this.handleSelect(e, "IndustriesAccordianMob")}>
                                                                    <Card>
                                                                        <Accordion.Toggle as={Card.Header} eventKey="0">
                                                                            {i18n.t('Facets.ActivityFacetLabel')}
                                                                        </Accordion.Toggle>
                                                                        <Accordion.Collapse eventKey="0">
                                                                            <Card.Body>
                                                                                <div className="side-list-bar-jobs  custm-checkbox-filters">
                                                                                    <MultiList filterLabel="Industries" componentId="IndustryfacetSensorMob" dataField={i18n.language == "en" ? "IndustryNameEN.keyword" : "IndustryNameFR.keyword"}
                                                                                        showSearch={true} showLoadMore={true} size={5}
                                                                                        loadMoreLabel="Plus de résultats"
                                                                                        value={this.state.selectedIndustries}
                                                                                        onChange={(result) => {
                                                                                            this.setState({ selectedIndustries: result })
                                                                                        }
                                                                                        }
                                                                                        react={{
                                                                                            "and": ["SearchSensor", "LocationsMob",
                                                                                                "JobTypeSensorMob", "SubCategoryfacetSensorMob", "FoodfacetSensorMob", "EnviromentFacetSensorMob",
                                                                                                "AssurancesFacetSensorMob", "TransportFacetSensorMob", "OpenSpaceFacetSensorMob", "GlobalQuery"]
                                                                                        }}
                                                                                        size={1000}
                                                                                        render={({
                                                                                            loading,
                                                                                            error,
                                                                                            data,
                                                                                            handleChange,
                                                                                        }) => {
                                                                                            var selectedIndustries = this.state.selectedIndustries;
                                                                                            return (
                                                                                                <ul>
                                                                                                    {
                                                                                                        data.map(item => (
                                                                                                            <li>
                                                                                                                <input
                                                                                                                    id={item.key}
                                                                                                                    type="checkbox"
                                                                                                                    value={item.key}
                                                                                                                    onChange={handleChange}
                                                                                                                    checked={selectedIndustries != null && selectedIndustries.length > 0 && selectedIndustries.indexOf(item.key) > -1}
                                                                                                                />
                                                                                                                <label for={item.key} className="job-checkbox-title">{item.key}<span>{item.doc_count}</span></label>
                                                                                                            </li>
                                                                                                        ))
                                                                                                    }
                                                                                                </ul>
                                                                                            )
                                                                                        }}
                                                                                    />
                                                                                </div>
                                                                            </Card.Body>
                                                                        </Accordion.Collapse>
                                                                    </Card>
                                                                </Accordion>

                                                                <Accordion defaultActiveKey="-1" id="SubCategoriesAccordianMob" onSelect={e => this.handleSelect(e, "SubCategoriesAccordianMob")}>
                                                                    <Card>
                                                                        <Accordion.Toggle as={Card.Header} eventKey="0">
                                                                            {i18n.t('Facets.SubcategoryFaceLabel')}
                                                                        </Accordion.Toggle>
                                                                        <Accordion.Collapse eventKey="0">
                                                                            <Card.Body>
                                                                                <div className="side-list-bar-jobs  custm-checkbox-filters">
                                                                                    <MultiList filterLabel="Sub-Catégories" componentId="SubCategoryfacetSensorMob" dataField={i18n.language == "en" ? "SubCategoriesEN.keyword" : "SubCategoriesFR.keyword"}
                                                                                        showSearch={true} showLoadMore={true} size={5}
                                                                                        loadMoreLabel="Plus de résultats"
                                                                                        react={{
                                                                                            "and": ["SearchSensor", "LocationsMob",
                                                                                                "JobTypeSensorMob", "IndustryfacetSensorMob", "FoodfacetSensorMob", "EnviromentFacetSensorMob",
                                                                                                "AssurancesFacetSensorMob", "TransportFacetSensorMob", "OpenSpaceFacetSensorMob", "GlobalQuery"]
                                                                                        }}
                                                                                        size={1000}
                                                                                        render={({
                                                                                            loading,
                                                                                            error,
                                                                                            data,
                                                                                            handleChange,
                                                                                        }) => {
                                                                                            var selectedSubcategories = this.state.selectedSubCategories;
                                                                                            return (
                                                                                                <ul>
                                                                                                    {
                                                                                                        data.map(item => (
                                                                                                            <li>
                                                                                                                <input
                                                                                                                    id={item.key}
                                                                                                                    type="checkbox"
                                                                                                                    value={item.key}
                                                                                                                    onChange={handleChange}
                                                                                                                    checked={selectedSubcategories != null && selectedSubcategories.length > 0 && selectedSubcategories.indexOf(item.key) > -1}
                                                                                                                />
                                                                                                                <label for={item.key} className="job-checkbox-title">{item.key}<span>{item.doc_count}</span></label>
                                                                                                            </li>
                                                                                                        ))
                                                                                                    }
                                                                                                </ul>
                                                                                            )
                                                                                        }}
                                                                                    />
                                                                                </div>
                                                                            </Card.Body>
                                                                        </Accordion.Collapse>
                                                                    </Card>
                                                                </Accordion>
                                                            </div>
                                                        </Tab>
                                                        <Tab eventKey="Avantages" title="Avantages" >
                                                            <div className="Avantages">
                                                                <Accordion defaultActiveKey="-1" id="FoodDrinkAccordianMob" onSelect={e => this.handleSelect(e, "FoodDrinkAccordianMob")}>
                                                                    <Card>
                                                                        <Accordion.Toggle as={Card.Header} eventKey="0">
                                                                            {i18n.t('Facets.FoodDrinkFacet')}
                                                                        </Accordion.Toggle>
                                                                        <Accordion.Collapse eventKey="0">
                                                                            <Card.Body>
                                                                                <div className="side-list-bar-jobs">
                                                                                    <MultiList filterLabel={i18n.t('Facets.FoodDrinkFacet')} componentId="FoodfacetSensorMob" dataField={i18n.language == "en" ? "FoodDrinkFacetEN.keyword" : "FoodDrinkFacetFR.keyword"}
                                                                                        showSearch={false}
                                                                                        react={{
                                                                                            "and": ["SearchSensor", "LocationsMob",
                                                                                                "JobTypeSensorMob", "IndustryfacetSensorMob", "SubCategoryfacetSensorMob", "EnviromentFacetSensorMob",
                                                                                                "AssurancesFacetSensorMob", "TransportFacetSensorMob", "OpenSpaceFacetSensorMob", "GlobalQuery"]
                                                                                        }} />
                                                                                </div>
                                                                            </Card.Body>
                                                                        </Accordion.Collapse>
                                                                    </Card>
                                                                </Accordion>

                                                                <Accordion defaultActiveKey="-1" id="EnviromentAccordianMob" onSelect={e => this.handleSelect(e, "EnviromentAccordianMob")}>
                                                                    <Card>
                                                                        <Accordion.Toggle as={Card.Header} eventKey="0">
                                                                            {i18n.t('Facets.EnviromentFacet')}
                                                                        </Accordion.Toggle>
                                                                        <Accordion.Collapse eventKey="0">
                                                                            <Card.Body>
                                                                                <div className="side-list-bar-jobs">
                                                                                    <MultiList filterLabel={i18n.t('Facets.EnviromentFacet')} componentId="EnviromentFacetSensorMob" dataField={i18n.language == "en" ? "EnviromentFacetEN.keyword" : "EnviromentFacetFR.keyword"}
                                                                                        react={{
                                                                                            "and": ["SearchSensor", "LocationsMob",
                                                                                                "JobTypeSensorMob", "IndustryfacetSensorMob", "SubCategoryfacetSensorMob", "FoodfacetSensorMob",
                                                                                                "AssurancesFacetSensorMob", "TransportFacetSensorMob", "OpenSpaceFacetSensorMob", "GlobalQuery"]
                                                                                        }} showSearch={false} />
                                                                                </div>
                                                                            </Card.Body>
                                                                        </Accordion.Collapse>
                                                                    </Card>
                                                                </Accordion>
                                                                <Accordion defaultActiveKey="-1" id="AssurancesFacetAccordianMob" onSelect={e => this.handleSelect(e, "AssurancesFacetAccordianMob")}>
                                                                    <Card>
                                                                        <Accordion.Toggle as={Card.Header} eventKey="0">
                                                                            {i18n.t('Facets.AssurancesFacet')}
                                                                        </Accordion.Toggle>
                                                                        <Accordion.Collapse eventKey="0">
                                                                            <Card.Body>

                                                                                <div className="side-list-bar-jobs">

                                                                                    <MultiList filterLabel={i18n.t('Facets.AssurancesFacet')} componentId="AssurancesFacetSensorMob" dataField={i18n.language == "en" ? "AssurancesFacetEN.keyword" : "AssurancesFacetFR.keyword"}
                                                                                        react={{
                                                                                            "and": ["SearchSensor", "LocationsMob",
                                                                                                "JobTypeSensorMob", "IndustryfacetSensorMob", "SubCategoryfacetSensorMob", "FoodfacetSensorMob",
                                                                                                "EnviromentFacetSensorMob", "TransportFacetSensorMob", "OpenSpaceFacetSensorMob", "GlobalQuery"]
                                                                                        }} showSearch={false} />
                                                                                </div>
                                                                            </Card.Body>
                                                                        </Accordion.Collapse>
                                                                    </Card>
                                                                </Accordion>

                                                                <Accordion defaultActiveKey="-1" id="TransportFacetAccordianMob" onSelect={e => this.handleSelect(e, "TransportFacetAccordianMob")}>
                                                                    <Card>
                                                                        <Accordion.Toggle as={Card.Header} eventKey="0">
                                                                            {i18n.t('Facets.TransportFacet')}
                                                                        </Accordion.Toggle>
                                                                        <Accordion.Collapse eventKey="0">
                                                                            <Card.Body>
                                                                                <div className="side-list-bar-jobs">
                                                                                    <MultiList filterLabel={i18n.t('Facets.TransportFacet')} componentId="TransportFacetSensorMob" dataField={i18n.language == "en" ? "TransportFacetEN.keyword" : "TransportFacetFR.keyword"}
                                                                                        react={{
                                                                                            "and": ["SearchSensor", "LocationsMob",
                                                                                                "JobTypeSensorMob", "IndustryfacetSensorMob", "SubCategoryfacetSensorMob", "FoodfacetSensorMob",
                                                                                                "EnviromentFacetSensorMob", "AssurancesFacetSensorMob", "OpenSpaceFacetSensorMob", "GlobalQuery"]
                                                                                        }} showSearch={false} />
                                                                                </div>
                                                                            </Card.Body>
                                                                        </Accordion.Collapse>
                                                                    </Card>
                                                                </Accordion>


                                                                <Accordion defaultActiveKey="-1" id="OpenSpaceFacetAccordianMob" onSelect={e => this.handleSelect(e, "OpenSpaceFacetAccordianMob")}>
                                                                    <Card>
                                                                        <Accordion.Toggle as={Card.Header} eventKey="0">
                                                                            {i18n.t('Facets.OpenSpaceFacet')}
                                                                        </Accordion.Toggle>
                                                                        <Accordion.Collapse eventKey="0">
                                                                            <Card.Body>
                                                                                <div className="side-list-bar-jobs">
                                                                                    <MultiList filterLabel={i18n.t('Facets.OpenSpaceFacet')} componentId="OpenSpaceFacetSensorMob" dataField={i18n.language == "en" ? "OpenSpaceEN.keyword" : "OpenSpaceFR.keyword"}
                                                                                        react={{
                                                                                            "and": ["SearchSensor", "LocationsMob",
                                                                                                "JobTypeSensorMob", "IndustryfacetSensorMob", "SubCategoryfacetSensorMob", "FoodfacetSensorMob",
                                                                                                "EnviromentFacetSensorMob", "AssurancesFacetSensorMob", "TransportFacetSensorMob", "GlobalQuery"]
                                                                                        }} showSearch={false}
                                                                                    />
                                                                                </div>
                                                                            </Card.Body>
                                                                        </Accordion.Collapse>
                                                                    </Card>
                                                                </Accordion>
                                                            </div>
                                                        </Tab>
                                                    </Tabs>

                                                </div>
                                            }
                                            <div className="col-sm-8 job-list-sidebr">
                                                <SelectedFilters showClearAll={false} />
                                                <DataSearch showVoiceSearch={true} componentId="SearchSensor" dataField={i18n.language == "en" ?
                                                    ['JobNumber', 'JobNumber.search', 'TitleEN', 'TitleEN.search', 'TitleEN.keyword',
                                                        'CompanyName', 'CompanyName.search',
                                                        'IndustryNameEN', 'IndustryNameEN.keyword', 'IndustryNameEN.search',
                                                        'Locations', 'Locations.keyword', 'Locations.search',
                                                        'JobDescriptionEN', 'JobDescriptionEN.search', 'JobDescriptionEN.keyword',
                                                        'JobTypeEN', 'JobTypeEN.keyword', 'JobTypeEN.search', "GlobalQuery"
                                                    ] :
                                                    ['JobNumber', 'JobNumber.search', 'TitleFR', 'TitleFR.search', 'TitleFR.keyword',
                                                        'CompanyName', 'CompanyName.search',
                                                        'IndustryNameFR', 'IndustryNameFR.keyword', 'IndustryNameFR.search',
                                                        'Locations', 'Locations.keyword', 'Locations.search',
                                                        'JobDescriptionFR', 'JobDescriptionFR.search', 'JobDescriptionFR.keyword',
                                                        'JobTypeFR', 'JobTypeFR.keyword', 'JobTypeFR.search', "GlobalQuery"
                                                    ]}
                                                    showClear={true}
                                                    placeholder={i18n.t('General.SearchLabel')}
                                                    showFilter={false}
                                                    value={this.state.searchTerm}
                                                    onChange={(value, triggerQuery, event, data) => {
                                                        this.setState({ searchTerm: value });
                                                        setTimeout(() => {
                                                            triggerQuery();
                                                        }, 3000);
                                                    }}
                                                    // // // debounce="100"
                                                    // onKeyPress={(value, triggerQuery, event) => {
                                                    //     debugger;
                                                    //     var searchText = this.state.searchTerm;
                                                    //     if (!event) {
                                                    //         this.setState({ searchTerm: searchText + value.key });
                                                    //     }
                                                    //     if (value.which == 13) {
                                                    //         triggerQuery();
                                                    //     }
                                                    // }}
                                                    parseSuggestion={(suggestion) => ({

                                                        label: (
                                                            <Fragment>
                                                                {
                                                                    i18n.language == "en" && suggestion.source.TitleEN.includes(suggestion.value) && suggestion.source.TitleEN
                                                                }
                                                                {
                                                                    i18n.language != "en" && suggestion.source.TitleFR.includes(suggestion.value) &&
                                                                    suggestion.source.TitleFR
                                                                }
                                                                {
                                                                    i18n.language == "en" && suggestion.source.IndustryNameEN.includes(suggestion.value) && suggestion.source.IndustryNameEN
                                                                }
                                                                {
                                                                    i18n.language != "en" && suggestion.source.IndustryNameFR.includes(suggestion.value) &&
                                                                    suggestion.source.IndustryNameFR
                                                                }
                                                                {
                                                                    suggestion.source.Locations && suggestion.source.Locations.length > 0 && suggestion.source.Locations.indexOf(suggestion.value) > -1 &&
                                                                    this.intersperse(suggestion.source.Locations, ", ")
                                                                }
                                                                {
                                                                    i18n.language == "en" && suggestion.source.JobTypeEN && suggestion.source.JobTypeEN.length > 0 && suggestion.source.JobTypeEN.indexOf(suggestion.value) > -1 &&
                                                                    this.intersperse(suggestion.source.JobTypeEN, ", ")
                                                                }
                                                                {
                                                                    i18n.language != "en" && suggestion.source.JobTypeFR && suggestion.source.JobTypeFR.length > 0 && suggestion.source.JobTypeFR.indexOf(suggestion.value) > -1 &&
                                                                    this.intersperse(suggestion.source.JobTypeFR, ", ")
                                                                }

                                                                {/* {i18n.language == "en" ? this.intersperse(suggestion.source.JobTypeEN, ", ") : this.intersperse(suggestion.source.JobTypeFR, ", ")} */}
                                                            </Fragment>
                                                        ),
                                                        source: suggestion.source,
                                                        value: (i18n.language == "en" ? suggestion.source.TitleEN : suggestion.source.TitleFR)
                                                    })}


                                                />
                                                <div className="job-list-tabs">

                                                    <Tabs transition={false} id="noanim-tab-example" onSelect={(k) => this.setKey(k)} activeKey={this.state.selectedTabKey}>
                                                        <Tab eventKey="alljobs" title={i18n.t('General.PositionsTabLabel')}>
                                                            <div className="container">
                                                                <div className="row">
                                                                    <div className="col-sm-12" style={{ marginTop: '50px' }} >
                                                                        <ReactiveList
                                                                            componentId="result"
                                                                            dataField="_score"
                                                                            scrollOnChange={false}
                                                                            showResultStats={true}
                                                                            renderResultStats={
                                                                                function (stats) {
                                                                                    return (
                                                                                        `${stats.numberOfResults} ${i18n.t('General.ResultFoundInLabel')} ${stats.time}ms`
                                                                                    )
                                                                                }
                                                                            }
                                                                            react={{
                                                                                "and": ["Locations", "SearchSensor", "FoodfacetSensor",
                                                                                    "EnviromentFacetSensor", "AssurancesFacetSensor", "TransportFacetSensor", "OpenSpaceFacetSensor", "JobTypeSensor",
                                                                                    "IndustryfacetSensor", "SubCategoryfacetSensor", "GlobalQuery"]
                                                                            }}
                                                                            renderItem={(job) => {
                                                                                return (this.renderJob(job))
                                                                            }}
                                                                            size={10}
                                                                            pagination={true}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </Tab>
                                                        <Tab eventKey="jobstories" title="Job Stories" >
                                                            <div className="Story-job-outer">
                                                                <ReactiveList
                                                                    className="Story-job-outer-in"
                                                                    componentId="resultStories"
                                                                    dataField="_score"
                                                                    scrollOnChange={false}
                                                                    react={{
                                                                        "and": ["Locations", "SearchSensor", "FoodfacetSensor",
                                                                            "EnviromentFacetSensor", "AssurancesFacetSensor", "TransportFacetSensor", "OpenSpaceFacetSensor", "JobTypeSensor",
                                                                            "IndustryfacetSensor", "SubCategoryfacetSensor", "GlobalQuery", "JobStoriesQuery"]
                                                                    }}

                                                                    onData={(data) => this.setData(data)
                                                                    }
                                                                    renderItem={(job) => {
                                                                        const jobDetailUrl = "/" + job.CompanyName + "/job-detail/" + job.JobPostingId
                                                                        const title = i18n.language == "en" ? job.TitleEN : job.TitleFR;
                                                                        const industry = i18n.language == "en" ? job.IndustryNameEN : job.IndustryNameFR;
                                                                        const description = i18n.language == "en" ? job.JobDescriptionEN.substr(0, 250) : job.JobDescriptionFR.substr(0, 250);
                                                                        const jobTypes = i18n.language == "en" ? job.JobTypeEN : job.JobTypeFR;
                                                                        // Change to update the UI
                                                                        return (
                                                                            <Fragment key={job.JobPostingId}>
                                                                                {
                                                                                    <div className="inner-story-item"  >
                                                                                        <div className="thumb-img-job" >
                                                                                            <img className="Job_thumb" src={!!job.Thumbnail ? job.Thumbnail : 'https://opsoestorage.blob.core.windows.net/companybackground-stg/default_thumbnail.PNG'} />
                                                                                            <span className="video-icon-hover" onClick={() => this.openJobVideoModal(job.VideoLink, true, job)}><i className="careerfy-icon careerfy-play-button"></i></span>

                                                                                            {
                                                                                                jobTypes != null && jobTypes.length > 0 &&
                                                                                                <p className="job_type_p" onClick={() => this.setSelectedJobTypes(jobTypes[0])}>{jobTypes[0]}</p>
                                                                                                // jobTypes.map((type, index) => {

                                                                                                //     return ()
                                                                                                // })
                                                                                            }
                                                                                            {/* <p className="job_type_p">{this.intersperse(jobTypes, ", ")}</p> */}
                                                                                            {(!!job.WorkExperienceMin || !!job.WorkexperienceMax) &&
                                                                                                <p className="job_type_bn">Experience {job.WorkExperienceMin}-{job.WorkexperienceMax} ans</p>
                                                                                            }
                                                                                        </div>
                                                                                        <div className="content-job-item">
                                                                                            <div className="img_title-job">
                                                                                                <span className="logo-job-ty"><img src={job.CompanyLogoUrl} /></span>
                                                                                                <div className="titl-des-jobb">
                                                                                                    <h3>{title}</h3>
                                                                                                    <p className="desp-job">
                                                                                                        <div className="textWidget " dangerouslySetInnerHTML={{ __html: description }} />
                                                                                                        <a href={jobDetailUrl} className="job-story-link">voir plus</a>
                                                                                                    </p>
                                                                                                </div>
                                                                                            </div>

                                                                                            <ul className="job_Cat_loc">
                                                                                                <li onClick={() => this.setSelectedIndustries(industry)}><i className="careerfy-icon careerfy-filter-tool-black-shape"></i> {industry}</li>
                                                                                                <li><i className="careerfy-icon careerfy-maps-and-flags"></i> <span>
                                                                                                    {
                                                                                                        job.Locations != null && job.Locations.length > 0 &&
                                                                                                        job.Locations.map((loc, index) => {

                                                                                                            return (<span onClick={() => this.setSelectedLocations(loc)}>{loc} &nbsp;</span>)
                                                                                                        })
                                                                                                    }</span></li>
                                                                                            </ul>

                                                                                        </div>
                                                                                    </div>
                                                                                }


                                                                            </Fragment>)
                                                                    }}
                                                                    size={6}
                                                                    pagination={true}
                                                                    renderResultStats={
                                                                        function (stats) {
                                                                            return (
                                                                                `${stats.numberOfResults} résultats trouvés en ${stats.time}ms`
                                                                            )
                                                                        }
                                                                    }
                                                                />
                                                            </div>
                                                        </Tab>
                                                        {
                                                            this.state.localFavJobIds.length > 0 &&
                                                            <Tab eventKey="favJobs" title="Likes">

                                                                <div className="container">
                                                                    <div className="row">
                                                                        <div className="col-sm-12" style={{ marginTop: '50px' }} >
                                                                            {
                                                                                this.state.localFavJobIds.map((job, index) => {
                                                                                    return (this.renderJob(job));
                                                                                })
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </Tab>
                                                        }
                                                    </Tabs>
                                                </div>


                                            </div>
                                        </div>


                                    </ReactiveBase>

                                }

                                {

                                    !this.state.latitude && !this.state.longitude &&
                                    <ReactiveBase
                                        app="jobs"
                                        credentials="LqovKbCGD:35e56a57-a426-4b1d-827c-8cb45cd12772"
                                        enableAppbase
                                        url="https://arc-cluster-spincvalpha-ne22bm.searchbase.io"
                                    >
                                        {
                                            <ReactiveComponent
                                                className="GlobalFilter"
                                                componentId="GlobalQuery"
                                                value={""}
                                                customQuery={props => this.customQuery(companyId, props)}

                                            />
                                        }

                                        <ReactiveComponent
                                            className="GlobalFilter"
                                            componentId="JobStoriesQuery"
                                            value={""}
                                            customQuery={() => this.fetchJobStoriesQuery()}
                                        />
                                        <div className="row">
                                            <div className="col-sm-4 fixed-filter">
                                                <div className="desktop-filters">
                                                    <div className="tab-facets-title">
                                                        <h2>Filtrer par:</h2>
                                                    </div>
                                                    <Tabs transition={false} id="facetstab" onSelect={(k) => this.setKeyFacetsTabs(k)} activeKey={this.state.selectedTabKeyFacets}>
                                                        <Tab eventKey="general" title={i18n.t('Facets.GeneralFacelLabel')}>
                                                            <div className="general">
                                                                <Accordion id="locationAccordian" defaultActiveKey="0" onSelect={e => this.handleSelect(e, "locationAccordian")}>
                                                                    <Card>
                                                                        <Accordion.Toggle className="active" as={Card.Header} eventKey="0">
                                                                            {i18n.t('Facets.LocationFacetLabel')}
                                                                        </Accordion.Toggle>
                                                                        <Accordion.Collapse eventKey="0">
                                                                            <Card.Body>
                                                                                <div className="side-list-bar-jobs custm-checkbox-filters">
                                                                                    <MultiList filterLabel="Locations" componentId="Locations" dataField="Locations.keyword"
                                                                                        react={{
                                                                                            "and": ["SearchSensor", "JobTypeSensor",
                                                                                                "IndustryfacetSensor", "SubCategoryfacetSensor", "FoodfacetSensor", "EnviromentFacetSensor",
                                                                                                "AssurancesFacetSensor", "TransportFacetSensor", "OpenSpaceFacetSensor", "GlobalQuery"]
                                                                                        }}
                                                                                        value={this.state.selectedLocations}
                                                                                        showLoadMore={true} size={1000}
                                                                                        loadMoreLabel="Plus de résultats"
                                                                                        placeholder={i18n.t('General.SearchLabel')}
                                                                                        onChange={(result) => {
                                                                                            this.setState({ selectedLocations: result })
                                                                                        }

                                                                                        }
                                                                                        render={({
                                                                                            loading,
                                                                                            error,
                                                                                            data,
                                                                                            handleChange,
                                                                                        }) => {
                                                                                            var selectedLocations = this.state.selectedLocations;
                                                                                            return (
                                                                                                <ul>
                                                                                                    {
                                                                                                        data.map(item => (
                                                                                                            <li>
                                                                                                                <input
                                                                                                                    id={item.key}
                                                                                                                    type="checkbox"
                                                                                                                    value={item.key}
                                                                                                                    onChange={handleChange}
                                                                                                                    checked={selectedLocations != null && selectedLocations.length > 0 && selectedLocations.indexOf(item.key) > -1}
                                                                                                                />
                                                                                                                <label for={item.key} className="job-checkbox-title">{item.key}<span>{item.doc_count}</span></label>
                                                                                                            </li>
                                                                                                        ))
                                                                                                    }
                                                                                                </ul>
                                                                                            )
                                                                                        }}

                                                                                    />
                                                                                </div>
                                                                            </Card.Body>
                                                                        </Accordion.Collapse>
                                                                    </Card>
                                                                </Accordion>
                                                                <Accordion defaultActiveKey="-1" id="jobTypeAccordian" onSelect={e => this.handleSelect(e, "jobTypeAccordian")}>
                                                                    <Card>
                                                                        <Accordion.Toggle as={Card.Header} eventKey="0">
                                                                            {i18n.t('Facets.JobTypeFacetLabel')}
                                                                        </Accordion.Toggle>
                                                                        <Accordion.Collapse eventKey="0">
                                                                            <Card.Body>
                                                                                <div className="side-list-bar-jobs custm-checkbox-filters">
                                                                                    <MultiList id="jobTypes" filterLabel="Types d’emplois" componentId="JobTypeSensor" dataField={i18n.language == "en" ? "JobTypeEN.keyword" : "JobTypeFR.keyword"}
                                                                                        showSearch={false}
                                                                                        value={this.state.selectedJobTypes}
                                                                                        onChange={(result) => {
                                                                                            this.setState({ selectedJobTypes: result })
                                                                                        }}
                                                                                        react={{
                                                                                            "and": ["SearchSensor", "Locations",
                                                                                                "IndustryfacetSensor", "SubCategoryfacetSensor", "FoodfacetSensor", "EnviromentFacetSensor",
                                                                                                "AssurancesFacetSensor", "TransportFacetSensor", "OpenSpaceFacetSensor", "GlobalQuery"]
                                                                                        }}

                                                                                        render={({
                                                                                            loading,
                                                                                            error,
                                                                                            data,
                                                                                            handleChange,
                                                                                        }) => {
                                                                                            var selectedJobTypes = this.state.selectedJobTypes;
                                                                                            return (
                                                                                                <ul>
                                                                                                    {
                                                                                                        data.map(item => (
                                                                                                            <li>
                                                                                                                <input
                                                                                                                    id={item.key}
                                                                                                                    type="checkbox"
                                                                                                                    value={item.key}
                                                                                                                    onChange={handleChange}
                                                                                                                    checked={selectedJobTypes != null && selectedJobTypes.length > 0 && selectedJobTypes.indexOf(item.key) > -1}
                                                                                                                />
                                                                                                                <label for={item.key} className="job-checkbox-title">{item.key}<span>{item.doc_count}</span></label>
                                                                                                            </li>
                                                                                                        ))
                                                                                                    }
                                                                                                </ul>
                                                                                            )
                                                                                        }} />
                                                                                </div>
                                                                            </Card.Body>
                                                                        </Accordion.Collapse>
                                                                    </Card>
                                                                </Accordion>
                                                                <Accordion defaultActiveKey="-1" id="IndustriesAccordian" onSelect={e => this.handleSelect(e, "IndustriesAccordian")}>
                                                                    <Card>
                                                                        <Accordion.Toggle as={Card.Header} eventKey="0">
                                                                            {i18n.t('Facets.ActivityFacetLabel')}
                                                                        </Accordion.Toggle>
                                                                        <Accordion.Collapse eventKey="0">
                                                                            <Card.Body>
                                                                                <div className="side-list-bar-jobs custm-checkbox-filters">
                                                                                    <MultiList filterLabel="Industries" componentId="IndustryfacetSensor" dataField={i18n.language == "en" ? "IndustryNameEN.keyword" : "IndustryNameFR.keyword"}
                                                                                        showSearch={true} showLoadMore={true} size={1000}
                                                                                        loadMoreLabel="Plus de résultats"
                                                                                        value={this.state.selectedIndustries}
                                                                                        placeholder={i18n.t('General.SearchLabel')}
                                                                                        onChange={(result) => {
                                                                                            this.setState({ selectedIndustries: result })
                                                                                        }
                                                                                        }
                                                                                        react={{
                                                                                            "and": ["SearchSensor", "Locations",
                                                                                                "JobTypeSensor", "SubCategoryfacetSensor", "FoodfacetSensor", "EnviromentFacetSensor",
                                                                                                "AssurancesFacetSensor", "TransportFacetSensor", "OpenSpaceFacetSensor", "GlobalQuery"]
                                                                                        }}
                                                                                        render={({
                                                                                            loading,
                                                                                            error,
                                                                                            data,
                                                                                            handleChange,
                                                                                        }) => {
                                                                                            var selectedIndustries = this.state.selectedIndustries;
                                                                                            return (
                                                                                                <ul>
                                                                                                    {
                                                                                                        data.map(item => (
                                                                                                            <li>
                                                                                                                <input
                                                                                                                    id={item.key}
                                                                                                                    type="checkbox"
                                                                                                                    value={item.key}
                                                                                                                    onChange={handleChange}
                                                                                                                    checked={selectedIndustries != null && selectedIndustries.length > 0 && selectedIndustries.indexOf(item.key) > -1}
                                                                                                                />
                                                                                                                <label for={item.key} className="job-checkbox-title">{item.key}<span>{item.doc_count}</span></label>
                                                                                                            </li>
                                                                                                        ))
                                                                                                    }
                                                                                                </ul>
                                                                                            )
                                                                                        }}
                                                                                    />
                                                                                </div>
                                                                            </Card.Body>
                                                                        </Accordion.Collapse>
                                                                    </Card>
                                                                </Accordion>

                                                                <Accordion defaultActiveKey="-1" id="SubCategoriesAccordian" onSelect={e => this.handleSelect(e, "SubCategoriesAccordian")}>
                                                                    <Card>
                                                                        <Accordion.Toggle as={Card.Header} eventKey="0">
                                                                            {i18n.t('Facets.SubcategoryFaceLabel')}
                                                                        </Accordion.Toggle>
                                                                        <Accordion.Collapse eventKey="0">
                                                                            <Card.Body>
                                                                                <div className="side-list-bar-jobs custm-checkbox-filters">
                                                                                    <MultiList filterLabel="Sub Cateogries" componentId="SubCategoryfacetSensor" dataField={i18n.language == "en" ? "SubCategoriesEN.keyword" : "SubCategoriesFR.keyword"}
                                                                                        showSearch={true} showLoadMore={true} size={1000}
                                                                                        loadMoreLabel="Plus de résultats"
                                                                                        value={this.state.selectedSubCategories}
                                                                                        onChange={(result) => {
                                                                                            this.setState({ selectedSubCategories: result })
                                                                                        }
                                                                                        }
                                                                                        placeholder={i18n.t('General.SearchLabel')}
                                                                                        react={{
                                                                                            "and": ["SearchSensor", "Locations",
                                                                                                "JobTypeSensor", "IndustryfacetSensor", "FoodfacetSensor", "EnviromentFacetSensor",
                                                                                                "AssurancesFacetSensor", "TransportFacetSensor", "OpenSpaceFacetSensor", "GlobalQuery"]
                                                                                        }}
                                                                                        render={({
                                                                                            loading,
                                                                                            error,
                                                                                            data,
                                                                                            handleChange,
                                                                                        }) => {
                                                                                            var selectedSubCategories = this.state.selectedSubCategories;
                                                                                            return (
                                                                                                <ul>
                                                                                                    {
                                                                                                        data.map(item => (
                                                                                                            <li>
                                                                                                                <input
                                                                                                                    id={item.key}
                                                                                                                    type="checkbox"
                                                                                                                    value={item.key}
                                                                                                                    onChange={handleChange}
                                                                                                                    checked={selectedSubCategories != null && selectedSubCategories.length > 0 && selectedSubCategories.indexOf(item.key) > -1}
                                                                                                                />
                                                                                                                <label for={item.key} className="job-checkbox-title">{item.key}<span>{item.doc_count}</span></label>
                                                                                                            </li>
                                                                                                        ))
                                                                                                    }
                                                                                                </ul>
                                                                                            )
                                                                                        }}

                                                                                    />
                                                                                </div>
                                                                            </Card.Body>
                                                                        </Accordion.Collapse>
                                                                    </Card>
                                                                </Accordion>

                                                            </div>
                                                        </Tab>
                                                        <Tab eventKey="Avantages" title={i18n.t('Facets.AvantageFacelLabel')} >
                                                            <div className="Avantages">
                                                                <Accordion defaultActiveKey="0" id="FoodDrinkAccordian" onSelect={e => this.handleSelect(e, "FoodDrinkAccordian")}>
                                                                    <Card>
                                                                        <Accordion.Toggle className="active" as={Card.Header} eventKey="0">
                                                                            {i18n.t('Facets.FoodDrinkFacet')}
                                                                        </Accordion.Toggle>
                                                                        <Accordion.Collapse eventKey="0">
                                                                            <Card.Body>
                                                                                <div className="side-list-bar-jobs">
                                                                                    <MultiList filterLabel={i18n.t('Facets.FoodDrinkFacet')} componentId="FoodfacetSensor" dataField={i18n.language == "en" ? "FoodDrinkFacetEN.keyword" : "FoodDrinkFacetFR.keyword"}
                                                                                        value={this.state.selectedFoodFacets}
                                                                                        onChange={(result) => {
                                                                                            this.setState({ selectedFoodFacets: result })
                                                                                        }
                                                                                        }
                                                                                        showSearch={false}
                                                                                        react={{
                                                                                            "and": ["SearchSensor", "Locations",
                                                                                                "JobTypeSensor", "IndustryfacetSensor", "SubCategoryfacetSensor", "EnviromentFacetSensor",
                                                                                                "AssurancesFacetSensor", "TransportFacetSensor", "OpenSpaceFacetSensor", "GlobalQuery"]
                                                                                        }} />
                                                                                </div>
                                                                            </Card.Body>
                                                                        </Accordion.Collapse>
                                                                    </Card>
                                                                </Accordion>

                                                                <Accordion defaultActiveKey="-1" id="EnviromentAccordian" onSelect={e => this.handleSelect(e, "EnviromentAccordian")}>
                                                                    <Card>
                                                                        <Accordion.Toggle as={Card.Header} eventKey="0">
                                                                            {i18n.t('Facets.EnviromentFacet')}
                                                                        </Accordion.Toggle>
                                                                        <Accordion.Collapse eventKey="0">
                                                                            <Card.Body>
                                                                                <div className="side-list-bar-jobs">
                                                                                    <MultiList filterLabel={i18n.t('Facets.EnviromentFacet')} componentId="EnviromentFacetSensor" dataField={i18n.language == "en" ? "EnviromentFacetEN.keyword" : "EnviromentFacetFR.keyword"}
                                                                                        value={this.state.selectedEnvironmentFacets}
                                                                                        onChange={(result) => {
                                                                                            this.setState({ selectedEnvironmentFacets: result })
                                                                                        }
                                                                                        }
                                                                                        react={{
                                                                                            "and": ["SearchSensor", "Locations",
                                                                                                "JobTypeSensor", "IndustryfacetSensor", "SubCategoryfacetSensor", "FoodfacetSensor",
                                                                                                "AssurancesFacetSensor", "TransportFacetSensor", "OpenSpaceFacetSensor", "GlobalQuery"]
                                                                                        }} showSearch={false} />
                                                                                </div>
                                                                            </Card.Body>
                                                                        </Accordion.Collapse>
                                                                    </Card>
                                                                </Accordion>
                                                                <Accordion defaultActiveKey="-1" id="AssurancesFacetAccordian" onSelect={e => this.handleSelect(e, "AssurancesFacetAccordian")}>
                                                                    <Card>
                                                                        <Accordion.Toggle as={Card.Header} eventKey="0">
                                                                            {i18n.t('Facets.AssurancesFacet')}
                                                                        </Accordion.Toggle>
                                                                        <Accordion.Collapse eventKey="0">
                                                                            <Card.Body>

                                                                                <div className="side-list-bar-jobs">

                                                                                    <MultiList filterLabel={i18n.t('Facets.AssurancesFacet')} componentId="AssurancesFacetSensor" dataField={i18n.language == "en" ? "AssurancesFacetEN.keyword" : "AssurancesFacetFR.keyword"}
                                                                                        value={this.state.selectedAssurancesFacets}
                                                                                        onChange={(result) => {
                                                                                            this.setState({ selectedAssurancesFacets: result })
                                                                                        }
                                                                                        }
                                                                                        react={{
                                                                                            "and": ["SearchSensor", "Locations",
                                                                                                "JobTypeSensor", "IndustryfacetSensor", "SubCategoryfacetSensor", "FoodfacetSensor",
                                                                                                "EnviromentFacetSensor", "TransportFacetSensor", "OpenSpaceFacetSensor", "GlobalQuery"]
                                                                                        }} showSearch={false} />
                                                                                </div>
                                                                            </Card.Body>
                                                                        </Accordion.Collapse>
                                                                    </Card>
                                                                </Accordion>

                                                                <Accordion defaultActiveKey="-1" id="TransportFacetAccordian" onSelect={e => this.handleSelect(e, "TransportFacetAccordian")}>
                                                                    <Card>
                                                                        <Accordion.Toggle as={Card.Header} eventKey="0">
                                                                            {i18n.t('Facets.TransportFacet')}
                                                                        </Accordion.Toggle>
                                                                        <Accordion.Collapse eventKey="0">
                                                                            <Card.Body>
                                                                                <div className="side-list-bar-jobs">
                                                                                    <MultiList filterLabel={i18n.t('Facets.TransportFacet')} componentId="TransportFacetSensor" dataField={i18n.language == "en" ? "TransportFacetEN.keyword" : "TransportFacetFR.keyword"}
                                                                                        value={this.state.selectedTransportFacets}
                                                                                        onChange={(result) => {
                                                                                            this.setState({ selectedTransportFacets: result })
                                                                                        }
                                                                                        }
                                                                                        react={{
                                                                                            "and": ["SearchSensor", "Locations",
                                                                                                "JobTypeSensor", "IndustryfacetSensor", "SubCategoryfacetSensor", "FoodfacetSensor",
                                                                                                "EnviromentFacetSensor", "AssurancesFacetSensor", "OpenSpaceFacetSensor", "GlobalQuery"]
                                                                                        }} showSearch={false} />
                                                                                </div>
                                                                            </Card.Body>
                                                                        </Accordion.Collapse>
                                                                    </Card>
                                                                </Accordion>


                                                                <Accordion defaultActiveKey="-1" id="OpenSpaceFacetAccordian" onSelect={e => this.handleSelect(e, "OpenSpaceFacetAccordian")}>
                                                                    <Card>
                                                                        <Accordion.Toggle as={Card.Header} eventKey="0">
                                                                            {i18n.t('Facets.OpenSpaceFacet')}
                                                                        </Accordion.Toggle>
                                                                        <Accordion.Collapse eventKey="0">
                                                                            <Card.Body>
                                                                                <div className="side-list-bar-jobs">
                                                                                    <MultiList filterLabel={i18n.t('Facets.OpenSpaceFacet')} componentId="OpenSpaceFacetSensor" dataField={i18n.language == "en" ? "OpenSpaceEN.keyword" : "OpenSpaceFR.keyword"}
                                                                                        value={this.state.selectedOpenSpaceFacets}
                                                                                        onChange={(result) => {
                                                                                            this.setState({ selectedOpenSpaceFacets: result })
                                                                                        }
                                                                                        }

                                                                                        react={{
                                                                                            "and": ["SearchSensor", "Locations",
                                                                                                "JobTypeSensor", "IndustryfacetSensor", "SubCategoryfacetSensor", "FoodfacetSensor",
                                                                                                "EnviromentFacetSensor", "AssurancesFacetSensor", "TransportFacetSensor", "GlobalQuery"]
                                                                                        }} showSearch={false}
                                                                                    />
                                                                                </div>
                                                                            </Card.Body>
                                                                        </Accordion.Collapse>
                                                                    </Card>
                                                                </Accordion>
                                                            </div>
                                                        </Tab>
                                                    </Tabs>




                                                </div>
                                                <button className="filter-mob-btn" onClick={() => this.toggleFilter()}>Filter</button>
                                            </div>

                                            {
                                                this.state.isFilterOpened &&
                                                <div className={this.state.isFilterOpened ? "mobile-filters fixed-filter mob-fil" : "mob-fil fixed-filter col-sm-4"}>
                                                    <div className="pop-actionss">
                                                        <h3>Filtrer par:</h3>
                                                        <button className="close-mob-btn" onClick={() => this.toggleFilter()}><i className="fa fa-times"></i></button>
                                                    </div>
                                                    <Tabs transition={false} id="facetstab" onSelect={(k) => this.setKeyFacetsTabs(k)} activeKey={this.state.selectedTabKeyFacets}>
                                                        <Tab eventKey="general" title={i18n.t('Facets.GeneralFacelLabel')}>
                                                            <div className="general">
                                                                <Accordion id="locationAccordianMob" defaultActiveKey="0" onSelect={e => this.handleSelect(e, "locationAccordianMob")}>
                                                                    <Card>
                                                                        <Accordion.Toggle className="active" as={Card.Header} eventKey="0">
                                                                            {i18n.t('Facets.LocationFacetLabel')}
                                                                        </Accordion.Toggle>
                                                                        <Accordion.Collapse eventKey="0">
                                                                            <Card.Body>
                                                                                <div className="side-list-bar-jobs  custm-checkbox-filters">
                                                                                    <MultiList filterLabel="Locations" componentId="LocationsMob" dataField="Locations.keyword"
                                                                                        react={{
                                                                                            "and": ["SearchSensor", "JobTypeSensorMob",
                                                                                                "IndustryfacetSensorMob", "SubCategoryfacetSensorMob", "FoodfacetSensorMob", "EnviromentFacetSensorMob",
                                                                                                "AssurancesFacetSensorMob", "TransportFacetSensorMob", "OpenSpaceFacetSensorMob", "GlobalQuery"]
                                                                                        }}
                                                                                        size={1000}
                                                                                        value={this.state.selectedLocations}
                                                                                        onChange={(result) => {
                                                                                            this.setState({ selectedLocations: result })
                                                                                        }
                                                                                        }
                                                                                        render={({
                                                                                            loading,
                                                                                            error,
                                                                                            data,
                                                                                            handleChange,
                                                                                        }) => {
                                                                                            var selectedLocations = this.state.selectedLocations;
                                                                                            return (
                                                                                                <ul>
                                                                                                    {
                                                                                                        data.map(item => (
                                                                                                            <li>
                                                                                                                <input
                                                                                                                    id={item.key}
                                                                                                                    type="checkbox"
                                                                                                                    value={item.key}
                                                                                                                    onChange={handleChange}
                                                                                                                    checked={selectedLocations != null && selectedLocations.length > 0 && selectedLocations.indexOf(item.key) > -1}
                                                                                                                />
                                                                                                                <label for={item.key} className="job-checkbox-title">{item.key}<span>{item.doc_count}</span></label>
                                                                                                            </li>
                                                                                                        ))
                                                                                                    }
                                                                                                </ul>
                                                                                            )
                                                                                        }}
                                                                                    />
                                                                                </div>
                                                                            </Card.Body>
                                                                        </Accordion.Collapse>
                                                                    </Card>
                                                                </Accordion>
                                                                <Accordion defaultActiveKey="0" id="jobTypeAccordianMob" onSelect={e => this.handleSelect(e, "jobTypeAccordianMob")}>
                                                                    <Card>
                                                                        <Accordion.Toggle className="active" as={Card.Header} eventKey="0">
                                                                            {i18n.t('Facets.JobTypeFacetLabel')}
                                                                        </Accordion.Toggle>
                                                                        <Accordion.Collapse eventKey="0">
                                                                            <Card.Body>
                                                                                <div className="side-list-bar-jobs  custm-checkbox-filters">
                                                                                    <MultiList filterLabel=" Types d’emplois" componentId="JobTypeSensorMob" dataField={i18n.language == "en" ? "JobTypeEN.keyword" : "JobTypeFR.keyword"}
                                                                                        showSearch={false}
                                                                                        value={this.state.selectedJobTypes}
                                                                                        onChange={(result) => {
                                                                                            this.setState({ selectedJobTypes: result })
                                                                                        }}
                                                                                        react={{
                                                                                            "and": ["SearchSensor", "LocationsMob",
                                                                                                "IndustryfacetSensorMob", "SubCategoryfacetSensorMob", "FoodfacetSensorMob", "EnviromentFacetSensorMob",
                                                                                                "AssurancesFacetSensorMob", "TransportFacetSensorMob", "OpenSpaceFacetSensorMob", "GlobalQuery"]
                                                                                        }}
                                                                                        size={1000}
                                                                                        render={({
                                                                                            loading,
                                                                                            error,
                                                                                            data,
                                                                                            handleChange,
                                                                                        }) => {
                                                                                            var selectedJobTypes = this.state.selectedJobTypes;
                                                                                            return (
                                                                                                <ul>
                                                                                                    {
                                                                                                        data.map(item => (
                                                                                                            <li>
                                                                                                                <input
                                                                                                                    id={item.key}
                                                                                                                    type="checkbox"
                                                                                                                    value={item.key}
                                                                                                                    onChange={handleChange}
                                                                                                                    checked={selectedJobTypes != null && selectedJobTypes.length > 0 && selectedJobTypes.indexOf(item.key) > -1}
                                                                                                                />
                                                                                                                <label for={item.key} className="job-checkbox-title">{item.key}<span>{item.doc_count}</span></label>
                                                                                                            </li>
                                                                                                        ))
                                                                                                    }
                                                                                                </ul>
                                                                                            )
                                                                                        }}

                                                                                    />
                                                                                </div>
                                                                            </Card.Body>
                                                                        </Accordion.Collapse>
                                                                    </Card>
                                                                </Accordion>
                                                                {/* <Accordion defaultActiveKey="0">
    <Card>
        <Accordion.Toggle as={Card.Header} eventKey="0">
            Salary Range
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="0">
            <Card.Body>
                <div className="side-list-bar-jobs">
                    <MultiRange
                        title="MultiRange"
                        componentId="SalaryRangeSensor"
                        dataField="SalaryMin"
                        data={[
                            { start: 0, end: 3, label: 'Rating < 3' },
                            { start: 3, end: 4, label: 'Rating 3 to 4' },
                            { start: 4, end: 5, label: 'Rating > 4' },
                        ]}
                    />
                </div>
            </Card.Body>
        </Accordion.Collapse>
    </Card>
</Accordion> */}
                                                                <Accordion defaultActiveKey="-1" id="IndustriesAccordianMob" onSelect={e => this.handleSelect(e, "IndustriesAccordianMob")}>
                                                                    <Card>
                                                                        <Accordion.Toggle as={Card.Header} eventKey="0">
                                                                            {i18n.t('Facets.ActivityFacetLabel')}
                                                                        </Accordion.Toggle>
                                                                        <Accordion.Collapse eventKey="0">
                                                                            <Card.Body>
                                                                                <div className="side-list-bar-jobs  custm-checkbox-filters">
                                                                                    <MultiList filterLabel="Industries" componentId="IndustryfacetSensorMob" dataField={i18n.language == "en" ? "IndustryNameEN.keyword" : "IndustryNameFR.keyword"}
                                                                                        showSearch={true} showLoadMore={true} size={5}
                                                                                        loadMoreLabel="Plus de résultats"
                                                                                        value={this.state.selectedIndustries}
                                                                                        onChange={(result) => {
                                                                                            this.setState({ selectedIndustries: result })
                                                                                        }
                                                                                        }
                                                                                        react={{
                                                                                            "and": ["SearchSensor", "LocationsMob",
                                                                                                "JobTypeSensorMob", "SubCategoryfacetSensorMob", "FoodfacetSensorMob", "EnviromentFacetSensorMob",
                                                                                                "AssurancesFacetSensorMob", "TransportFacetSensorMob", "OpenSpaceFacetSensorMob", "GlobalQuery"]
                                                                                        }}
                                                                                        size={1000}
                                                                                        render={({
                                                                                            loading,
                                                                                            error,
                                                                                            data,
                                                                                            handleChange,
                                                                                        }) => {
                                                                                            var selectedIndustries = this.state.selectedIndustries;
                                                                                            return (
                                                                                                <ul>
                                                                                                    {
                                                                                                        data.map(item => (
                                                                                                            <li>
                                                                                                                <input
                                                                                                                    id={item.key}
                                                                                                                    type="checkbox"
                                                                                                                    value={item.key}
                                                                                                                    onChange={handleChange}
                                                                                                                    checked={selectedIndustries != null && selectedIndustries.length > 0 && selectedIndustries.indexOf(item.key) > -1}
                                                                                                                />
                                                                                                                <label for={item.key} className="job-checkbox-title">{item.key}<span>{item.doc_count}</span></label>
                                                                                                            </li>
                                                                                                        ))
                                                                                                    }
                                                                                                </ul>
                                                                                            )
                                                                                        }}
                                                                                    />
                                                                                </div>
                                                                            </Card.Body>
                                                                        </Accordion.Collapse>
                                                                    </Card>
                                                                </Accordion>

                                                                <Accordion defaultActiveKey="-1" id="SubCategoriesAccordianMob" onSelect={e => this.handleSelect(e, "SubCategoriesAccordianMob")}>
                                                                    <Card>
                                                                        <Accordion.Toggle as={Card.Header} eventKey="0">
                                                                            {i18n.t('Facets.SubcategoryFaceLabel')}
                                                                        </Accordion.Toggle>
                                                                        <Accordion.Collapse eventKey="0">
                                                                            <Card.Body>
                                                                                <div className="side-list-bar-jobs  custm-checkbox-filters">
                                                                                    <MultiList filterLabel="Sub-Catégories" componentId="SubCategoryfacetSensorMob" dataField={i18n.language == "en" ? "SubCategoriesEN.keyword" : "SubCategoriesFR.keyword"}
                                                                                        showSearch={true} showLoadMore={true} size={5}
                                                                                        loadMoreLabel="Plus de résultats"
                                                                                        react={{
                                                                                            "and": ["SearchSensor", "LocationsMob",
                                                                                                "JobTypeSensorMob", "IndustryfacetSensorMob", "FoodfacetSensorMob", "EnviromentFacetSensorMob",
                                                                                                "AssurancesFacetSensorMob", "TransportFacetSensorMob", "OpenSpaceFacetSensorMob", "GlobalQuery"]
                                                                                        }}
                                                                                        size={1000}
                                                                                        render={({
                                                                                            loading,
                                                                                            error,
                                                                                            data,
                                                                                            handleChange,
                                                                                        }) => {
                                                                                            var selectedSubcategories = this.state.selectedSubCategories;
                                                                                            return (
                                                                                                <ul>
                                                                                                    {
                                                                                                        data.map(item => (
                                                                                                            <li>
                                                                                                                <input
                                                                                                                    id={item.key}
                                                                                                                    type="checkbox"
                                                                                                                    value={item.key}
                                                                                                                    onChange={handleChange}
                                                                                                                    checked={selectedSubcategories != null && selectedSubcategories.length > 0 && selectedSubcategories.indexOf(item.key) > -1}
                                                                                                                />
                                                                                                                <label for={item.key} className="job-checkbox-title">{item.key}<span>{item.doc_count}</span></label>
                                                                                                            </li>
                                                                                                        ))
                                                                                                    }
                                                                                                </ul>
                                                                                            )
                                                                                        }}
                                                                                    />
                                                                                </div>
                                                                            </Card.Body>
                                                                        </Accordion.Collapse>
                                                                    </Card>
                                                                </Accordion>
                                                            </div>
                                                        </Tab>
                                                        <Tab eventKey="Avantages" title="Avantages" >
                                                            <div className="Avantages">
                                                                <Accordion defaultActiveKey="-1" id="FoodDrinkAccordianMob" onSelect={e => this.handleSelect(e, "FoodDrinkAccordianMob")}>
                                                                    <Card>
                                                                        <Accordion.Toggle as={Card.Header} eventKey="0">
                                                                            {i18n.t('Facets.FoodDrinkFacet')}
                                                                        </Accordion.Toggle>
                                                                        <Accordion.Collapse eventKey="0">
                                                                            <Card.Body>
                                                                                <div className="side-list-bar-jobs">
                                                                                    <MultiList filterLabel={i18n.t('Facets.FoodDrinkFacet')} componentId="FoodfacetSensorMob" dataField={i18n.language == "en" ? "FoodDrinkFacetEN.keyword" : "FoodDrinkFacetFR.keyword"}
                                                                                        showSearch={false}
                                                                                        react={{
                                                                                            "and": ["SearchSensor", "LocationsMob",
                                                                                                "JobTypeSensorMob", "IndustryfacetSensorMob", "SubCategoryfacetSensorMob", "EnviromentFacetSensorMob",
                                                                                                "AssurancesFacetSensorMob", "TransportFacetSensorMob", "OpenSpaceFacetSensorMob", "GlobalQuery"]
                                                                                        }} />
                                                                                </div>
                                                                            </Card.Body>
                                                                        </Accordion.Collapse>
                                                                    </Card>
                                                                </Accordion>

                                                                <Accordion defaultActiveKey="-1" id="EnviromentAccordianMob" onSelect={e => this.handleSelect(e, "EnviromentAccordianMob")}>
                                                                    <Card>
                                                                        <Accordion.Toggle as={Card.Header} eventKey="0">
                                                                            {i18n.t('Facets.EnviromentFacet')}
                                                                        </Accordion.Toggle>
                                                                        <Accordion.Collapse eventKey="0">
                                                                            <Card.Body>
                                                                                <div className="side-list-bar-jobs">
                                                                                    <MultiList filterLabel={i18n.t('Facets.EnviromentFacet')} componentId="EnviromentFacetSensorMob" dataField={i18n.language == "en" ? "EnviromentFacetEN.keyword" : "EnviromentFacetFR.keyword"}
                                                                                        react={{
                                                                                            "and": ["SearchSensor", "LocationsMob",
                                                                                                "JobTypeSensorMob", "IndustryfacetSensorMob", "SubCategoryfacetSensorMob", "FoodfacetSensorMob",
                                                                                                "AssurancesFacetSensorMob", "TransportFacetSensorMob", "OpenSpaceFacetSensorMob", "GlobalQuery"]
                                                                                        }} showSearch={false} />
                                                                                </div>
                                                                            </Card.Body>
                                                                        </Accordion.Collapse>
                                                                    </Card>
                                                                </Accordion>
                                                                <Accordion defaultActiveKey="-1" id="AssurancesFacetAccordianMob" onSelect={e => this.handleSelect(e, "AssurancesFacetAccordianMob")}>
                                                                    <Card>
                                                                        <Accordion.Toggle as={Card.Header} eventKey="0">
                                                                            {i18n.t('Facets.AssurancesFacet')}
                                                                        </Accordion.Toggle>
                                                                        <Accordion.Collapse eventKey="0">
                                                                            <Card.Body>

                                                                                <div className="side-list-bar-jobs">

                                                                                    <MultiList filterLabel={i18n.t('Facets.AssurancesFacet')} componentId="AssurancesFacetSensorMob" dataField={i18n.language == "en" ? "AssurancesFacetEN.keyword" : "AssurancesFacetFR.keyword"}
                                                                                        react={{
                                                                                            "and": ["SearchSensor", "LocationsMob",
                                                                                                "JobTypeSensorMob", "IndustryfacetSensorMob", "SubCategoryfacetSensorMob", "FoodfacetSensorMob",
                                                                                                "EnviromentFacetSensorMob", "TransportFacetSensorMob", "OpenSpaceFacetSensorMob", "GlobalQuery"]
                                                                                        }} showSearch={false} />
                                                                                </div>
                                                                            </Card.Body>
                                                                        </Accordion.Collapse>
                                                                    </Card>
                                                                </Accordion>

                                                                <Accordion defaultActiveKey="-1" id="TransportFacetAccordianMob" onSelect={e => this.handleSelect(e, "TransportFacetAccordianMob")}>
                                                                    <Card>
                                                                        <Accordion.Toggle as={Card.Header} eventKey="0">
                                                                            {i18n.t('Facets.TransportFacet')}
                                                                        </Accordion.Toggle>
                                                                        <Accordion.Collapse eventKey="0">
                                                                            <Card.Body>
                                                                                <div className="side-list-bar-jobs">
                                                                                    <MultiList filterLabel={i18n.t('Facets.TransportFacet')} componentId="TransportFacetSensorMob" dataField={i18n.language == "en" ? "TransportFacetEN.keyword" : "TransportFacetFR.keyword"}
                                                                                        react={{
                                                                                            "and": ["SearchSensor", "LocationsMob",
                                                                                                "JobTypeSensorMob", "IndustryfacetSensorMob", "SubCategoryfacetSensorMob", "FoodfacetSensorMob",
                                                                                                "EnviromentFacetSensorMob", "AssurancesFacetSensorMob", "OpenSpaceFacetSensorMob", "GlobalQuery"]
                                                                                        }} showSearch={false} />
                                                                                </div>
                                                                            </Card.Body>
                                                                        </Accordion.Collapse>
                                                                    </Card>
                                                                </Accordion>


                                                                <Accordion defaultActiveKey="-1" id="OpenSpaceFacetAccordianMob" onSelect={e => this.handleSelect(e, "OpenSpaceFacetAccordianMob")}>
                                                                    <Card>
                                                                        <Accordion.Toggle as={Card.Header} eventKey="0">
                                                                            {i18n.t('Facets.OpenSpaceFacet')}
                                                                        </Accordion.Toggle>
                                                                        <Accordion.Collapse eventKey="0">
                                                                            <Card.Body>
                                                                                <div className="side-list-bar-jobs">
                                                                                    <MultiList filterLabel={i18n.t('Facets.OpenSpaceFacet')} componentId="OpenSpaceFacetSensorMob" dataField={i18n.language == "en" ? "OpenSpaceEN.keyword" : "OpenSpaceFR.keyword"}
                                                                                        react={{
                                                                                            "and": ["SearchSensor", "LocationsMob",
                                                                                                "JobTypeSensorMob", "IndustryfacetSensorMob", "SubCategoryfacetSensorMob", "FoodfacetSensorMob",
                                                                                                "EnviromentFacetSensorMob", "AssurancesFacetSensorMob", "TransportFacetSensorMob", "GlobalQuery"]
                                                                                        }} showSearch={false}
                                                                                    />
                                                                                </div>
                                                                            </Card.Body>
                                                                        </Accordion.Collapse>
                                                                    </Card>
                                                                </Accordion>
                                                            </div>
                                                        </Tab>
                                                    </Tabs>

                                                </div>
                                            }
                                            <div className="col-sm-8 job-list-sidebr">
                                                <SelectedFilters showClearAll={false} />
                                                <DataSearch showVoiceSearch={true} componentId="SearchSensor" dataField={i18n.language == "en" ?
                                                    ['JobNumber', 'JobNumber.search', 'TitleEN', 'TitleEN.search', 'TitleEN.keyword',
                                                        'CompanyName', 'CompanyName.search',
                                                        'IndustryNameEN', 'IndustryNameEN.keyword', 'IndustryNameEN.search',
                                                        'Locations', 'Locations.keyword', 'Locations.search',
                                                        'JobDescriptionEN', 'JobDescriptionEN.search', 'JobDescriptionEN.keyword',
                                                        'JobTypeEN', 'JobTypeEN.keyword', 'JobTypeEN.search', "GlobalQuery"
                                                    ] :
                                                    ['JobNumber', 'JobNumber.search', 'TitleFR', 'TitleFR.search', 'TitleFR.keyword',
                                                        'CompanyName', 'CompanyName.search',
                                                        'IndustryNameFR', 'IndustryNameFR.keyword', 'IndustryNameFR.search',
                                                        'Locations', 'Locations.keyword', 'Locations.search',
                                                        'JobDescriptionFR', 'JobDescriptionFR.search', 'JobDescriptionFR.keyword',
                                                        'JobTypeFR', 'JobTypeFR.keyword', 'JobTypeFR.search', "GlobalQuery"
                                                    ]}
                                                    showClear={true}
                                                    placeholder={i18n.t('General.SearchLabel')}
                                                    showFilter={false}
                                                    value={this.state.searchTerm}
                                                    onChange={(value, triggerQuery, event, data) => {
                                                        this.setState({ searchTerm: value });
                                                        setTimeout(() => {
                                                            triggerQuery();
                                                        }, 3000);
                                                    }}
                                                    // // // debounce="100"
                                                    // onKeyPress={(value, triggerQuery, event) => {
                                                    //     debugger;
                                                    //     var searchText = this.state.searchTerm;
                                                    //     if (!event) {
                                                    //         this.setState({ searchTerm: searchText + value.key });
                                                    //     }
                                                    //     if (value.which == 13) {
                                                    //         triggerQuery();
                                                    //     }
                                                    // }}
                                                    parseSuggestion={(suggestion) => ({

                                                        label: (
                                                            <Fragment>
                                                                {
                                                                    i18n.language == "en" && suggestion.source.TitleEN.includes(suggestion.value) && suggestion.source.TitleEN
                                                                }
                                                                {
                                                                    i18n.language != "en" && suggestion.source.TitleFR.includes(suggestion.value) &&
                                                                    suggestion.source.TitleFR
                                                                }
                                                                {
                                                                    i18n.language == "en" && suggestion.source.IndustryNameEN.includes(suggestion.value) && suggestion.source.IndustryNameEN
                                                                }
                                                                {
                                                                    i18n.language != "en" && suggestion.source.IndustryNameFR.includes(suggestion.value) &&
                                                                    suggestion.source.IndustryNameFR
                                                                }
                                                                {
                                                                    suggestion.source.Locations && suggestion.source.Locations.length > 0 && suggestion.source.Locations.indexOf(suggestion.value) > -1 &&
                                                                    this.intersperse(suggestion.source.Locations, ", ")
                                                                }
                                                                {
                                                                    i18n.language == "en" && suggestion.source.JobTypeEN && suggestion.source.JobTypeEN.length > 0 && suggestion.source.JobTypeEN.indexOf(suggestion.value) > -1 &&
                                                                    this.intersperse(suggestion.source.JobTypeEN, ", ")
                                                                }
                                                                {
                                                                    i18n.language != "en" && suggestion.source.JobTypeFR && suggestion.source.JobTypeFR.length > 0 && suggestion.source.JobTypeFR.indexOf(suggestion.value) > -1 &&
                                                                    this.intersperse(suggestion.source.JobTypeFR, ", ")
                                                                }

                                                                {/* {i18n.language == "en" ? this.intersperse(suggestion.source.JobTypeEN, ", ") : this.intersperse(suggestion.source.JobTypeFR, ", ")} */}
                                                            </Fragment>
                                                        ),
                                                        source: suggestion.source,
                                                        value: (i18n.language == "en" ? suggestion.source.TitleEN : suggestion.source.TitleFR)
                                                    })}


                                                />
                                                <div className="job-list-tabs">

                                                    <Tabs transition={false} id="noanim-tab-example" onSelect={(k) => this.setKey(k)} activeKey={this.state.selectedTabKey}>
                                                        <Tab eventKey="alljobs" title={i18n.t('General.PositionsTabLabel')}>
                                                            <div className="container">
                                                                <div className="row">
                                                                    <div className="col-sm-12" style={{ marginTop: '50px' }} >
                                                                        <ReactiveList
                                                                            componentId="result"
                                                                            dataField="_score"
                                                                            scrollOnChange={false}
                                                                            showResultStats={true}
                                                                            renderResultStats={
                                                                                function (stats) {
                                                                                    return (
                                                                                        `${stats.numberOfResults} ${i18n.t('General.ResultFoundInLabel')} ${stats.time}ms`
                                                                                    )
                                                                                }
                                                                            }
                                                                            react={{
                                                                                "and": ["Locations", "SearchSensor", "FoodfacetSensor",
                                                                                    "EnviromentFacetSensor", "AssurancesFacetSensor", "TransportFacetSensor", "OpenSpaceFacetSensor", "JobTypeSensor",
                                                                                    "IndustryfacetSensor", "SubCategoryfacetSensor", "GlobalQuery"]
                                                                            }}
                                                                            renderItem={(job) => {
                                                                                return (this.renderJob(job))
                                                                            }}
                                                                            size={10}
                                                                            pagination={true}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </Tab>
                                                        <Tab eventKey="jobstories" title="Job Stories" >
                                                            <div className="Story-job-outer">
                                                                <ReactiveList
                                                                    className="Story-job-outer-in"
                                                                    componentId="resultStories"
                                                                    dataField="_score"
                                                                    scrollOnChange={false}
                                                                    react={{
                                                                        "and": ["Locations", "SearchSensor", "FoodfacetSensor",
                                                                            "EnviromentFacetSensor", "AssurancesFacetSensor", "TransportFacetSensor", "OpenSpaceFacetSensor", "JobTypeSensor",
                                                                            "IndustryfacetSensor", "SubCategoryfacetSensor", "GlobalQuery", "JobStoriesQuery"]
                                                                    }}

                                                                    onData={(data) => this.setData(data)
                                                                    }
                                                                    renderItem={(job) => {
                                                                        const jobDetailUrl = "/" + job.CompanyName + "/job-detail/" + job.JobPostingId
                                                                        const title = i18n.language == "en" ? job.TitleEN : job.TitleFR;
                                                                        const industry = i18n.language == "en" ? job.IndustryNameEN : job.IndustryNameFR;
                                                                        const description = i18n.language == "en" ? job.JobDescriptionEN.substr(0, 250) : job.JobDescriptionFR.substr(0, 250);
                                                                        const jobTypes = i18n.language == "en" ? job.JobTypeEN : job.JobTypeFR;
                                                                        // Change to update the UI
                                                                        return (
                                                                            <Fragment key={job.JobPostingId}>
                                                                                {
                                                                                    <div className="inner-story-item"  >
                                                                                        <div className="thumb-img-job" >
                                                                                            <img className="Job_thumb" src={!!job.Thumbnail ? job.Thumbnail : 'https://opsoestorage.blob.core.windows.net/companybackground-stg/default_thumbnail.PNG'} />
                                                                                            <span className="video-icon-hover" onClick={() => this.openJobVideoModal(job.VideoLink, true, job)}><i className="careerfy-icon careerfy-play-button"></i></span>

                                                                                            {
                                                                                                jobTypes != null && jobTypes.length > 0 &&
                                                                                                <p className="job_type_p" onClick={() => this.setSelectedJobTypes(jobTypes[0])}>{jobTypes[0]}</p>
                                                                                                // jobTypes.map((type, index) => {

                                                                                                //     return ()
                                                                                                // })
                                                                                            }
                                                                                            {/* <p className="job_type_p">{this.intersperse(jobTypes, ", ")}</p> */}
                                                                                            {(!!job.WorkExperienceMin || !!job.WorkexperienceMax) &&
                                                                                                <p className="job_type_bn">Experience {job.WorkExperienceMin}-{job.WorkexperienceMax} ans</p>
                                                                                            }
                                                                                        </div>
                                                                                        <div className="content-job-item">
                                                                                            <div className="img_title-job">
                                                                                                <span className="logo-job-ty"><img src={job.CompanyLogoUrl} /></span>
                                                                                                <div className="titl-des-jobb">
                                                                                                    <h3>{title}</h3>
                                                                                                    <p className="desp-job">
                                                                                                        <div className="textWidget " dangerouslySetInnerHTML={{ __html: description }} />
                                                                                                        <a href={jobDetailUrl} className="job-story-link">voir plus</a>
                                                                                                    </p>
                                                                                                </div>
                                                                                            </div>

                                                                                            <ul className="job_Cat_loc">
                                                                                                <li onClick={() => this.setSelectedIndustries(industry)}><i className="careerfy-icon careerfy-filter-tool-black-shape"></i> {industry}</li>
                                                                                                <li><i className="careerfy-icon careerfy-maps-and-flags"></i> <span>
                                                                                                    {
                                                                                                        job.Locations != null && job.Locations.length > 0 &&
                                                                                                        job.Locations.map((loc, index) => {

                                                                                                            return (<span onClick={() => this.setSelectedLocations(loc)}>{loc} &nbsp;</span>)
                                                                                                        })
                                                                                                    }</span></li>
                                                                                            </ul>

                                                                                        </div>
                                                                                    </div>
                                                                                }


                                                                            </Fragment>)
                                                                    }}
                                                                    size={6}
                                                                    pagination={true}
                                                                    renderResultStats={
                                                                        function (stats) {
                                                                            return (
                                                                                `${stats.numberOfResults} résultats trouvés en ${stats.time}ms`
                                                                            )
                                                                        }
                                                                    }
                                                                />
                                                            </div>
                                                        </Tab>
                                                        {
                                                            this.state.localFavJobIds.length > 0 &&
                                                            <Tab eventKey="favJobs" title="Likes">

                                                                <div className="container">
                                                                    <div className="row">
                                                                        <div className="col-sm-12" style={{ marginTop: '50px' }} >
                                                                            {
                                                                                this.state.localFavJobIds.map((job, index) => {
                                                                                    return (this.renderJob(job));
                                                                                })
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </Tab>
                                                        }
                                                    </Tabs>
                                                </div>


                                            </div>
                                        </div>


                                    </ReactiveBase>

                                }

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



            </Fragment >
        );
    }
}
export default withTranslation('common')(JobSearch);
