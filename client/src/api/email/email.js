///  api/auth/email/send-welcome/:email/:JWT
import{jwt} from "../users/Users";
import variable from "../../config/variable";


function sendWelcome(data,callback){
    fetch(variable.api.baseURL+"/auth/email/create-user/"+jwt,{
        method:'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(response => response.json())
    .then(jsondata => {
        callback(jsondata)});
}
function sendForgotPasswordEmail(email,callback){
    var body = {
        email:email
    }
    fetch(variable.api.baseURL+"/auth/email/forgot-password",{
        method:'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(response => response.json())
    .then(jsondata => {
        callback(jsondata)});
}

export{
    sendWelcome,sendForgotPasswordEmail
}