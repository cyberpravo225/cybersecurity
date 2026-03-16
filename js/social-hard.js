const quizData = [

{
question: "Что означает термин OSINT?",
answers: [
"Поиск данных из открытых источников",
"Метод шифрования файлов",
"Тип компьютерного вируса",
"Система хранения данных"
],
correct: 0,
explanation: "OSINT — сбор информации из открытых источников."
},

{
question: "Почему геолокация на фото может быть рискованной?",
answers: [
"Она увеличивает размер файла",
"Она показывает место съёмки",
"Она снижает качество изображения",
"Она меняет формат фото"
],
correct: 1,
explanation: "Геолокация может раскрыть местоположение."
},

{
question: "Что означает термин doxxing?",
answers: [
"Удаление аккаунта",
"Создание фейкового профиля",
"Публикация личных данных человека",
"Изменение настроек приватности"
],
correct: 2,
explanation: "Doxxing — публикация личной информации без согласия."
},

{
question: "Почему онлайн-викторины могут быть опасны?",
answers: [
"Они изменяют пароль",
"Они удаляют профиль",
"Они блокируют браузер",
"Они собирают персональные ответы"
],
correct: 3,
explanation: "Ответы могут использоваться для анализа личности."
},

{
question: "Что такое ботнет в соцсетях?",
answers: [
"Сеть управляемых аккаунтов",
"Тип браузера",
"Алгоритм поиска",
"Программа шифрования"
],
correct: 0,
explanation: "Ботнет используется для спама и атак."
},

{
question: "Почему опасно публиковать фото посадочного талона?",
answers: [
"Он содержит рекламные данные",
"По коду можно получить данные о поездке",
"Он увеличивает цифровой след",
"Он показывает дату поездки"
],
correct: 1,
explanation: "QR-код может содержать данные пассажира."
},

{
question: "Что означает spear phishing?",
answers: [
"Массовая рассылка писем",
"Автоматическая реклама",
"Целевая атака на конкретного человека",
"Метод шифрования"
],
correct: 2,
explanation: "Spear phishing использует персональную информацию."
},

{
question: "Почему фото рабочего пропуска может быть рискованным?",
answers: [
"Он может потеряться",
"Он содержит QR код",
"Он показывает должность",
"Можно узнать компанию и данные сотрудника"
],
correct: 3,
explanation: "Это может помочь подготовить атаку."
},

{
question: "Как злоумышленники используют данные из соцсетей?",
answers: [
"Для подготовки убедительных атак",
"Для ускорения интернета",
"Для изменения паролей",
"Для удаления аккаунтов"
],
correct: 0,
explanation: "Личная информация помогает сделать атаку убедительной."
},

{
question: "Какая стратегия защиты наиболее эффективна?",
answers: [
"Публичный профиль",
"Один пароль для всех сайтов",
"Частая смена аватара",
"Минимум личных данных и 2FA"
],
correct: 3,
explanation: "Комбинация мер безопасности снижает риск атак."
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
