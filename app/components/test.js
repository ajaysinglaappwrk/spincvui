import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import FacebookLogin from 'react-facebook-login';
import { forgotPasswordUrl } from '../config'
import { withTranslation, i18n } from "../../i18n";

class Test extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoginFailed: false,
            selectedLoginoption: 0,
            isProcessing: false
        }
    }

    render() {
        return (
            <div>
              Hello This is my test component
            </div>
        );
    }
}


export default withTranslation('common')(Test);
