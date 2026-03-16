let currentQuestion = 0
let totalScore = 0
let roundFinished = false

let playerMarker = null
let correctMarker = null
let playerCoords = null

const map = new maplibregl.Map({
container:"map",
style:"https://tiles.openfreemap.org/styles/liberty",
center:[0,30],
zoom:2
})

const questions = [

{fact:"В 2013 году произошла крупнейшая утечка данных пользователей этого почтового сервиса.",lat:37.3875,lng:-122.0575,place:"Yahoo"},
{fact:"В 2018 году утекли данные около 500 миллионов клиентов сети отелей.",lat:38.9072,lng:-77.0369,place:"Marriott"},
{fact:"В 2017 году хакеры украли данные 147 миллионов клиентов кредитного бюро.",lat:33.7490,lng:-84.3880,place:"Equifax"},
{fact:"В 2013 году была крупная утечка данных покупателей этой сети магазинов.",lat:44.9778,lng:-93.2650,place:"Target"},
{fact:"В 2016 году произошла утечка данных более 400 миллионов аккаунтов этого сайта знакомств.",lat:34.0522,lng:-118.2437,place:"Adult Friend Finder"},
{fact:"В 2021 году хакеры получили данные 533 миллионов пользователей этой социальной сети.",lat:37.4848,lng:-122.1484,place:"Facebook"},
{fact:"В 2012 году утекли данные 164 миллионов пользователей этого профессионального сервиса.",lat:37.7749,lng:-122.4194,place:"LinkedIn"},
{fact:"В 2014 году была утечка данных 76 миллионов пользователей этой банковской компании.",lat:40.7128,lng:-74.0060,place:"JPMorgan Chase"},
{fact:"В 2019 году произошла утечка данных 100 миллионов клиентов этой финансовой компании.",lat:38.9072,lng:-77.0369,place:"Capital One"},
{fact:"В 2014 году произошла утечка данных 145 миллионов пользователей этой игровой платформы.",lat:35.6762,lng:139.6503,place:"Sony PlayStation"},

{fact:"В 2014 году хакеры взломали киностудию и опубликовали внутренние документы.",lat:34.0522,lng:-118.2437,place:"Sony Pictures"},
{fact:"В 2020 году произошла утечка данных пользователей этого популярного сервиса доставки еды.",lat:37.7749,lng:-122.4194,place:"DoorDash"},
{fact:"В 2016 году утекли данные 57 миллионов пользователей и водителей этого сервиса такси.",lat:37.7749,lng:-122.4194,place:"Uber"},
{fact:"В 2021 году произошла утечка данных пользователей этого сервиса для программистов.",lat:37.7749,lng:-122.4194,place:"GitHub"},
{fact:"В 2014 году произошла утечка данных 5 миллионов пользователей этого облачного сервиса.",lat:37.4419,lng:-122.1430,place:"Dropbox"},
{fact:"В 2022 году произошла утечка данных клиентов этой криптовалютной биржи.",lat:37.7749,lng:-122.4194,place:"Coinbase"},
{fact:"В 2018 году утекли данные миллионов пользователей этого сервиса вопросов и ответов.",lat:37.7749,lng:-122.4194,place:"Quora"},
{fact:"В 2019 году произошла утечка данных пользователей этого популярного VPN-сервиса.",lat:54.6872,lng:25.2797,place:"NordVPN"},
{fact:"В 2020 году произошла утечка данных пользователей этой видеоконференц-платформы.",lat:37.3688,lng:-122.0363,place:"Zoom"},
{fact:"В 2018 году произошла утечка данных пользователей этого онлайн-сервиса бронирования.",lat:52.3676,lng:4.9041,place:"Booking.com"},

{fact:"В 2020 году произошёл массовый взлом аккаунтов известных людей в этой социальной сети.",lat:37.7749,lng:-122.4194,place:"Twitter"},
{fact:"В 2018 году произошла утечка данных пользователей этой платформы вопросов и ответов.",lat:37.7749,lng:-122.4194,place:"Stack Overflow"},
{fact:"В 2017 году произошла утечка данных пользователей этого антивируса.",lat:55.7558,lng:37.6176,place:"Kaspersky"},
{fact:"В 2015 году произошла крупная утечка данных этого сайта знакомств.",lat:43.6532,lng:-79.3832,place:"Ashley Madison"},
{fact:"В 2019 году произошла утечка данных пользователей этого облачного сервиса.",lat:37.7749,lng:-122.4194,place:"Microsoft"},
{fact:"В 2018 году произошла утечка данных пользователей этой авиакомпании.",lat:51.5074,lng:-0.1278,place:"British Airways"},
{fact:"В 2014 году произошла утечка данных клиентов этого магазина электроники.",lat:32.7767,lng:-96.7970,place:"Home Depot"},
{fact:"В 2021 году произошла утечка данных пользователей этого популярного форума.",lat:37.7749,lng:-122.4194,place:"Reddit"},
{fact:"В 2022 году произошла утечка данных пользователей этого сервиса доставки еды.",lat:37.7749,lng:-122.4194,place:"Uber Eats"},
{fact:"В 2023 году произошла утечка данных пользователей этого игрового сервиса.",lat:47.6062,lng:-122.3321,place:"Steam"}

]
const gameQuestions = questions
.sort(()=>Math.random()-0.5)
.slice(0,5)
function loadQuestion(){

const q = gameQuestions[currentQuestion]

document.getElementById("fact-text").innerText = q.fact
document.getElementById("result").scrollIntoView({
behavior:"smooth",
block:"start"
})

playerCoords = null

if(playerMarker) playerMarker.remove()
if(correctMarker) correctMarker.remove()

if(map.getLayer("line")){
map.removeLayer("line")
map.removeSource("line")
}

}

