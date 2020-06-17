import variable from "../../config/variable";
var jwt = null;

const getAllData = async(jwt_token) =>{
    jwt = jwt_token;
    return await (await fetch(variable.api.baseURL+"/data/"+jwt)).json()
}
export{
    getAllData
}