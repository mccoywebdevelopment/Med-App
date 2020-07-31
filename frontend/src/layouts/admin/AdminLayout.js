import React from 'react';

//DO NOT DELETE CSS FILES AND SCRIPTS ARE ATTATCH!!!========
import Header from "../../components/admin/partials/Header";
import Footer from "../../components/admin/partials/Footer";
//==========================================================
import "../../assets/css/myCss.css";

export default function AdminLayout(props) {
    return (
        <>
            <div className="my-side-bar">
                <div className="my-brand">
                    <a href="/home"  className="my-nav-item ">
                        <i title="Home" className="fas fa-notes-medical"></i>
                    </a>
                </div>
                <div>
                    <a href="/dependents/all" className="my-nav-item">
                        <i title="Medication(s)" className="fas fa-capsules"></i>
                    </a>
                </div>
                <div>
                    <a href="/groups/all" className="my-nav-item">
                        <i title="Group(s)" className="fas fa-users"></i>
                    </a>
                </div>
                <div>
                    <a href="/users/all" className="my-nav-item">
                        <i title="User(s)" className="fas fa-user-shield"></i>
                    </a>
                </div>
                <div>
                    <a href="/profile" className="my-nav-item">
                        <i title="My Profile" className="fas fa-user-md"></i>
                    </a>
                </div>
            </div>
            <div className="my-top-nav">
                
            </div>
            <div className="main">
                <div className="alert-container">
                    <div class="alert alert-danger" role="alert">
                        This is a danger alert—check it out!
                    </div>
                </div>
                <div>
                    {props.children}
                </div>
                {/* <div className="footer">
                    footer
                </div> */}
            </div>
        </>
    );
}