import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import QrReader from 'react-qr-reader'
import PopUpCard from '../../../components/user/cards/PopUpCard';

class Scanner extends React.Component {
    _handleError = (error) =>{
        console.log(error);
    }
    _handleScan = (data) =>{
        console.log(data)
    }
    render() {
        return (
            <>
                <div className="row h-100">
                    <div className="col-12 text-center" style={{paddingTop:'2em'}}>
                        <h3 style={{fontWeight:'bold'}}>Place QR code inside area</h3>
                        <h5 className="text-muted">Scanning will start automatically</h5>
                    </div>
                    <div className="col-12 h-100 scanner-container" style={{paddingTop:'5em'}}>
                        <QrReader
                            delay={300}
                            onError={this._handleError}
                            onScan={this._handleScan}
                            style={{ width: '100%' }}
                        />
                    </div>
                </div>
            </>
        );
    }
}

Scanner.propTypes = {

};
const mapStateToProps = (state) => ({
    auth: state.auth,
    dependentState: state.dependentState,
});

export default connect(mapStateToProps, {})(Scanner);