let currentQuestion = 0
let totalScore = 0
let playerMarker = null
let playerCoords = null

const map = new maplibregl.Map({
container:"map",
style:"https://tiles.openfreemap.org/styles/liberty",
center:[0,30],
zoom:2
})

const questions = [

{
fact:"В 2017 вирус WannaCry поразил сотни тысяч компьютеров.",
lat:51.5074,
lng:-0.1278,
place:"Великобритания"
},

{
fact:"Крупнейшая утечка данных произошла в Yahoo.",
lat:37.3875,
lng:-122.0575,
place:"США"
},

{
fact:"Атака Stuxnet была направлена на ядерную программу Ирана.",
lat:35.6892,
lng:51.3890,
place:"Иран"
},

{
fact:"Крупная утечка LinkedIn произошла в 2012 году.",
lat:37.7749,
lng:-122.4194,
place:"США"
},

{
fact:"Один из первых вирусов появился в университетской сети США.",
lat:40.7128,
lng:-74.0060,
place:"США"
}

]

questions.sort(()=>Math.random()-0.5)

function loadQuestion(){

const q = questions[currentQuestion]

document.getElementById("fact-text").innerText = q.fact
document.getElementById("result").innerHTML = ""

playerCoords = null

if(playerMarker){
playerMarker.remove()
}

}

map.on("click",(e)=>{

playerCoords = e.lngLat

if(playerMarker){
playerMarker.remove()
}

playerMarker = new maplibregl.Marker()
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

document.getElementById("guess-btn").onclick = ()=>{

if(!playerCoords) return

const q = questions[currentQuestion]

const dist = distance(
playerCoords.lat,
playerCoords.lng,
q.lat,
q.lng
)

const score = calculateScore(dist)

totalScore += score

document.getElementById("result").innerHTML =
`
Расстояние: <b>${Math.round(dist)} км</b><br>
Очки: <b>${score}</b><br>
Раунд: ${currentQuestion+1}/5
`

}

document.getElementById("next-round").onclick = ()=>{

currentQuestion++

if(currentQuestion >= 5){

document.getElementById("result").innerHTML =
`
<h2>Игра окончена</h2>
Общий результат: <b>${totalScore}</b>
`

return
}

loadQuestion()

}

loadQuestion()
