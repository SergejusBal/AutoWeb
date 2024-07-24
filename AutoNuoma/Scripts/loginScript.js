
const url_login = 'http://localhost:8080';

document.getElementById("loginBtn").addEventListener("click", async function(event) {

    var user = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    

    let response = await getToken(user, password); 
    
    if(response == "Invalid username or password") {
         document.getElementById("errorMessage").textContent = response;
    }
    else{
        let userid = await getUserID(user, response);
        setCookie("LogInCookies",response,7);
        setCookie("UserID",userid,7);
        setCookie("username",user,7);
        loginProcedure();
    }              

})


document.getElementById("registerBtn").addEventListener("click", async function(event) {
    parent.document.getElementById("contentFrame").src = "./html/register.html";              

})


async function getUserID(user,token){
    
    let response = await fetch(url_login + "/user?email=" + user, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization':  "Bearer " + token,
        },               
    })

    if (response.status == 401){
        console.log("LogIn Status:","unauthorized")
    }
    else if (response.status == 500 ) {
        throw new Error('Failed to fetch ticket data');
    }  


    return await response.text();      
    
}


async function getToken(user,password){
    
        let response = await fetch(url_login +"/authenticate", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({          
              "username":user,
              "password":password                      
            })       
        })
    

        if (response.status == 401){
            console.log("LogIn Status:","unauthorized")
            return "Invalid username or password";
        }
        else if (response.status == 500 ) {
            throw new Error('Failed to fetch ticket data');
        }  
    
        return await response.text();      
        
}




function loginProcedure() {
    parent.document.getElementById("loginLink").innerHTML = "Sign Out";
    parent.document.getElementById("contentFrame").src  = "./html/homePage.html";
    parent.document.getElementById("userInterfaceItem").style.display ="block";
    parent.document.getElementById("UserInterface").innerHTML="Add Cars";
    parent.document.getElementById("userProfile").style.display = display ="block";
    parent.document.getElementById("userProfile").innerHTML = "Welcome <br>" + getCookie("username");
}





  

