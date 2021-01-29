import React from 'react';

export default function Footer(){
    return(
        <footer className="footer">
            <div className="container-fluid clearfix">
              <span className="text-muted d-block text-center text-sm-left d-sm-inline-block">Copyright © 2019 <a href="http://www.bootstrapdash.com/" target="_blank">Bootstrapdash</a>. All rights reserved.</span>
              <span className="float-none float-sm-right d-block mt-1 mt-sm-0 text-center">Hand-crafted & made with <i className="mdi mdi-heart text-danger"></i>
              </span>
            </div>


            <script src="../../../assets/js/template/off-canvas.js"></script>
            <script src="../../../assets/js/template/misc.js"></script>
            <script src="../../../assets/js/Jquery/jquery.js"></script>
            <script src="../../../assets/js/popper/popper.js"></script>
            <script src="../../../assets/js/bootstrap/bootstrap.js"></script>

        </footer>
    );
}