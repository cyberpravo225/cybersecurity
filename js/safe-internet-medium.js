const quizData = [

{
question: "Что такое HTTPS?",
answers: [
"Защищённый протокол передачи данных",
"Тип браузера",
"Формат сайта",
"Система хранения файлов"
],
correct: 0,
explanation: "HTTPS шифрует данные между пользователем и сайтом."
},

{
question: "Что означает термин 'фишинг'?",
answers: [
"Метод взлома серверов",
"Попытка украсть данные через поддельные сайты",
"Способ ускорить интернет",
"Тип компьютерного вируса"
],
correct: 1,
explanation: "Фишинг имитирует настоящие сайты или письма."
},

{
question: "Почему публичный Wi-Fi может быть опасен?",
answers: [
"Он работает медленно",
"Он ограничивает сайты",
"Данные могут перехватываться",
"Он блокирует аккаунты"
],
correct: 2,
explanation: "Злоумышленники могут перехватывать трафик."
},

{
question: "Что такое антивирус?",
answers: [
"Программа для защиты системы",
"Программа для создания сайтов",
"Программа для ускорения интернета",
"Программа для просмотра файлов"
],
correct: 0,
explanation: "Антивирус помогает обнаруживать вредоносное ПО."
},

{
question: "Что означает термин 'утечка данных'?",
answers: [
"Удаление файлов",
"Потеря интернета",
"Попадание информации в чужие руки",
"Повреждение системы"
],
correct: 2,
explanation: "Утечки могут раскрывать личные данные пользователей."
},

{
question: "Почему стоит использовать разные пароли?",
answers: [
"Это ускоряет вход",
"Это уменьшает риск взлома",
"Это улучшает дизайн сайта",
"Это увеличивает скорость сети"
],
correct: 1,
explanation: "Один взлом не даст доступ ко всем аккаунтам."
},

{
question: "Что такое вредоносная ссылка?",
answers: [
"Ссылка на новость",
"Ссылка на официальный сайт",
"Ссылка, ведущая на опасный ресурс",
"Ссылка на форум"
],
correct: 2,
explanation: "Такие ссылки могут вести на фишинговые страницы."
},

{
question: "Что лучше сделать перед установкой программы?",
answers: [
"Проверить источник загрузки",
"Закрыть браузер",
"Удалить файлы",
"Отключить антивирус"
],
correct: 0,
explanation: "Лучше скачивать программы только с официальных источников."
},

{
question: "Почему стоит проверять разрешения приложений?",
answers: [
"Они могут запрашивать лишний доступ",
"Они уменьшают память",
"Они влияют на интернет",
"Они меняют пароль"
],
correct: 0,
explanation: "Некоторые приложения требуют больше данных, чем нужно."
},

{
question: "Что помогает защитить данные в интернете?",
answers: [
"Использование HTTPS сайтов",
"Отключение браузера",
"Удаление файлов",
"Отключение Wi-Fi"
],
correct: 0,
explanation: "HTTPS шифрует передаваемую информацию."
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
