import { BehaviorSubject } from 'rxjs';
import axios from 'axios';
import { handleResponse } from '../helpers/handle-response';
import { apiUrl } from '../config'

const currentUserSubject = new BehaviorSubject({});

export const authenticationService = {
    login,
    logout,
    resetPassword,
    currentUser: currentUserSubject.asObservable(),
    get currentUserName() { return currentUserSubject.value != null && currentUserSubject.value.user ? currentUserSubject.value.user.firstName : '' },
    get currentUserId() { return currentUserSubject.value != null && currentUserSubject.value.user ? currentUserSubject.value.user.id : '' },
    get currentCompanyName() { return currentUserSubject.value != null && currentUserSubject.value.user ? currentUserSubject.value.user.companyName : '' },
    get currentCompanyId() { return currentUserSubject.value != null && currentUserSubject.value.user ? currentUserSubject.value.user.companyId : '' },
    get isCandidateUser() { return currentUserSubject.value != null && currentUserSubject.value.user ? currentUserSubject.value.user.isCandidateUser : '' },
    get token() { return currentUserSubject.value != null && currentUserSubject.value.token },
    get isUserLoggedIn() { return currentUserSubject.value != null && currentUserSubject.value.token != null },
    get isSocialLogin() { return currentUserSubject.value != null && currentUserSubject.value.user ? currentUserSubject.value.user.isSocialLogin : false },
    get isTokenExpired() {
        return currentUserSubject.value != null && !!currentUserSubject.value.expiration ? new Date() > new Date(currentUserSubject.value.expiration) : true
    },
    get currentUserEmail() { return currentUserSubject.value != null && currentUserSubject.value.user ? currentUserSubject.value.user.email : '' },
    get currentUserLastName() { return currentUserSubject.value != null && currentUserSubject.value.user ? currentUserSubject.value.user.lastName : '' },
    get currentUserPhoneNumber() { return currentUserSubject.value != null && currentUserSubject.value.user ? currentUserSubject.value.user.phoneNumber : '' },

};

function login(data) {
    let axiosConfig = {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        }
    };
    // const dataToSend = JSON.stringify({ email: username, Password: password });
    return axios.post(encodeURI(apiUrl + "Account/CreateToken"), data, axiosConfig)
        .then(handleResponse)
        .then(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify(user));
            currentUserSubject.next(user);
            return user;
        })
}

function resetPassword(data) {
    const axiosConfig = {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        }
    };
    // const dataToSend = JSON.stringify({ email: username, Password: password });
    return axios.post(encodeURI(apiUrl + "Api/Users/ResetPassword"), data, axiosConfig)
        .then(handleResponse)
        .then(result => {
            return result;
        })
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    currentUserSubject.next(null);
}