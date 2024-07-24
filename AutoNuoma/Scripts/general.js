
function createByteArrayFromImage(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const arrayBuffer = e.target.result;
            const byteArray = new Uint8Array(arrayBuffer);
            resolve(byteArray);
        };
        reader.onerror = function(e) {
            reject(e);
        };
        reader.readAsArrayBuffer(file);
    });
}

function createBase64FromImage(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const arrayBuffer = e.target.result;
            const byteArray = new Uint8Array(arrayBuffer);

            let binaryString = '';
            for (let i = 0; i < byteArray.length; i++) {
                binaryString += String.fromCharCode(byteArray[i]);
            }            
            const base64String = btoa(binaryString);
            resolve(base64String);
        };
        
        reader.onerror = function(e) {
            reject(e);
        };        
        reader.readAsArrayBuffer(file);
    });
}



function convertBase64ToImage(base64String) {
    let byteArray = convertBase64ToArray(base64String)
    const blob = new Blob([byteArray], { type: 'image/jpeg' });
    return URL.createObjectURL(blob);
}

function convertBase64ToArray(base64String) { 
    // Decode the base64 string into a binary string
   let binaryString
   try { 
       binaryString = atob(base64String);
   } catch (error){
       binaryString = [];
   }

   let byteArray = new Uint8Array(binaryString.length);
   for (let i = 0; i < binaryString.length; i++) {
       byteArray[i] = binaryString.charCodeAt(i);
   }
   return byteArray;
}


function convertByteArrayToImage(byteArray) {
    const blob = new Blob([byteArray], { type: 'image/jpeg' });
    return URL.createObjectURL(blob);
}

