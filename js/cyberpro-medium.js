const quizData = [

{
question: "Что означает аббревиатура VPN?",
answers: [
"Виртуальная частная сеть",
"Тип антивируса",
"Метод шифрования",
"Формат соединения"
],
correct: 0,
explanation: "VPN создаёт защищённый канал связи."
},

{
question: "Что такое MITM-атака?",
answers: [
"Перехват данных между сторонами",
"Удаление файлов",
"Создание вирусов",
"Шифрование паролей"
],
correct: 0,
explanation: "Man-in-the-middle позволяет перехватывать трафик."
},

{
question: "Что означает термин 'хэширование'?",
answers: [
"Шифрование сообщений",
"Преобразование данных в фиксированный код",
"Удаление информации",
"Сжатие файлов"
],
correct: 1,
explanation: "Хэш-функции используются для хранения паролей."
},

{
question: "Что такое SQL-инъекция?",
answers: [
"Метод атаки на базы данных",
"Тип вируса",
"Формат таблиц",
"Метод шифрования"
],
correct: 0,
explanation: "SQL injection позволяет выполнять запросы к базе данных."
},

{
question: "Что делает IDS система?",
answers: [
"Обнаруживает подозрительную активность",
"Удаляет вирусы",
"Шифрует данные",
"Создаёт резервные копии"
],
correct: 0,
explanation: "IDS — система обнаружения вторжений."
},

{
question: "Что означает термин 'социальная инженерия'?",
answers: [
"Манипуляция людьми для получения данных",
"Метод шифрования",
"Тип сетевого протокола",
"Формат базы данных"
],
correct: 0,
explanation: "Атаки используют психологию."
},

{
question: "Что такое Zero-day уязвимость?",
answers: [
"Неизвестная разработчикам уязвимость",
"Ошибка браузера",
"Метод шифрования",
"Тип вируса"
],
correct: 0,
explanation: "Zero-day ещё не имеет исправления."
},

{
question: "Что означает термин 'sandbox'?",
answers: [
"Изолированная среда для запуска программ",
"Система хранения файлов",
"Тип браузера",
"Метод шифрования"
],
correct: 0,
explanation: "Sandbox используется для анализа программ."
},

{
question: "Что делает антивирус?",
answers: [
"Обнаруживает вредоносные программы",
"Шифрует данные",
"Создаёт сайты",
"Удаляет интернет"
],
correct: 0,
explanation: "Антивирус ищет и удаляет malware."
},

{
question: "Что означает термин 'penetration testing'?",
answers: [
"Тестирование безопасности системы",
"Создание вирусов",
"Настройка сети",
"Шифрование файлов"
],
correct: 0,
explanation: "Pentest проверяет систему на уязвимости."
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
