const quizData = [

{
question: "Что означает закрытый (приватный) профиль?",
answers: [
"Аккаунт не отображается в поиске",
"Посты видят только одобренные подписчики",
"Сообщения приходят только друзьям",
"Аккаунт временно отключён"
],
correct: 1,
explanation: "Приватный профиль ограничивает доступ к публикациям только для одобренных подписчиков."
},

{
question: "Почему не стоит принимать заявки от незнакомых людей?",
answers: [
"Соцсеть может ограничить профиль",
"Это может быть фейковый аккаунт",
"Это уменьшает активность страницы",
"Это влияет на рекомендации"
],
correct: 1,
explanation: "Мошенники часто используют фейковые аккаунты для обмана."
},

{
question: "Какая информация может быть рискованной для публикации?",
answers: [
"Музыкальные предпочтения",
"Любимые фильмы",
"Адрес проживания",
"Список друзей"
],
correct: 2,
explanation: "Адрес может раскрыть ваше местоположение."
},

{
question: "Что может указывать на фейковый профиль?",
answers: [
"Много лайков",
"Частые публикации",
"Подробная биография",
"Очень мало личной информации"
],
correct: 3,
explanation: "Фейковые аккаунты часто содержат минимум реальной информации."
},

{
question: "Почему нельзя передавать пароль даже знакомым?",
answers: [
"Пароль может попасть к другим людям",
"Аккаунт станет публичным",
"Соцсеть изменит настройки",
"Сообщения перестанут сохраняться"
],
correct: 0,
explanation: "Пароль может случайно попасть к третьим лицам."
},

{
question: "Если в сообщении просят срочно перевести деньги, что лучше сделать?",
answers: [
"Отправить небольшую сумму",
"Проверить информацию другим способом",
"Переслать сообщение друзьям",
"Попросить скидку"
],
correct: 1,
explanation: "Мошенники часто создают ощущение срочности."
},

{
question: "Для чего используется двухфакторная защита?",
answers: [
"Для хранения сообщений",
"Для ускорения входа",
"Для подтверждения входа дополнительным кодом",
"Для автоматической смены пароля"
],
correct: 2,
explanation: "Дополнительный код защищает аккаунт даже при утечке пароля."
},

{
question: "Почему стоит осторожно переходить по ссылкам в сообщениях?",
answers: [
"Они могут вести на поддельные сайты",
"Они уменьшают скорость интернета",
"Они меняют настройки профиля",
"Они удаляют сообщения"
],
correct: 0,
explanation: "Фишинговые ссылки могут украсть данные."
},

{
question: "Что лучше сделать при подозрении на взлом аккаунта?",
answers: [
"Удалить приложение",
"Создать новый аккаунт",
"Сменить пароль",
"Игнорировать проблему"
],
correct: 2,
explanation: "Смена пароля — первое действие при подозрении на взлом."
},

{
question: "Что сильнее всего защищает аккаунт?",
answers: [
"Открытый профиль",
"Частая смена аватара",
"Короткий пароль",
"Сложный пароль"
],
correct: 3,
explanation: "Сложный пароль значительно усложняет подбор."
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
