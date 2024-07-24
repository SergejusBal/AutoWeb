const url_carPage= "http://localhost:8080";

var id;

document.addEventListener('DOMContentLoaded', async function() {

    const urlParams = new URLSearchParams(parent.location.search);
    id = urlParams.get('id');

    let response = await fetch(url_carPage + "/car?id="+id, {
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
    
    
    document.getElementById('title').textContent = car.title;
    document.getElementById('make').textContent = car.make;
    document.getElementById('model').textContent = car.model;
    document.getElementById('year').textContent = car.year.substring(0, 4);;
    document.getElementById('mileage').textContent = car.millage;
    document.getElementById('price').textContent = car.price;
    document.getElementById('description').textContent = car.description;
    document.getElementById('photo').src = convertBase64ToImage(car.image); 
    sendHeight();


    if (getCookie("UserID") != car.userEntityEmail){
        document.getElementById("deleteBtn").style.display = "none";
        document.getElementById("editBtn").style.display = "none";
    }

});


document.getElementById("deleteBtn").addEventListener("click", async function(event) {

    const jwttoken =  getCookie("LogInCookies");

    let response = await fetch(url_carPage + "/car?id="+id, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization':  "Bearer " + jwttoken,
        },               
    })

    if(response.status == 200){
        parent.window.open("../index.html");      
    }
    else{

    }

});

document.getElementById("editBtn").addEventListener("click", async function(event) {

    parent.document.getElementById('contentFrame').src = "./html/userCarSubmitPage.html";

})





async function createdata(){

    const file = document.getElementById('photo').files[0];
    let convertedImage = await createBase64FromImage(file);   

    let data ={
        userEntityEmail: 1,
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


