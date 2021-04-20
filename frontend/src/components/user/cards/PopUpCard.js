import React from 'react'
import UserHeader from '../header/UserHeader';

export default class MedicationCard extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <>
                <div className="card h-100" style={{ padding: '0.75em', overflowY: 'scroll' }}>
                    <div className="row" style={{ marginTop: '0px', marginBottom: '0px' }}>
                        <div className="col-9">
                            <UserHeader header={this.props.header} subHeader={this.props.subHeader} />
                        </div>
                        {this.props.togglePopUp && typeof(this.props.togglePopUp) == 'function' ?
                            <>
                                <div className="col-3">

                                    <i title="close" onClick={() => { this.props.togglePopUp() }}
                                        style={{ float: 'right', color: 'rgb(33, 150, 243)' }} className="fas fa-times"></i>
                                </div>
                            </>
                            : null}
                    </div>
                    {this.props.children}
                </div>
            </>
        )
    }
}