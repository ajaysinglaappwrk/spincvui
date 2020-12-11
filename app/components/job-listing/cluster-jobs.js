import React, { Fragment } from 'react';
import { withTranslation, i18n } from '../../../i18n';
import {
    ReactiveBase,
    ReactiveList,
    MultiList
} from "@appbaseio/reactivesearch";
import { Card, Accordion } from 'react-bootstrap';

class Jobs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            url: '',
            isLoaded: false,
            selectedLocations: '',
            selectedJobTypes: '',
            selectedIndustries: '',
            isFilterOpened: false
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
    handleSelect(value, accordianId) {
        if (!value) {
            document.getElementById(accordianId).children[0].children[0].classList.remove('active');
        }
        else {
            document.getElementById(accordianId).children[0].children[0].classList.add('active');

        }
    }
    defaultQuery = function () {
        const { companyId } = this.props;
        var queries = [];
        queries.push({
            "match": {
                "PublishStatus": 2
            }
        });

        queries.push({
            "match": {
                "CompanyId": companyId
            }
        });

        if (!!this.state.selectedLocations && this.state.selectedLocations.length > 0) {
            queries.push({
                "terms": {
                    "Locations.keyword": this.state.selectedLocations
                }
            });
        }

        if (!!this.state.selectedJobTypes && this.state.selectedJobTypes.length > 0) {
            if (i18n.language == "en") {
                queries.push({
                    "terms": {
                        "JobTypeEN.keyword": this.state.selectedJobTypes
                    }
                });
            }
            else {
                queries.push({
                    "terms": {
                        "JobTypeFR.keyword": this.state.selectedJobTypes
                    }
                });
            }
        }


        if (!!this.state.selectedIndustries && this.state.selectedIndustries.length > 0) {
            if (i18n.language == "en") {
                queries.push({
                    "terms": {
                        "IndustryNameEN.keyword": this.state.selectedIndustries
                    }
                });
            }
            else {
                queries.push({
                    "terms": {
                        "IndustryNameFR.keyword": this.state.selectedIndustries
                    }
                });
            }
        }
        return {
            "sort": {
                "_score": { "order": "desc" }
            },
            "query": {
                "bool": {
                    "must": queries
                }
            }
        };

    }


    renderJob(job) {
        const { i18n } = this.props;
        const jobDetailUrl = "/" + job.CompanyName + "/job-detail/" + job.JobPostingId
        const title = i18n.language == "en" ? job.TitleEN : job.TitleFR;
        const industry = i18n.language == "en" ? job.IndustryNameEN : job.IndustryNameFR;
        const jobTypes = i18n.language == "en" ? job.JobTypeEN : job.JobTypeFR;

        // Change to update the UI
        return (

            <div className="careerfy-job careerfy-joblisting-classic" key={job.JobPostingId} >
                <ul style={{ maxWidth: "100%" }}>
                    <li className="careerfy-column-12">
                        <div className="careerfy-joblisting-classic-wrap job-list-main profile-job">
                            <div className="figure_logo"><a href="#"><img src={job.CompanyLogoUrl} alt="" /></a></div>
                            <div className="careerfy-joblisting-text profile-job-desc">
                                <div className="careerfy-list-option">
                                    <h2> <a href={jobDetailUrl}> {title} </a> </h2>
                                    <ul>
                                        <li><a href="#">{job.CompanyName}</a></li>
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

                                </div>

                                <div className="careerfy-job-userlist">

                                    {
                                        jobTypes != null && jobTypes.length > 0 &&
                                        <a onClick={() => this.setSelectedJobTypes(jobTypes[0])} className="careerfy-option-btn">{jobTypes[0]}</a>

                                    }
                                </div>
                                <div className="clearfix"></div>

                            </div>
                        </div>
                    </li>
                </ul>
            </div>

        )
    }
    toggleFilter() {
        if (!this.state.isFilterOpened) document.body.classList.add('modal-open');
        else document.body.classList.remove('modal-open');

        this.setState({ isFilterOpened: !this.state.isFilterOpened });
    }
    render() {
        const { i18n } = this.props;
        return (
            <Fragment>
                <div className="Job-search-tabs-page">
                    <div className="container">
                        <div className="row Job-search-tabs-page">

                            <ReactiveBase
                                app="jobs"
                                credentials="cP0z1rykF:9bd95720-8f69-4b0f-a58c-55f17bb3b5a8"
                                enableAppbase
                                url="https://readonly:spincv_2020!@sandboxjobs-ythbjhr-arc.searchbase.io"
                            >
                                {
                                    this.props.showFacet &&
                                    <Fragment>
                                        <div className="col-sm-4 fixed-filter">
                                            <div className="desktop-filters">

                                                <Accordion id="locationAccordian" defaultActiveKey="0" onSelect={e => this.handleSelect(e, "locationAccordian")}>
                                                    <Card>
                                                        <Accordion.Toggle className="active" as={Card.Header} eventKey="0">
                                                            Emplacement
                                                    </Accordion.Toggle>
                                                        <Accordion.Collapse eventKey="0">
                                                            <Card.Body>
                                                                <div className="side-list-bar-jobs custm-checkbox-filters">
                                                                    <MultiList filterLabel="Locations" componentId="Locations" dataField="Locations.keyword"
                                                                        react={{
                                                                            "and": ["SearchSensor", "JobTypeSensor",
                                                                                "IndustryfacetSensor", "SubCategoryfacetSensor", "FoodfacetSensor", "EnviromentFacetSensor",
                                                                                "AssurancesFacetSensor", "TransportFacetSensor", "OpenSpaceFacetSensor"]
                                                                        }}
                                                                        value={this.state.selectedLocations}
                                                                        defaultQuery={() => this.defaultQuery()}
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
                                                <Accordion defaultActiveKey="0" id="jobTypeAccordian" onSelect={e => this.handleSelect(e, "jobTypeAccordian")}>
                                                    <Card>
                                                        <Accordion.Toggle className="active" as={Card.Header} eventKey="0">
                                                            Type de poste
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
                                                                        defaultQuery={() => this.defaultQuery()}
                                                                        react={{
                                                                            "and": ["SearchSensor", "Locations",
                                                                                "IndustryfacetSensor", "SubCategoryfacetSensor", "FoodfacetSensor", "EnviromentFacetSensor",
                                                                                "AssurancesFacetSensor", "TransportFacetSensor", "OpenSpaceFacetSensor"]
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
                                                            Secteur d’activité
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
                                                                        defaultQuery={() => this.defaultQuery()}
                                                                        react={{
                                                                            "and": ["SearchSensor", "Locations",
                                                                                "JobTypeSensor", "SubCategoryfacetSensor", "FoodfacetSensor", "EnviromentFacetSensor",
                                                                                "AssurancesFacetSensor", "TransportFacetSensor", "OpenSpaceFacetSensor"]
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
                                                            Sous-Catégorie
                                                    </Accordion.Toggle>
                                                        <Accordion.Collapse eventKey="0">
                                                            <Card.Body>
                                                                <div className="side-list-bar-jobs custm-checkbox-filters">
                                                                    <MultiList filterLabel="Sub Cateogries" componentId="SubCategoryfacetSensor" dataField={i18n.language == "en" ? "SubCategoriesEN.keyword" : "SubCategoriesFR.keyword"}
                                                                        showSearch={true} showLoadMore={true} size={1000}
                                                                        loadMoreLabel="Plus de résultats"
                                                                        defaultQuery={() => this.defaultQuery()}
                                                                        value={this.state.selectedSubCategories}
                                                                        onChange={(result) => {
                                                                            this.setState({ selectedSubCategories: result })
                                                                        }
                                                                        }
                                                                        placeholder={i18n.t('General.SearchLabel')}
                                                                        react={{
                                                                            "and": ["SearchSensor", "Locations",
                                                                                "JobTypeSensor", "IndustryfacetSensor", "FoodfacetSensor", "EnviromentFacetSensor",
                                                                                "AssurancesFacetSensor", "TransportFacetSensor", "OpenSpaceFacetSensor"]
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
                                            <button className="filter-mob-btn" onClick={() => this.toggleFilter()}>Filter</button>
                                        </div>
                                        {
                                            this.state.isFilterOpened &&
                                            <div className={this.state.isFilterOpened ? "mobile-filters mob-fil" : "mob-fil col-sm-4"}>
                                                <div className="pop-actionss">
                                                    <h3>Filters</h3>
                                                    <button className="close-mob-btn" onClick={() => this.toggleFilter()}><i className="fa fa-times"></i></button>
                                                </div>
                                                <Accordion id="locationAccordianMob" defaultActiveKey="0" onSelect={e => this.handleSelect(e, "locationAccordianMob")}>
                                                    <Card>
                                                        <Accordion.Toggle className="active" as={Card.Header} eventKey="0">
                                                            Emplacement
        </Accordion.Toggle>
                                                        <Accordion.Collapse eventKey="0">
                                                            <Card.Body>
                                                                <div className="side-list-bar-jobs  custm-checkbox-filters">
                                                                    <MultiList filterLabel="Locations" componentId="LocationsMob" dataField="Locations.keyword"
                                                                        react={{
                                                                            "and": ["SearchSensor", "JobTypeSensorMob",
                                                                                "IndustryfacetSensorMob", "SubCategoryfacetSensorMob", "FoodfacetSensorMob", "EnviromentFacetSensorMob",
                                                                                "AssurancesFacetSensorMob", "TransportFacetSensorMob", "OpenSpaceFacetSensorMob"]
                                                                        }}
                                                                        size={1000}
                                                                        value={this.state.selectedLocations}
                                                                        onChange={(result) => {
                                                                            this.setState({ selectedLocations: result })
                                                                        }
                                                                        }
                                                                        defaultQuery={() => this.defaultQuery()}
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
                                                            Type de poste
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
                                                                        defaultQuery={() => this.defaultQuery()}
                                                                        react={{
                                                                            "and": ["SearchSensor", "LocationsMob",
                                                                                "IndustryfacetSensorMob", "SubCategoryfacetSensorMob", "FoodfacetSensorMob", "EnviromentFacetSensorMob",
                                                                                "AssurancesFacetSensorMob", "TransportFacetSensorMob", "OpenSpaceFacetSensorMob"]
                                                                        }}
                                                                        defaultQuery={() => this.defaultQuery()}
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
                                                            Secteur d’activité
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
                                                                                "AssurancesFacetSensorMob", "TransportFacetSensorMob", "OpenSpaceFacetSensorMob"]
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
                                                            Sous-Catégorie
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
                                                                                "AssurancesFacetSensorMob", "TransportFacetSensorMob", "OpenSpaceFacetSensorMob"]
                                                                        }}
                                                                        defaultQuery={() => this.defaultQuery()}
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
                                        }

                                    </Fragment>
                                }
                                <div className={this.props.showFacet ? "col-sm-8 job-list-sidebr cluster-pg" : "col-sm-12 "} style={{ marginTop: '50px' }} >
                                    <div className="job-list-tabs" >
                                        <ReactiveList
                                            componentId="result"
                                            dataField="_score"
                                            scrollOnChange={false}
                                            react={{
                                                "and": ["Locations"]
                                            }}
                                            renderItem={(job) => {
                                                return (this.renderJob(job))
                                            }}
                                            showResultStats={this.props.showFacet}
                                            renderResultStats={
                                                function (stats) {
                                                    return (
                                                        `${stats.numberOfResults} résultats trouvés en ${stats.time}ms`
                                                    )
                                                }
                                            }
                                            size={this.props.size}
                                            pagination={true}

                                            defaultQuery={() => this.defaultQuery()}
                                        />
                                    </div>
                                </div>
                            </ReactiveBase>

                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default withTranslation('translation')(Jobs);