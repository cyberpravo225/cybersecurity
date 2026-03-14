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

// перемешиваем
questions.sort(()=>Math.random()-0.5)

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

function drawLine(player,correct){

const lineData = {
type:"Feature",
geometry:{
type:"LineString",
coordinates:[
[player.lng,player.lat],
[correct.lng,correct.lat]
]
}
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

correctMarker = new maplibregl.Marker({color:"#ff4444"})
.setLngLat([q.lng,q.lat])
.addTo(map)

drawLine(playerCoords,{lat:q.lat,lng:q.lng})

zoomToPoints(playerCoords,{lat:q.lat,lng:q.lng})

document.getElementById("result").innerHTML = `
<div style="background:var(--card-bg);padding:15px;border-radius:10px;">
📍 Правильный ответ: <b>${q.place}</b><br>
📏 Расстояние: <b>${Math.round(dist)} км</b><br>
⭐ Очки: <b>${score}</b><br>
Раунд: ${currentQuestion+1}/5
</div>
`

}

document.getElementById("next-round").onclick = ()=>{

currentQuestion++

if(currentQuestion >= 5){

document.getElementById("result").innerHTML = `
<div style="text-align:center;padding:20px;">
<h2>🏆 Игра окончена</h2>
<p>Ваш результат:</p>
<h1>${totalScore}</h1>
</div>
`

return
}

roundFinished = false

loadQuestion()

}

loadQuestion()
