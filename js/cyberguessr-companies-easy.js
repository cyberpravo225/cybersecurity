
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

{fact:"Самая популярная поисковая система в мире.",lat:37.4220,lng:-122.0841,place:"Google"},
{fact:"Компания, которая делает iPhone.",lat:37.3349,lng:-122.0090,place:"Apple"},
{fact:"Создатели операционной системы Windows.",lat:47.6426,lng:-122.1393,place:"Microsoft"},
{fact:"Самая популярная социальная сеть.",lat:37.4848,lng:-122.1484,place:"Meta"},
{fact:"Крупнейший интернет-магазин.",lat:47.6062,lng:-122.3321,place:"Amazon"},
{fact:"Компания видеохостинга YouTube.",lat:37.4220,lng:-122.0841,place:"Google"},
{fact:"Мессенджер, который создал Павел Дуров.",lat:25.2048,lng:55.2708,place:"Telegram"},
{fact:"Компания, которая делает смартфоны Galaxy.",lat:37.5665,lng:126.9780,place:"Samsung"},
{fact:"Компания, которая делает PlayStation.",lat:35.6762,lng:139.6503,place:"Sony"},
{fact:"Компания популярного видеосервиса с фильмами и сериалами.",lat:37.7749,lng:-122.4194,place:"Netflix"},

{fact:"Самая популярная социальная сеть с короткими видео.",lat:39.9042,lng:116.4074,place:"ByteDance"},
{fact:"Компания, которой принадлежит WhatsApp.",lat:37.4848,lng:-122.1484,place:"Meta"},
{fact:"Популярный сервис видеозвонков.",lat:37.3688,lng:-122.0363,place:"Zoom"},
{fact:"Компания, известная программой Photoshop.",lat:37.7749,lng:-122.4194,place:"Adobe"},
{fact:"Компания популярных видеокарт GeForce.",lat:37.3875,lng:-121.9637,place:"Nvidia"},
{fact:"Компания, которая делает процессоры для компьютеров.",lat:37.3875,lng:-121.9637,place:"Intel"},
{fact:"Популярная платформа для программистов.",lat:37.7749,lng:-122.4194,place:"GitHub"},
{fact:"Популярный сервис для хранения файлов.",lat:37.4419,lng:-122.1430,place:"Dropbox"},
{fact:"Китайская компания интернет-магазинов.",lat:30.2741,lng:120.1551,place:"Alibaba"},
{fact:"Китайская компания, которая делает смартфоны и технику.",lat:39.9042,lng:116.4074,place:"Huawei"},

{fact:"Компания браузера Firefox.",lat:37.7749,lng:-122.4194,place:"Mozilla"},
{fact:"Компания популярного мессенджера Discord.",lat:37.7749,lng:-122.4194,place:"Discord"},
{fact:"Компания облачного хранения iCloud.",lat:37.3349,lng:-122.0090,place:"Apple"},
{fact:"Компания популярного облачного сервиса OneDrive.",lat:47.6426,lng:-122.1393,place:"Microsoft"},
{fact:"Компания популярной социальной сети Instagram.",lat:37.4848,lng:-122.1484,place:"Meta"},
{fact:"Компания популярного мессенджера Messenger.",lat:37.4848,lng:-122.1484,place:"Meta"},
{fact:"Компания популярной видеоплатформы Twitch.",lat:47.6062,lng:-122.3321,place:"Amazon"},
{fact:"Компания популярного голосового помощника Alexa.",lat:47.6062,lng:-122.3321,place:"Amazon"},
{fact:"Компания, которая делает MacBook.",lat:37.3349,lng:-122.0090,place:"Apple"},
{fact:"Компания популярной операционной системы Android.",lat:37.4220,lng:-122.0841,place:"Google"}

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
