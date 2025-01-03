
let key=`1aa6b64906680fbf1189b0cedf9e3c0d`;
window.onload=function(){
    getdata("jaipur")
}
let city=document.getElementById("result");
let list=document.querySelector(".container ul");
document.querySelector(".fa-magnifying-glass").addEventListener("click",function(){
    getdata(city.value);
})
document.querySelector("#result").addEventListener("keyup",function(e){
    if (e.key === "Enter") {
        getdata(city.value);
        list.innerHTML = ""; 
        list.style.visibility="hidden"
    }
    else if(city.value.length==0){
        list.innerHTML = ""; 
        list.style.visibility="hidden"
    }
    else if(key!=' ' ){
        citylist(city.value);
    }
})



list.addEventListener("click", function (e) {
    if (e.target.tagName === "LI") {
        city.value = e.target.innerText;
        list.innerHTML = "";
        getdata(city.value);
    }
});

async function citylist(query) {
    try {
        let url = `http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=100&appid=${key}`;
        let res = await fetch(url);
        let suggestions = await res.json();
        list.innerHTML = ""; 
        list.style.visibility="visible";
        suggestions.forEach((city) => {
            if(city.state!==undefined){
                let li = document.createElement("li");  
                if(city.name===city.state){
                    li.innerText = `${city.name}, ${city.country}`;
                }
                else
                    li.innerText = `${city.name},${city.state}, ${city.country}`;
                list.appendChild(li)
            }
        });
    } catch (err) {
        console.error("Error fetching suggestions:", err);
    }
}

