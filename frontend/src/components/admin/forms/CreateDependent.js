import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { submitNewDependent } from '../../../actions/dependent';

import DepOverview from './DepOverview';

class CreateDependent extends React.Component {
    static propTypes = {
        dependents: PropTypes.object.isRequired
    };
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
                <div className="row">
                    <DepOverview />
                </div>
                <div className="row">
                    <button className="btn btn-primary" onClick={()=>{this.props.submitNewDependent()}}>Submit</button>
                </div>
            </>

        );
    }
}

CreateDependent.propTypes = {
    submitNewDependent: PropTypes.func.isRequired
};
const mapStateToProps = (state) => ({
    dependents: state.dependents
});

export default connect(mapStateToProps, { submitNewDependent })(CreateDependent);