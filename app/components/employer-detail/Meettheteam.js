import * as React from 'react';
import { withTranslation } from '../../../i18n';
import Iframe from 'react-iframe'
import ReactPlayer from 'react-player'
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css'; // This only needs to be imported once in your app

class Meetheteam extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            teamDescription: "",
            followupDescription: "",
            teamMembers: [],
            leftSideMedia: [],
            rightSideMedia: [],
            isOpen: false,
            url: '',
            imageLargeUrl: "",
            openLargeView: false,
            largeViewMembers: []
        }
    }
    openModal(url, value) {
        this.setState({ url: url });
        this.setState({ isOpen: value });
    }
    openLightBox(url) {
        //creating Large image Url
        var firstPart = url.substr(0, url.lastIndexOf("."));
        var secondPart = url.substr(url.lastIndexOf("."));
        firstPart = firstPart + "-max";
        this.setState({ imageLargeUrl: firstPart + secondPart, openLargeView: true });
    }
    loadMore(id, showMore) {
        var memberIds = this.state.largeViewMembers;
        if (showMore) {
            memberIds.push(id);
        }
        else {
            memberIds = memberIds.filter(x => x != id);
        }
        this.setState({ largeViewMembers: memberIds });
    }
    render() {
        const { teams, i18n } = this.props;
        if (teams && teams.length > 0) {
            const team = teams[0];
            const description = team.companyTeamDetailDescription.find(
                x => { return (i18n.language == "en" ? x.languageId == 1 : x.languageId == 2) }
            );
            if (description) {
                this.state.teamDescription = description.teamDescription;
                this.state.followupDescription = description.followupDescription;
            }
            if (team.companyTeamMembers && team.companyTeamMembers.length > 0) {
                this.state.teamMembers = team.companyTeamMembers;
                this.state.leftSideMedia = team.companyTeamMembers;

                for (var i = 0; i < this.state.leftSideMedia.length > 0; i++) {
                    this.state.leftSideMedia[i].shortDesc = this.state.leftSideMedia[i].description && this.state.leftSideMedia[i].description.length > 249 ? this.state.leftSideMedia[i].description.replace(/^(.{252}[^\s]*).*/, "$1") + "\n" : this.state.leftSideMedia[i].description
                }
            }

        }


        return (
            <div className="container-fulid whatWedo" style={{ maxWidth: '91%', margin: 'auto' }} >

                <div className="activites">

                    <div className="activites_desc">
                        <h2 className="underline main_heading">{i18n.t('General.MeetTheTeamTitle')}</h2>
                        <p className="desc_text" dangerouslySetInnerHTML={{ __html: this.state.teamDescription }}></p>
                    </div>
                    <div className="meetTeam_card" >

                        {
                            this.state.leftSideMedia.map((member, index) => {
                                return (

                                    <div className="card-col">
                                        <div className="activity_card">
                                            <div className="what_card_img" onClick={() => member.isVedio ? this.openModal(member.mediaUrl, true) : this.openLightBox(member.mediaUrl)}>
                                                <img src={member.isVedio ? member.thumbnail : member.mediaUrl} />
                                                <div class="img_magnifier">
                                                    <div class="hoverr_magnifier playhover_btn">{

                                                        member.isVedio ? <img src="../static/assets/images/vide_play.png" /> : <i className="careerfy-icon careerfy-search magnifire_icon"></i>}</div>
                                                </div>
                                            </div>
                                            <div className="what_card_content">
                                                <h4 className="what_subheading underline"> {member.name}  </h4>
                                                {
                                                    this.state.largeViewMembers && this.state.largeViewMembers.indexOf(member.id) <= -1 &&
                                                    <p className="desc_text">{member.shortDesc} {
                                                         this.state.largeViewMembers &&  !!member.description && member.description.length > 250 &&  <span onClick={() => { this.loadMore(member.id, true) }}>{i18n.t('General.ShowMore')}</span>
                                                    }
                                                    </p>

                                                }
                                                {
                                                    this.state.largeViewMembers && this.state.largeViewMembers.indexOf(member.id) > -1 &&
                                                    <p className="desc_text"> {member.description} <span onClick={() => { this.loadMore(member.id, false) }}>{i18n.t('General.ShowLess')}</span></p>
                                                }
                                            </div>
                                        </div>
                                    </div>);
                            })

                        }

                    </div>
                </div>

                {/* sidebar content */}
                <div className="sidebar_tabs  ">
                    <div className="what_sidebar">
                        <h2 className="underline main_heading ">{i18n.t('General.FollowUpLabel')}</h2>
                        <div className="social_box">
                            <ul class="social_icon list-inline ">
                                <li class="list-inline-item"><a href="#" class="rounded"><i class="fa fa-facebook"></i></a></li>
                                <li class="list-inline-item"><a href="#" class="rounded"><i class="fa fa-twitter"></i></a></li>
                                <li class="list-inline-item"><a href="#" class="rounded"><i class="fa fa-instagram"></i></a></li>
                                <li class="list-inline-item"><a href="#" class="rounded"><i class="fa fa-whatsapp"></i></a></li>
                                <li class="list-inline-item"><a href="#" class="rounded"><i class="fa fa-linkedin"></i></a></li>

                            </ul>
                        </div>
                        <p className="desc_text">
                            {this.state.followupDescription}
                        </p>
                    </div>
                    {/* 
                    {
                        this.state.rightSideMedia.map((member, index) => {
                            return (

                                <div className="card-col">
                                    <div className="activity_card">
                                        <div className="what_card_img" onClick={() => this.openModal(member.mediaUrl, true)}>
                                            <img src={member.isVedio ? member.thumbnail : member.mediaUrl} />
                                            <div class="img_magnifier">
                                                <div class="hoverr_magnifier playhover_btn">{

                                                    member.isVedio ? <img src="/assets/images/vide_play.png" /> : <i class="careerfy-icon careerfy-search magnifire_icon"></i>}</div>
                                            </div>
                                        </div>
                                        <div className="what_card_content">
                                            <h4 className="what_subheading underline"> {member.name}  </h4>
                                            <p className="desc_text"> {member.description}</p>
                                        </div>
                                    </div>
                                </div>);
                        })

                    } */}

                </div>

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
                                    {/* <Iframe url={this.state.url} playing width={1083} height={609} controls style={{ maxWidth: '100%', width: '100%' }} /> */}
                                    {/* <ReactPlayer url={this.state.url} playing width={1083} height={609} controls style={{ maxWidth: '100%', width: '100%' }} /> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                }

                {this.state.openLargeView && (
                    <Lightbox
                        mainSrc={this.state.imageLargeUrl}
                        onCloseRequest={() => this.setState({ openLargeView: false })}

                    />
                )}
            </div>

        );
    }
}
export default withTranslation('translation')(Meetheteam);
