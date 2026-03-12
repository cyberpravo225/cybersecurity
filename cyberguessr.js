const map = L.map("map").setView([30,0],2)

L.tileLayer(
"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
{
maxZoom: 19
}
).addTo(map)

let playerMarker = null
let playerCoords = null

map.on("click",function(e){

playerCoords = e.latlng

if(playerMarker){
map.removeLayer(playerMarker)
}

playerMarker = L.marker(playerCoords).addTo(map)

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
fact:"Первый компьютерный вирус появился в университетской сети.",
lat:40.7128,
lng:-74.0060,
place:"США"
}

]
function distance(lat1, lon1, lat2, lon2){

const R = 6371

const dLat = (lat2-lat1) * Math.PI/180
const dLon = (lon2-lon1) * Math.PI/180

const a =
Math.sin(dLat/2)*Math.sin(dLat/2) +
Math.cos(lat1*Math.PI/180) *
Math.cos(lat2*Math.PI/180) *
Math.sin(dLon/2)*Math.sin(dLon/2)

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

document.getElementById("result").innerHTML =
`Вы были в ${Math.round(dist)} км от правильного ответа`

}
