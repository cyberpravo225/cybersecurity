const quizData = [

{
question: "Что такое социальная инженерия?",
answers: [
"Метод взлома через программирование",
"Манипуляция людьми для получения информации",
"Создание соцсетей",
"Удаление аккаунтов"
],
correct: 1,
explanation: "Социальная инженерия использует психологию для обмана."
},

{
question: "Почему опасно публиковать фото билетов или документов?",
answers: [
"Их могут использовать для мошенничества",
"Фото будет удалено",
"Аккаунт станет популярным",
"Это замедлит интернет"
],
correct: 0,
explanation: "На фото могут быть персональные данные."
},

{
question: "Что может произойти если использовать один пароль везде?",
answers: [
"Ничего",
"При взломе одного сайта взломают остальные",
"Пароль станет длиннее",
"Аккаунт станет быстрее"
],
correct: 1,
explanation: "Это называется password reuse."
},

{
question: "Почему опасно публиковать дату рождения?",
answers: [
"Её могут использовать для подбора пароля",
"Она удаляет аккаунт",
"Она блокирует интернет",
"Она делает профиль приватным"
],
correct: 0,
explanation: "Дата рождения часто используется в паролях."
},

{
question: "Что такое фишинговая ссылка?",
answers: [
"Ссылка на новость",
"Поддельная страница для кражи данных",
"Музыкальная ссылка",
"Игровая ссылка"
],
correct: 1,
explanation: "Фишинговые сайты копируют внешний вид настоящих."
},

{
question: "Почему нельзя делиться кодом из SMS?",
answers: [
"Это код подтверждения входа",
"Он бесполезен",
"Он нужен друзьям",
"Он удаляет аккаунт"
],
correct: 0,
explanation: "Мошенники могут войти в аккаунт с этим кодом."
},

{
question: "Что может выдать фейковый аккаунт?",
answers: [
"Мало друзей и странные сообщения",
"Много лайков",
"Длинное имя",
"Фото природы"
],
correct: 0,
explanation: "Фейковые аккаунты часто выглядят подозрительно."
},

{
question: "Почему нельзя публиковать фото банковской карты?",
answers: [
"Можно украсть данные карты",
"Фото будет удалено",
"Соцсеть заблокируется",
"Это запрещено законом"
],
correct: 0,
explanation: "На фото могут быть номер и срок действия."
},

{
question: "Что такое цифровой след?",
answers: [
"Следы на клавиатуре",
"Информация о действиях пользователя в интернете",
"Удалённые файлы",
"История браузера"
],
correct: 1,
explanation: "Все действия в сети оставляют цифровой след."
},

{
question: "Как лучше защитить аккаунт?",
answers: [
"Сложный пароль + 2FA",
"Только пароль",
"Открытый профиль",
"Один пароль для всех сайтов"
],
correct: 0,
explanation: "Двухфакторная защита значительно повышает безопасность."
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
