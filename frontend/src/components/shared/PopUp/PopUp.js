import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { togglePopUp } from '../../../actions/popUp';
import { fadeInDown } from 'react-animations';
import Radium, {StyleRoot} from 'radium';

class PopUp extends React.Component{
    static propTypes = {
        popUp: PropTypes.object.isRequired,
    };
    constructor(props){
        super(props);
    }
    render(){
        const styles = {
            bounce: {
              animation: 'x 1s',
              animationName: Radium.keyframes(fadeInDown, 'fadeInDown')
            }
          }
        return(
            <StyleRoot>
                {this.props.popUp.component?
                <div className="z-100 my-popUp-container text-centered" style={styles.bounce}>
                    <div className="card my-popUp" style={{paddingLeft:"15px",paddingRight:"15px"}}>
                        <div className="row" style={{marginTop:'10px'}}>
                            <div className="col-lg-12">
                                <h4 style={{display:'inline'}}>{this.props.popUp.title}&nbsp;</h4>
                                <i title="close" onClick={()=>{this.props.togglePopUp()}} style={{float:'right'}} className="fas fa-times"></i>
                            </div>
                        </div>
                        <div className="row" style={{marginTop:'30px'}}>
                            <p>test</p>
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
});

export default connect(mapStateToProps, {togglePopUp})(PopUp);