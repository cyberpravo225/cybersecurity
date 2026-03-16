const quizData = [

{
question: "Что означает термин 'социальная инженерия'?",
answers: [
"Использование психологических приёмов для обмана",
"Разработка социальных платформ",
"Метод шифрования сообщений",
"Автоматический подбор паролей"
],
correct: 0,
explanation: "Социальная инженерия основана на манипуляции людьми."
},

{
question: "Почему публикация даты рождения может быть рискованной?",
answers: [
"Она влияет на алгоритмы",
"Она может использоваться для подбора паролей",
"Она увеличивает рекламу",
"Она меняет настройки профиля"
],
correct: 1,
explanation: "Дата рождения часто используется в паролях."
},

{
question: "Что происходит при использовании одного пароля на разных сайтах?",
answers: [
"Пароль становится короче",
"Аккаунты синхронизируются",
"Взлом одного сайта открывает доступ к другим",
"Сайт автоматически блокируется"
],
correct: 2,
explanation: "Это называется повторным использованием паролей."
},

{
question: "Что такое фишинговая страница?",
answers: [
"Страница с рекламой",
"Личный блог пользователя",
"Раздел поддержки сайта",
"Поддельный сайт для кражи данных"
],
correct: 3,
explanation: "Фишинговые сайты копируют внешний вид настоящих."
},

{
question: "Почему нельзя передавать код из SMS?",
answers: [
"Он подтверждает вход в аккаунт",
"Он используется для регистрации",
"Он изменяет пароль",
"Он удаляет сообщения"
],
correct: 0,
explanation: "Мошенники используют этот код для входа."
},

{
question: "Что может выдать фейковый аккаунт?",
answers: [
"Странные сообщения и мало друзей",
"Регулярные публикации",
"Качественные фотографии",
"Подробная биография"
],
correct: 0,
explanation: "Фейковые аккаунты часто выглядят подозрительно."
},

{
question: "Почему нельзя публиковать фото банковской карты?",
answers: [
"Фото может быть удалено",
"Соцсеть блокирует аккаунт",
"По фото можно узнать данные карты",
"Это запрещено правилами"
],
correct: 2,
explanation: "Даже частичный номер карты может быть использован."
},

{
question: "Что означает термин 'цифровой след'?",
answers: [
"История действий пользователя в интернете",
"Следы на клавиатуре",
"Удалённые файлы",
"Данные браузера"
],
correct: 0,
explanation: "Любая активность оставляет цифровой след."
},

{
question: "Что лучше всего повышает безопасность аккаунта?",
answers: [
"Использование одного пароля",
"Сложный пароль и 2FA",
"Публичный профиль",
"Частая смена имени"
],
correct: 1,
explanation: "Комбинация сложного пароля и 2FA повышает безопасность."
},

{
question: "Почему стоит ограничивать личную информацию в профиле?",
answers: [
"Она занимает место",
"Она снижает популярность",
"Её могут использовать мошенники",
"Она влияет на рекламу"
],
correct: 2,
explanation: "Чем меньше данных доступно, тем сложнее атака."
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
