const quizData = [

{
question: "Какой пароль самый безопасный?",
answers: [
"123456",
"password",
"Q7!dF9@kL2",
"qwerty"
],
correct: 2,
explanation: "Безопасный пароль должен содержать буквы, цифры и символы."
},

{
question: "Можно ли использовать один и тот же пароль на разных сайтах?",
answers: [
"Да",
"Нет",
"Иногда",
"Только на важных сайтах"
],
correct: 1,
explanation: "Если один сайт взломают, злоумышленники смогут попасть во все аккаунты."
},

{
question: "Что нужно делать с паролем?",
answers: [
"Хранить в секрете",
"Отправлять друзьям",
"Писать в комментариях",
"Размещать в соцсетях"
],
correct: 0,
explanation: "Пароль должен знать только владелец аккаунта."
},

{
question: "Какая длина пароля безопаснее?",
answers: [
"3 символа",
"5 символов",
"8 и более символов",
"Любая"
],
correct: 2,
explanation: "Чем длиннее пароль — тем сложнее его взломать."
},

{
question: "Можно ли использовать имя в пароле?",
answers: [
"Да",
"Лучше не стоит",
"Это самый безопасный вариант",
"Всегда можно"
],
correct: 1,
explanation: "Личную информацию легче угадать."
},

{
question: "Что такое двухфакторная защита?",
answers: [
"Дополнительный код",
"Пароль из двух слов",
"Два аккаунта",
"Два сайта"
],
correct: 0,
explanation: "После пароля нужно подтвердить вход кодом."
},

{
question: "Можно ли сохранять пароль на чужом компьютере?",
answers: [
"Нет",
"Да",
"Иногда",
"Всегда можно"
],
correct: 0,
explanation: "Другой человек сможет войти в аккаунт."
},

{
question: "Что делать если пароль узнали?",
answers: [
"Сменить пароль",
"Ничего",
"Удалить аккаунт",
"Сообщить всем"
],
correct: 0,
explanation: "Нужно сразу поменять пароль."
},

{
question: "Как часто менять важные пароли?",
answers: [
"Раз в несколько месяцев",
"Никогда",
"Раз в 10 лет",
"Каждый день"
],
correct: 0,
explanation: "Регулярная смена повышает безопасность."
},

{
question: "Можно ли хранить пароль без защиты?",
answers: [
"Нет",
"Да",
"Иногда",
"Всегда можно"
],
correct: 0,
explanation: "Лучше использовать менеджер паролей."
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

resultEl.innerHTML = `
<h2>Ваш результат: ${score} / ${quizData.length}</h2>
<p>${getLevel()}</p>
`

}

function getLevel(){

if(score <=3) return "Нужно подтянуть знания 🔐"
if(score <=7) return "Хороший уровень 👍"
return "Отличный уровень безопасности 🛡️"

}

loadQuestion()
