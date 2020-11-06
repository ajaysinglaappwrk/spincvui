import React from 'react';
import Login from '../login/login';
import Register from '../register/register';
import ChangePassword from '../profile-management/change-password';
import {  authenticationService } from '../../services/authentication.service';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";

import { withTranslation, i18n } from "../../../i18n";

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loginModal: false,
      registerModal: false,
      changePasswordModal: false,
      loggedInUserName: '',
      loggedInCompanyName: '',
      isLoggedIn: authenticationService.isUserLoggedIn,
      isCandidateUser: authenticationService.isCandidateUser,
      isSocialLogin: false,
      isMenuExpanded: false
    }
    this.keyPress = this.keyPress.bind(this);
  }

  componentDidMount() {
    var isLogout = this.getParameterByName('logout');
    if (isLogout) {
      this.logoutUser();
    }

    var isLogin = this.getParameterByName('sign-in');
    if (isLogin) {
      this.setState({ loginModal: true });
    }

    var isRegister = this.getParameterByName('sign-up');
    if (isRegister) {
      this.setState({ registerModal: true });
    }

    authenticationService.currentUser.subscribe(user => {
      this.setState({
        isLoggedIn: authenticationService.isUserLoggedIn, loggedInUserName: authenticationService.currentUserName,
        loggedInCompanyName: authenticationService.currentCompanyName,
        isCandidateUser: authenticationService.isCandidateUser,
        isSocialLogin: authenticationService.isSocialLogin
      })
    });



  }
  getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }
  logoutUser() {
    authenticationService.logout();
    window.location.href = "/";
  }
  menuToggle() {
    this.setState({ isMenuExpanded: !this.state.isMenuExpanded })
    document.body.classList.toggle('open-menu');
  }

  goToSearch() {
    window.location.href = '/jobs?searchterm=' + document.getElementById("txtGlobalSearch").value;
  }


  keyPress(e) {
    if (e.keyCode == 13) {
      this.goToSearch();
    }
  }

  render() {
    const { i18n } = this.props;
    return (
      <div>
        <header id="careerfy-header" className="careerfy-header-one">
          <div className="container-fulid main-header">
            <div className="row o-mob" style={{ alignItems: 'center' }} >
             
              <aside className="col-lg-4 col-md-6 col-sm-6 p-3">
                <div className="header-search">
                  <input
                    type="text"
                    placeholder="Search"
                    id="txtGlobalSearch"
                    onKeyDown={this.keyPress}
                  />
                  <button onClick={() => this.goToSearch()} > <i className="careerfy-icon careerfy-search"></i></button>
                </div>
              </aside>
              <aside className="col-lg-6 col-md-3 col-sm-2 col-xs-6 p-2" >
                <nav className="careerfy-navigation">
                  <div className="navbar-header">
                    <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#careerfy-navbar-collapse-1" aria-expanded="false" onClick={() => this.menuToggle()}>
                      <span className="icon-bar"></span>
                      <span className="icon-bar"></span>
                      <span className="icon-bar"></span>
                    </button>
                  </div>
                  <div className={this.state.isMenuExpanded ? "collapse navbar-collapse in" : "collapse navbar-collapse"} id="careerfy-navbar-collapse-1">
                    <ul className="navbar-nav mob-menus">
                      <li ><a href="/"> {i18n.t('Menu.Home')}</a>
                        {/* <ul className="sub-menu">
                          <li><a href="https://eyecix.com/html/careerfy/">Jobs</a></li>
                        </ul> */}
                      </li>

                      <li><a href="/about-us">{i18n.t('Menu.ForCandidates')}</a>
                        <ul className="sub-menu">
                        </ul>
                      </li>

                      <li ><a href="/contact-us">{i18n.t('Menu.ForEmployers')}</a>

                      </li>
                      {/* <li><a href="contact-us.html">{i18n.t('Menu.Contact')}</a></li> */}

                    </ul>
                    <div className="careerfy-right careerfy-header-right">
                      <ul className="careerfy-user-section">
                        {/* {this.state.isLoggedIn && <li className="username" title={this.state.loggedInUserName}><Link to="/employer-detail"> {"Hey " + this.state.loggedInCompanyName}</Link></li>} */}
                        {/* {!this.state.isLoggedIn && <li><a className="careerfy-color careerfy-open-signin-tab" href="# " onClick={() => this.register()}>{i18n.t('Menu.Register')}</a></li>} */}
                        {/* {
                      <li>
                        {
                          this.state.isLoggedIn ? <a className="careerfy-color careerfy-open-signup-tab" href="# " onClick={() => this.logoutUser()}>Logout</a> // Need to change from resource file
                            : <a className="careerfy-color careerfy-open-signup-tab" href="# " onClick={() => this.login()}>{i18n.t('Menu.SignIn')}</a>
                        }
                      </li>
                    } */}

                      </ul>
                      <a href="/post-a-job" className="careerfy-simple-btn careerfy-bgcolor mobilePostbtn"><span> <i className="careerfy-icon careerfy-arrows-2"></i>{i18n.t('Menu.ForEmploye')}</span></a>


                      <ul className="careerfy-user-section careerfy-user-section-mob " >
                        {/* <li><a className="careerfy-color careerfy-open-signin-tab" href="# " onClick={() => i18n.changeLanguage('en')}>English</a></li> */}
                        <li><a className="careerfy-color careerfy-open-signup-tab" href="# " onClick={() => i18n.changeLanguage('fr')}>Français</a></li>
                        {!this.state.isLoggedIn && <li><a className="careerfy-color careerfy-open-signin-tab" href="# " onClick={() => this.register()}>{i18n.t('Menu.Register')}</a></li>}
                        {!this.state.isLoggedIn && <li> <a className="careerfy-color careerfy-open-signup-tab" href="# " onClick={() => this.login()}>{i18n.t('Menu.SignIn')}</a></li>}
                      </ul>
                      <ul className="careerfy-user-section user-loginn">
                        {/* {this.state.isLoggedIn && <li className="username" title={this.state.loggedInUserName}><Link to={"/" + this.state.loggedInCompanyName}>Hey   {(this.state.isCandidateUser || !this.state.loggedInCompanyName) ? this.state.loggedInUserName : this.state.loggedInCompanyName}</Link></li>} */}

                        {
                          <ul className="sub-userlist">
                            {
                              authenticationService.isCandidateUser &&
                              <li className="sub-userlist-item">
                                <a className="careerfy-color careerfy-open-signup-tab" href="/manage-profile">Gérer le profil</a>
                              </li>
                            }

                            <li className="sub-userlist-item">
                              {
                                this.state.isLoggedIn && <a className="careerfy-color careerfy-open-signup-tab" href="# " onClick={() => this.logoutUser()}> Déconnexion</a> // Need to change from resource file

                              }
                            </li>
                          </ul>
                        }

                      </ul>
                    </div>
                    {/* <ul className="careerfy-user-section careerfy-user-section-mob " >
                  <li><a className="careerfy-color careerfy-open-signin-tab" href="# " onClick={() => i18n.changeLanguage('en')}>English</a></li>
                  <li><a className="careerfy-color careerfy-open-signup-tab" href="# " onClick={() => i18n.changeLanguage('fr')}>Français</a></li>
                </ul> */}
                  </div>

                </nav>

              </aside>
              {/* <aside className="col-lg-6 col-md-10 col-sm-7 col-xs-12 mobi-space mobileLogin" style={{ zoom: '86%', padding: '5px 0' }}>
                

              </aside> */}
              {/* <div className="col-md-2 col-sm-4 col-xs-4" style={{zoom:'86%', padding: '5px 0'}}>
                <ul className="careerfy-user-section">
                  <li><a className="careerfy-color careerfy-open-signin-tab" href="# " onClick={() => i18n.changeLanguage('en')}>English</a></li>
                  <li><a className="careerfy-color careerfy-open-signup-tab" href="# " onClick={() => i18n.changeLanguage('fr')}>Français</a></li>
                </ul>
              </div> */}
            </div>
          </div>
        </header>
        {
          this.state.loginModal &&
          <Login modal={this.state.loginModal} close={this.closeLoginModal}
          ></Login>
        }
        {
          this.state.registerModal &&
          <Register modal={this.state.registerModal} close={this.closeRegisterModal}
          ></Register>
        }

        {
          this.state.changePasswordModal &&
          <ChangePassword close={this.closeChangePasswordModal} name={this.state.isCandidateUser ? this.state.loggedInUserName : this.state.loggedInCompanyName}></ChangePassword>
        }
        <ToastContainer autoClose={3000} />

      </div>
    )
  }

  handleClick(lang) {
    this.props.handleClick(lang);
  }

  //for login method 
  login() {
    const loginModal = true;
    this.setState({ loginModal });
    document.body.classList.add('careerfy-modal-active');
  }
  closeLoginModal = () => {
    const loginModal = false;
    this.setState({ loginModal });
    document.body.classList.remove('careerfy-modal-active');
  }
  closeChangePasswordModal = () => {
    this.setState({ changePasswordModal: false });
    document.body.classList.remove('careerfy-modal-active');
  }

  //for register method
  register() {
    const registerModal = true;
    this.setState({ registerModal });
    document.body.classList.add('careerfy-modal-active');
  }

  closeRegisterModal = () => {
    const registerModal = false;
    this.setState({ registerModal });
    document.body.classList.remove('careerfy-modal-active');
  }
}

export default withTranslation('common')(Header);
