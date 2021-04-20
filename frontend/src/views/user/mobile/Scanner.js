import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createMessage } from '../../../actions/messages';

import QrReader from 'react-qr-reader'
import PopUpCard from '../../../components/user/cards/PopUpCard';

class Scanner extends React.Component {
    state = {
        data: null
    }
    constructor(props) {
        super(props);
    }
    _handleError = (error) => {
        this.props.createMessage(JSON.stringify(error), 'danger', 6000);
        console.log(error);
    }
    _handleScan = (data) => {
        if (!this.state.data && data) {
            // let newState = this.state;
            // newState.data = data;
            // this.setState(newState);
            window.location = data + "/is-local";
        }
    }
    render() {
        return (
            <>
                <div className="row h-100">
                    <div className="col-12 text-center" style={{ paddingTop: '2em' }}>
                        <h3 style={{ fontWeight: 'bold' }}>Place QR code inside area</h3>
                        <h5 className="text-muted">Scanning will start automatically</h5>
                    </div>
                    {this.state.data ?
                        <div className="col-12 card">
                            <h1>success!</h1>
                        </div> :
                        <div className={"col-12 h-100 scanner-container " + (this.state.data ? 'scanner-success' : null)} style={{ paddingTop: '5em' }}>
                            <QrReader
                                delay={600}
                                onError={this._handleError}
                                onScan={this._handleScan}
                                style={{ width: '100%' }}
                            />
                        </div>
                    }
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

export default connect(mapStateToProps, { createMessage })(Scanner);