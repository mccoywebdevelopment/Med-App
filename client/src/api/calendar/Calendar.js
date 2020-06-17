import variable from "../../config/variable";

const getAllMedEvents = async(jwt_token) =>{
    var jwt = jwt_token;
    return await (await fetch(variable.api.baseURL+"/calendar/"+jwt+"/get-dates-medication-taken")).json()
}
function updateEvent(data,jwt,eventId,callback){
    var newData ={
        updatedFields:data
    }
    fetch(variable.api.baseURL+"/rxsMedication-event/"+jwt+"/med-event/"+eventId,{
        method:'PATCH',
        body: JSON.stringify(newData),
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(response => response.json())
    .then(jsondata => callback(jsondata));
}
export{
    getAllMedEvents,
    updateEvent
}