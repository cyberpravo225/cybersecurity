const quizData = [

{
question: "Что означает значок замка в адресной строке сайта?",
answers: [
"Сайт использует защищённое соединение",
"Сайт полностью безопасен",
"Сайт принадлежит государству",
"Сайт нельзя взломать"
],
correct: 0,
explanation: "Замок означает использование HTTPS, но не гарантирует полную безопасность."
},

{
question: "Почему не стоит скачивать файлы с неизвестных сайтов?",
answers: [
"Файлы могут содержать вредоносные программы",
"Файлы могут открываться медленно",
"Файлы занимают много памяти",
"Файлы могут изменить язык системы"
],
correct: 0,
explanation: "Неизвестные сайты могут распространять вредоносное ПО."
},

{
question: "Что лучше сделать перед вводом пароля на сайте?",
answers: [
"Проверить адрес сайта",
"Обновить браузер",
"Закрыть вкладки",
"Отключить интернет"
],
correct: 0,
explanation: "Важно убедиться, что сайт настоящий."
},

{
question: "Почему не стоит использовать одинаковые пароли?",
answers: [
"Сайт может изменить настройки",
"Это усложняет вход",
"Взлом одного сайта даст доступ к другим",
"Пароль станет длиннее"
],
correct: 2,
explanation: "Повторное использование паролей повышает риск взлома."
},

{
question: "Что такое вредоносная программа?",
answers: [
"Программа для защиты компьютера",
"Программа для ускорения системы",
"Программа для удаления файлов",
"Программа, которая может нанести вред"
],
correct: 3,
explanation: "Вредоносные программы могут красть данные или повреждать систему."
},

{
question: "Почему важно обновлять программы?",
answers: [
"Обновления могут закрывать уязвимости",
"Обновления меняют дизайн",
"Обновления добавляют рекламу",
"Обновления удаляют файлы"
],
correct: 0,
explanation: "Разработчики исправляют найденные уязвимости."
},

{
question: "Что лучше сделать с подозрительным письмом?",
answers: [
"Удалить его",
"Переслать друзьям",
"Сохранить на компьютер",
"Ответить отправителю"
],
correct: 0,
explanation: "Лучше не взаимодействовать с подозрительными письмами."
},

{
question: "Что может указывать на поддельный сайт?",
answers: [
"Странный адрес страницы",
"Яркий дизайн",
"Большое количество текста",
"Много изображений"
],
correct: 0,
explanation: "Мошенники часто используют похожие, но неправильные адреса."
},

{
question: "Почему важно выходить из аккаунтов на чужих устройствах?",
answers: [
"Чтобы освободить память",
"Чтобы ускорить интернет",
"Чтобы никто не получил доступ",
"Чтобы удалить историю"
],
correct: 2,
explanation: "Иначе другой пользователь может открыть ваш аккаунт."
},

{
question: "Что лучше всего защищает аккаунты?",
answers: [
"Открытый профиль",
"Сложный пароль",
"Короткое имя",
"Отключённые уведомления"
],
correct: 1,
explanation: "Сложный пароль значительно повышает безопасность."
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
