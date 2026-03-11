const quizData = [

{
question: "Что такое фишинг?",
answers: [
"Компьютерная игра",
"Попытка обманом получить личные данные",
"Настройка интернета",
"Удаление вирусов"
],
correct: 1,
explanation: "Фишинг — это мошенничество, когда злоумышленники пытаются получить пароли или данные."
},

{
question: "Что обычно делают фишинговые письма?",
answers: [
"Предлагают помощь с уроками",
"Просят перейти по ссылке и ввести данные",
"Отправляют музыку",
"Показывают новости"
],
correct: 1,
explanation: "Фишинговые письма часто содержат ссылки на поддельные сайты."
},

{
question: "Что нужно сделать, если пришло подозрительное письмо?",
answers: [
"Сразу открыть ссылку",
"Отправить друзьям",
"Не переходить по ссылке",
"Удалить компьютер"
],
correct: 2,
explanation: "Нельзя переходить по подозрительным ссылкам."
},

{
question: "Как выглядит фишинговый сайт?",
answers: [
"Точно как настоящий",
"Всегда чёрный",
"Без текста",
"Только с картинками"
],
correct: 0,
explanation: "Мошенники часто копируют внешний вид настоящих сайтов."
},

{
question: "Что могут украсть мошенники?",
answers: [
"Пароли",
"Деньги",
"Личные данные",
"Все перечисленное"
],
correct: 3,
explanation: "Фишинг может привести к краже аккаунтов и денег."
},

{
question: "Можно ли вводить пароль на сайте, если ссылка выглядит странно?",
answers: [
"Да",
"Нет",
"Иногда",
"Всегда можно"
],
correct: 1,
explanation: "Странная ссылка может вести на поддельный сайт."
},

{
question: "Что часто пишут мошенники?",
answers: [
"Вы выиграли приз",
"Ваш аккаунт срочно нужно подтвердить",
"Получите деньги прямо сейчас",
"Все варианты"
],
correct: 3,
explanation: "Мошенники используют заманчивые или срочные сообщения."
},

{
question: "Почему мошенники торопят пользователя?",
answers: [
"Чтобы человек не успел подумать",
"Чтобы сайт работал быстрее",
"Чтобы экономить время",
"Чтобы обновить страницу"
],
correct: 0,
explanation: "Если человек торопится, он чаще совершает ошибку."
},

{
question: "Куда лучше зайти, если нужно проверить аккаунт?",
answers: [
"По ссылке из письма",
"Через официальный сайт",
"Через случайный сайт",
"Через рекламу"
],
correct: 1,
explanation: "Лучше самостоятельно открыть официальный сайт."
},

{
question: "Что делать если вы подозреваете фишинг?",
answers: [
"Сообщить взрослому или администратору",
"Игнорировать",
"Отправить друзьям",
"Нажать на ссылку"
],
correct: 0,
explanation: "Важно сообщить о мошенничестве."
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
