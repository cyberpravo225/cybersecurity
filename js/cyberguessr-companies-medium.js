
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

{fact:"Компания облачного сервиса Salesforce.",lat:37.7749,lng:-122.4194,place:"Salesforce"},
{fact:"Компания видеокарт Radeon.",lat:37.7749,lng:-122.4194,place:"AMD"},
{fact:"Компания производителя компьютеров ThinkPad.",lat:40.7128,lng:-74.0060,place:"Lenovo"},
{fact:"Компания сетевого оборудования Cisco.",lat:37.3875,lng:-121.9637,place:"Cisco"},
{fact:"Компания программного обеспечения Oracle.",lat:37.5297,lng:-122.0402,place:"Oracle"},
{fact:"Компания популярной CRM-системы HubSpot.",lat:42.3601,lng:-71.0589,place:"HubSpot"},
{fact:"Компания популярного конструктора сайтов Wix.",lat:32.0853,lng:34.7818,place:"Wix"},
{fact:"Компания популярной платформы Shopify.",lat:45.4215,lng:-75.6972,place:"Shopify"},
{fact:"Компания браузера Opera.",lat:59.9139,lng:10.7522,place:"Opera"},
{fact:"Компания антивируса Avast.",lat:50.0755,lng:14.4378,place:"Avast"},

{fact:"Компания антивируса AVG.",lat:50.0755,lng:14.4378,place:"AVG"},
{fact:"Компания облачной платформы DigitalOcean.",lat:40.7128,lng:-74.0060,place:"DigitalOcean"},
{fact:"Компания системы управления базами данных MySQL.",lat:37.5297,lng:-122.0402,place:"Oracle"},
{fact:"Компания производителя ноутбуков Alienware.",lat:30.2672,lng:-97.7431,place:"Dell"},
{fact:"Компания популярного сервиса Notion.",lat:37.7749,lng:-122.4194,place:"Notion"},
{fact:"Компания платформы для командной работы Slack.",lat:37.7749,lng:-122.4194,place:"Slack"},
{fact:"Компания популярного VPN-сервиса NordVPN.",lat:54.6872,lng:25.2797,place:"NordVPN"},
{fact:"Компания VPN-сервиса ProtonVPN.",lat:46.2044,lng:6.1432,place:"Proton"},
{fact:"Компания облачного хранилища Box.",lat:37.4419,lng:-122.1430,place:"Box"},
{fact:"Компания разработчика игры Fortnite.",lat:35.9940,lng:-78.8986,place:"Epic Games"},

{fact:"Компания популярного игрового движка Unity.",lat:37.7749,lng:-122.4194,place:"Unity"},
{fact:"Компания игрового движка Unreal Engine.",lat:35.9940,lng:-78.8986,place:"Epic Games"},
{fact:"Компания производителя сетевых хранилищ Synology.",lat:25.0330,lng:121.5654,place:"Synology"},
{fact:"Компания производителя сетевого оборудования Ubiquiti.",lat:40.7128,lng:-74.0060,place:"Ubiquiti"},
{fact:"Компания производителя игровых видеокарт MSI.",lat:25.0330,lng:121.5654,place:"MSI"},
{fact:"Компания производителя видеокарт Gigabyte.",lat:25.0330,lng:121.5654,place:"Gigabyte"},
{fact:"Компания производителя компьютерных комплектующих ASUS.",lat:25.0330,lng:121.5654,place:"ASUS"},
{fact:"Компания производителя жестких дисков Western Digital.",lat:33.6846,lng:-117.8265,place:"Western Digital"},
{fact:"Компания производителя SSD Samsung.",lat:37.5665,lng:126.9780,place:"Samsung"},
{fact:"Компания производителя процессоров ARM.",lat:52.2053,lng:0.1218,place:"ARM"}

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
