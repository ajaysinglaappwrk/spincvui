import axios from 'axios';
import { handleResponse } from '../../../helpers/handle-response';
import { apiUrl } from '.././../../config';

export const registerService = {
    register,
    getUserInfoByEmail,
    updateUserInfo
};

function register(model) {
    return axios.post(encodeURI(apiUrl + "Api/Users/Register"), model)
        .then(handleResponse)
        .then(result => {
            return result;
        });
}
function updateUserInfo(model) {
    return axios.post(encodeURI(apiUrl + "Api/Users/UpdateUserInfo"), model)
        .then(handleResponse)
        .then(result => {
            return result;
        });
}

function getUserInfoByEmail(email) {
    return axios.get(encodeURI(apiUrl + "Api/Users/GetUserInfoByEmail/"+email))
        .then(handleResponse)
        .then(result => {
            return result;
        });
}