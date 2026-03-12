let currentQuestion = 0
let totalScore = 0
let roundFinished = false

let playerMarker = null
let correctMarker = null
let line = null
const map = new maplibregl.Map({
container: "map",
style: "https://tiles.openfreemap.org/styles/liberty",
center: [0,30],
zoom: 2
})
let playerMarker = null
let playerCoords = null

let currentQuestion = 0

const questions = [

{
fact:"В 2017 году вирус WannaCry поразил сотни тысяч компьютеров.",
lat:51.5074,
lng:-0.1278,
place:"Великобритания"
},

{
fact:"Самая крупная утечка данных произошла в компании Yahoo.",
lat:37.3875,
lng:-122.0575,
place:"США"
},

{
fact:"Первый компьютерный вирус появился в университетской сети.",
lat:40.7128,
lng:-74.0060,
place:"США"
}

]

function loadQuestion(){

const q = questions[currentQuestion]

document.getElementById("fact-text").innerText = q.fact

document.getElementById("result").innerHTML = ""

playerCoords = null

if(playerMarker) playerMarker.remove()
if(correctMarker) correctMarker.remove()

if(map.getLayer("line")){
map.removeLayer("line")
map.removeSource("line")
}

}

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

document.getElementById("guess-btn").onclick = ()=>{

if(!playerCoords) return

const q = questions[currentQuestion]

const dist = distance(
playerCoords.lat,
playerCoords.lng,
q.lat,
q.lng
)

correctMarker = new maplibregl.Marker({color:"red"})
.setLngLat([q.lng,q.lat])
.addTo(map)

document.getElementById("result").innerHTML =
`Вы были в <b>${Math.round(dist)} км</b> от правильного ответа.<br>
Правильная локация: ${q.place}`

}

loadQuestion()
function calculateScore(distance){

if(distance < 50) return 5000
if(distance < 200) return 4000
if(distance < 1000) return 2500
if(distance < 3000) return 1000
return 500

}
function drawLine(player, correct){

const lineData = {
type:"Feature",
geometry:{
type:"LineString",
coordinates:[
[player.lng, player.lat],
[correct.lng, correct.lat]
]
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
"line-color":"#ffcc00",
"line-width":3
}
})

}
document.getElementById("guess-btn").onclick = ()=>{

if(!playerCoords || roundFinished) return

roundFinished = true

const q = questions[currentQuestion]

const dist = distance(
playerCoords.lat,
playerCoords.lng,
q.lat,
q.lng
)

const score = calculateScore(dist)
totalScore += score

correctMarker = new maplibregl.Marker({color:"red"})
.setLngLat([q.lng,q.lat])
.addTo(map)

drawLine(playerCoords,{lat:q.lat,lng:q.lng})

document.getElementById("result").innerHTML = `
Вы были в <b>${Math.round(dist)} км</b><br>
Очки: <b>${score}</b><br>
Раунд: ${currentQuestion+1}/5
`

}document.getElementById("next-round").onclick = ()=>{

currentQuestion++

if(currentQuestion >= 5){

document.getElementById("result").innerHTML = `
<h2>Игра окончена</h2>
Ваш общий результат: <b>${totalScore}</b>
`

return
}

roundFinished = false

loadQuestion()

}
