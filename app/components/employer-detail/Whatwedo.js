import React, { Fragment } from 'react';
import {  Card, Accordion  } from 'react-bootstrap';
import Slider from "react-slick";
import { withTranslation } from '../../../i18n';

class Whatwedo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentEventKey: [0],
            teamSkills: [],
            teamDetail: { teamDescription: "", followupDescription: "", teamServicesTitle: "" },
            clients: [],
            firstImage: null,
            secondImage: null,
            teamQuote: null,
            teamMembers: [],
            companyProfile: null
        }
    }

    onPanelClicked(currentEventKey) {
        document.getElementsByClassName("Skill_accordian")[0].children[0].children[1].classList.remove('show');
        if (this.state.currentEventKey.indexOf(currentEventKey) > -1) {
            this.setState({ currentEventKey: [] });
        } else {
            this.setState({ currentEventKey: [] });
            this.setState({ currentEventKey: [currentEventKey] });
        }
    }

    componentDidMount() {
        if (this.state.teamSkills.length > 0)
            document.getElementsByClassName("Skill_accordian")[0].children[0].children[1].classList.add('show');
    }
    goToJobs() {
        window.scrollTo(0, 0);
        this.props.tabChange(4, "/" + this.state.companyProfile.name + "/jobs");
    }

    render() {
        var { companyTeamDetailData, companyTeamMediaList, i18n, profile } = this.props;

        if (companyTeamDetailData && companyTeamDetailData.length > 0) {
            this.state.companyProfile = profile;
            const detail = companyTeamDetailData[0];
            this.state.teamSkills = detail.companyTeamSkills.filter(x => { return (i18n == "en" ? x.languageId == 1 : x.languageId == 2) });
            const teamDetailDescription = detail.companyTeamDetailDescription.find(x => { return (i18n == "en" ? x.languageId == 1 : x.languageId == 2) });
            this.state.teamDetail.teamDescription = teamDetailDescription.teamDescription;
            this.state.teamDetail.followupDescription = teamDetailDescription.followupDescription;
            this.state.teamDetail.teamServicesTitle = teamDetailDescription.teamServicesTitle;
            if (detail && detail.companyClients && detail.companyClients.length > 0) {
                this.state.clients = detail.companyClients;
            }

            if (detail.companyTeamMembers && detail.companyTeamMembers.length > 0) {
                this.state.teamMembers = detail.companyTeamMembers.filter(x => { return x.isFirstMedia != true });
                const firstImage = detail.companyTeamMembers.find(x => { return x.isFirstMedia == true });
                if (firstImage) {
                    this.state.firstImage = firstImage.mediaUrl;
                }

                const secondImage = detail.companyTeamMembers.find(x => { return (x.isFirstMedia != true && !!x.mediaUrl) });
                const teamQuote = detail.companyTeamMembers.find(x => { return (x.isFirstMedia != true && !!x.content) });
                if (secondImage) {
                    this.state.secondImage = secondImage.mediaUrl;
                }
                if (teamQuote) {
                    this.state.teamQuote = teamQuote.content;
                }
            }
        }
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
            responsive: [
                {
                    breakpoint: 768,
                    settings: {
                        arrows: true,
                        centerMode: true,
                        centerPadding: '40px',
                        slidesToShow: 3
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
        return (
            <div className="container-fulid whatWedo what-we-do-bg" style={{ maxWidth: '91%', margin: 'auto' }}>
                <div className=" activites">
                    <div className="activites_desc">
                        <h2 className="underline main_heading">{i18n.t('General.WhoWeAreTitle')}</h2>
                        <div className="who_we_content">
                            <div className="textWidget" dangerouslySetInnerHTML={{ __html: this.state.teamDetail.teamDescription }} />
                            <div className="right_text_we">
                                {
                                    this.state.firstImage && <img src={this.state.firstImage} />
                                }
                            </div>
                            <a onClick={() => this.goToJobs()} className="open_jobs_btn">{i18n.t('General.OpenJobsBtnText')}</a>
                        </div>
                    </div>
                    <div className="reviews-section">
                        <div className="review-outer">
                            {
                                // this.state.teamMembers.map((member, index) => {

                                //     return (
                                <Fragment>
                                    {
                                        this.state.secondImage && <div className="review-image" >
                                            <img src={this.state.secondImage} alt="Review_image" />
                                        </div>

                                    }
                                    {
                                        !!this.state.teamQuote &&
                                        <div className="review_content">
                                            <div className="title-decoration">
                                                <div className="quote_icon q_top">
                                                    <img src="https://my-cdn.azureedge.net/cdn/images/quote-top.png" alt="icon" />
                                                </div>
                                                <div className="review_title">
                                                    <div className="textWidget" dangerouslySetInnerHTML={{ __html: this.state.teamQuote }} />
                                                </div>
                                                <div className="quote_icon q_bottom">
                                                    <img src="https://my-cdn.azureedge.net/cdn/images/quote-bottom.png" alt="icon" />
                                                </div>
                                            </div>
                                        </div>
                                    }
                                </Fragment>

                                //     )
                                // })

                            }


                        </div>
                    </div>



                </div>

                {/* sidebar content */}
                <div className="sidebar_tabs  ">
                    <div className="what_sidebar">
                        <h2 className="underline main_heading ">{i18n.t('General.AboutUSLabel')}</h2>
                        <div className="textWidget" dangerouslySetInnerHTML={{ __html: this.state.teamDetail.followupDescription }} />

                        {
                            this.state.teamSkills && this.state.teamSkills.length > 0 &&
                            <div className="skills_section">
                                <h2 className="underline main_heading ">{i18n.t('General.SkillsLabel')}</h2>
                                <Accordion defaultActiveKey="0" className="Skill_accordian">
                                    {
                                        this.state.teamSkills.map((skill, index) => {
                                            return (
                                                <Card key={index} className="accr_card">
                                                    <Card.Header className={this.state.currentEventKey.indexOf(index) == 0 ? "accr_header active" : "accr_header"} onClick={() => this.onPanelClicked(index)}>
                                                        <Accordion.Toggle className="accr_text" eventKey={index}>
                                                            {skill.description}
                                                        </Accordion.Toggle>
                                                    </Card.Header>
                                                    <Accordion.Collapse eventKey={index}>
                                                        <Card.Body className="accr_body">
                                                            <div className="skill_progress">

                                                                {
                                                                    skill.companyTeamSkillSubcategories && skill.companyTeamSkillSubcategories.length > 0
                                                                    && skill.companyTeamSkillSubcategories.map((category, catIndex) => {
                                                                        const percentage = category.percentage + "%";
                                                                        return (<Fragment key={catIndex}><h6>{category.description}</h6>
                                                                            <div className="progress_bar">
                                                                                <div className="progres-bar-inner">
                                                                                    <div className="bar" style={{ color: '#000', width: percentage }}>
                                                                                        <p className="percent">{percentage}</p>
                                                                                    </div>
                                                                                </div>
                                                                            </div></Fragment>)

                                                                    })


                                                                }



                                                            </div>


                                                        </Card.Body>
                                                    </Accordion.Collapse>
                                                </Card>);

                                        })

                                    }


                                </Accordion>

                                {/* close accordian */}

                            </div>
                        }
                    </div>

                </div>
                {
                    companyTeamMediaList && companyTeamMediaList.length >= 4 &&

                    <div className="our-project-sec">
                        <h2 className="underline main_heading">{i18n.t('General.TeamServiceTitle')}</h2>
                        <Slider {...settings}>
                            {companyTeamMediaList && companyTeamMediaList.length > 0 && companyTeamMediaList.map((x, i) => (
                                <div className="slide" key={i}>
                                    <img src={x.url} />
                                </div>
                            ))}
                        </Slider>
                    </div>
                }

                {
                    companyTeamDetailData && companyTeamDetailData.length > 0 && companyTeamDetailData[0].companyTeamDetailFindJobs && companyTeamDetailData[0].companyTeamDetailFindJobs.length > 0 &&

                    companyTeamDetailData[0].companyTeamDetailFindJobs.map((current, index) => {
                        return (
                            <div key={index} className="find_jobs">
                                <div className="leftSide-content">
                                    <h2 className="underline main_heading">{i18n.t('General.FindJobheaderText')}</h2>
                                    <p>  <div dangerouslySetInnerHTML={{ __html: current.description }} /></p>
                                    <a onClick={() => this.goToJobs()} className="find_job_btn">{i18n.t('General.FindJobBtnText')}</a>
                                </div>
                                <div className="right-side-content">
                                    {
                                        !!current.mediaUrl && <img src={current.mediaUrl} />
                                    }
                                </div>
                            </div>
                        )
                    })

                }

            </div >

        );
    }
}
export default withTranslation('translation')(Whatwedo);
