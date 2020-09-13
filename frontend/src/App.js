import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Switch } from "react-router-dom";
import { BrowserRouter } from 'react-router-dom'
import { adminRoutes, authRoutes } from "./Routes";
import { changeRedirectURL } from "./actions/auth";

import AdminLayout from "./layouts/admin/AdminLayout";
import AuthLayout from "./layouts/shared/AuthLayout";

import "./assets/css/shared/fontawesome/css/all.min.css";

class App extends React.Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
    changeRedirectURL: PropTypes.func.isRequired
  };
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
  _redirect = () =>{

    if(this.props.auth.redirectURL){
      let redirect = this.props.auth.redirectURL;
      this.props.changeRedirectURL(null);
      window.location = redirect;
    }
  }
  render() {
    this._redirect();
    return (
      <BrowserRouter>
        <Switch>
          {this._adminRouteList()}
          {this._authRouteList()}
        </Switch>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { changeRedirectURL })(App);
