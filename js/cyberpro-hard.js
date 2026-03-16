const quizData = [

{
question: "Что означает принцип 'least privilege'?",
answers: [
"Минимально необходимые права доступа",
"Максимальная защита пароля",
"Полное шифрование системы",
"Запрет сетевых соединений"
],
correct: 0,
explanation: "Пользователь получает только необходимые права."
},

{
question: "Что такое CVE?",
answers: [
"База известных уязвимостей",
"Тип вируса",
"Метод шифрования",
"Система хранения файлов"
],
correct: 0,
explanation: "CVE — база идентификаторов уязвимостей."
},

{
question: "Что означает термин 'hash collision'?",
answers: [
"Совпадение хэш-значений",
"Удаление хэша",
"Изменение алгоритма",
"Ошибка базы данных"
],
correct: 0,
explanation: "Коллизия возникает когда два входа дают один хэш."
},

{
question: "Что такое XSS-атака?",
answers: [
"Внедрение вредоносного скрипта",
"Сканирование сети",
"Метод шифрования",
"Тип вируса"
],
correct: 0,
explanation: "Cross-Site Scripting выполняет скрипты в браузере."
},

{
question: "Что означает термин 'SOC'?",
answers: [
"Центр мониторинга безопасности",
"Тип шифрования",
"Система браузера",
"Метод взлома"
],
correct: 0,
explanation: "SOC отслеживает угрозы в реальном времени."
},

{
question: "Что такое DDoS-атака?",
answers: [
"Перегрузка сервера большим числом запросов",
"Шифрование файлов",
"Удаление базы данных",
"Метод резервного копирования"
],
correct: 0,
explanation: "DDoS делает сервис недоступным."
},

{
question: "Что означает термин 'threat intelligence'?",
answers: [
"Анализ информации об угрозах",
"Создание вирусов",
"Метод шифрования",
"Тип базы данных"
],
correct: 0,
explanation: "Threat intelligence помогает предсказывать атаки."
},

{
question: "Что делает honeypot?",
answers: [
"Ловушка для злоумышленников",
"Метод шифрования",
"Система хранения данных",
"Тип антивируса"
],
correct: 0,
explanation: "Honeypot имитирует уязвимую систему."
},

{
question: "Что означает термин 'attack surface'?",
answers: [
"Все возможные точки атаки",
"Тип вредоносной программы",
"Метод шифрования",
"Система резервного копирования"
],
correct: 0,
explanation: "Attack surface — все потенциальные входы для атак."
},

{
question: "Что такое SIEM?",
answers: [
"Система анализа событий безопасности",
"Тип сетевого протокола",
"Метод шифрования",
"Формат базы данных"
],
correct: 0,
explanation: "SIEM собирает и анализирует логи безопасности."
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
