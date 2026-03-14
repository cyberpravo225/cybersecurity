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

{
fact:"В 2017 вирус WannaCry поразил сотни тысяч компьютеров и парализовал больницы.",
lat:51.5074,
lng:-0.1278,
place:"Великобритания"
},

{
fact:"Крупнейшая утечка данных произошла в компании Yahoo.",
lat:37.3875,
lng:-122.0575,
place:"США"
},

{
fact:"Атака Stuxnet была направлена на ядерную программу страны.",
lat:35.6892,
lng:51.3890,
place:"Иран"
},

{
fact:"Крупная утечка данных LinkedIn произошла в 2012 году.",
lat:37.7749,
lng:-122.4194,
place:"США"
},

{
fact:"Один из первых компьютерных вирусов распространился в университетской сети.",
lat:40.7128,
lng:-74.0060,
place:"США"
},

{
fact:"Вирус NotPetya нанёс миллиардные убытки компаниям.",
lat:50.4501,
lng:30.5234,
place:"Украина"
},

{
fact:"Атака на Sony Pictures привела к утечке тысяч документов.",
lat:34.0522,
lng:-118.2437,
place:"США"
},

{
fact:"Хакерская атака на парламент страны, произошла в 2015 году.",
lat:52.5200,
lng:13.4050,
place:"Германия"
},

{
fact:"Взлом компании Equifax раскрыл данные миллионов людей.",
lat:33.7490,
lng:-84.3880,
place:"США"
},

{
fact:"Группировка REvil проводила атаки с программами-вымогателями.",
lat:55.7558,
lng:37.6173,
place:"Россия"
},

{
fact:"Хакеры атаковали нефтепровод Colonial Pipeline.",
lat:33.7488,
lng:-84.3877,
place:"США"
},

{
fact:"Массовая утечка данных пользователей Facebook обсуждалась во всём мире.",
lat:37.4848,
lng:-122.1484,
place:"США"
},

{
fact:"Вирус ILOVEYOU распространился через электронную почту.",
lat:14.5995,
lng:120.9842,
place:"Филиппины"
},

{
fact:"Крупная атака на правительственные сайты страны, произошла в 2007 году.",
lat:59.4370,
lng:24.7536,
place:"Эстония"
},

{
fact:"Компания Target пострадала от масштабной утечки данных покупателей.",
lat:44.9778,
lng:-93.2650,
place:"США"
},

{
fact:"Взлом медицинской компании Anthem раскрыл данные миллионов пациентов.",
lat:39.7684,
lng:-86.1581,
place:"США"
},

{
fact:"Кибератака на энергосистему страны, привела к отключению электричества.",
lat:50.4501,
lng:30.5234,
place:"Украина"
},

{
fact:"Хакеры взломали базу данных Adobe.",
lat:37.7749,
lng:-122.4194,
place:"США"
},

{
fact:"Крупная атака на сервис Dropbox раскрыла данные пользователей.",
lat:37.4419,
lng:-122.1430,
place:"США"
},

{
fact:"Вирус Conficker заразил миллионы компьютеров.",
lat:47.6062,
lng:-122.3321,
place:"США"
},

{
fact:"Атака SolarWinds затронула множество государственных организаций.",
lat:30.2672,
lng:-97.7431,
place:"США"
},

{
fact:"Взлом PlayStation Network оставил миллионы игроков без доступа.",
lat:35.6762,
lng:139.6503,
place:"Япония"
},

{
fact:"Хакеры атаковали британскую телеком-компанию TalkTalk.",
lat:51.5074,
lng:-0.1278,
place:"Великобритания"
},

{
fact:"Крупная утечка данных Marriott раскрыла информацию о гостях отелей.",
lat:38.9072,
lng:-77.0369,
place:"США"
},

{
fact:"Вирус MyDoom стал одним из самых быстро распространяющихся.",
lat:47.6062,
lng:-122.3321,
place:"США"
},

{
fact:"Хакеры атаковали французскую телеком-компанию Orange.",
lat:48.8566,
lng:2.3522,
place:"Франция"
},

{
fact:"Крупная атака на банковскую систему страны, произошла через SWIFT.",
lat:23.8103,
lng:90.4125,
place:"Бангладеш"
},

{
fact:"Хакеры атаковали серверы компании Uber.",
lat:37.7749,
lng:-122.4194,
place:"США"
},

{
fact:"Кибератака на правительство страны, временно остановила сайты.",
lat:45.4215,
lng:-75.6972,
place:"Канада"
},

{
fact:"Взлом криптовалютной биржи Mt.Gox привёл к потере биткоинов.",
lat:35.6762,
lng:139.6503,
place:"Япония"
}

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

if(d < 50) return 5000
if(d < 200) return 4000
if(d < 1000) return 2500
if(d < 3000) return 1000
return 500

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

function accuracyBar(score){

const percent = Math.round(score/5000*100)

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

${accuracyBar(score)}

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
