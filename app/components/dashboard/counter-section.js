import React, { Fragment } from 'react';
import { withTranslation } from '../../../i18n';
import { companyService } from '../../services/company.service'

class CounterSection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            companies: []
        }
    }
    componentDidMount() {
        companyService.getDashboardCompanies().then((res) => {
            this.setState({ companies: res });

        })
    }

    removeTags(str) {
        if ((str === null) || (str === ''))
            return false;
        else
            str = str.toString();

        // Regular expression to identify HTML tags in  
        // the input string. Replacing the identified  
        // HTML tag with a null string. 
        return str.replace(/(<([^>]+)>)/ig, '');
    }

    render() {
        const { i18n } = this.props;
        return (
            <div className="careerfy-main-section " >
                <div className="container">
                    <div className="row">
                        <div className="col-md-12 col-sm-12">
                            <div className="careerfy-counter">
                                {
                                    this.renderData()
                                }
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        );
    }

    renderData() {
        const { i18n } = this.props;
        var permanentClients = this.state.companies.filter(x => x.isFutureClient != true);
        var futureClients = this.state.companies.filter(x => x.isFutureClient == true);
        return (
            <div className="row " style={{ marginBottom: '3em' }} >
                <div className="col-md-12" style={{ marginTop: '3em' }} >
                    <section className="careerfy-fancy-title">
                        <h2>{i18n.t('Banner.FindCompanyLabel')}</h2>
                        <p>{i18n.t('Banner.FindCompanyParagraph')}</p>
                    </section>
                    <div className="careerfy-blog careerfy-blog-grid">
                        <ul className="blog-items">
                            {
                                permanentClients.map((company, index) => {
                                    var reqLength = 80;
                                    var companyDesc = this.removeTags(company.businessDescription);
                                    if (companyDesc.length > reqLength) {
                                        var nextStr = companyDesc.substr(reqLength);
                                        var firstSpaceIndex = nextStr.indexOf(" ");
                                        companyDesc = firstSpaceIndex > 0 ? companyDesc.substr(0, (reqLength + firstSpaceIndex)) : companyDesc.substr(0, reqLength);
                                    }
                                    const profileUrl = "/" + company.name;
                                    // const description = !!company.businessDescription ? (company.businessDescription.length > 100 ? company.businessDescription.substr(0, 90) : company.businessDescription) : "";
                                    const industry = company.industries.find(x => { return this.props.i18n.language == "en" ? x.languageId == 1 : x.languageId == 2 })
                                    return (
                                        <li className="blog-home-item" key={index}>
                                            <div onClick={() => window.location.href = profileUrl}>
                                                <figure><img src={company.companyLogoUrl} alt="" /></figure>
                                                <div className="careerfy-blog-grid-text">
                                                    <div className="careerfy-blog-tag"> <a href={company.name}>{industry ? industry.description : ""} </a> </div>
                                                    <h2 style={{height:"90px"}}>{company.displayName}</h2>
                                                    <div className="textWidget" dangerouslySetInnerHTML={{ __html: companyDesc }} />
                                                    <a className="read-more-btn" href={profileUrl}>{i18n.t('Banner.SeeMoreBtnText')} </a>
                                                    <span className="careerfy-read-more careerfy-bgcolor">{i18n.t('Banner.ViewProfilBtnText')}</span>
                                                </div>
                                            </div>
                                        </li>
                                    )
                                })
                            }


                        </ul>
                    </div>
                    {
                        futureClients && futureClients.length > 0 &&
                        <Fragment>
                            <section className="careerfy-fancy-title">
                                <h2>{i18n.t('Banner.FutureClientLabel')}</h2>
                            </section>
                            <div className="careerfy-blog careerfy-blog-grid">
                                <ul className="blog-items" style={{ cursor: "none" }}>
                                    {
                                        futureClients.map((company, index) => {
                                            var reqLength = 80;
                                            var companyDesc = this.removeTags(company.businessDescription);
                                            if (companyDesc.length > reqLength) {
                                                var nextStr = companyDesc.substr(reqLength);
                                                var firstSpaceIndex = nextStr.indexOf(" ");
                                                companyDesc = firstSpaceIndex > 0 ? companyDesc.substr(0, (reqLength + firstSpaceIndex)) : companyDesc.substr(0, reqLength);
                                            }
                                            const profileUrl = "/" + company.name;
                                            // const description = !!company.businessDescription ? (company.businessDescription.length > 100 ? company.businessDescription.substr(0, 90) : company.businessDescription) : "";
                                            const industry = company.industries.find(x => { return this.props.i18n.language == "en" ? x.languageId == 1 : x.languageId == 2 })
                                            return (
                                                <li className="blog-home-item" key={index}>
                                                    <div>
                                                        <figure><img src={company.companyLogoUrl} alt="" /></figure>
                                                        <div className="careerfy-blog-grid-text">
                                                            <div className="careerfy-blog-tag"> <a>{industry ? industry.description : ""} </a> </div>
                                                            <h2 style={{height:"90px"}}>{company.displayName}</h2>
                                                            <div className="textWidget" dangerouslySetInnerHTML={{ __html: companyDesc }} />
                                                            <a className="read-more-btn">{i18n.t('Banner.SeeMoreBtnText')} </a>
                                                            <span className="careerfy-read-more careerfy-bgcolor">{i18n.t('Banner.FutureClientBtnText')}</span>
                                                        </div>
                                                    </div>
                                                </li>
                                            )
                                        })
                                    }


                                </ul>
                            </div>
                        </Fragment>
                    }
                </div>
            </div>
        )
    }
}

export default withTranslation('common')(CounterSection);