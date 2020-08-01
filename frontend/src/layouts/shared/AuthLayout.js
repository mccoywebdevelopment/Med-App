import React from "react";

export default function AuthLayout(props){
    return(
        <div className="auth auth-bg-1" style={{padding:'20px'}}>
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
    );
}