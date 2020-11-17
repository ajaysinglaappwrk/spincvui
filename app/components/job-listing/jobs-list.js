import React, { Fragment } from 'react';
import { withTranslation, i18n } from '../../../i18n';

class Jobs extends React.Component {
    static getInitialProps = async ({ req }) => {
        const currentLanguage = req ? req.language : i18n.language;
        return { currentLanguage, namespacesRequired: ["common"] };
    };
    constructor(props) {
        super(props);
        this.state = {
            url: '',
            openJobVideo: false
        }
    }
    openJobVideoModal(url, value) {
        this.setState({ url: url });
        this.setState({ openJobVideo: value });
    }
    render() {
        return (
            <Fragment>
                <div className="container">
                    <div className="row">

                        <div className="col-sm-12" style={{ marginTop: '50px' }} >
                            <div className="careerfy-job careerfy-joblisting-classic">
                                <ul style={{ maxWidth: "100%" }}>
                                    {
                                        this.props.jobs.map((job, index) => {
                                            var jobdetail = job.jobs.filter(x => {
                                                return i18n.language == "en" ? x.languageId == 1 : x.languageId == 2
                                            })[0];
                                            job.title = jobdetail.title;
                                            job.color = jobdetail.color;

                                            if (job.industries != null) {
                                                var industry = job.industries.find(x => { return i18n.language == "en" ? x.languageId == 1 : x.languageId == 2 });
                                                if (industry) {
                                                    job.industryName = industry.description;
                                                }
                                            }
                                            if(job.jobTypes !=null)
                                            {
                                                var type= job.jobTypes.find(x=>{ return i18n.language == "en" ? x.jtd.languageId == 1 : x.jtd.languageId == 2 })
                                                if (type) {
                                                    job.type = type.jtd.jobDescription;
                                                }
                                            }

                                            return (<li key={index} className="careerfy-column-12">
                                                <div className="careerfy-joblisting-classic-wrap job-list-main profile-job">
                                                    <div className="figure_logo"><a href="#"><img src={job.companyLogoUrl} alt="" /></a></div>
                                                    <div className="careerfy-joblisting-text profile-job-desc">
                                                        <div className="careerfy-list-option">
                                                            <h2> 
                                                                <a href={`/${job.companyName}/job-detail/${job.jobPostingId}`}>{job.title}</a> </h2>
                                                            <ul>
                                                                <li><a href="#">{job.companyName}</a></li>
                                                                <div className="inline_li">
                                                                    <li><i className="careerfy-icon careerfy-maps-and-flags"></i> {job.locations}</li>
                                                                    <li><i className="careerfy-icon careerfy-filter-tool-black-shape"></i> {job.industryName}</li>
                                                                </div>
                                                            </ul>
                                                        </div>
                                                       
                                                        <div className="careerfy-job-userlist">
                                                        {!!job.videoLink && this.props.showJobVideo &&
                                                                <button className="video-pop-btn" onClick={() => this.openJobVideoModal(job.videoLink, true)}><i className="fa fa-youtube-play"></i> See Job Video</button>
                                                        }
                                                            <a href="#" className={!job.color ? "careerfy-option-btn" : "careerfy-option-btn careerfy-" + job.color}>{!job.type ? "Temps plein" : job.type}</a>
                                                        </div>
                                                        <div className="clearfix"></div>
                                                    </div>
                                                </div>
                                            </li>)
                                        })
                                    }
                                </ul>
                            </div>
                        </div>

                    </div>
                </div>

            </Fragment>
        )
    }
}

export default withTranslation('translation')(Jobs);