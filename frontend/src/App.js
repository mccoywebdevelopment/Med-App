import React from 'react';
import { Route, Switch } from "react-router";
import { BrowserRouter } from 'react-router-dom'
import { adminRoutes, authRoutes } from "./Routes";

import AdminLayout from "./layouts/admin/AdminLayout";
import AuthLayout from "./layouts/shared/AuthLayout";


function App() {
  const adminRouteList = () =>{
    return adminRoutes.map((route,key)=>{
      let component = <AdminLayout>{route.component}</AdminLayout>
      return(
          <Route exact path={route.path} key={"adminRoute"+key}>
            {component}
          </Route>
      );
    });
  }
  const authRouteList = () =>{
    return authRoutes.map((route,key)=>{
      let component = <AuthLayout>{route.component}</AuthLayout>
      return(
          <Route exact path={route.path} key={"authRoute"+key}>
            {component}
          </Route>
      );
    });
  }
  return (
      <BrowserRouter>
        <Switch>
            {adminRouteList()}
            {authRouteList()}
        </Switch>
      </BrowserRouter>
  );
}

export default App;
