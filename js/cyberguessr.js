const map = new maplibregl.Map({
container: "map",
style: "https://demotiles.maplibre.org/style.json",
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

if(playerMarker){
map.removeLayer(playerMarker)
}

if(correctMarker){
map.removeLayer(correctMarker)
}

}

map.on("click",(e)=>{

playerCoords = e.lngLat

if(playerMarker){
playerMarker.remove()
}

playerMarker = new maplibregl.Marker()
.setLngLat([playerCoords.lng, playerCoords.lat])
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
