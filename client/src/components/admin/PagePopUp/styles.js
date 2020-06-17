var popUp = {
    position: 'fixed', /* Sit on top of the page content */
    display: 'block', /* Hidden by default */
    width: '100%', /* Full width (cover the whole page) */
    height: '100%', /* Full height (cover the whole page) */
    top: '0px',
    left: '0',
    right: '0',
    bottom: '0',
    backgroundColor:'rgba(0,0,0,0.7)', /* Black background with opacity */
    zIndex: '2', /* Specify a stack order in case you're using a different order for other elements */
    cursor: 'pointer' /* Add a pointer on hover */
}
var popUpContent = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    fontSize: '50px',
    width:'60%',
    height:'auto',
    transform: 'translate(-50%,-50%)'
}
var exit = {
    marginLeft:'30px',
    marginTop:'5px',
    cursor:'pointer',
    fontSize:'25px',
    color:'#7B8497'
}

module.exports={popUp,popUpContent,exit}