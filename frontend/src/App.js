import React from 'react';
import { Route, Switch } from "react-router";
import { BrowserRouter } from 'react-router-dom'
import { adminRoutes } from "./Routes";

import AdminLayout from "./layouts/admin/AdminLayout";


function App() {
  const adminRouteList = () =>{
    return adminRoutes.map((route,key)=>{
      let component = <AdminLayout>{route.component()}</AdminLayout>
      return(
          <Route exact path={route.path} key={"route"+key}>
            {component}
          </Route>
      );
    });
  }
  return (
      <BrowserRouter>
        <Switch>
            {adminRouteList()}
        </Switch>
      </BrowserRouter>
  );
}

export default App;
