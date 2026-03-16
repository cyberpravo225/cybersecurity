const quizData = [

{
question: "Что означает термин 'атака посредника' (MITM)?",
answers: [
"Перехват данных между пользователем и сайтом",
"Удаление файлов с сервера",
"Изменение дизайна сайта",
"Блокировка интернет-соединения"
],
correct: 0,
explanation: "MITM позволяет злоумышленнику читать или изменять трафик."
},

{
question: "Почему стоит проверять сертификат сайта?",
answers: [
"Он подтверждает подлинность соединения",
"Он ускоряет загрузку",
"Он меняет внешний вид",
"Он уменьшает рекламу"
],
correct: 0,
explanation: "Сертификат подтверждает подлинность сайта."
},

{
question: "Что может указывать на фишинговый сайт?",
answers: [
"Странный домен",
"Яркий дизайн",
"Много текста",
"Наличие логотипа"
],
correct: 0,
explanation: "Поддельные сайты часто используют похожие домены."
},

{
question: "Что означает термин 'ботнет'?",
answers: [
"Сеть заражённых устройств",
"Тип браузера",
"Метод шифрования",
"Формат сайта"
],
correct: 0,
explanation: "Ботнет используется для атак или рассылки спама."
},

{
question: "Почему важно использовать обновлённый браузер?",
answers: [
"Новые версии закрывают уязвимости",
"Он быстрее открывает сайты",
"Он меняет тему сайта",
"Он уменьшает рекламу"
],
correct: 0,
explanation: "Обновления устраняют найденные уязвимости."
},

{
question: "Что может сделать вредоносное расширение браузера?",
answers: [
"Красть данные пользователя",
"Ускорять интернет",
"Удалять сайты",
"Менять пароль"
],
correct: 0,
explanation: "Некоторые расширения могут получать доступ к данным."
},

{
question: "Почему опасно скачивать пиратские программы?",
answers: [
"Они могут содержать вредоносный код",
"Они занимают много памяти",
"Они медленно устанавливаются",
"Они меняют язык системы"
],
correct: 0,
explanation: "Пиратские версии часто распространяются с вредоносным ПО."
},

{
question: "Что означает термин 'уязвимость'?",
answers: [
"Ошибка безопасности в системе",
"Ошибка дизайна сайта",
"Ошибка загрузки файлов",
"Ошибка подключения"
],
correct: 0,
explanation: "Уязвимости могут использоваться для атак."
},

{
question: "Что помогает уменьшить риск атак в интернете?",
answers: [
"Регулярные обновления системы",
"Удаление браузера",
"Отключение антивируса",
"Использование старых программ"
],
correct: 0,
explanation: "Обновления закрывают известные уязвимости."
},

{
question: "Почему важно использовать антивирус?",
answers: [
"Он помогает обнаруживать вредоносные программы",
"Он ускоряет интернет",
"Он удаляет сайты",
"Он меняет пароли"
],
correct: 0,
explanation: "Антивирус может обнаружить и удалить вредоносное ПО."
}

]
let currentQuestion = 0
let score = 0
let answered = false

const questionEl = document.getElementById("question")
const answersEl = document.getElementById("answers")
const nextBtn = document.getElementById("next-btn")
const explanationEl = document.getElementById("explanation")
const progressEl = document.getElementById("progress")
const progressFill = document.getElementById("progress-fill")
const resultEl = document.getElementById("result")

function loadQuestion(){

answered = false
explanationEl.innerHTML = ""

const q = quizData[currentQuestion]

progressEl.innerHTML = `Вопрос ${currentQuestion+1} из ${quizData.length}`

const progressPercent = (currentQuestion / quizData.length) * 100
progressFill.style.width = progressPercent + "%"

questionEl.innerHTML = q.question

answersEl.innerHTML = ""

q.answers.forEach((answer,index)=>{

const div = document.createElement("div")
div.classList.add("answer-card")
div.innerText = answer

div.onclick = ()=>selectAnswer(div,index)

answersEl.appendChild(div)

})

}

function selectAnswer(card,index){

if(answered) return

answered = true

const q = quizData[currentQuestion]
const cards = document.querySelectorAll(".answer-card")

cards.forEach((c,i)=>{

if(i === q.correct){
c.classList.add("correct")
}

})

if(index === q.correct){

score++

}else{

card.classList.add("wrong")

explanationEl.innerHTML =
`Правильный ответ: <b>${q.answers[q.correct]}</b><br>${q.explanation}`

}

}

nextBtn.onclick = ()=>{

if(!answered) return

currentQuestion++

if(currentQuestion < quizData.length){

loadQuestion()

}else{

showResult()

}

}

document.addEventListener("keydown",(e)=>{

if(e.key === "Enter"){
nextBtn.click()
}

})

function showResult(){

document.getElementById("quiz-container").style.display="none"

const resultCard = document.getElementById("result")
const monkey = document.getElementById("result-monkey")
const title = document.getElementById("result-title")
const scoreText = document.getElementById("result-score")

resultCard.style.display = "block"

scoreText.innerHTML = `Ваш результат: ${score} / ${quizData.length}`

if(score <=4){

title.innerHTML = "Стоит повторить правила безопасности"
monkey.src = "assets/rez1.png"
resultCard.classList.add("result-bad")

}

else if(score <=7){

title.innerHTML = "Неплохо, но можно лучше"
monkey.src = "assets/rez2.png"
resultCard.classList.add("result-mid")

}

else{

title.innerHTML = "Отличный уровень безопасности!"
monkey.src = "assets/rez3.png"
resultCard.classList.add("result-good")

launchConfetti()

}

}

function getLevel(){

if(score <=3) return "Нужно подтянуть знания"
if(score <=7) return "Хороший уровень"
return "Отличный уровень безопасности"

}

loadQuestion()
function launchConfetti(){

for(let i=0;i<40;i++){

const conf = document.createElement("div")

conf.style.position="fixed"
conf.style.width="8px"
conf.style.height="8px"
conf.style.background=`hsl(${Math.random()*360},70%,60%)`
conf.style.left=Math.random()*100+"%"
conf.style.top="-10px"
conf.style.opacity="0.8"
conf.style.zIndex="999"

conf.style.animation=`fall ${2+Math.random()*2}s linear`

document.body.appendChild(conf)

setTimeout(()=>conf.remove(),4000)

}

}
