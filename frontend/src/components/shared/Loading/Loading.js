import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import BounceLoader from "react-spinners/ClipLoader";
import { fadeInDown } from 'react-animations';
import Radium, {StyleRoot} from 'radium';

class Loading extends React.Component{
    static propTypes = {
        loading: PropTypes.bool.isRequired
    };
    constructor(props){
        super(props);
    }
    
    render(){
        const styles = {
            bounce: {
              animation: 'x 2s',
              animationName: Radium.keyframes(fadeInDown, 'fadeInDown')
            }
          }
        const override = {
            marginLeft:'auto',
            marginRight:'auto'
        }
        return(
             <StyleRoot>
                <div className={"my-loader "+(this.props.loading?'z-100':'')}>
                    {this.props.loading?
                    <div className={"card my-loader-card"} style={styles.bounce}>
                        <BounceLoader
                            size={100}
                            color={"#2196f3"}
                            css={override}
                        />
                        <h4 style={{marginTop:'30px'}}>Loading...</h4>
                    </div>
                        :null}
                    </div>
                    
                    <div className={""+(this.props.loading?'my-darker':'')} style={styles.bounce}>
                        {this.props.children}
                    </div>

                    </StyleRoot>
        )
    }
}
const mapStateToProps = (state) => ({
    loading: state.loading,
});

export default connect(mapStateToProps)(Loading);