import React from 'react';

import Nav from "./Nav";

import "../../../assets/css/bootstrap/style.css";
import "../../../assets/css/template/style.css";
import "../../../assets/images/favicon.png";


export default function Header(){
    return(
        <>
            <meta charSet="utf-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
            <title>Star Admin Premium Bootstrap Admin Dashboard Template</title>
            {/* <link rel="stylesheet" href="../assets/vendors/iconfonts/mdi/css/materialdesignicons.min.css"/>
            <link rel="stylesheet" href="../assets/vendors/iconfonts/ionicons/css/ionicons.css"/>
            <link rel="stylesheet" href="../assets/vendors/iconfonts/typicons/src/font/typicons.css"/>
            <link rel="stylesheet" href="../assets/vendors/iconfonts/flag-icon-css/css/flag-icon.min.css"/>
            <link rel="stylesheet" href="../assets/vendors/css/vendor.bundle.base.css"/>
            <link rel="stylesheet" href="../assets/vendors/css/vendor.bundle.addons.css"/>
            <link rel="stylesheet" href="../assets/css/shared/style.css"/>
            <link rel="stylesheet" href="../assets/css/demo_1/style.css"/>
            <link rel="shortcut icon" href="../assets/images/favicon.png"/> */}
            <Nav/>
        </>
    );
}