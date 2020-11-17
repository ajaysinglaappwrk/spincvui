import {companyService} from '../services/company.service'

export const employerConstants = {
    GET_PROFILE_REQUEST: 'GET_PROFILE_REQUEST',
    GET_COMPANY_PROFILE:'GET_COMPANY_PROFILE',
    GET_PROFILE_FAILURE: 'GET_JOB_FAILURE',
    GET_JOBS_REQUEST:'GET_JOBS_REQUEST',
    GET_COMPANY_JOBS:'GET_COMPANY_JOBS',
    GET_JOBS_FAILURE:'GET_JOBS_FAILURE',
    GET_JOBS_DETAIL:'GET_JOBS_DETAIL',
    GET_JOBS_DETAIL_FAILURE:'GET_JOBS_DETAIL_FAILURE',
}
export  const employerActions = {
    getCompanyProfile,
    getCompanyJobs,
    getJobDetailById
}

function getCompanyProfile(name) {
    return dispatch => {
        request();
        companyService.getCompanyProfile(name)
            .then(
                profile => {
                    dispatch(success(profile))
                },
                error => {
                    dispatch(failure(error))
                }
            );
    };
    function request() { return { type: employerConstants.GET_PROFILE_REQUEST } }
    function success(profile) { return { type: employerConstants.GET_COMPANY_PROFILE, profile } }
    function failure(error) { return { type: employerConstants.GET_PROFILE_FAILURE, error } }
}
function getCompanyJobs() {
    return dispatch => {
        request();
        companyService.getCompanyJobs()
            .then(
                jobs => {
                    dispatch(success(jobs))
                },
                error => {
                    dispatch(failure(error))
                }
            );
    };
    function request() { return { type: employerConstants.GET_JOBS_REQUEST_REQUEST } }
    function success(jobs) { return { type: employerConstants.GET_COMPANY_JOBS, jobs } }
    function failure(error) { return { type: employerConstants.GET_JOBS_FAILURE, error } }
}

function getJobDetailById(jobPostingId) {
    return dispatch => {
        companyService.getJobDetailById(jobPostingId)
            .then(
                jobDetail => {
                    dispatch(success(jobDetail))
                },
                error => {
                    dispatch(failure(error))
                }
            );
    };
    function success(jobDetail) { return { type: employerConstants.GET_JOBS_DETAIL, jobDetail } }
    function failure(error) { return { type: employerConstants.GET_JOBS_DETAIL_FAILURE, error } }
}