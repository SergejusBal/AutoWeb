const url_registration = "http://localhost:8080";

document.getElementById("registerBtn").addEventListener("click", async function(event) {
    
    let password1 = document.getElementById("password1").value;
    let password2 = document.getElementById("password2").value;   
    let email = document.getElementById("email").value; 

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
    else if (!email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)){
        document.getElementById("errorMessage").innerHTML = "Incorrect email format!";
        return;
    }

    let user = {
        username: document.getElementById("username").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password1").value
    }

    let response  = await register(user);

    if(response){
        document.getElementById("errorMessage").innerHTML = "Registration was successful!";
        clearFields()
    }

})


async function register(user){   
   
    let response = await fetch(url_registration +"/register", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',            
        },
        body: JSON.stringify({
            name: user.username,            
            username: user.email,
            password:user.password,         
            }),            
    });

   
    if (response.status == 409 ) {
        document.getElementById("errorMessage").innerHTML = "Email already exists!";
        return false;
    } 

    const boolean = await response.json();
    return boolean;
}


function clearFields(){

    document.getElementById("password1").textContent = "";
    document.getElementById("password2").textContent = "";
    document.getElementById("username").textContent = "";
    document.getElementById("email").textContent = "";


}