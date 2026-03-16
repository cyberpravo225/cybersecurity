
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

{fact:"Компания антивируса Kaspersky.",lat:55.7558,lng:37.6176,place:"Kaspersky"},
{fact:"Компания антивируса ESET.",lat:48.1486,lng:17.1077,place:"ESET"},
{fact:"Компания антивируса Avast.",lat:50.0755,lng:14.4378,place:"Avast"},
{fact:"Компания антивируса Bitdefender.",lat:44.4268,lng:26.1025,place:"Bitdefender"},
{fact:"Компания антивируса McAfee.",lat:37.3382,lng:-121.8863,place:"McAfee"},
{fact:"Компания антивируса Norton.",lat:37.3382,lng:-121.8863,place:"NortonLifeLock"},
{fact:"Компания киберзащиты CrowdStrike.",lat:30.2672,lng:-97.7431,place:"CrowdStrike"},
{fact:"Компания сетевой безопасности Palo Alto Networks.",lat:37.4419,lng:-122.1430,place:"Palo Alto Networks"},
{fact:"Компания кибербезопасности Check Point.",lat:32.0853,lng:34.7818,place:"Check Point"},
{fact:"Компания сетевой защиты Fortinet.",lat:37.3875,lng:-121.9637,place:"Fortinet"},

{fact:"Компания безопасности Trend Micro.",lat:35.6762,lng:139.6503,place:"Trend Micro"},
{fact:"Компания кибербезопасности Sophos.",lat:51.7520,lng:-1.2577,place:"Sophos"},
{fact:"Компания киберразведки Recorded Future.",lat:42.3601,lng:-71.0589,place:"Recorded Future"},
{fact:"Компания кибербезопасности Rapid7.",lat:42.3601,lng:-71.0589,place:"Rapid7"},
{fact:"Компания анализа угроз Mandiant.",lat:37.7749,lng:-122.4194,place:"Mandiant"},
{fact:"Компания SIEM-систем Splunk.",lat:37.3382,lng:-121.8863,place:"Splunk"},
{fact:"Компания сетевого анализа Darktrace.",lat:52.2053,lng:0.1218,place:"Darktrace"},
{fact:"Компания кибербезопасности FireEye.",lat:37.7749,lng:-122.4194,place:"FireEye"},
{fact:"Компания безопасности Okta.",lat:37.7749,lng:-122.4194,place:"Okta"},
{fact:"Компания защиты сайтов Cloudflare.",lat:37.7749,lng:-122.4194,place:"Cloudflare"},

{fact:"Компания защиты данных Veeam.",lat:47.6062,lng:-122.3321,place:"Veeam"},
{fact:"Компания VPN-сервиса Proton.",lat:46.2044,lng:6.1432,place:"Proton"},
{fact:"Компания VPN-сервиса Nord Security.",lat:54.6872,lng:25.2797,place:"Nord Security"},
{fact:"Компания защиты почты Proofpoint.",lat:37.7749,lng:-122.4194,place:"Proofpoint"},
{fact:"Компания защиты устройств SentinelOne.",lat:37.7749,lng:-122.4194,place:"SentinelOne"},
{fact:"Компания анализа угроз Group-IB.",lat:1.3521,lng:103.8198,place:"Group-IB"},
{fact:"Компания киберразведки Recorded Future.",lat:42.3601,lng:-71.0589,place:"Recorded Future"},
{fact:"Компания облачной безопасности Zscaler.",lat:37.3382,lng:-121.8863,place:"Zscaler"},
{fact:"Компания защиты приложений Imperva.",lat:37.7749,lng:-122.4194,place:"Imperva"},
{fact:"Компания безопасности Tenable.",lat:39.2904,lng:-76.6122,place:"Tenable"}

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
