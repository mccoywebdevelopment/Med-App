import variable from "../../config/variable";


function register(email,token,bodyData,callback){
    fetch(variable.api.baseURL+"/auth/register/"+email+"/"+token,{
        method:'POST',
        body: JSON.stringify(bodyData),
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        //text because it's sending back
    }).then(response => response.json())
    .then(jsondata => callback(jsondata));
}
function login(bodyData,callback){

    fetch(variable.api.baseURL+"/auth/login",{
        method:'POST',
        body: JSON.stringify(bodyData),
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        //text because it's sending back
    }).then(response => response.json())
    .then(jsondata => callback(jsondata));
}
function resetPassword(bodyData,callback){

    fetch(variable.api.baseURL+"/auth/reset-password",{
        method:'POST',
        body: JSON.stringify(bodyData),
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        //text because it's sending back
    }).then(response => response.json())
    .then(jsondata => callback(jsondata));
}
function logout(jwt,callback){

    fetch(variable.api.baseURL+"/auth/logout/"+jwt,{
        method:'GET',
    }).then(response => response.json())
    .then(jsondata => callback(jsondata));
}

export{register,login,resetPassword,logout}