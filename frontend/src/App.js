import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Switch } from "react-router-dom";
import { BrowserRouter } from 'react-router-dom'
import { adminRoutes, authRoutes, userRoutes, auth2Routes } from "./Routes";
import { changeRedirectURL, changeCurrentURL } from "./actions/auth";

import AdminLayout from "./layouts/admin/AdminLayout";
import AuthLayout from "./layouts/shared/AuthLayout";
import UserLayout from "./layouts/user/UserLayout";

import "./assets/css/fontawesome/css/all.min.css";

class App extends React.Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
    changeRedirectURL: PropTypes.func.isRequired,
    changeCurrentURL: PropTypes.func.isRequired
  };
  state = {
    redirect:null
  }
  constructor(props) {
    super(props);
  }
  _adminRouteList = () => {
    return adminRoutes.map((route, key) => {
      let component = <AdminLayout>{route.component}</AdminLayout>
      return (
        <Route exact path={route.path} key={"adminRoute" + key}>
          {component}
        </Route>
      );
    });
  }
  _userRouteList = () => {
    return userRoutes.map((route, key) => {
      let component = <UserLayout>{route.component}</UserLayout>
      return (
        <Route exact path={route.path} key={"userRoute" + key}>
          {component}
        </Route>
      );
    });
  }
  _authRouteList = () => {
    return authRoutes.map((route, key) => {
      let component = <AuthLayout>{route.component}</AuthLayout>
      return (
        <Route exact path={route.path} key={"authRoute" + key}>
          {component}
        </Route>
      );
    });
  }
  _authAdminList = () =>{
    return auth2Routes.map((route, key) => {
      let component = <AdminLayout>{route.component}</AdminLayout>
      return (
        <Route exact path={route.path} key={"authRouteAdmin" + key}>
          {component}
        </Route>
      );
    });
  }
  _authUserList = () =>{
    return auth2Routes.map((route, key) => {
      let component = <UserLayout>{route.component}</UserLayout>
      return (
        <Route exact path={route.path} key={"authRouteUser" + key}>
          {component}
        </Route>
      );
    });
  }
  _redirect = () =>{

    // if(this.props.auth.redirectURL){
    //   let redirect = this.props.auth.redirectURL;
    //   this.props.changeRedirectURL(false);
    //   window.location = redirect;
    // }

  }
  render() {
    this._redirect();
    return (
      <BrowserRouter>
        <Switch>
          {this._adminRouteList()}
          {this._authRouteList()}
          {this._userRouteList()}
        </Switch>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { changeRedirectURL,changeCurrentURL })(App);
