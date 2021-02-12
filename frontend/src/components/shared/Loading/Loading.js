import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import BounceLoader from "react-spinners/MoonLoader";
import {toggleLoading} from '../../../actions/loading';
import {createMessage} from '../../../actions/messages'
import { fadeInDown } from 'react-animations';
import Radium, {StyleRoot} from 'radium';

class Loading extends React.Component{
    static propTypes = {
        loading: PropTypes.bool.isRequired,
        theme: PropTypes.object.isRequired
    };
    constructor(props){
        super(props);
    }

    componentDidMount = () =>{
        setTimeout(()=>{
            if(this.props.loading){
                this.props.toggleLoading(false);
                this.props.createMessage("Script took too long to fetch please check console.",'danger');
            }
        },15000)
    }
    
    render(){
        const styles = {
            bounce: {
              animation: 'x 1s',
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
                            color={this.props.theme.pagePrimaryColor}
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
Loading.propTypes = {
    toggleLoading: PropTypes.func.isRequired,
    createMessage: PropTypes.func.isRequired
};
const mapStateToProps = (state) => ({
    loading: state.loading,
    theme: state.theme
});

export default connect(mapStateToProps,{toggleLoading,createMessage})(Loading);