import { authenticationService } from '../services/authentication.service';

export function handleResponse(response) {
    if ((response.status != 201 && response.status != 200 && response.status != 204) || response.status == 401) { // that is for token identifying that token sucussfully created
        authenticationService.logout();
        const error = "User Authentication Failed";
        return Promise.reject(error);
    }

    return response.data;
}