async function getdata(city){
    try{
        list.style.visibility="hidden";
        let divs=document.querySelectorAll(".weather-info div");
        for(let i=0;i<divs.length;i++)
            divs[i].style.visibility="hidden";
        let url=`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=metric`;
        let res=await fetch(url);
        let data=await res.json();
        let img = document.createElement("img");
        img.src = "loding.gif";
        img.alt = "Loading...";
        document.querySelector(".loding_container").innerHTML="";
        document.querySelector(".loding_container").appendChild(img);
        let delay = new Promise(resolve => setTimeout(resolve, 2500));
        await delay;
        if(data.cod==200){
            let flag=`https://flagcdn.com/w320/${data.sys.country.toLowerCase()}.png`;
            let flag_imag=await fetch(flag);
            let url2=`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
            let img=await fetch(url2);
            let divs=document.querySelectorAll(".weather-info div");
            for(let i=0;i<divs.length;i++)
                divs[i].style.visibility="visible";
            console.log(data)
            let f_image=document.createElement("img");
            f_image.src=flag_imag.url;
            document.querySelector(".loding_container").innerHTML="";
            document.getElementById("city_name").innerHTML=data.name+", ";
            document.getElementById("city_name").appendChild(f_image);
            document.getElementById("img").src=img.url;
            document.getElementById("description").innerText=data.weather[0].description;
            document.getElementById("temp").innerText=Math.floor(data.main.temp)+"℃";
            document.getElementById("temp2").innerText=Math.floor(data.main.temp)+"℃";
            let temp=Math.floor(data.main.temp)
            if(temp<=0)
                document.getElementById("temp_info").innerText="Freezing conditions, prepare for ice and bundle up warmly."
            else if(temp>0 && temp<=10)
                document.getElementById("temp_info").innerText="Cold weather, suitable for jackets and warm layers."
            else if(temp>10 && temp<=20)
                document.getElementById("temp_info").innerText="Cool to mild, comfortable with light layers or a sweater."
            else if(temp>20 && temp<=30)
                document.getElementById("temp_info").innerText="Moderate temperature, warm layers or a light jacket are recommended."
            else if(temp>30)
                document.getElementById("temp_info").innerText="Hot conditions, use sunscreen, and avoid prolonged exposure to direct sunlight."
            document.getElementById("humidity").innerText=data.main.humidity+"%";
            if(data.main.humidity>=65)
                document.getElementById("humidity_info").innerText="The air feels moist or sticky, potentially affecting how comfortable it feels outdoors."
            else
                document.getElementById("humidity_info").innerText="The air feels relatively dry or comfortable, making outdoor activities more pleasant for most people."
            document.getElementById("wind").innerText=data.wind.speed+" mph"    
            let wind=data.wind.speed;
            if(wind<=6)
                document.getElementById("wind_info").innerText="Light breeze, gentle wind, generally calm conditions."
            else if(wind>6 && wind<=12)
                document.getElementById("wind_info").innerText="Moderate breeze, noticeable wind, rustling of leaves and light flags"
            else if(wind>12 && wind<=18)
                document.getElementById("wind_info").innerText=" Fresh breeze, wind felt on face, small branches sway."
            else if(wind>18&& wind<=25)
                document.getElementById("wind_info").innerText="Strong breeze, difficulty with umbrellas, some twigs break off trees."
            else
                document.getElementById("wind_info").innerText="Moderate gale, small trees sway, progress with walking is impeded"
            document.getElementById("visibility").innerText=data.visibility/1000+" km"
            let visibility=data.visibility/1000;
            if(visibility>10)
                document.getElementById("visibility_info").innerText=" Clear visibility, no obstructions, excellent for all activities and travel."
            else if(visibility>5 && visibility<=10)
                document.getElementById("visibility_info").innerText="Minor haze or fog, generally clear, suitable for most outdoor activities."
            else if(visibility>2 && visibility<=5)
                document.getElementById("visibility_info").innerText=" Moderate haze or fog, visibility reduced, use caution during outdoor activities."
            else if(visibility>1 && visibility<=2)
                document.getElementById("visibility_info").innerText="Dense fog or haze, limited visibility, use headlights and caution when outdoors."
            else
                document.getElementById("visibility_info").innerText="Thick fog or heavy precipitation, extremely limited visibility, avoid unnecessary travel."
            document.getElementById("cloud").innerText=data.clouds.all+"%";
            let cloud=data.clouds.all;
            if(cloud>=90)
                document.getElementById("cloud_info").innerText="Overcast,Complete cloud cover with no direct sunlight, minimal visibility of the sky."
            else if(cloud>=50 && cloud<90)
                document.getElementById("cloud_info").innerText="Mostly cloudy, some scattered clouds, fair weather, visibility may be reduced."
            else if(cloud>=20 && cloud<50)
                document.getElementById("cloud_info").innerText="Partly cloudy, scattered clouds, fair weather, good visibility. "
            else
                document.getElementById("cloud_info").innerText=" Mostly sunny with few or no clouds, excellent visibility for outdoor activities."
            document.getElementById("pressure").innerText=data.main.pressure+" hPa";
            let pressure=data.main.pressure;
            if(pressure>1020)
                document.getElementById("pressure_info").innerText="Clear skies, stable weather, and generally fair conditions with high-pressure systems dominating."
            else if(pressure>1000 && pressure<=1020)
                document.getElementById("pressure_info").innerText="Weather improving, with clearing skies and decreasing chances of precipitation as pressure rises."
            else 
                document.getElementById("pressure_info").innerText="Cloudy skies, higher chances of precipitation, potential for stormy weather due to low-pressure systems."
            
            let sunset=new Date(data.sys.sunset*1000).toLocaleTimeString();
            let sunrise=new Date(data.sys.sunrise*1000).toLocaleTimeString();
            document.getElementById("sunset").innerText=sunset;
            document.getElementById("sunrise").innerText=sunrise;
        }
        else{
            document.querySelector(".loding_container").innerHTML="Sorry, 🥺 city weather is not available";
            let divs=document.querySelectorAll(".weather-info div");
            for(let i=0;i<divs.length;i++)
                divs[i].style.visibility="hidden";
        }
    }
    catch(err){
        console.log("Error fetching weather")
    }
}
