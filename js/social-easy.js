const quizData = [

{
question: "Что означает приватный профиль в соцсети?",
answers: [
"Аккаунт удалён",
"Профиль может видеть только владелец",
"Посты могут видеть только одобренные подписчики",
"Профиль нельзя найти"
],
correct: 2,
explanation: "Приватный профиль ограничивает доступ к контенту только для подписчиков."
},

{
question: "Почему нельзя принимать заявки от незнакомых людей?",
answers: [
"Они могут оказаться мошенниками",
"Это запрещено соцсетями",
"Это замедляет интернет",
"Это удаляет аккаунт"
],
correct: 0,
explanation: "Мошенники часто создают фейковые аккаунты для сбора информации."
},

{
question: "Какая информация опасна для публикации?",
answers: [
"Фото еды",
"Адрес проживания",
"Фото природы",
"Музыка"
],
correct: 1,
explanation: "Публикация адреса может угрожать личной безопасности."
},

{
question: "Что такое фейковый аккаунт?",
answers: [
"Аккаунт без фото",
"Аккаунт, созданный под чужим именем",
"Аккаунт с длинным именем",
"Аккаунт без подписчиков"
],
correct: 1,
explanation: "Фейковые аккаунты часто используются мошенниками."
},

{
question: "Почему не стоит делиться паролем от соцсети?",
answers: [
"Аккаунт может быть взломан",
"Пароль станет длиннее",
"Соцсеть заблокирует интернет",
"Это ничего не меняет"
],
correct: 0,
explanation: "Если пароль узнает другой человек, он сможет войти в аккаунт."
},

{
question: "Что делать, если незнакомец просит деньги в сообщениях?",
answers: [
"Отправить деньги",
"Проигнорировать и пожаловаться",
"Дать пароль",
"Добавить в друзья"
],
correct: 1,
explanation: "Это распространённая схема мошенничества."
},

{
question: "Что означает двухфакторная аутентификация?",
answers: [
"Два пароля",
"Дополнительный код при входе",
"Два аккаунта",
"Два браузера"
],
correct: 1,
explanation: "Помимо пароля нужен код из SMS или приложения."
},

{
question: "Почему нельзя переходить по подозрительным ссылкам?",
answers: [
"Они могут вести на мошеннические сайты",
"Они удаляют интернет",
"Они делают аккаунт популярным",
"Они ускоряют загрузку"
],
correct: 0,
explanation: "Фишинговые ссылки могут украсть пароль."
},

{
question: "Что делать если аккаунт взломали?",
answers: [
"Удалить интернет",
"Сменить пароль",
"Игнорировать",
"Создать новый телефон"
],
correct: 1,
explanation: "Первое действие — срочно сменить пароль."
},

{
question: "Что помогает защитить аккаунт?",
answers: [
"Сложный пароль",
"Открытый профиль",
"Публикация адреса",
"Передача пароля друзьям"
],
correct: 0,
explanation: "Сложный пароль значительно снижает риск взлома."
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
