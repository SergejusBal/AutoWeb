const url_profile = "http://localhost:8080";
const urlParams = new URLSearchParams(parent.location.search);
var carImage;


document.addEventListener("DOMContentLoaded", async function(){

    const urlParams = new URLSearchParams(parent.location.search);
    id = urlParams.get('id');

        if(id != null){

            let response = await fetch(url_profile + "/car?id="+id, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',            
                },               
            })
        
            if (response.status == 401){
                console.log("LogIn Status:","unauthorized")
            }
            else if (response.status == 500 ) {
                throw new Error('Failed to fetch ticket data');
            }  
        
            var car =  await response.json();   
            
            carImage = car.image;

            document.getElementById('titlePreview').textContent = car.title;
            document.getElementById('makePreview').textContent = car.make;
            document.getElementById('modelPreview').textContent = car.model;
            document.getElementById('yearPreview').textContent = car.year.substring(0, 4);
            document.getElementById('mileagePreview').textContent = car.millage;
            document.getElementById('pricePreview').textContent = car.price;
            document.getElementById('descriptionPreview').textContent = car.description;
            document.getElementById('photoPreview').src = convertBase64ToImage(carImage);

            document.getElementById('title').textContent = car.title;
            document.getElementById('make').textContent = car.make;
            document.getElementById('model').textContent = car.model;           
            document.getElementById('mileage').textContent = car.millage;
            document.getElementById('price').textContent = car.price;
            document.getElementById('description').textContent = car.description;
            document.getElementById('year').value = car.year.substring(0, 4);

        }

        sendHeight();

})

//Paliktas be event kad turėčiau ir tokį metodą
async function setPreview() {


    let check= checkIfDataIsCorrect();
    if(check != "ok"){
        document.getElementById('errorMessage').innerText = check;
        return;
    }
    document.getElementById('errorMessage').innerText = "";

    document.getElementById('titlePreview').innerText = document.getElementById('title').value;
    document.getElementById('makePreview').innerText = document.getElementById('make').value;
    document.getElementById('modelPreview').innerText = document.getElementById('model').value;
    document.getElementById('yearPreview').innerText = document.getElementById('year').value;
    document.getElementById('pricePreview').innerText = document.getElementById('price').value;
    document.getElementById('mileagePreview').innerText = document.getElementById('mileage').value;
    document.getElementById('descriptionPreview').innerText = document.getElementById('description').value;
    
    const file = document.getElementById('photo').files[0];
    const photoPreview = document.getElementById('photoPreview');
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            photoPreview.src = e.target.result;
        }
        reader.readAsDataURL(file);
    } 
    else if(urlParams){
       //do nothing as car is iset already
    }
    else {        
        photoPreview.src = '/Images/original_logo.webp';
    }   
     
}

async function createdata(){
    let convertedImage;
    const file = document.getElementById('photo').files[0];
    if(file) {
        convertedImage = await createBase64FromImage(file); 
    } else{
        convertedImage = carImage;
    }

    let data ={
        userEntityEmail: getCookie("UserID"),
        title: document.getElementById('title').value,
        make: document.getElementById('make').value,
        model: document.getElementById('model').value,
        year: document.getElementById('year').value,
        millage: document.getElementById('mileage').value,
        price: document.getElementById('price').value,
        description: document.getElementById('description').value,
        fuelType:"1",
        image: convertedImage,
    }

    return data;

}

async function sentToDataBase() { 

    id = urlParams.get('id');
        if(id == null){
            writeNewData();
        }else{
            updateData(id);
        }
}

async function writeNewData(){

    let check= checkIfDataIsCorrect();
    if(check != "ok"){
        document.getElementById('errorMessage').innerText = check;
        return;
    }
    document.getElementById('errorMessage').innerText = "";

    data = await createdata();   

    console.log('Returned Byte Array:', data);

    let jwttoken = getCookie("LogInCookies");

    let response = await fetch(url_profile + '/car/new', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': "Bearer "+ jwttoken,    
        },
        body: JSON.stringify({
        title: data.title,
        userEntityEmail:data.userEntityEmail,
        make: data.make,
        model: data.model,
        year: data.year + "-01-01",
        millage: data.millage,
        price: data.price,
        description: data.description,
        fuelType: data.fuelType,       
        image: data.image,
        })       
    })

     
    if (response.status == 200){
        document.getElementById('errorMessage').innerText = "Car added successfully";
    } else{
        document.getElementById('errorMessage').innerText = "Car submission failed";
    }
}

async function updateData(id){

    let check= checkIfDataIsCorrect();
    if(check != "ok"){
        document.getElementById('errorMessage').innerText = check;
        return;
    }
    document.getElementById('errorMessage').innerText = "";

    data = await createdata();   

    console.log('Returned Byte Array:', data);

    let jwttoken = getCookie("LogInCookies");

    let response = await fetch(url_profile + '/car/alter?id=' + id, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': "Bearer "+ jwttoken,    
        },
        body: JSON.stringify({
        title: data.title,
        userEntityEmail:data.userEntityEmail,
        make: data.make,
        model: data.model,
        year: data.year + "-01-01",
        millage: data.millage,
        price: data.price,
        description: data.description,
        fuelType: data.fuelType,       
        image: data.image,
        })       
    })

     
    if (response.status == 200){
        document.getElementById('errorMessage').innerText = "Car updated successfully";
    } else{
        document.getElementById('errorMessage').innerText = "Car submission failed";
    }

}



function checkIfDataIsCorrect(){

    let price = parseInt(document.getElementById('price').value);
    let mileage = document.getElementById('mileage').value;
    let year =  parseInt(document.getElementById('year').value);
    
    if (document.getElementById('title').value.length > 45)       
        return "Title is to long";
    
    else if (document.getElementById('make').value.length  > 45)
        return "Make is to long";
    
    else if (document.getElementById('model').value.length  > 45)
        return "Model is to long";
    

    else if (document.getElementById('description').value.length  > 500)
        return "Description is to long";  
    
    else if (isNaN(price))
        return "Invalid price format";
        
    else if (price < 0)
        return "Price must be possitive";
       
    else if (isNaN(mileage))
        return "Invalid mileage format";
        
    else if (mileage < 0)
        return "Mileage must be possitive";
    
    else if(isNaN(year))
        return "Please select year";

    return "ok";
}











