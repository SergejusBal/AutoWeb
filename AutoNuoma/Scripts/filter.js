
var url_filter = "http://localhost:8080";

var filter = {};

async function applyFilter() {
 
        const make = document.getElementById('make').value;
        const model = document.getElementById('model').value;
        const minPrice = document.getElementById('minprice').value;
        const maxPrice = document.getElementById('maxprice').value;
        const mileage = document.getElementById('mileage').value;
        const year = document.getElementById('year').value;        

        const filter = {
            make: make,
            model: model,
            minPrice: minPrice,
            maxPrice: maxPrice,
            mileage: mileage,
            year: year
        };

    let check= checkIfFilterCorrect();
    if(check != "ok"){
     document.getElementById('errorMessage').innerText = check;
        return;
    }
     document.getElementById('errorMessage').innerText = "";


    const message = {
        type: 'filterValues',
        content: {
            data: filter,
        }
    };       
    window.parent.postMessage(message, '*');
}


function checkIfFilterCorrect(){

    let priceMin = parseInt(document.getElementById('minprice').value);
    let priceMax = parseInt(document.getElementById('maxprice').value);
    let mileage = document.getElementById('mileage').value;
    let year =  parseInt(document.getElementById('year').value);
    
     
    
    if (isNaN(priceMin))
        return "Invalid min price format";
        
    else if (priceMin < 0)
        return "Min price must be possitive";

    if (isNaN(priceMax))
        return "Invalid max price format";
        
    else if (priceMax < 0)
        return "Max price must be possitive";
       
    else if (isNaN(mileage))
        return "Invalid mileage format";
        
    else if (mileage < 0)
        return "Mileage must be possitive";

    else if (isNaN(year))
        return "Invalid year format";
        
    else if (year < 1900 || year > 2024)
        return "Year must be between 1900 and 2024";

    return "ok";    
}




document.addEventListener('DOMContentLoaded',  async function() { 
    const make = await getMake();
    const makeSelect = document.getElementById('make');  

    make.forEach((make, index) => {
        const option = document.createElement('option');
        option.value = make; 
        option.textContent = make;
        makeSelect.appendChild(option);
    });
    
    document.getElementById('minprice').value = await getPrice(filter,"MIN");
    document.getElementById('maxprice').value = await getPrice(filter,"MAX");
    

});



document.getElementById('make').addEventListener('change', async function() {

    filter.make = document.getElementById('make').value;
    const model = await getModel(filter);     

    const modelSelect = document.getElementById('model');
    modelSelect.innerHTML = '<option value="">-Select a model-</option>'

    

    model.forEach((model, index) => {
        const option = document.createElement('option');
        option.value = model; 
        option.textContent = model;
        modelSelect.appendChild(option);
    });

    
    

});



document.getElementById('model').addEventListener('change', async function() {
    filter.model = document.getElementById('model').value;

    document.getElementById('minprice').value = await getPrice(filter,"MIN");
    document.getElementById('maxprice').value = await getPrice(filter,"MAX");
    

});


async function getMake(){
    
    let response = await fetch(url_filter + "/car/make", {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',            
        },               
    })  
      
    if(response.status == 200){
        return await response.json();  
    }

        
    
}

async function getModel(filter){
    
    let response = await fetch(url_filter + "/car/model", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',            
        }, 
        body:JSON.stringify({          
            make:filter.make,                                       
          })             
    })  
      
    if(response.status == 200){
        return await response.json();  
    }        
    
}

async function getPrice(filter,price){
    
    let response = await fetch(url_filter + "/car/price?price=" + price, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',            
        }, 
        body:JSON.stringify({          
            make:filter.make,
            model:filter.model                              
          })             
    })  
      
    if(response.status == 200){
        return await response.json();  
    }        
    
}


