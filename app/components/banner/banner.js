import React, { Fragment } from 'react';
import ReactPlayer from 'react-player';
import {
    ReactiveBase,
    MultiDropdownList,
    DataSearch
} from "@appbaseio/reactivesearch";
import { withTranslation, i18n } from '../../../i18n';

class Banner extends React.Component {
    static getInitialProps = async ({ req }) => {
        const currentLanguage = req ? req.language : i18n.language;

        return { currentLanguage, namespacesRequired: ["common"] };
    };
    constructor(props) {
        super(props);
        this.state = {
            searchTerm: '',
            selectedIndustries: [],
            selectedLocations: []
        }


    }
    componentDidMount() {
        window.addEventListener('keydown', (event) => {
            var search = document.getElementById("SearchSensor-downshift-input");

            if (event.keyCode == 13)
                window.location.href = '/jobs?searchterm=' + (!!search ? search.value : '') + "&locations=" + this.state.selectedLocations + "&industries=" + this.state.selectedIndustries;
        });
    }

    search() {
        window.location.href = '/jobs?searchterm=' + this.state.searchTerm + "&locations=" + this.state.selectedLocations + "&industries=" + this.state.selectedIndustries;
    }
    intersperse(arr, sep) {
        if (arr.length === 0) {
            return [];
        }

        return arr.slice(1).reduce(function (xs, x, i) {
            return xs.concat([sep, x]);
        }, [arr[0]]);
    }
    render() {
        return (
            <div className="careerfy-banner">
                <ReactPlayer url='/static/assets/video/video_1280.mp4' playing className="videobg" />
                {/* <video loop autoPlay className="videobg">
                    <source src='assets/video/video_1280.mp4' type="video/mp4" />
                </video> */}
                <span className="careerfy-banner-transparent"></span>
                <div className="careerfy-banner-caption">
                    <div className="container">
                        <h1>{this.props.t('Banner.Header')}</h1>
                        <p>{this.props.t('Banner.BannerParagraph')}</p>
                        <div className="home-search-list">
                            <form className="careerfy-banner-search">
                                <ReactiveBase
                                    app="jobs"
                                    credentials="LqovKbCGD:35e56a57-a426-4b1d-827c-8cb45cd12772"
                                    enableAppbase
                                    url="https://arc-cluster-spincvalpha-ne22bm.searchbase.io"
                                >
                                    <ul className="home-search-options">
                                        <li>
                                            <DataSearch showVoiceSearch={true} componentId="SearchSensor" dataField={i18n.language == "en" ?
                                                ['JobNumber', 'JobNumber.search', 'TitleEN', 'TitleEN.search', 'TitleEN.keyword',
                                                    'CompanyName', 'CompanyName.search',
                                                    'IndustryNameEN', 'IndustryNameEN.keyword', 'IndustryNameEN.search',
                                                    'Locations', 'Locations.keyword', 'Locations.search',
                                                    'JobDescriptionEN', 'JobDescriptionEN.search', 'JobDescriptionEN.keyword',
                                                    'JobTypeEN', 'JobTypeEN.keyword', 'JobTypeEN.search'
                                                ] :
                                                ['JobNumber', 'JobNumber.search', 'TitleFR', 'TitleFR.search', 'TitleFR.keyword',
                                                    'CompanyName', 'CompanyName.search',
                                                    'IndustryNameFR', 'IndustryNameFR.keyword', 'IndustryNameFR.search',
                                                    'Locations', 'Locations.keyword', 'Locations.search',
                                                    'JobDescriptionFR', 'JobDescriptionFR.search', 'JobDescriptionFR.keyword',
                                                    'JobTypeFR', 'JobTypeFR.keyword', 'JobTypeFR.search'
                                                ]} queryFormat="and"
                                                placeholder={i18n.t('Banner.PlaceHolder1')}
                                                showClear={true}
                                                showFilter={false}
                                                iconPosition="right"
                                                onValueChange={(value) => {
                                                    this.setState({ searchTerm: value })
                                                }}
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

                                            {/* <input placeholder={i18n.t('Banner.PlaceHolder1')} type="text" /> */}
                                        </li>
                                        <li>
                                            <MultiDropdownList
                                                componentId="LocationsSensor"
                                                dataField="Locations.keyword"
                                                placeholder={i18n.t('Banner.PlaceHolder2')}
                                                onValueChange={(result) => {
                                                    this.setState({ selectedLocations: result })
                                                }
                                                }
                                                id="location-sensor"
                                            />
                                            {/* <input placeholder={i18n.t('Banner.PlaceHolder2')} type="text" />
                                            <i className="careerfy-icon careerfy-location"></i> */}
                                        </li>
                                        {/* <li>
                                            <div className="careerfy-select-style">
                                                 <MultiDropdownList
                                                    componentId="IndustriesSensor"
                                                    dataField={i18n.language == "en" ? "IndustryNameEN.keyword" : "IndustryNameFR.keyword"}
                                                    placeholder="Select Industries"
                                                    onValueChange={(result) => {

                                                        this.setState({ selectedIndustries: result })
                                                    }
                                                    }
                                                /> 
                                             <select>
                                                <option>Comptable</option>
                                                <option>IT</option>
                                                <option>Administration</option>
                                            </select> 
                                            </div>
                                        </li> */}
                                        <li className="careerfy-banner-submit"> <span ref={input => this.inputElement = input} onClick={() => this.search()}> <i className="careerfy-icon careerfy-search"></i></span> </li>
                                    </ul>
                                </ReactiveBase>
                            </form>
                        </div>
                        <div className="careerfy-banner-btn">
                            <a href="/post-a-job" className="careerfy-bgcolorhover"><i className="careerfy-icon careerfy-portfolio"></i>{i18n.t('Banner.Button1')} </a>
                            {/* <a href="" className="careerfy-bgcolorhover"><i className="careerfy-icon careerfy-arrows-2"></i>{i18n.t('Banner.Button')} </a> */}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withTranslation('common')(Banner);
