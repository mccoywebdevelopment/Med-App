import React from 'react';

export default function Nav(){
    return(
        <div>
        {/* Required meta tags */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <title>Star Admin Premium Bootstrap Admin Dashboard Template</title>
        {/* plugins:css */}
        <link rel="stylesheet" href="../../../assets/vendors/iconfonts/mdi/css/materialdesignicons.min.css" />
        <link rel="stylesheet" href="../../../assets/vendors/iconfonts/ionicons/css/ionicons.css" />
        <link rel="stylesheet" href="../../../assets/vendors/iconfonts/typicons/src/font/typicons.css" />
        <link rel="stylesheet" href="../../../assets/vendors/iconfonts/flag-icon-css/css/flag-icon.min.css" />
        <link rel="stylesheet" href="../../../assets/vendors/css/vendor.bundle.base.css" />
        <link rel="stylesheet" href="../../../assets/vendors/css/vendor.bundle.addons.css" />
        {/* endinject */}
        {/* plugin css for this page */}
        {/* End plugin css for this page */}
        {/* inject:css */}
        <link rel="stylesheet" href="../../../assets/css/shared/style.css" />
        {/* endinject */}
        {/* Layout styles */}
        <link rel="stylesheet" href="../../../assets/css/demo_1/style.css" />
        {/* End Layout styles */}
        <link rel="shortcut icon" href="../../../assets/images/favicon.png" />
        <div className="container-scroller">
          {/* partial:../../partials/_navbar.html */}
          <nav className="navbar default-layout col-lg-12 col-12 p-0 fixed-top d-flex flex-row">
            <div className="text-center navbar-brand-wrapper d-flex align-items-top justify-content-center">
              <a className="navbar-brand brand-logo" href="../../index.html">
                <img src="../../../assets/images/logo.svg" alt="logo" /> </a>
              <a className="navbar-brand brand-logo-mini" href="../../index.html">
                <img src="../../../assets/images/logo-mini.svg" alt="logo" /> </a>
            </div>
            <div className="navbar-menu-wrapper d-flex align-items-center">
              <ul className="navbar-nav">
                <li className="nav-item font-weight-semibold d-none d-lg-block">Help : +050 2992 709</li>
                <li className="nav-item dropdown language-dropdown">
                  <a className="nav-link dropdown-toggle px-2 d-flex align-items-center" id="LanguageDropdown" href="#" data-toggle="dropdown" aria-expanded="false">
                    <div className="d-inline-flex mr-0 mr-md-3">
                      <div className="flag-icon-holder">
                        <i className="flag-icon flag-icon-us" />
                      </div>
                    </div>
                    <span className="profile-text font-weight-medium d-none d-md-block">English</span>
                  </a>
                  <div className="dropdown-menu dropdown-menu-left navbar-dropdown py-2" aria-labelledby="LanguageDropdown">
                    <a className="dropdown-item">
                      <div className="flag-icon-holder">
                        <i className="flag-icon flag-icon-us" />
                      </div>English
                    </a>
                    <a className="dropdown-item">
                      <div className="flag-icon-holder">
                        <i className="flag-icon flag-icon-fr" />
                      </div>French
                    </a>
                    <a className="dropdown-item">
                      <div className="flag-icon-holder">
                        <i className="flag-icon flag-icon-ae" />
                      </div>Arabic
                    </a>
                    <a className="dropdown-item">
                      <div className="flag-icon-holder">
                        <i className="flag-icon flag-icon-ru" />
                      </div>Russian
                    </a>
                  </div>
                </li>
              </ul>
              <form className="ml-auto search-form d-none d-md-block" action="#">
                <div className="form-group">
                  <input type="search" className="form-control" placeholder="Search Here" />
                </div>
              </form>
              <ul className="navbar-nav ml-auto">
                <li className="nav-item dropdown">
                  <a className="nav-link count-indicator" id="messageDropdown" href="#" data-toggle="dropdown" aria-expanded="false">
                    <i className="mdi mdi-bell-outline" />
                    <span className="count">7</span>
                  </a>
                  <div className="dropdown-menu dropdown-menu-right navbar-dropdown preview-list pb-0" aria-labelledby="messageDropdown">
                    <a className="dropdown-item py-3">
                      <p className="mb-0 font-weight-medium float-left">You have 7 unread mails </p>
                      <span className="badge badge-pill badge-primary float-right">View all</span>
                    </a>
                    <div className="dropdown-divider" />
                    <a className="dropdown-item preview-item">
                      <div className="preview-thumbnail">
                        <img src="../../../assets/images/faces/face10.jpg" alt="image" className="img-sm profile-pic" /> </div>
                      <div className="preview-item-content flex-grow py-2">
                        <p className="preview-subject ellipsis font-weight-medium text-dark">Marian Garner </p>
                        <p className="font-weight-light small-text"> The meeting is cancelled </p>
                      </div>
                    </a>
                    <a className="dropdown-item preview-item">
                      <div className="preview-thumbnail">
                        <img src="../../../assets/images/faces/face12.jpg" alt="image" className="img-sm profile-pic" /> </div>
                      <div className="preview-item-content flex-grow py-2">
                        <p className="preview-subject ellipsis font-weight-medium text-dark">David Grey </p>
                        <p className="font-weight-light small-text"> The meeting is cancelled </p>
                      </div>
                    </a>
                    <a className="dropdown-item preview-item">
                      <div className="preview-thumbnail">
                        <img src="../../../assets/images/faces/face1.jpg" alt="image" className="img-sm profile-pic" /> </div>
                      <div className="preview-item-content flex-grow py-2">
                        <p className="preview-subject ellipsis font-weight-medium text-dark">Travis Jenkins </p>
                        <p className="font-weight-light small-text"> The meeting is cancelled </p>
                      </div>
                    </a>
                  </div>
                </li>
                <li className="nav-item dropdown">
                  <a className="nav-link count-indicator" id="notificationDropdown" href="#" data-toggle="dropdown">
                    <i className="mdi mdi-email-outline" />
                    <span className="count bg-success">3</span>
                  </a>
                  <div className="dropdown-menu dropdown-menu-right navbar-dropdown preview-list pb-0" aria-labelledby="notificationDropdown">
                    <a className="dropdown-item py-3 border-bottom">
                      <p className="mb-0 font-weight-medium float-left">You have 4 new notifications </p>
                      <span className="badge badge-pill badge-primary float-right">View all</span>
                    </a>
                    <a className="dropdown-item preview-item py-3">
                      <div className="preview-thumbnail">
                        <i className="mdi mdi-alert m-auto text-primary" />
                      </div>
                      <div className="preview-item-content">
                        <h6 className="preview-subject font-weight-normal text-dark mb-1">Application Error</h6>
                        <p className="font-weight-light small-text mb-0"> Just now </p>
                      </div>
                    </a>
                    <a className="dropdown-item preview-item py-3">
                      <div className="preview-thumbnail">
                        <i className="mdi mdi-settings m-auto text-primary" />
                      </div>
                      <div className="preview-item-content">
                        <h6 className="preview-subject font-weight-normal text-dark mb-1">Settings</h6>
                        <p className="font-weight-light small-text mb-0"> Private message </p>
                      </div>
                    </a>
                    <a className="dropdown-item preview-item py-3">
                      <div className="preview-thumbnail">
                        <i className="mdi mdi-airballoon m-auto text-primary" />
                      </div>
                      <div className="preview-item-content">
                        <h6 className="preview-subject font-weight-normal text-dark mb-1">New user registration</h6>
                        <p className="font-weight-light small-text mb-0"> 2 days ago </p>
                      </div>
                    </a>
                  </div>
                </li>
                <li className="nav-item dropdown d-none d-xl-inline-block user-dropdown">
                  <a className="nav-link dropdown-toggle" id="UserDropdown" href="#" data-toggle="dropdown" aria-expanded="false">
                    <img className="img-xs rounded-circle" src="../../../assets/images/faces/face8.jpg" alt="Profile image" /> </a>
                  <div className="dropdown-menu dropdown-menu-right navbar-dropdown" aria-labelledby="UserDropdown">
                    <div className="dropdown-header text-center">
                      <img className="img-md rounded-circle" src="../../../assets/images/faces/face8.jpg" alt="Profile image" />
                      <p className="mb-1 mt-3 font-weight-semibold">Allen Moreno</p>
                      <p className="font-weight-light text-muted mb-0">allenmoreno@gmail.com</p>
                    </div>
                    <a className="dropdown-item">My Profile <span className="badge badge-pill badge-danger">1</span><i className="dropdown-item-icon ti-dashboard" /></a>
                    <a className="dropdown-item">Messages<i className="dropdown-item-icon ti-comment-alt" /></a>
                    <a className="dropdown-item">Activity<i className="dropdown-item-icon ti-location-arrow" /></a>
                    <a className="dropdown-item">FAQ<i className="dropdown-item-icon ti-help-alt" /></a>
                    <a className="dropdown-item">Sign Out<i className="dropdown-item-icon ti-power-off" /></a>
                  </div>
                </li>
              </ul>
              <button className="navbar-toggler navbar-toggler-right d-lg-none align-self-center" type="button" data-toggle="offcanvas">
                <span className="mdi mdi-menu" />
              </button>
            </div>
          </nav>
          {/* partial */}
          <div className="container-fluid page-body-wrapper">
            {/* partial:../../partials/_sidebar.html */}
            <nav className="sidebar sidebar-offcanvas" id="sidebar">
              <ul className="nav">
                <li className="nav-item nav-profile">
                  <a href="#" className="nav-link">
                    <div className="profile-image">
                      <img className="img-xs rounded-circle" src="../../../assets/images/faces/face8.jpg" alt="profile image" />
                      <div className="dot-indicator bg-success" />
                    </div>
                    <div className="text-wrapper">
                      <p className="profile-name">Allen Moreno</p>
                      <p className="designation">Premium user</p>
                    </div>
                  </a>
                </li>
                <li className="nav-item nav-category">Main Menu</li>
                <li className="nav-item">
                  <a className="nav-link" href="../../index.html">
                    <i className="menu-icon typcn typcn-document-text" />
                    <span className="menu-title">Dashboard</span>
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" data-toggle="collapse" href="#ui-basic" aria-expanded="false" aria-controls="ui-basic">
                    <i className="menu-icon typcn typcn-coffee" />
                    <span className="menu-title">Basic UI Elements</span>
                    <i className="menu-arrow" />
                  </a>
                  <div className="collapse" id="ui-basic">
                    <ul className="nav flex-column sub-menu">
                      <li className="nav-item">
                        <a className="nav-link" href="../../pages/ui-features/buttons.html">Buttons</a>
                      </li>
                      <li className="nav-item">
                        <a className="nav-link" href="../../pages/ui-features/dropdowns.html">Dropdowns</a>
                      </li>
                      <li className="nav-item">
                        <a className="nav-link" href="../../pages/ui-features/typography.html">Typography</a>
                      </li>
                    </ul>
                  </div>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="../../pages/forms/basic_elements.html">
                    <i className="menu-icon typcn typcn-shopping-bag" />
                    <span className="menu-title">Form elements</span>
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="../../pages/charts/chartjs.html">
                    <i className="menu-icon typcn typcn-th-large-outline" />
                    <span className="menu-title">Charts</span>
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="../../pages/tables/basic-table.html">
                    <i className="menu-icon typcn typcn-bell" />
                    <span className="menu-title">Tables</span>
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="../../pages/icons/font-awesome.html">
                    <i className="menu-icon typcn typcn-user-outline" />
                    <span className="menu-title">Icons</span>
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" data-toggle="collapse" href="#auth" aria-expanded="false" aria-controls="auth">
                    <i className="menu-icon typcn typcn-document-add" />
                    <span className="menu-title">User Pages</span>
                    <i className="menu-arrow" />
                  </a>
                  <div className="collapse" id="auth">
                    <ul className="nav flex-column sub-menu">
                      <li className="nav-item">
                        <a className="nav-link" href="../../pages/samples/blank-page.html"> Blank Page </a>
                      </li>
                      <li className="nav-item">
                        <a className="nav-link" href="../../pages/samples/login.html"> Login </a>
                      </li>
                      <li className="nav-item">
                        <a className="nav-link" href="../../pages/samples/register.html"> Register </a>
                      </li>
                      <li className="nav-item">
                        <a className="nav-link" href="../../pages/samples/error-404.html"> 404 </a>
                      </li>
                      <li className="nav-item">
                        <a className="nav-link" href="../../pages/samples/error-500.html"> 500 </a>
                      </li>
                    </ul>
                  </div>
                </li>
              </ul>
            </nav>
            {/* partial */}
            <div className="main-panel">
              <div className="content-wrapper"> </div>
              {/* content-wrapper ends */}
              {/* partial:../../partials/_footer.html */}
              <footer className="footer">
                <div className="container-fluid clearfix">
                  <span className="text-muted d-block text-center text-sm-left d-sm-inline-block">Copyright © 2019 <a href="http://www.bootstrapdash.com/" target="_blank">Bootstrapdash</a>. All rights reserved.</span>
                  <span className="float-none float-sm-right d-block mt-1 mt-sm-0 text-center">Hand-crafted &amp; made with <i className="mdi mdi-heart text-danger" />
                  </span>
                </div>
              </footer>
              {/* partial */}
            </div>
            {/* main-panel ends */}
          </div>
          {/* page-body-wrapper ends */}
        </div>
        {/* container-scroller */}
        {/* plugins:js */}
        {/* endinject */}
        {/* Plugin js for this page*/}
        {/* End plugin js for this page*/}
        {/* inject:js */}
        {/* endinject */}
        {/* Custom js for this page*/}
        {/* End custom js for this page*/}
      </div>
    );
}