import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { togglePopUp } from '../../../actions/popUp';
import { fadeInDown } from 'react-animations';
import Radium, {StyleRoot} from 'radium';

class PopUp extends React.Component{
    static propTypes = {
        popUp: PropTypes.object.isRequired,
        theme: PropTypes.object.isRequired
    };
    constructor(props){
        super(props);
        if(this.props.popUp && this.props.popUp.component && this.props.popUp.component.type && this.props.popUp.component.type.compare == null){
            this.props.togglePopUp();
            window.localStorage.clear(); //try this to clear all local storage
            localStorage.clear();
        }
    }
    render(){
        const styles = {
            bounce: {
              animation: 'x 1s',
              animationName: Radium.keyframes(fadeInDown, 'fadeInDown'),
            }
          }
        return(
            <StyleRoot>
                {this.props.popUp.component?
                <div className="z-100 my-popUp-container text-centered" style={styles.bounce}>
                    <div className="card my-popUp" style={{padding:'20px',width:this.props.popUp.width||'80%'}}>
                        <div className="row">
                            <div className="col-lg-12">
                                <h2 style={{display:'inline'}}>{this.props.popUp.title}&nbsp;</h2>
                                <i title="close" onClick={()=>{this.props.togglePopUp()}} 
                                    style={{float:'right',color:this.props.theme.pagePrimaryColor}} className="fas fa-times"></i>
                            </div>
                        </div>
                        <div className="row" style={{marginTop:'0px',paddingTop:'10px'}}>
                            {this.props.popUp.component}
                        </div>
                    </div>
                </div>
                :null
                }
                
                <div className={""+(this.props.popUp.component?'my-darker':'')} style={styles.bounce}>
                    {this.props.children}
                </div>
            </StyleRoot>
        )
    }
}
PopUp.propTypes = {
  togglePopUp: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  popUp: state.popUp,
  theme: state.theme
});

export default connect(mapStateToProps, {togglePopUp})(PopUp);