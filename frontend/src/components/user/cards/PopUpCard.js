import React from 'react'

export default class MedicationCard extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <>
                <div className="card" style={{ padding: '0.5em' }}>
                    <div className="row">
                        <div className="col-12">
                            <UserHeader header={this.props.header} subHeader={this.props.subHeader} />
                            <i title="close" onClick={() => { this.props.togglePopUp() }}
                                                style={{ float: 'right', color: this.props.theme.pagePrimaryColor }} className="fas fa-times"></i>
                        </div>
                    </div>
                    {this.props.children}
                </div>
            </>
        )
    }
}