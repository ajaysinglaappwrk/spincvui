import { employerConstants } from '../actions/employer-actions';

export function EmployerReducer(state = {}, action) {
    switch (action.type) {
        case employerConstants.GET_REQUEST:
            return {
                loading: true
            };
        case employerConstants.GET_COMPANY_PROFILE:
            return {
                items: action.profile
            };
        case employerConstants.GET_PROFILE_FAILURE:
            return {
                error: action.error
            };
        case employerConstants.GET_JOBS_REQUEST:
            return {
                loading: true
            };
        case employerConstants.GET_COMPANY_JOBS:
            return {
                items: action.jobs
            };
        case employerConstants.GET_JOBS_FAILURE:
            return {
                error: action.error
            };
        case employerConstants.GET_JOBS_DETAIL:
            return {
                jobDetail: action.jobDetail
            };
        case employerConstants.GET_JOBS_DETAIL_FAILURE:
            return {
                error: action.error
            };
        default:
            return state
    }
};
