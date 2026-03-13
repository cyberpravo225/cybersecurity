let currentQuestion = 0
let totalScore = 0
let roundFinished = false

let playerMarker = null
let correctMarker = null
let playerCoords = null

const map = new maplibregl.Map({
container: "map",
style: "https://tiles.openfreemap.org/styles/liberty",
center: [0,30],
zoom: 2
})

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
fact:"Атака Stuxnet была направлена на ядерную программу Ирана.",
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
fact:"Первый компьютерный вирус появился в университетской сети.",
lat:40.7128,
lng:-74.0060,
place:"США"
}

]

// перемешиваем вопросы
questions.sort(()=>Math.random()-0.5)

function loadQuestion(){

const q = questions[currentQuestion]

document.getElementById("fact-text").innerText = q.fact
document.getElementById("result").innerHTML = ""

playerCoords = null

if() .remove()
if(correctMarker) correctMarker.remove()

if(map.getLayer("line")){
map.removeLayer("line")
map.removeSource("line")
}

}

map.on("click",(e)=>{

playerCoords = e.lngLat

if(){
.remove()
}

const el = document.createElement("div")
el.className = "marker marker-player"

playerMarker = new maplibregl.Marker({
element: el,
anchor: "center"
})
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

function calculateScore(distance){

if(distance < 50) return 5000
if(distance < 200) return 4000
if(distance < 1000) return 2500
if(distance < 3000) return 1000
return 500

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

const correctEl = document.createElement("div")
correctEl.className = "marker marker-correct"

correctMarker = new maplibregl.Marker(correctEl)
.setLngLat([q.lng,q.lat])
.addTo(map)
drawLine(playerCoords,{lat:q.lat,lng:q.lng})
  zoomToPoints(playerCoords,{lat:q.lat,lng:q.lng})

document.getElementById("result").innerHTML = `
Вы были в <b>${Math.round(dist)} км</b><br>
Очки: <b>${score}</b><br>
Раунд: ${currentQuestion+1}/${questions.length}
`

}

document.getElementById("next-round").onclick = ()=>{

currentQuestion++

if(currentQuestion >= questions.length){

document.getElementById("result").innerHTML = `
<h2>Игра окончена</h2>
Ваш общий результат: <b>${totalScore}</b>
`

return
}

roundFinished = false

loadQuestion()

}

loadQuestion()
function drawLine(player,correct){

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
