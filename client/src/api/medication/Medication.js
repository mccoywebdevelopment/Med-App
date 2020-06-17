import variable from "../../config/variable";
import{jwt} from "../dependents/Dependents";

function medicationPatch(id,data,callback){
    var newData = {
        updatedFields:data
    }
    fetch(variable.api.baseURL+"/medications/"+id+"/"+jwt,{
        method:'PATCH',
        body: JSON.stringify(newData),
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(response => response.json())
    .then(jsondata => callback(jsondata));
}
export {
    medicationPatch
}