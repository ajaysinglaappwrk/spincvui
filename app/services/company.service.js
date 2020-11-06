import axios from 'axios';
import { authenticationService } from '../services/authentication.service'
import { handleResponse } from '../helpers/handle-response';
import { apiUrl } from '../config'

export const companyService = {
    getCompanyProfile,
    getCompanyJobs,
    getJobDetailById,
    applyForJob,
    sendReminder,
    getDashboardCompanies,
    setJobAsFavourite,
    setJobAsHidden,
    fetchFavouriteJobs,
    fetchHiddenJobIds,
    saveBulkFavJobs,
    contactUs,
    uploadResume,
    getResume,
    deleteResume
};

function getCompanyProfile(name) {
    // let axiosConfig = {
    //     headers: {
    //         'Authorization': "bearer " + authenticationService.token
    //     }
    // }
    return axios.get(encodeURI(apiUrl + "Api/Company/GetCompanyByName/" + name))
        .then(handleResponse)
        .then(res => {
            return res
        });
}
function getCompanyJobs() {

    let axiosConfig = {
        headers: {
            'Authorization': "bearer " + authenticationService.token
        }
    }
    return axios.get(encodeURI(apiUrl + "Api/Company/GetAllJobsForCompany/"), axiosConfig)
        .then(handleResponse)
        .then(res => {
            return res
        });
}

function getDashboardCompanies() {

    return axios.get(encodeURI(apiUrl + "Api/Company/GetDashboardCompanies/"))
        .then(handleResponse)
        .then(res => {
            return res
        });
}

function sendReminder(email, id, name) {

    return axios.get(encodeURI(apiUrl + "Api/Company/SendNotification/" + email + "/" + name + "/" + id))
        .then(handleResponse)
        .then(res => {
            return res
        });
}

function getJobDetailById(id) {

    let axiosConfig = {
        headers: {
            'Authorization': "bearer " + authenticationService.token
        }
    }
    return axios.get(encodeURI(apiUrl + "Api/Company/GetJobDetailById/" + id), axiosConfig)
        .then(handleResponse)
        .then(res => {
            return res
        });
}

function setJobAsFavourite(id, markAsFavourite) {

    let axiosConfig = {
        headers: {
            'Authorization': "bearer " + authenticationService.token
        }
    }
    return axios.get(encodeURI(apiUrl + "Api/Company/SaveFavouriteJob/" + id + "/" + markAsFavourite), axiosConfig)
        .then(handleResponse)
        .then(res => {
            return res
        });
}

function setJobAsHidden(id) {

    let axiosConfig = {
        headers: {
            'Authorization': "bearer " + authenticationService.token
        }
    }
    return axios.get(encodeURI(apiUrl + "Api/Company/SaveHiddenJob/" + id), axiosConfig)
        .then(handleResponse)
        .then(res => {
            return res
        });
}

function fetchFavouriteJobs(jobIds) {
    let axiosConfig = {
        headers: {
            'Authorization': "bearer " + authenticationService.token
        }
    }
    return axios.get(encodeURI(apiUrl + "Api/Company/FetchFavouriteJobs?idsToSave=" + jobIds), axiosConfig)
        .then(handleResponse)
        .then(res => {
            return res
        });
}

function saveBulkFavJobs(jobIds, userId) {

    return axios.get(encodeURI(apiUrl + "Api/Company/SaveBulkFavJobs?idsToSave=" + jobIds + "&userId=" + userId))
        .then(handleResponse)
        .then(res => {
            return res
        });
}

function fetchHiddenJobIds(id) {
    let axiosConfig = {
        headers: {
            'Authorization': "bearer " + authenticationService.token
        }
    }
    return axios.get(encodeURI(apiUrl + "Api/Company/FetchHiddenJobIds/"), axiosConfig)
        .then(handleResponse)
        .then(res => {
            return res
        });
}

function contactUs(model) {
    // const dataToSend = JSON.stringify(model);
    return axios.post(encodeURI(apiUrl + "Api/Company/ContactUs"), model)
        .then(handleResponse)
        .then(result => {
            return result;
        });
}

function applyForJob(model, jobId, companyId) {

    let formData = new FormData();
    formData.append('email', model.email);   //append the values with key, value pair
    formData.append('firstname', model.firstname);
    formData.append('lastname', model.lastname);
    formData.append('contactnumber', model.phonenumber);
    formData.append('jobid', !jobId ? 0 : jobId);
    formData.append('companyid', !companyId ? 0 : companyId);
    formData.append('file', model.file);
    formData.append('description', model.description);
    return axios.post(encodeURI(apiUrl + "Api/Company/ApplyForJob"), formData)
        .then(handleResponse)
        .then(result => {
            return result;
        });
}
function uploadResume(file) {

    let formData = new FormData();
    formData.append('file', file);
    let axiosConfig = {
        headers: {
            'Authorization': "bearer " + authenticationService.token
        }
    }
    return axios.post(encodeURI(apiUrl + "Api/Company/UploadResume"), formData, axiosConfig)
        .then(handleResponse)
        .then(result => {
            return result;
        });
}

function getResume(email) {
    return axios.get(encodeURI(apiUrl + "Api/Company/GetUserResume/" + email))
        .then(handleResponse)
        .then(result => {
            return result;
        });
}

function deleteResume(id) {
    return axios.get(encodeURI(apiUrl + "Api/Company/DeleteResume/" + id))
        .then(handleResponse)
        .then(result => {
            return result;
        });
}