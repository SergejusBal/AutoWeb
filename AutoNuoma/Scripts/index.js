const url_index = 'http://localhost:8080'; 



    ///send message   
    window.addEventListener('scroll', async function() {
        const iframe = document.getElementById('contentFrame');
        let hasSentMessage = false;

        if (window.innerHeight + window.scrollY >= document.body.offsetHeight && !hasSentMessage) {
            hasSentMessage = true;
            const message = {
                type: "scrollEnd"
            };
            console.log("IndexHome", "sendDone");
            iframe.contentWindow.postMessage(message, '*');
        }
        else if (window.innerHeight + window.scrollY < document.body.offsetHeight) {
            hasSentMessage = false;
        }

    });


    //get message
    window.addEventListener('message', function(event) {
    
    if (event.data.type === "scrollSize") { 
        document.getElementById('contentFrame').style.height = event.data.content.height + 'px';
        console.log("got","got")
    } else {
        console.log('Unknown message type:', event.data.type); 
    }
    });




    /* Top meniu bar controller */
    function changeIframeSrc(newSrc) {
        clearURL();
        document.getElementById('contentFrame').src = newSrc;
    }

    document.getElementById('userProfile').addEventListener('click', function() {        
        changeIframeSrc('./html/userProfile.html'); 

    });

    document.getElementById('homeLink').addEventListener('click', function() {       
        changeIframeSrc('./html/homePage.html'); 
    });

    document.getElementById('aboutUsLink').addEventListener('click', function() {       
        changeIframeSrc('./html/aboutus.html');
    });

    document.getElementById('contactLink').addEventListener('click', function() {        
        changeIframeSrc('./html/contact.html'); 
    });
    document.getElementById('UserInterface').addEventListener('click', function() {       
        changeIframeSrc('./html/userCarSubmitPage.html'); 
    });

    document.getElementById('loginLink').addEventListener('click', function() {         
        if(document.getElementById('loginLink').innerHTML == "Login"){           
            changeIframeSrc('./html/loginPage.html');
        }  
        else{            
            deleteCookie("LogInCookies");
            deleteCookie("UserID");            
            document.getElementById('loginLink').innerHTML = "Login";            
            document.getElementById("userInterfaceItem").style.display ="none"; 
            document.getElementById("UserInterface").innerHTML="Cars";
            document.getElementById("userProfile").style.display ="none";
            changeIframeSrc('./html/loginPage.html');            
            
        }

    });

    document.getElementById('contactLink').addEventListener('click', function() {
        changeIframeSrc('./html/contact.html'); 
    });

    ///////////////Auto login //////////////////////////////    

    function loginProcedure() {
        document.getElementById("loginLink").innerHTML = "Sign Out";

        loadProperPage();

        document.getElementById("userInterfaceItem").style.display ="block";
        document.getElementById("UserInterface").innerHTML="Add Cars";
        document.getElementById("userProfile").style.display ="block";

        document.getElementById("userProfile").innerHTML = "Welcome <br>" + getCookie("username");

    }


    async function autorize(){
        const jwttoken =  getCookie("LogInCookies");

        if(!jwttoken) return false;

        let response = await fetch(url_index+"/user/autoLogin", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': "Bearer "+ jwttoken
            },                                 
        });
        
        if (response.status == 200){
            return true;
        } 

        return false;       
        
    }

    
    document.addEventListener('DOMContentLoaded',  async function() {    
         const authorized =  await autorize();   
         if(authorized){   
             loginProcedure();
         } 
        
        

    });

   

 ////////////////////////////// i can set diferenct sorce base on url  example http://127.0.0.1:5500/index.html?page=/html/carPage.html
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    window.onload = loadProperPage();

    function loadProperPage() {
        const page = getQueryParam('page');
        if (page) {
            document.getElementById('contentFrame').src = page;
        } else {
            document.getElementById('contentFrame').src = './html/homePage.html'; 
        }
    };    



  //////////////////////////////////////////////////////////// Clear URL  ///////////////////////////////////////
    
  
  function clearURL(){
    const urlParams = new URL(window.location.href);
    urlParams.search="";   
    window.history.replaceState({}, document.title, urlParams);
  }