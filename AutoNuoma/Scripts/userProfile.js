const url_profile = "http://localhost:8080";

document.getElementById("submitBtn").addEventListener("click", async function(event) {
    
    let password1 = document.getElementById("password1").value;
    let password2 = document.getElementById("password2").value;    

    if(password1 !== password2){
        document.getElementById("errorMessage").innerHTML = "Passwords do not match!";
        return;
    }
    else if (password1.length < 10) {
        document.getElementById("errorMessage").innerHTML = "Password too short!";
        return;
    }
    else if (!password1.match(/[a-z]+/)){
        document.getElementById("errorMessage").innerHTML = "Password must contain lowercase!";
        return;
    }
    else if (!password1.match(/[A-Z]+/)){
        document.getElementById("errorMessage").innerHTML = "Password must contain uppercase!";
        return;
    }
    else if (!password1.match(/[0-9]+/)){
        document.getElementById("errorMessage").innerHTML = "Password must contain number!";
        return;
    }

    let user = {
        username: document.getElementById("name").value,       
        password: document.getElementById("password1").value
    }

    await register(user);    

})



async function register(user){   
    
    let userId = getCookie("UserID");
    let jwttoken = getCookie("LogInCookies");

    let response = await fetch(url_profile +"/user/update/" + userId, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json', 
            'Authorization': "Bearer "+ jwttoken,           
        },
        body: JSON.stringify({
            name: user.username,            
            password:user.password,         
            }),            
    });


    if (response.status == 200 ) {
        document.getElementById("errorMessage").innerHTML = "User was updated successfully!";
        return;
    } 
   
    if (response.status == 404 ) {
        document.getElementById("errorMessage").innerHTML = "User not Found!";
        return; 
    } 
    if (response.status == 403 ) {
        document.getElementById("errorMessage").innerHTML = "Forbidden!";
        return;
    } 
   
}