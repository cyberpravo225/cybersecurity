const quizData = [

{
question: "Что такое 'spear phishing'?",
answers: [
"Массовая рассылка спама",
"Целевая фишинговая атака на конкретного человека",
"Удаление аккаунтов",
"Вирус в браузере"
],
correct: 1,
explanation: "Spear phishing направлен на конкретного человека или организацию."
},

{
question: "Почему фишинговые сайты часто копируют дизайн известных сервисов?",
answers: [
"Чтобы сайт выглядел красивее",
"Чтобы вызвать доверие у пользователя",
"Чтобы ускорить загрузку",
"Чтобы изменить пароль"
],
correct: 1,
explanation: "Если сайт выглядит знакомо, люди реже проверяют адрес."
},

{
question: "Что может указывать на фишинговый сайт?",
answers: [
"Небольшие ошибки в домене",
"Отсутствие HTTPS",
"Подозрительный адрес",
"Все перечисленное"
],
correct: 3,
explanation: "Все эти признаки могут говорить о поддельном сайте."
},

{
question: "Что происходит при 'credential harvesting'?",
answers: [
"Сбор паролей и логинов пользователей",
"Удаление аккаунтов",
"Создание новых сайтов",
"Обновление системы"
],
correct: 0,
explanation: "Мошенники собирают логины и пароли через поддельные страницы."
},

{
question: "Почему опасно скачивать вложения из неизвестных писем?",
answers: [
"Они могут содержать вредоносное ПО",
"Они удаляют браузер",
"Они изменяют пароль автоматически",
"Они блокируют интернет"
],
correct: 0,
explanation: "Вложения могут содержать вирусы или трояны."
},

{
question: "Как мошенники маскируют фишинговые ссылки?",
answers: [
"Используют сокращённые ссылки",
"Меняют буквы на похожие символы",
"Добавляют лишние слова",
"Все варианты"
],
correct: 3,
explanation: "Все эти методы используются для маскировки поддельных ссылок."
},

{
question: "Что такое 'homograph attack'?",
answers: [
"Подмена букв похожими символами в адресе сайта",
"Удаление домена",
"Создание вируса",
"Замена IP адреса"
],
correct: 0,
explanation: "Например: использование 'а' кириллицы вместо латинской."
},

{
question: "Почему HTTPS не всегда гарантирует безопасность?",
answers: [
"Потому что его могут использовать и мошенники",
"Потому что он отключает защиту",
"Потому что он удаляет пароли",
"Потому что он работает только на телефоне"
],
correct: 0,
explanation: "HTTPS защищает соединение, но не гарантирует честность сайта."
},

{
question: "Что лучше сделать при подозрении на фишинговый сайт?",
answers: [
"Закрыть страницу",
"Проверить адрес сайта",
"Не вводить данные",
"Все перечисленное"
],
correct: 3,
explanation: "Лучше сразу прекратить взаимодействие с подозрительным сайтом."
},

{
question: "Какой способ защиты лучше всего помогает против фишинга?",
answers: [
"Внимательная проверка ссылок",
"Использование двухфакторной защиты",
"Игнорирование подозрительных писем",
"Все перечисленное"
],
correct: 3,
explanation: "Все методы вместе значительно повышают безопасность."
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

loadQuestion()
