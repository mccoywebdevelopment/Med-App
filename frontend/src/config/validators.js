function nameValidator(name,isRequired){
    var feedback = {
        isValid:true,
        errorMsg:""
    }
    if(name.length<1 && isRequired){
        feedback.errorMsg = "This field is required";
        feedback.isValid = false;
    }
    return feedback;
}
function phoneNumberValidator(phoneNumber,isRequired){
    var feedback = {
        isValid:true,
        errorMsg:""
    }
    phoneNumber = phoneNumber.replace(/-/g,"");
    phoneNumber = phoneNumber.replace("(","");
    phoneNumber = phoneNumber.replace(")","");
    phoneNumber = phoneNumber.replace(/\s/g, "");

    if(phoneNumber.length<1 && isRequired){
        feedback.errorMsg = "This field is required";
        feedback.isValid = false;
    }else if(isNaN(phoneNumber)){
        feedback.errorMsg = "Please enter only numeric values";
        feedback.isValid = false;
    }else if(phoneNumber.length != 10){
        feedback.errorMsg = "Please enter a ten digit phone number recieved: "+phoneNumber.length+".";
        feedback.isValid = false;
    }
    return feedback;
}
function numberValidator(number,isRequired){
    var feedback = {
        isValid:true,
        errorMsg:""
    }
    if(number.length<1 && isRequired){
        feedback.errorMsg = "This field is required";
        feedback.isValid = false;
    }else if(isNaN(number)){
        feedback.errorMsg = "Please enter only numeric values";
        feedback.isValid = false;
    }
    return feedback;
}
function emailValidator(email,isRequired){
    var feedback = {
        isValid:true,
        errorMsg:""
    }
    if(email.length<1 && isRequired){
        feedback.errorMsg = "This field is required";
        feedback.isValid = false;
    }else if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
        feedback.errorMsg = "You have entered an invalid email address";
        feedback.isValid = false;
    }
    return feedback;
}
function passwordValidator(password,isRequired){
    var feedback = {
        isValid:true,
        errorMsg:""
    }
    if(password.length<1 && isRequired){
        feedback.errorMsg = "This field is required";
        feedback.isValid = false;
    }else if(password.length<8){
        feedback.errorMsg = "Please enter a password with at least eight characters only recieved: "+password.length+".";
        feedback.isValid = false;
    }
    return feedback;
}
module.exports = {nameValidator,phoneNumberValidator,numberValidator,emailValidator,passwordValidator};