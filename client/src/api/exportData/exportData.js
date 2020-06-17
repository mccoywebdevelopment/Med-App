import variable from "../../config/variable";
var saveAs = require('file-saver');

const downloadFile = async(jwt_token,month,year) =>{
    var jwt = jwt_token;
    //eturn await (await fetch(variable.api.baseURL+"/export-data/"+jwt+"/"+month+"/"+year)).text()
    fetch(variable.api.baseURL+"/export-data/"+jwt+"/"+month+"/"+year, {
        headers: {
          'Content-Type': 'text/csv'
        },
        responseType: 'blob'
      }).then(response => response.blob())
        .then(blob => saveAs(blob, getNameOfCurrentMonth(month)+" "+year+'.csv'));
}
function getNameOfCurrentMonth(index){
  const monthNames = ["January", "February", "March", "April", "May", "June",
                      "July", "August", "September", "October", "November", "December"
                      ];


  return monthNames[index];
}
export{
    downloadFile
}