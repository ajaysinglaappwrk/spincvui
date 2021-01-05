import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { withTranslation, i18n } from '../../../i18n';
import { authenticationService } from '../../services/authentication.service'
import ReactPlayer from 'react-player'
import { employerActions } from '../../actions/employer-actions';
import { spinCVUrl } from '../../config';

import GoogleMap from './map/google.map';
import { TwitterTimelineEmbed } from 'react-twitter-embed';
import Iframe from 'react-iframe'

import Jobs from '../job-listing/cluster-jobs';
import JobSearch from '../job-listing/job-search';
import Whatwedo from './Whatwedo';
import Meetheteam from './Meettheteam'
import JobApply from '../apply-job/apply-job';
import YoutubeLive from './youtube-live'
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css'; // This only needs to be imported once in your app

import ArrowKeysReact from 'arrow-keys-react';
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

import { withRouter } from 'next/router';
import DropCreate from '../../components/apply-job/drop-create';

class EmployerDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            companyProfile: {},
            profilePageUrl: spinCVUrl + "Account/AuthenticationUser?token=" + authenticationService.token,
            canPlayVideo: false,
            url: '',
            isOpen: false,
            companyMediaList: [],
            firstImageData: '',
            languageLabels: [],
            companyDetailWidget: {},
            companyPerks: [],
            rightSideWidgets: [],
            leftSideWidgets: [],
            leftSideSecondWidgets: [],
            companyTopLeftWidget: [],
            nav1: null,
            nav2: null,
            currentSlide: 1,
            text: '',
            perkTitle: '',
            innerPage: 1,
            activePerk: 1,
            firstRender: false,
            companyRecentJobs: [],
            companyAllJobs: [],
            industryName: "",
            isLargeViewOpened: false,
            viewURL: "",
            locationNumber: 0,
            isProcessing: false,
            jobsCount: 0,
            images: [],
            photoIndex: 0,
            videos: [],
            videoIndex: 0,
        }
        this.openModal = this.openModal.bind(this);
        this.goToPrevious = this.goToPrevious.bind(this);
        this.goToNext = this.goToNext.bind(this);

        ArrowKeysReact.config({
            left: () => {
                if (this.state.isOpen) {
                    this.playPreviousVideo();
                }
            },
            right: () => {
                if (this.state.isOpen) {
                    this.playNextVideo();
                }
            }
        });
    }

    componentDidMount() {
        this.props.dispatch(employerActions.getCompanyProfile(this.props.router.query.companyname));
        this.setState({
            nav1: this.slider1,
            nav2: this.slider2,
            isProcessing: true
        });
        if (window.location.hostname.substr(0, window.location.hostname.indexOf('.')).toLowerCase() == "gexel") {
            document.body.classList.add('gexel-profile')
        }
        else {
            document.body.classList.add('all-profile')
        }
        window.addEventListener("popstate", this.onBackButtonEvent);
    }

    onBackButtonEvent = (location) => {
        var currentTab = this.props.match.params.tab;
        if (currentTab) {
            if (currentTab == "team")
                this.setState({ innerPage: 2 });
            else if (currentTab == "jobs")
                this.setState({ innerPage: 4 });
            else if (currentTab == "whatwedo")
                this.setState({ innerPage: 3 });
            else if (currentTab == "live")
                this.setState({ innerPage: 5 });
        }
        else
            this.setState({ innerPage: 1 });

        window.scrollTo(0, -200);
    }
    componentWillUnmount() {
        window.removeEventListener("popstate", this.onBackButtonEvent)
    }

    componentWillUnmount() {
        document.body.classList.remove('gexel-profile')
        document.body.classList.add('all-profile')
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.EmployerReducer !== nextProps.EmployerReducer) {
            if (nextProps.EmployerReducer.items && nextProps.EmployerReducer.items.companyPerks && nextProps.EmployerReducer.items.companyPerks.length > 0) {
                const { i18n } = this.props;
                var perk = nextProps.EmployerReducer.items.companyPerks.find(x => { return i18n.language == "en" ? x.languageId == 1 : x.languageId == 2 });
                if (perk) {
                    this.state.perkTitle = perk.title;
                    this.state.text = perk.companyPerkSubcategories.map((subcategory, catindex) => {
                        return (<div key={catindex} className="perksContent-text"><img src="https://my-cdn.azureedge.net/cdn/images/perksicon.png" /> <h6 className="desc_text">{subcategory.title}</h6></div>)
                    });
                }

            }
        }
    }

    openModal(url, value, thumb) {
        this.setState({ url: url, videoIndex: this.state.videos.indexOf(url) });
        this.setState({ isOpen: value });
    }

    openLinkInNewTab(isSocialLink, SocialLink, url) {
        if (isSocialLink)
            window.open(SocialLink, '_blank');
        else {
            var largeUrl = this.getLargeURLForImage(url);
            this.setState({ isLargeViewOpened: true, viewURL: largeUrl, photoIndex: this.state.images.indexOf(largeUrl) });

        }
    }

    getLargeURLForImage(url) {
        //creating Large image Url
        var firstPart = url.substr(0, url.lastIndexOf("."));
        var secondPart = url.substr(url.lastIndexOf("."));
        firstPart = firstPart + "-max";
        return firstPart + secondPart;
    }

    onTabChange = (tabIndex, url) => {
        this.setState({ innerPage: tabIndex, locationNumber: tabIndex == 6 ? 1 : 0 })
        this.props.router.push(url);
        window.scrollTo(0, 200);
    }
    getCompanyAttributeId(attribute) {
        return this.state.companyProfile.companyAttributes.find(x => x.name == attribute).id;
    }

    openURLInNewTab(url) {
        if (!!url && (url.indexOf("https") > -1 || url.indexOf("http") > -1)) {
            window.open(url, "_blank");
        }
        else {
            window.open("https://" + url, "_blank");
        }
    }


    goToNext() {
        this.setState({
            photoIndex: (this.state.photoIndex + 1) % this.state.images.length,
        });
    }

    goToPrevious() {
        this.setState({
            photoIndex: (this.state.photoIndex + this.state.images.length - 1) % this.state.images.length,
        });
    }

    playNextVideo() {
        this.setState({
            videoIndex: (this.state.videoIndex + 1) % this.state.videos.length,
        });
    }

    playPreviousVideo() {
        this.setState({
            videoIndex: (this.state.videoIndex + this.state.videos.length - 1) % this.state.videos.length,
        });
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

    render() {
        const { EmployerReducer, i18n } = this.props;
        if (EmployerReducer && EmployerReducer.error && EmployerReducer.error.isAxiosError)
            this.props.router.push('/');

        if (EmployerReducer && EmployerReducer.items && !Array.isArray(EmployerReducer.items)) {
            if (!EmployerReducer.items.isLiveCustomer || EmployerReducer.items.isFutureClient)
                window.location.href = "/";
            this.state.isProcessing = false;
            var currentTab = this.props.router.query.tab;
            if (currentTab && this.state.innerPage != 7) {
                if (currentTab == "team")
                    this.state.innerPage = 2;
                else if (currentTab == "jobs")
                    this.state.innerPage = 4;
                else if (currentTab == "whatwedo")
                    this.state.innerPage = 3;
                else if (currentTab == "live")
                    this.state.innerPage = 5;
            }
            this.state.companyProfile = EmployerReducer.items;
            this.state.jobsCount = this.state.companyProfile.totalJobs;
            this.state.companyMediaList = this.state.companyProfile.companyMediaList;
            const companyImageData = this.state.companyProfile.companyMediaList.filter(p => p.isVideo == false);
            const companyVideoData = this.state.companyProfile.companyMediaList.filter(p => p.isVideo == true);
            const companyDetailWidget = this.state.companyProfile.companyWidgets.filter(x => x.name == "CompanyDetailWidget");
            const companyTopLeftWidget = this.state.companyProfile.companyWidgets.filter(x => x.name == "TopLeftWidget");
            const rightSideWidgets = this.state.companyProfile.companyWidgets.filter(x => x.isLeftSideWidget == false);
            const leftSideWidgets = this.state.companyProfile.companyWidgets.filter(x => x.isLeftSideWidget == true && x.isFirstLeftColumn == true);
            const leftSideSecondColumnWidgets = this.state.companyProfile.companyWidgets.filter(x => x.isLeftSideWidget == true && x.isFirstLeftColumn != true);

            if (this.state.companyProfile && this.state.companyProfile.industries && this.state.companyProfile.industries.length > 0) {
                const industry = this.state.companyProfile.industries.find(x => { return i18n.language == "en" ? x.languageId == 1 : x.languageId == 2 });
                if (industry)
                    this.state.industryName = industry.description;
            }
            if (companyImageData && companyImageData.length > 0) {
                this.state.firstImageData = companyImageData[0];
                var imagesData = [];
                companyImageData.forEach(element => {
                    imagesData.push(this.getLargeURLForImage(element.url));
                });
                this.state.images = imagesData;
            }
            if (companyVideoData && companyVideoData.length > 0) {
                var videosData = [];
                companyVideoData.forEach(element => {
                    videosData.push(element.url);
                });
                this.state.videos = videosData;
            }
            //Checking if url contains url and video
            var params = this.getUrlParams();
            if (params && params.isvideo) {
                if (params.isvideo == "true") {
                    this.state.url = params.url;
                    this.state.videoIndex = this.state.videos.indexOf(params.url);
                    this.state.isOpen = true;
                }
                else if (params.isvideo == "false") {
                    this.state.photoIndex = this.state.images.indexOf(params.url);
                    this.state.isLargeViewOpened = true;
                }
            }

            if (companyTopLeftWidget && companyTopLeftWidget.length > 0) {
                this.state.companyTopLeftWidget = companyTopLeftWidget;
            }
            if (companyDetailWidget && companyDetailWidget.length > 0) {
                this.state.companyDetailWidget = companyDetailWidget[0];
            }
            if (rightSideWidgets && rightSideWidgets.length > 0) {
                this.state.rightSideWidgets = rightSideWidgets.sort(function (a, b) {
                    return a.position - b.position
                });;
            }
            if (leftSideWidgets && leftSideWidgets.length > 0) {
                this.state.leftSideWidgets = leftSideWidgets.sort(function (a, b) {
                    return a.position - b.position
                });
            }
            if (leftSideSecondColumnWidgets && leftSideSecondColumnWidgets.length > 0) {
                this.state.leftSideSecondWidgets = leftSideSecondColumnWidgets.sort(function (a, b) {
                    return a.position - b.position
                });
            }
            if (i18n && i18n.language) {
                this.state.languageLabels = this.state.companyProfile.languageLabelList.filter(p => p.languageCode.toLowerCase() == i18n.language);
                if (this.state.companyProfile.companyPerks && this.state.companyProfile.companyPerks.length > 0) {
                    this.state.companyPerks = this.state.companyProfile.companyPerks.filter((p) => {
                        if (p.languageCode == i18n.language || i18n.language.includes(p.languageCode)) {
                            p.companyPerkSubcategories = p.companyPerkSubcategories.filter(x => x.languageCode == i18n.language)
                            return true
                        }
                        else { return false }
                    })
                    if (this.state.companyPerks && this.state.companyPerks.length > 0 && !this.state.firstRender) {
                        this.state.firstRender = true;
                        this.state.activePerk = this.state.companyPerks[0].id;
                    }

                }

            }
            if (this.state.companyProfile.companyJobs && this.state.companyProfile.companyJobs.length > 0) {
                this.state.companyRecentJobs = this.state.companyProfile.companyJobs.slice(0, 3);
                this.state.companyAllJobs = this.state.companyProfile.companyJobs;
            }

        }

        return (
            <div {...ArrowKeysReact.events} tabIndex="1">
                {
                    this.state.isProcessing &&
                    <div className="loader-outer"><div className="loader"></div></div>
                }
                {/* <HeaderG></HeaderG> */}
                <div className="careerfy-job-subheader" style={{ backgroundImage: 'url(' + this.state.companyProfile.companyBackImgUrl + ')', backgroundPosition: 'top center' }}>
                    <span className="careerfy-banner-transparent" style={{ backgroundImage: 'url' }}></span>
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-md-12">
                            </div>
                        </div>
                    </div>
                </div>
                <div className="careerfy-main-content" >
                    <div className="careerfy-main-section">
                        <div className="container-fulid data-container">
                            <div className="row m_0">
                                <div className="careerfy-column-12 careerfy-typo-wrap" >
                                    <figure className="careerfy-jobdetail-list" >
                                        <span className="careerfy-jobdetail-listthumb careerfy-jobdetail-listthumb-mob"><img src={this.state.companyProfile.companyLogoUrl} alt="" /></span>
                                        <figcaption>
                                            <h2>{this.state.companyProfile.displayName}</h2>
                                            <ul className="careerfy-jobdetail-options">
                                                {this.companyProfile && (this.companyProfile.companyId == authenticationService.currentCompanyId)}
                                                <li><i className="fa fa-map-marker"></i> {this.state.companyProfile.city}, {this.state.companyProfile.state}
                                                    {
                                                        (!authenticationService.isCandidateUser && this.state.companyProfile && this.state.companyProfile.companyId && (this.state.companyProfile.companyId == authenticationService.currentCompanyId)) &&
                                                        <a href={this.state.profilePageUrl} className="careerfy-jobdetail-view">Edit Profile</a>
                                                    }
                                                </li>
                                                <li><i className="careerfy-icon careerfy-internet"></i> <a onClick={() => this.openURLInNewTab(this.state.companyProfile.url)} >{this.state.companyProfile.url}</a></li>
                                                <li><i className="careerfy-icon careerfy-technology"></i>  {i18n.t('General.HotLineLabel')}: {this.state.companyProfile.phone}</li>
                                            </ul>
                                        </figcaption>
                                        <div className="spinTab">
                                            <ul>
                                                <li className={(this.state.innerPage === 1) ? "tabActive" : "careerfy-simple-btn"} >
                                                    <label onClick={() => this.onTabChange(1, "/" + this.state.companyProfile.name)}>{i18n.t('Tabs.ProfileTabLabel')}</label>

                                                </li>
                                                {/* <li className={this.state.innerPage === 6 ? "tabActive  location-tab" : "careerfy-simple-btn location-tab"} onClick={() => this.onTabChange(6, "/" + this.state.companyProfile.name + "/locations")}>locations</li> */}
                                                <li className={this.state.innerPage === 5 ? "tabActive" : "careerfy-simple-btn"} onClick={() => this.onTabChange(5, "/" + this.state.companyProfile.name + "/live")}>
                                                    <label> <i className="fa fa-youtube-play" aria-hidden="true" ></i>  {i18n.t('Tabs.LiveTabLabel')}</label>
                                                </li>
                                                <li className={this.state.innerPage === 2 ? "tabActive" : "careerfy-simple-btn"} onClick={() => this.onTabChange(2, "/" + this.state.companyProfile.name + "/team")}>
                                                    <label>{i18n.t('Tabs.MeetTheTeamLabel')}</label>
                                                </li>
                                                <li className={this.state.innerPage === 3 ? "tabActive" : "careerfy-simple-btn"} onClick={() => this.onTabChange(3, "/" + this.state.companyProfile.name + "/whatwedo")}>
                                                    <label>{i18n.t('Tabs.WhatWeLabel')}</label>
                                                </li>
                                                <li className={this.state.innerPage === 4 ? "tabActive" : "job-tab-btn"} onClick={() => this.onTabChange(4, "/" + this.state.companyProfile.name + "/jobs")}>
                                                    <label>{i18n.t('Tabs.JobsTabLabel')} </label>
                                                    <span className="badge notification_count">{this.state.jobsCount}</span>
                                                </li>
                                            </ul>

                                        </div>
                                        {
                                            this.state.companyProfile && this.state.companyProfile.name == "CUSM" &&
                                            <button type="button" class="careerfy-option-btn cusm-btn" onClick={() => this.setState({ innerPage: 7 })}>Hopital Lachine</button>
                                        }
                                    </figure>
                                </div>

                                {this.state.innerPage === 1 ?
                                    <div>
                                        <div className="careerfy-column-8 careerfy-typo-wrap">
                                            <div className="careerfy-facility-titel " style={{ marginBottom: '10px' }}><h2 className="main_heading">{i18n.t('General.PerksHeaderLabel')} </h2></div>
                                            <div className="container-fulid careerfy-row m_0" style={{ marginBottom: '15px', marginRight: '0px' }}>
                                                <div className="perksTab" >
                                                    <div className="perksSidebar">
                                                        <div className="perksSidebar-title">
                                                            <ul>
                                                                {this.state.companyPerks.map((perks, index) => {
                                                                    const { title, companyPerkSubcategories, id } = perks;
                                                                    return <Fragment key={index} >
                                                                        <li className={this.state.activePerk === id ? "perksTabactive desc_text  " : "desc_text"}
                                                                            onClick={() =>
                                                                                this.setState({
                                                                                    activePerk: id,
                                                                                    perkTitle: title,
                                                                                    text: companyPerkSubcategories.map((subcategory, catindex) => {
                                                                                        return (<div className="perksContent-text"><img src="https://my-cdn.azureedge.net/cdn/images/perksicon.png" /> <h6 className="desc_text">{subcategory.title}</h6></div>)
                                                                                    })
                                                                                })
                                                                            } onMouseEnter={() => this.setState({
                                                                                activePerk: id,
                                                                                perkTitle: title,
                                                                                text: companyPerkSubcategories.map((subcategory, catindex) => {
                                                                                    return (<div className="perksContent-text"><img src="https://my-cdn.azureedge.net/cdn/images/perksicon.png" /> <h6 className="desc_text">{subcategory.title}</h6></div>)
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

                                            <div className="careerfy-gallery careerfy-simple-gallery">
                                                <div className="container-fulid">
                                                    <div className="grid-item careerfy-column-12 p_0">
                                                        <div className="careerfy-row grid m_0">
                                                            <div className="grid-item careerfy-column-8 p_0">

                                                                {
                                                                    this.renderTopLeftWidget()

                                                                }

                                                                <div className="careerfy-row grid">
                                                                    <div className="grid-item careerfy-column-12">
                                                                        <div className="careerfy-jobdetail-content profile-icon-text hover-effect careerfy-employerdetail-content " style={{ marginTop: '20px', borderRadius: '10px' }} >

                                                                            {
                                                                                (this.state.companyProfile && !!this.state.companyProfile.employeeCount
                                                                                    || this.state.companyProfile && !!this.state.companyProfile.employeeCount
                                                                                    || this.state.jobsCount > 0
                                                                                    || !!this.state.industryName
                                                                                    || this.state.companyProfile && !!this.state.companyProfile.yearFounded
                                                                                    || this.state.companyProfile && !!this.state.companyProfile.revenue
                                                                                    || this.state.companyProfile && !!this.state.companyProfile.averageAge
                                                                                    || this.state.companyProfile && !!this.state.companyProfile.numberOfStores) &&
                                                                                <div className="careerfy-content-title"><h2 className="sub_heading">{i18n.t('EmployeeDetail.EmployerDetailDesc')}</h2></div>

                                                                            }
                                                                            <div className="careerfy-jobdetail-services">
                                                                                <ul className="careerfy-row profile-detail-box">
                                                                                    {
                                                                                        this.state.companyProfile && !!this.state.companyProfile.employeeCount && <li className={this.state.companyDetailWidget ? "careerfy-column-" + this.state.companyDetailWidget.columns : "careerfy-column-6"}>
                                                                                            <i className="careerfy-icon careerfy-group"></i>
                                                                                            <div className="careerfy-services-text">{i18n.t('EmployeeDetail.Employee')} <small>{this.state.companyProfile.employeeCount}</small></div>
                                                                                        </li>
                                                                                    }
                                                                                    {
                                                                                        this.state.jobsCount > 0 && <li className={this.state.companyDetailWidget ? "careerfy-column-" + this.state.companyDetailWidget.columns : "careerfy-column-6"}>
                                                                                            <i className="careerfy-icon careerfy-briefcase"></i>
                                                                                            <div className="careerfy-services-text" style={{ whiteSpace: 'nowrap' }}>{i18n.t('EmployeeDetail.Number')} <small> {this.state.jobsCount}</small></div>
                                                                                        </li>
                                                                                    }

                                                                                    {
                                                                                        !!this.state.industryName && <li className={this.state.companyDetailWidget ? "careerfy-column-" + this.state.companyDetailWidget.columns : "careerfy-column-6"}>
                                                                                            <i className="careerfy-icon careerfy-folder"></i>
                                                                                            <div className="careerfy-services-text">{i18n.t('EmployeeDetail.Industry')} <small>{this.state.industryName}</small></div>
                                                                                        </li>
                                                                                    }
                                                                                    {
                                                                                        this.state.companyProfile && !!this.state.companyProfile.yearFounded && <li className={this.state.companyDetailWidget ? "careerfy-column-" + this.state.companyDetailWidget.columns : "careerfy-column-6"}>
                                                                                            <i className="careerfy-icon careerfy-time"></i>
                                                                                            <div className="careerfy-services-text">{i18n.t('EmployeeDetail.Year')} <small>{this.state.companyProfile.yearFounded}</small></div>
                                                                                        </li>
                                                                                    }
                                                                                    {
                                                                                        this.state.companyProfile && !!this.state.companyProfile.revenue && <li className={this.state.companyDetailWidget ? "careerfy-column-" + this.state.companyDetailWidget.columns : "careerfy-column-6"}>
                                                                                            <i className="careerfy-icon careerfy-credit-card"></i>
                                                                                            <div className="careerfy-services-text">{i18n.t('EmployeeDetail.Turnover')} <small>{this.state.companyProfile.revenue}</small></div>
                                                                                        </li>
                                                                                    }
                                                                                    {
                                                                                        this.state.companyProfile && !!this.state.companyProfile.averageAge && <li className={this.state.companyDetailWidget ? "careerfy-column-" + this.state.companyDetailWidget.columns : "careerfy-column-6"}>
                                                                                            <i className="careerfy-icon careerfy-user"></i>
                                                                                            <div className="careerfy-services-text">{i18n.t('EmployeeDetail.AverageAge')} <small>{this.state.companyProfile.averageAge} </small></div>
                                                                                        </li>
                                                                                    }
                                                                                    {
                                                                                        this.state.companyProfile && !!this.state.companyProfile.numberOfStores && <li className={this.state.companyDetailWidget ? "careerfy-column-" + this.state.companyDetailWidget.columns : "careerfy-column-6"}>
                                                                                            <i className="careerfy-icon careerfy-buildings2"></i>
                                                                                            <div className="careerfy-services-text">{i18n.t('EmployeeDetail.NumberOfStores')} <small>{this.state.companyProfile.numberOfStores} </small></div>
                                                                                        </li>
                                                                                    }
                                                                                </ul>
                                                                            </div></div>
                                                                    </div>
                                                                </div>
                                                                <div className="careerfy-row grid m_0 " style={{ display: 'flex', flexWrap: 'wrap', paddingRight: '15px' }} >
                                                                    <div className="grid careerfy-column-6 db-img-sec pr-0">
                                                                        {
                                                                            this.renderWidgets(this.state.leftSideWidgets)
                                                                        }
                                                                    </div>
                                                                    <div className="grid careerfy-column-6 db-img-sec pr-0">
                                                                        {
                                                                            this.renderWidgets(this.state.leftSideSecondWidgets)
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="careerfy-row grid careerfy-column-4 db-img-sec-tw pr-0 four-col-widget" >{this.renderWidgets(this.state.rightSideWidgets)}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <aside className="careerfy-column-4 careerfy-typo-wrap wrksq_aside" style={{ marginTop: '38px' }}>
                                            <div className="careerfy-jobdetail-content careerfy-employerdetail-content">
                                                <div className="careerfy-content-title"><h2 className="sub_heading">{i18n.t('EmployeeDetail.Description')}</h2></div>
                                                <div className="careerfy-description">
                                                    <div className="textWidget" dangerouslySetInnerHTML={{ __html: this.state.companyProfile.description }} />
                                                </div>
                                            </div>
                                            {
                                                this.state.companyProfile && !!this.state.companyProfile.name && this.state.companyProfile.name.toLowerCase() != 'metro' &&
                                                <JobApply companyId={this.state.companyProfile.companyId} currentProfile={this.state.companyProfile}></JobApply>
                                            }

                                            {
                                                this.state.companyProfile && !!this.state.companyProfile.name && this.state.companyProfile.name.toLowerCase() == 'metro' &&
                                                <DropCreate companyName={this.state.companyProfile.name}></DropCreate>
                                            }

                                            {
                                                this.state.jobsCount > 0 &&
                                                <div className="careerfy-job wrksq_joblisting careerfy-joblisting-classic careerfy-jobdetail-joblisting">
                                                    <div className="careerfy-section-title" style={{ cursor: "pointer" }} onClick={() => this.onTabChange(4, "/" + this.state.companyProfile.name + "/jobs")}><h2 className="sub_heading">{i18n.t('EmployeeDetail.ActiveJobs')} {this.state.companyProfile.name}</h2></div>
                                                    <ul className="careerfy-row hide-pagination" >
                                                        <Jobs jobs={this.state.companyRecentJobs} size={3} companyId={this.state.companyProfile.companyId} showFacet={false}></Jobs>

                                                    </ul>
                                                    <a style={{ cursor: "pointer" }} onClick={() => this.onTabChange(4, "/" + this.state.companyProfile.name + "/jobs")} className="widget_view_jobs_btn">{i18n.t('EmployeeDetail.ViewAllJobs')} <i className="careerfy-icon careerfy-arrows32"></i></a>
                                                </div>
                                            }
                                            <div className="widget jobsearch_widget_map  wrksq_map">
                                                {/* <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d22589232.038285658!2d-103.9763543971716!3d46.28054447273778!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2s!4v1507595834401"></iframe> */}
                                                <GoogleMap center={{ lat: this.state.companyProfile.latitude, lng: this.state.companyProfile.longitude }}
                                                    height='35vh'
                                                    zoom={18}></GoogleMap>
                                            </div>
                                        </aside>
                                    </div> : ''}

                                {this.state.innerPage === 2 ? <div className="careerfy-column-12 " style={{ padding: "0px" }}> <Meetheteam teams={this.state.companyProfile.companyTeamDetails} /> </div> : ''}

                                {this.state.innerPage === 6 ? <div className="careerfy-column-12 spinTab location-inner-tabs" style={{ padding: "0px" }}>

                                    <ul>
                                        <li onClick={() => this.setState({ locationNumber: 1 })} className={this.state.locationNumber === 1 ? "tabActive" : "job-tab-btn"}>Montréal</li>
                                        <li onClick={() => this.setState({ locationNumber: 2 })} className={this.state.locationNumber === 2 ? "tabActive" : "job-tab-btn"}>Trois-Rivières</li>
                                        <li onClick={() => this.setState({ locationNumber: 3 })} className={this.state.locationNumber === 3 ? "tabActive" : "job-tab-btn"}>Magog</li>

                                    </ul>

                                </div> : ''}

                                {
                                    (this.state.locationNumber == 1 || this.state.locationNumber == 2 || this.state.locationNumber == 3) && <div className="location-tab-content">
                                        <div className="careerfy-row grid m_0">

                                            <div className="grid-item careerfy-column-8 p_0">
                                                {
                                                    this.renderTopLeftWidget()

                                                }
                                                <div className="careerfy-row grid m_0 " style={{ display: 'flex', flexWrap: 'wrap', paddingRight: '15px' }} >
                                                    <div className="grid careerfy-column-6 db-img-sec pr-0">
                                                        {
                                                            this.renderWidgets(this.state.leftSideWidgets)
                                                        }
                                                    </div>
                                                    <div className="grid careerfy-column-6 db-img-sec pr-0">
                                                        {
                                                            this.renderWidgets(this.state.leftSideSecondWidgets)
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="careerfy-row grid careerfy-column-4 db-img-sec-tw pr-0 four-col-widget" >{this.renderWidgets(this.state.rightSideWidgets)}</div>

                                        </div>
                                    </div>
                                }

                                {this.state.innerPage === 3 ? <div className="careerfy-column-12 " style={{ padding: "0px" }}> <Whatwedo companyTeamMediaList={this.state.companyProfile.companyTeamMediaList} companyTeamDetailData={this.state.companyProfile.companyTeamDetailData} profile={this.state.companyProfile} tabChange={this.onTabChange} /></div> : ''}

                                {this.state.innerPage === 5 ? <div className="careerfy-column-12 " style={{ padding: "0px" }}> <YoutubeLive teams={this.state.companyProfile.companyTeamDetails} profile={this.state.companyProfile} jobsCount={this.state.jobsCount} /> </div> : ''}

                                {this.state.innerPage === 4 ? <div className="careerfy-column-12 " style={{ padding: "0px" }}>
                                    <div className="container jobs_tab_page" >
                                        <div className="row">
                                            <div className="col-sm-8" >
                                                <ul className="careerfy-row">
                                                    <JobSearch companyId={this.state.companyProfile.companyId}></JobSearch>
                                                    {/* <Jobs jobs={this.state.companyAllJobs} size={10} companyId={this.state.companyProfile.companyId} showFacet={true}></Jobs> */}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div> : ''}

                                {
                                    this.state.innerPage == 7 &&

                                    <div className="careerfy-gallery careerfy-simple-gallery cusm-main-container">
                                        <div className="container">
                                            <div className="grid-item careerfy-column-12 p_0">
                                                <div className="careerfy-row grid m_0">
                                                    <div className="grid-item careerfy-column-12 p_0">

                                                        {/* {
                                                            this.renderTopLeftWidget()

                                                        } */}
                                                        <div className="clearfix careerfy-row grid m_0 " style={{ display: 'flex', flexWrap: 'wrap', paddingRight: '15px' }} >
                                                            <div className="grid careerfy-column-4 db-img-sec pr-0">
                                                                {
                                                                    this.renderWidgets(this.state.leftSideWidgets)
                                                                }
                                                            </div>
                                                            <div className="grid careerfy-column-4 db-img-sec pr-0">
                                                                {
                                                                    this.renderWidgets(this.state.leftSideSecondWidgets)
                                                                }
                                                            </div>
                                                            <div className="grid careerfy-column-4 db-img-sec pr-0">
                                                                {
                                                                    this.renderWidgets(this.state.rightSideWidgets.slice(0, this.state.rightSideWidgets.length - 5))
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/* <div className="careerfy-row grid careerfy-column-4 db-img-sec-tw pr-0 four-col-widget" ></div> */}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>

                </div>
                {this.state.isOpen && <div>
                    <div className="careerfy-modal careerfy-typo-wrap fade-in" id="JobSearchModalSignup">
                        <div className="modal-inner-area">&nbsp;</div>
                        <div className="modal-content-area">
                            <div className="modal-box-area video-modal profile-meta">
                                <a className="video-arrow arrow-left" onClick={() => this.playPreviousVideo()}><i className="careerfy-icon careerfy-right-arrow"></i></a>
                                <div className="careerfy-modal-title-box">
                                    <h2>Video</h2>


                                    <span className="modal-close" onClick={() => this.openModal(null, false, this.state.thumbnail)}><i className="fa fa-times"></i></span>
                                </div>
                                <div className="share-icon-video">
                                    <div className="copy-video-url">
                                        <input type="text" value={window.location + "?url=" + this.state.videos[this.state.videoIndex] + "&isvideo=true"} />  <CopyToClipboard text={window.location + "?url=" + this.state.videos[this.state.videoIndex] + "&isvideo=true"}>
                                            <i class="fa fa-clone" aria-hidden="true"></i>
                                        </CopyToClipboard>
                                    </div>
                                    <ul className="careerfy-jobdetail-media">
                                        <li>{i18n.t('General.ShareButtonLabel')}:</li>
                                        <li><FacebookShareButton url={window.location + "?url=" + this.state.videos[this.state.videoIndex] + "&isvideo=true"} className="share">
                                            <FacebookIcon size={25} round={true} />
                                        </FacebookShareButton></li>
                                        <li><TwitterShareButton url={window.location + "?url=" + this.state.videos[this.state.videoIndex] + "&isvideo=true"} className="share">
                                            <TwitterIcon size={25} round={true} />
                                        </TwitterShareButton></li>
                                        <li><LinkedinShareButton url={window.location + "?url=" + this.state.videos[this.state.videoIndex] + "&isvideo=true"} className="share">
                                            <LinkedinIcon size={25} round={true} />
                                        </LinkedinShareButton></li>
                                        <li><EmailShareButton url={window.location + "?url=" + this.state.videos[this.state.videoIndex] + "&isvideo=true"} className="share">
                                            <EmailIcon size={25} round={true} />
                                        </EmailShareButton></li>
                                    </ul>
                                </div>
                                <div className="playerBox">
                                    {this.state.videos[this.state.videoIndex].includes("youtu") ? <ReactPlayer url={this.state.videos[this.state.videoIndex]} playing width={1083} height={609} controls style={{ maxWidth: '100%', width: '100%' }} /> : <Iframe className="iframePlayer" url={this.state.videos[this.state.videoIndex]} />}
                                </div>
                                <a className="video-arrow arrow-right" onClick={() => this.playNextVideo()}><i className="careerfy-icon careerfy-right-arrow"></i></a>
                            </div>
                        </div>
                    </div>
                </div>
                }
                {this.state.isLargeViewOpened && (
                    <Lightbox
                        reactModalProps={{ shouldReturnFocusAfterClose: false }}
                        mainSrc={this.state.images[this.state.photoIndex]}
                        nextSrc={this.state.images[(this.state.photoIndex + 1) % this.state.images.length]}
                        prevSrc={this.state.images[(this.state.photoIndex + this.state.images.length - 1) % this.state.images.length]}
                        onCloseRequest={() => this.setState({ isLargeViewOpened: false })}
                        onMovePrevRequest={this.goToPrevious}
                        onMoveNextRequest={this.goToNext}
                        toolbarButtons={[
                            <div className="share-icon-video">
                                <div className="copy-video-url">
                                    <input type="text" value={window.location + "?url=" + this.state.images[this.state.photoIndex] + "&isvideo=false"} />  <CopyToClipboard text={window.location + "?url=" + this.state.images[this.state.photoIndex] + "&isvideo=false"}>
                                        <i class="fa fa-clone" aria-hidden="true"></i>
                                    </CopyToClipboard>
                                </div>
                                <ul className="careerfy-jobdetail-media">
                                    <li>{i18n.t('General.ShareButtonLabel')}:</li>
                                    <li><FacebookShareButton url={window.location + "?url=" + this.state.images[this.state.photoIndex] + "&isvideo=false"} className="share">
                                        <FacebookIcon size={25} round={true} />
                                    </FacebookShareButton></li>
                                    <li><TwitterShareButton url={window.location + "?url=" + this.state.images[this.state.photoIndex] + "&isvideo=false"} className="share">
                                        <TwitterIcon size={25} round={true} />
                                    </TwitterShareButton></li>
                                    <li><LinkedinShareButton url={window.location + "?url=" + this.state.images[this.state.photoIndex] + "&isvideo=false"} className="share">
                                        <LinkedinIcon size={25} round={true} />
                                    </LinkedinShareButton></li>
                                    <li><EmailShareButton url={window.location + "?url=" + this.state.images[this.state.photoIndex] + "&isvideo=false"} className="share">
                                        <EmailIcon size={25} round={true} />
                                    </EmailShareButton></li>
                                </ul>
                            </div>
                        ]}
                    />
                )}
                {/* <FooterG></FooterG> */}
            </div >


        );
    }

    renderWidgets(widgets) {
        if (widgets && widgets.length > 0) {
            return widgets.map((widget, index) => {
                const { companyMediaId, isSocialWidget, content, isEmptyWidget } = widget;
                let id = 0; let url = ''; let thumbnail = ''; let isVideo = ''; let isSocialLink = ''; let socialLink = '';
                if (companyMediaId) {
                    const media = this.state.companyMediaList.find(x => x.id == companyMediaId);
                    id = media.id; url = media.url; thumbnail = media.thumbnail; isVideo = media.isVideo; isSocialLink = media.isSocialLink; socialLink = media.socialLink;
                }

                return (
                    <Fragment key={index}>
                        {

                            widget.name == "ParityWidget" && <div className={widget ? " pr-0 grid-item hover-effect twitterWidget careerfy-column-" + widget.columns : " pr-0 hover-effect careerfy-column-6"}>
                                <div className="careerfy-description">

                                    <div className="parity-wrap textWidget">
                                        <h3>{i18n.t('EmployeeDetail.ParityWidgetheaderText')}</h3>
                                        <ul>
                                            <li>
                                                <i class="fa fa-venus"></i>
                                                <span>{widget.workingWomens}%</span>   </li>
                                            <li>
                                                <i class="fa fa-mars"></i>
                                                <span>{widget.workingMens}%</span>   </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        }

                        {
                            widget.name == "SocialAddresses" && (!!widget.facebookUrl || !!widget.linkedInUrl || !!widget.twitterUrl || !!widget.instagramUrl) && <div className={widget ? " pr-0 grid-item hover-effect  careerfy-column-" + widget.columns : " pr-0 hover-effect careerfy-column-6"}>
                                <div className="careerfy-description">

                                    <div className="box-border-icons">
                                        <h3 class="box-heading" >{i18n.t('EmployeeDetail.SocialWidgetheaderText')}</h3>
                                        <ul>
                                            {
                                                !!widget.facebookUrl &&
                                                <li>
                                                    <a href={widget.facebookUrl} target="_blank" >
                                                        <i className="fa fa-facebook" aria-hidden="true" ></i></a></li>
                                            }
                                            {
                                                !!widget.linkedInUrl &&
                                                <li ><a href={widget.linkedInUrl} target="_blank">
                                                    <i className="fa fa-linkedin" aria-hidden="true"></i></a></li>
                                            }
                                            {
                                                !!widget.twitterUrl &&
                                                <li ><a href={widget.twitterUrl} target="_blank">
                                                    <i className="fa fa-twitter" aria-hidden="true"></i></a></li>
                                            }
                                            {
                                                !!widget.instagramUrl &&
                                                <li ><a href={widget.instagramUrl} target="_blank">
                                                    <i className="fa fa-instagram" aria-hidden="true"></i></a></li>
                                            }
                                        </ul>  </div> </div>
                            </div>
                        }

                        {

                            widget.name == "TwitterWidget" && <div className={widget ? "grid-item hover-effect twitterWidget pr-0 careerfy-column-" + widget.columns : "hover-effect careerfy-column-6 pr-0"}>
                                <div className="">
                                    <TwitterTimelineEmbed
                                        sourceType="profile"
                                        screenName={widget.screenName}
                                        options={{ height: 400, tweetLimit: "1", chrome: "nofooter noborders", backGroundColor: "blue" }}
                                        // theme="dark"
                                        backGroundColor="red"
                                    />
                                    {/* <InstagramEmbed
            url='https://www.instagram.com/p/B9oEwOnJF-G/?utm_source=ig_web_copy_link'
            maxWidth={320}
            hideCaption={false}
            containerTagName='div'
        />
        <FacebookProvider appId="2620928294682644">
            <EmbeddedPost href="https://www.facebook.com/SarcasmHubb/photos/a.659133287438509/3270557822962696/?type=3&theater" width="500" />
        </FacebookProvider> */}
                                </div>
                            </div>
                        }



                        {
                            (widget.name != "TwitterWidget" && widget.name != "SocialAddresses" && widget.name != "ParityWidget") && content && !isEmptyWidget && isSocialWidget && <div className={widget ? " pr-0 grid-item hover-effect  careerfy-column-" + widget.columns : " pr-0 hover-effect careerfy-column-6"}>
                                <div className="careerfy-description">
                                    <div className="textWidget" dangerouslySetInnerHTML={{ __html: content }} />
                                </div>
                            </div>
                        }
                        {
                            (widget.name != "TwitterWidget" && widget.name != "SocialAddresses" && widget.name != "ParityWidget") && content && !isEmptyWidget && !isSocialWidget && <div className={widget ? " pr-0 grid-item hover-effect twitterWidget careerfy-column-" + widget.columns : " pr-0 hover-effect careerfy-column-6"}>
                                <div className="careerfy-description">
                                    <div className="textWidget" dangerouslySetInnerHTML={{ __html: content }} />
                                </div>
                            </div>
                        }
                        {
                            (widget.name != "TwitterWidget" && widget.name != "SocialAddresses" && widget.name != "ParityWidget") && !content && !isSocialWidget && isVideo && !isEmptyWidget && <div className={widget ? "grid-item  video_play one four pr-0  hover-effect careerfy-column-" + widget.columns : "hover-effect careerfy-column-6 four pr-0  one"}  >
                                <div className="widget-box" onClick={() => this.openModal(url, true, thumbnail)}>
                                    <img src={thumbnail} style={{ width: 'auto', maxHeight: '100vh' }} />
                                    <div className="overlay-text">
                                        <h6 >
                                            {this.getImageLabel(id)}
                                        </h6>
                                    </div>

                                    <div className="img_magnifier">
                                        <div className="hoverr_magnifier playhover_btn"><img src="https://my-cdn.azureedge.net/cdn/images/vide_play.png" /></div>
                                    </div>
                                </div>
                            </div>
                        }
                        {
                            (widget.name != "TwitterWidget" && widget.name != "SocialAddresses" && widget.name != "ParityWidget") && !content && !isSocialWidget && !isVideo && !isEmptyWidget && <div className={widget ? "img_magnifire  grid-item hover-effect four pr-0 careerfy-column-" + widget.columns : " two  four pr-0 hover-effect careerfy-column-6"} style={{ position: "relative" }}>

                                <div className="widget-box">

                                    <img src={url} alt="website logo"
                                        style={{ width: '100%' }} onClick={() => this.openLinkInNewTab(isSocialLink, socialLink, url)} />
                                    {!isSocialLink && <div className="overlay-text">
                                        <h6 >
                                            {this.getImageLabel(id)}
                                        </h6>
                                    </div>}
                                    <div onClick={() => this.openLinkInNewTab(isSocialLink, socialLink, url)} className="img_magnifier" >
                                        <div className="hoverr_magnifier"><i className="careerfy-icon careerfy-search magnifire_icon"></i></div>
                                    </div>
                                </div>
                            </div>
                        }
                        {
                            (widget.name != "TwitterWidget" && widget.name != "SocialAddresses" && widget.name != "ParityWidget") && isEmptyWidget && <div className={widget ? "img_magnifire  grid-item hover-effect four pr-0 careerfy-column-" + widget.columns : " two  four pr-0 hover-effect careerfy-column-6"} style={{ position: "relative" }}>
                                <div className="widget-box"></div>
                            </div>
                        }
                    </Fragment>
                );
            });
        }
    }
    renderTopLeftWidget() {
        if (this.state.companyTopLeftWidget && this.state.companyTopLeftWidget.length > 0) {
            return this.state.companyTopLeftWidget.map((widget, index) => {
                const { companyMediaId, isSocialWidget } = widget;
                let id = 0; let url = ''; let thumbnail = ''; let isVideo = ''; let isSocialLink = ''; let socialLink = '';
                if (companyMediaId) {
                    const media = this.state.companyMediaList.find(x => x.id == companyMediaId);
                    id = media.id; url = media.url; thumbnail = media.thumbnail; isVideo = media.isVideo; isSocialLink = media.isSocialLink; socialLink = media.socialLink;
                }
                return (
                    <div key={index}>
                        {
                            isSocialWidget && <div className={widget ? "grid-item hover-effect careerfy-column-" + widget.columns : "hover-effect careerfy-column-6"}>
                                <TwitterTimelineEmbed
                                    sourceType="profile"
                                    screenName="CvSpin"
                                    options={{ height: 400, tweetLimit: "1" }}
                                />
                            </div>
                        }
                        {
                            !isSocialWidget && isVideo && <div className={widget ? "three grid-item hover-effect p_0 careerfy-column-" + widget.columns : "three p_0 hover-effect careerfy-column-6"}  >
                                <div className="widget-box" onClick={() => this.openModal(url, true, thumbnail)}>
                                    <img src={thumbnail}
                                        style={{ width: '100%' }} />
                                    <div className="overlay-text"><h6 >{this.getImageLabel(id)}</h6></div>
                                    <div className="img_magnifier">
                                        <div className="hoverr_magnifier playhover_btn"><img src="https://my-cdn.azureedge.net/cdn/images/vide_play.png" /></div>
                                    </div>
                                </div>
                            </div>

                        }
                        {
                            !isSocialWidget && !isVideo && <div className={widget ? "  grid-item hover-effect careerfy-column-" + widget.columns : " four hover-effect careerfy-column-6 four"} style={{ position: "relative" }}>
                                <div className="widget-box">
                                    <img src={url} alt="website logo"
                                        style={{ width: '100%' }} onClick={() => this.openLinkInNewTab(isSocialLink, socialLink, url)} />
                                    {!isSocialLink && <div onClick={() => this.openLinkInNewTab(isSocialLink, socialLink, url)} className="text-trasnparent"><h6 >{this.getImageLabel(id)}</h6></div>}</div>

                            </div>
                        }
                    </div>
                );
            });
        }
    }

    getImageLabel(id) {
        return this.state.languageLabels ? this.state.languageLabels.filter(p => p.mediaId == id)[0] && this.state.languageLabels.filter(p => p.mediaId == id)[0].description : '';
    }
}

function mapStateToProps(state) {
    const { EmployerReducer } = state;
    return {
        EmployerReducer
    };
}

export default connect(mapStateToProps)(withTranslation('common')(withRouter(EmployerDetail)));
