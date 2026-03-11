const quizData = [

{
question: "Какой признак чаще всего указывает на фишинговое письмо?",
answers: [
"Письмо от знакомого",
"Ошибка в адресе сайта или отправителя",
"Письмо без текста",
"Письмо без картинок"
],
correct: 1,
explanation: "Фишинговые письма часто используют адреса, похожие на настоящие."
},

{
question: "Почему нельзя переходить по ссылкам из подозрительных писем?",
answers: [
"Они могут вести на поддельный сайт",
"Они удаляют браузер",
"Они делают интернет медленным",
"Они меняют пароль автоматически"
],
correct: 0,
explanation: "Мошенники создают копии сайтов для кражи данных."
},

{
question: "Что лучше сделать, если письмо требует срочно подтвердить пароль?",
answers: [
"Сразу ввести пароль",
"Перейти по ссылке",
"Проверить сайт самостоятельно",
"Отправить письмо друзьям"
],
correct: 2,
explanation: "Лучше открыть официальный сайт вручную."
},

{
question: "Как мошенники часто заставляют людей доверять письму?",
answers: [
"Используют логотипы известных компаний",
"Пишут очень короткие письма",
"Используют только цифры",
"Пишут на другом языке"
],
correct: 0,
explanation: "Фишинговые письма часто копируют дизайн настоящих компаний."
},

{
question: "Какой адрес выглядит подозрительно?",
answers: [
"bank.com",
"secure-bank.com",
"bank-login-security.xyz",
"bank.ru"
],
correct: 2,
explanation: "Странные домены часто используются мошенниками."
},

{
question: "Почему мошенники используют срочные сообщения?",
answers: [
"Чтобы человек не успел проверить информацию",
"Чтобы сайт загрузился быстрее",
"Чтобы письмо выглядело длиннее",
"Чтобы изменить пароль"
],
correct: 0,
explanation: "Паника снижает внимательность пользователя."
},

{
question: "Что может произойти если ввести пароль на фишинговом сайте?",
answers: [
"Ничего",
"Пароль украдут",
"Сайт удалится",
"Компьютер выключится"
],
correct: 1,
explanation: "Мошенники получают доступ к аккаунту."
},

{
question: "Какой способ проверки сайта безопаснее?",
answers: [
"Перейти по ссылке из письма",
"Ввести адрес сайта вручную",
"Открыть случайную ссылку",
"Скачать приложение"
],
correct: 1,
explanation: "Так вы попадёте на настоящий сайт."
},

{
question: "Что делать если подозреваете фишинговое письмо?",
answers: [
"Игнорировать или удалить",
"Переслать друзьям",
"Нажать ссылку",
"Ответить мошеннику"
],
correct: 0,
explanation: "Лучше не взаимодействовать с подозрительными письмами."
},

{
question: "Какая информация чаще всего интересует мошенников?",
answers: [
"Пароли и банковские данные",
"Любимые фильмы",
"Домашние задания",
"Музыка"
],
correct: 0,
explanation: "Основная цель фишинга — кража аккаунтов и денег."
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