map.on("click",(e)=>{

if(roundFinished) return

playerCoords = e.lngLat

if(playerMarker){
playerMarker.remove()
}

playerMarker = new maplibregl.Marker({color:"#ffd54f"})
.setLngLat([playerCoords.lng,playerCoords.lat])
.addTo(map)

})

function distance(lat1, lon1, lat2, lon2){

const R = 6371

const dLat = (lat2-lat1) * Math.PI/180
const dLon = (lon2-lon1) * Math.PI/180

const a =
Math.sin(dLat/2)**2 +
Math.cos(lat1*Math.PI/180) *
Math.cos(lat2*Math.PI/180) *
Math.sin(dLon/2)**2

const c = 2 * Math.atan2(Math.sqrt(a),Math.sqrt(1-a))

return R * c

}

function calculateScore(d){

const maxDistance = 10000

let score = Math.round(5000 * (1 - d/maxDistance))

if(score < 0) score = 0

return score

}
function drawAnimatedLine(player,correct){

const steps = 60
let i = 0

const coords = []

const lineData = {
type:"Feature",
geometry:{
type:"LineString",
coordinates:[]
}
}

if(map.getSource("line")){
map.removeLayer("line")
map.removeSource("line")
}

map.addSource("line",{
type:"geojson",
data:lineData
})

map.addLayer({
id:"line",
type:"line",
source:"line",
paint:{
"line-color":"#ffd54f",
"line-width":4,
"line-opacity":0.9
}
})

function animate(){

if(i > steps) return

const lat = player.lat + (correct.lat-player.lat)*(i/steps)
const lng = player.lng + (correct.lng-player.lng)*(i/steps)

coords.push([lng,lat])

lineData.geometry.coordinates = coords

map.getSource("line").setData(lineData)

i++

requestAnimationFrame(animate)

}

animate()

}

function zoomToPoints(player,correct){

const bounds = new maplibregl.LngLatBounds()

bounds.extend([player.lng,player.lat])
bounds.extend([correct.lng,correct.lat])

map.fitBounds(bounds,{
padding:100,
duration:1500
})

}

function accuracyBar(distance){

const maxDistance = 10000
const perfectDistance = 1

let percent

if(distance <= perfectDistance){

percent = 100

}else{

percent = Math.round(
100 * (1 - (distance - perfectDistance) / (maxDistance - perfectDistance))
)

}

if(percent < 0) percent = 0

return `
<div style="margin-top:10px">
<div style="height:8px;background:#333;border-radius:5px;overflow:hidden">
<div style="
width:${percent}%;
height:100%;
background:linear-gradient(90deg,#4caf50,#ffd54f);
transition:1s;
"></div>
</div>
<div style="font-size:14px;margin-top:4px">
Точность: ${percent}%
</div>
</div>
`

}

document.getElementById("guess-btn").onclick = ()=>{

if(!playerCoords || roundFinished) return

roundFinished = true

const q = gameQuestions[currentQuestion]

const dist = distance(
playerCoords.lat,
playerCoords.lng,
q.lat,
q.lng
)

const score = calculateScore(dist)

totalScore += score
if(currentQuestion === 4){

document.getElementById("guess-btn").style.display="none"

const nextBtn = document.getElementById("next-round")

nextBtn.innerText = "Узнать результаты"
nextBtn.className = "btn primary"
nextBtn.onclick = showFinalResults

}
correctMarker = new maplibregl.Marker({color:"#ff4444"})
.setLngLat([q.lng,q.lat])
.addTo(map)

drawAnimatedLine(playerCoords,{lat:q.lat,lng:q.lng})

zoomToPoints(playerCoords,{lat:q.lat,lng:q.lng})

document.getElementById("result").innerHTML = `
<div style="background:var(--card-bg);padding:15px;border-radius:12px">
📍 Правильный ответ: <b>${q.place}</b><br>
📏 Расстояние: <b>${Math.round(dist)} км</b><br>
⭐ Очки: <b>${score}</b>

${accuracyBar(dist)}

Раунд: ${currentQuestion+1}/5
</div>
`

}

document.getElementById("next-round").onclick = ()=>{

currentQuestion++

if(currentQuestion >= 5){

document.getElementById("guess-btn").style.display="none"
document.getElementById("next-round").style.display="none"

document.getElementById("result").innerHTML = `
<button id="show-final" class="btn primary">
Узнать результаты
</button>
`

document.getElementById("show-final").onclick = showFinalResults

return
}

roundFinished = false

loadQuestion()

}

loadQuestion()
function showFinalResults(){

const maxScore = 25000
const percent = Math.round(totalScore/maxScore*100)

let message = "Неплохо"

if(percent > 80) message = "Отличный результат"
if(percent > 95) message = "Киберэксперт"

const modal = document.createElement("div")

modal.className = "final-screen"

modal.innerHTML = `
<div class="final-card">

<button class="close-results" onclick="this.closest('.final-screen').remove()">
✕
</button>

<h2>🏆 Результаты игры</h2>

<h1>${totalScore}</h1>

<p>${message}</p>

<div class="final-bar">
<div style="width:${percent}%"></div>
</div>

<p>${percent}% точности</p>

<button class="btn primary" onclick="location.reload()">
Играть снова
</button>

</div>
`

document.body.appendChild(modal)

}
