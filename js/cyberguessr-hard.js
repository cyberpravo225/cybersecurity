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

{fact:"Кибератака на правительство Эстонии в 2007 году парализовала сайты страны.",lat:59.4370,lng:24.7536,place:"Эстония"},
{fact:"Атака Stuxnet была направлена на ядерные объекты страны.",lat:35.6892,lng:51.3890,place:"Иран"},
{fact:"Вирус WannaCry парализовал больницы NHS.",lat:51.5074,lng:-0.1278,place:"Великобритания"},
{fact:"Хакерская атака на парламент произошла в 2015 году.",lat:52.5200,lng:13.4050,place:"Германия"},
{fact:"Вирус ILOVEYOU начал распространяться из этой страны.",lat:14.5995,lng:120.9842,place:"Филиппины"},
{fact:"Хакеры атаковали нефтепровод Colonial Pipeline.",lat:33.7488,lng:-84.3877,place:"США"},
{fact:"Крупнейшая утечка данных Yahoo произошла в этой стране.",lat:37.3875,lng:-122.0575,place:"США"},
{fact:"Атака на Sony Pictures привела к утечке документов.",lat:34.0522,lng:-118.2437,place:"США"},
{fact:"Взлом PlayStation Network затронул миллионы игроков.",lat:35.6762,lng:139.6503,place:"Япония"},
{fact:"Кибератака на энергосистему привела к отключению электричества.",lat:50.4501,lng:30.5234,place:"Украина"},

{fact:"Крупная утечка данных компании Target.",lat:44.9778,lng:-93.2650,place:"США"},
{fact:"Взлом Equifax раскрыл данные миллионов людей.",lat:33.7490,lng:-84.3880,place:"США"},
{fact:"Атака SolarWinds затронула госструктуры.",lat:30.2672,lng:-97.7431,place:"США"},
{fact:"Вирус Conficker заразил миллионы компьютеров.",lat:47.6062,lng:-122.3321,place:"США"},
{fact:"Крупная утечка данных Marriott.",lat:38.9072,lng:-77.0369,place:"США"},
{fact:"Хакеры атаковали французскую телеком-компанию Orange.",lat:48.8566,lng:2.3522,place:"Франция"},
{fact:"Атака на британскую телеком-компанию TalkTalk.",lat:51.5074,lng:-0.1278,place:"Великобритания"},
{fact:"Вирус NotPetya нанёс миллиардные убытки.",lat:50.4501,lng:30.5234,place:"Украина"},
{fact:"Крупная атака на банковскую систему через SWIFT.",lat:23.8103,lng:90.4125,place:"Бангладеш"},
{fact:"Хакеры атаковали серверы компании Uber.",lat:37.7749,lng:-122.4194,place:"США"},

{fact:"Массовая утечка данных Facebook.",lat:37.4848,lng:-122.1484,place:"США"},
{fact:"Кибератака на правительство Канады.",lat:45.4215,lng:-75.6972,place:"Канада"},
{fact:"Взлом криптовалютной биржи Mt.Gox.",lat:35.6762,lng:139.6503,place:"Япония"},
{fact:"Кибератака на банки Польши.",lat:52.2297,lng:21.0122,place:"Польша"},
{fact:"Атака на правительственные сайты Литвы.",lat:54.6872,lng:25.2797,place:"Литва"},
{fact:"Хакеры атаковали энергетические компании Чехии.",lat:50.0755,lng:14.4378,place:"Чехия"},
{fact:"Кибератака на правительство Австрии.",lat:48.2082,lng:16.3738,place:"Австрия"},
{fact:"Хакерская атака на банки Швеции.",lat:59.3293,lng:18.0686,place:"Швеция"},
{fact:"Атака на телеком Нидерландов.",lat:52.3676,lng:4.9041,place:"Нидерланды"},
{fact:"Хакеры атаковали серверы Adobe.",lat:37.7749,lng:-122.4194,place:"США"},

{fact:"Кибератака на Dropbox раскрыла данные пользователей.",lat:37.4419,lng:-122.1430,place:"США"},
{fact:"Один из самых быстрых вирусов MyDoom.",lat:47.6062,lng:-122.3321,place:"США"},
{fact:"Атака на банки Южной Кореи.",lat:37.5665,lng:126.9780,place:"Южная Корея"},
{fact:"Кибератака на правительство Австралии.",lat:-35.2809,lng:149.1300,place:"Австралия"},
{fact:"Взлом серверов GitHub через DDoS.",lat:37.7749,lng:-122.4194,place:"США"},
{fact:"Атака на нефтяную компанию Saudi Aramco.",lat:26.4207,lng:50.0888,place:"Саудовская Аравия"},
{fact:"Вирус Shamoon атаковал нефтяные компании.",lat:26.4207,lng:50.0888,place:"Саудовская Аравия"},
{fact:"Кибератака на парламент Норвегии.",lat:59.9139,lng:10.7522,place:"Норвегия"},
{fact:"Хакеры атаковали банки Бразилии.",lat:-23.5505,lng:-46.6333,place:"Бразилия"},
{fact:"Атака на телеком Италии.",lat:41.9028,lng:12.4964,place:"Италия"},

{fact:"Кибератака на банки Индии.",lat:28.6139,lng:77.2090,place:"Индия"},
{fact:"Хакеры атаковали правительственные сайты Испании.",lat:40.4168,lng:-3.7038,place:"Испания"},
{fact:"Кибератака на телеком Турции.",lat:41.0082,lng:28.9784,place:"Турция"},
{fact:"Хакеры атаковали банки Мексики.",lat:19.4326,lng:-99.1332,place:"Мексика"},
{fact:"Кибератака на инфраструктуру Израиля.",lat:31.7683,lng:35.2137,place:"Израиль"},
{fact:"Взлом серверов компании Nvidia.",lat:37.3875,lng:-121.9637,place:"США"},
{fact:"Хакеры атаковали правительство Финляндии.",lat:60.1699,lng:24.9384,place:"Финляндия"},
{fact:"Кибератака на банки Аргентины.",lat:-34.6037,lng:-58.3816,place:"Аргентина"},
{fact:"Атака на телеком Греции.",lat:37.9838,lng:23.7275,place:"Греция"},
{fact:"Кибератака на правительство Новой Зеландии.",lat:-41.2866,lng:174.7756,place:"Новая Зеландия"}

]
const gameQuestions = questions
.sort(()=>Math.random()-0.5)
.slice(0,10)
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

const maxDistance = 4000

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

const maxDistance = 4000
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
if(currentQuestion === 9){

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

Раунд: ${currentQuestion+1}/10
</div>
`

}

document.getElementById("next-round").onclick = ()=>{

currentQuestion++

if(currentQuestion >= 10){

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
