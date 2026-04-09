const scenes = [
  {
    id:'sms', chapter:'Утро', title:'SMS о доставке',
    text:'Сообщение: "Посылка задержана. Подтвердите адрес по ссылке".', threat:'Фишинг SMS',
    hint:'Не переходи по ссылке из внезапного SMS. Проверь через официальное приложение.',
    choices:[
      {text:'Открыть ссылку и ввести данные', risk:'high', effects:{security:-2,xp:3,focus:-1,risk:2,wrong:'sms'} , why:'Ссылка в SMS часто ведёт на поддельный сайт.'},
      {text:'Открыть приложение доставки и проверить там', risk:'low', effects:{security:+1,xp:10,focus:+1,risk:-1,habit:'Проверять через официальные приложения'}, why:'Ты используешь безопасный канал.'},
      {text:'Игнорировать и пометить как спам', risk:'low', effects:{security:+1,xp:9,focus:+1,risk:-1,habit:'Не доверять срочным сообщениям'}, why:'Отличная базовая привычка.'}
    ]
  },
  {
    id:'email', chapter:'День', title:'Письмо "Аккаунт будет заблокирован"',
    text:'В письме красная кнопка "Срочно подтвердить вход".', threat:'Email-фишинг',
    hint:'Сначала проверяй адрес отправителя и домен.',
    choices:[
      {text:'Нажать кнопку и ввести пароль', risk:'high', effects:{security:-2,xp:2,focus:-1,risk:2,wrong:'email'}, why:'Так пароль может попасть мошенникам.'},
      {text:'Зайти на сайт вручную из закладки', risk:'low', effects:{security:+1,xp:10,focus:+1,risk:-1,habit:'Входить вручную на важные сервисы'}, why:'Это безопаснее, чем кнопка из письма.'}
    ]
  },
  {
    id:'wifi', chapter:'Кафе', title:'Открытый Wi‑Fi',
    text:'Сеть "FREE-CAFE" без пароля. Нужно войти в банк.', threat:'Небезопасный Wi‑Fi',
    hint:'Для банка лучше мобильный интернет.',
    choices:[
      {text:'Подключиться и войти в банк', risk:'high', effects:{security:-2,xp:2,focus:-1,risk:2,wrong:'wifi'}, why:'Открытые сети опасны для чувствительных данных.'},
      {text:'Использовать мобильный интернет', risk:'low', effects:{security:+2,xp:10,focus:+1,risk:-1,habit:'Не логиниться в важные сервисы в открытой сети'}, why:'Верное решение.'}
    ]
  },
  {
    id:'code', chapter:'Вечер', title:'Звонок "из поддержки"',
    text:'Просят назвать код из SMS "для отмены подозрительной операции".', threat:'Социнженерия',
    hint:'Код из SMS нельзя сообщать никому.',
    choices:[
      {text:'Продиктовать код', risk:'critical', effects:{security:-3,xp:1,focus:-1,risk:3,wrong:'code'}, why:'Код подтверждения — ключ к твоему аккаунту.'},
      {text:'Отказаться и завершить звонок', risk:'low', effects:{security:+2,xp:11,focus:+1,risk:-1,habit:'Никому не сообщать коды из SMS'}, why:'Ты сохранил контроль.'}
    ]
  },
  {
    id:'final', chapter:'Финал', title:'Попытка захвата аккаунта',
    text:'Уведомления о входе с нового устройства.', threat:'Захват аккаунта',
    hint:'Сразу: смена пароля + выход из сессий + 2FA.',
    choices:[
      {text:'Игнорировать до завтра', risk:'critical', effects:{security:-3,xp:1,focus:-1,risk:3,wrong:'final'}, why:'Промедление увеличивает ущерб.'},
      {text:'Срочно сменить пароль и включить 2FA', risk:'low', effects:{security:+3,xp:14,focus:+1,risk:-2,habit:'Быстро реагировать на подозрительные входы'}, why:'Ты перекрыл атаку.'}
    ]
  }
]

const state = {
  screen:'start', idx:0,
  stats:{security:4,xp:0,focus:3,risk:0,safe:0,danger:0},
  mistakes:{sms:0,email:0,wifi:0,code:0,final:0},
  habits:new Set(), last:null
}

const $hud=document.getElementById('hud')
const $screen=document.getElementById('screen')

function tone(freq=600,dur=0.08,type='sine',vol=0.03){
  try{
    const ctx = tone.ctx || (tone.ctx = new (window.AudioContext||window.webkitAudioContext)())
    const o=ctx.createOscillator(), g=ctx.createGain()
    o.type=type;o.frequency.value=freq;g.gain.value=vol
    o.connect(g);g.connect(ctx.destination);o.start();o.stop(ctx.currentTime+dur)
  }catch{}
}

function hud(){
  const s=state.stats
  const meters=[
    ['Защита',s.security,5,'var(--success)'],
    ['XP',s.xp,60,'linear-gradient(90deg,var(--indigo),var(--purple))'],
    ['Внимательность',s.focus,5,'var(--accent)'],
    ['Риск',s.risk,20,'var(--danger)']
  ]
  $hud.innerHTML=meters.map(([name,val,max,color])=>`<div class="meter"><b>${name}: ${val}/${max}</b><div class="track"><div class="fill" style="width:${Math.max(0,Math.min(100,val/max*100))}%;background:${color}"></div></div></div>`).join('')
}

function startScreen(){
  $screen.innerHTML=`
    <h1 class="title">Один день: цифровая ловушка</h1>
    <p class="muted">Короткая сюжетная игра о том, как не попасться на цифровые уловки в обычный день.</p>
    <div class="btns">
      <button class="btn-primary" id="start">Начать игру</button>
      <a class="btn btn-secondary" href="../index.html">← На главную</a>
    </div>`
  document.getElementById('start').onclick=()=>{tone(340,.18);state.screen='game';render()}
}

function sceneScreen(){
  const scene=scenes[state.idx]
  $screen.innerHTML=`
    <span class="badge">${scene.chapter} · ${state.idx+1}/${scenes.length}</span>
    <h2>${scene.title}</h2>
    <p>${scene.text}</p>
    <p class="muted"><b>Подсказка:</b> ${scene.hint}</p>
    <div class="choices">${scene.choices.map((c,i)=>`<button class="choice" data-i="${i}">${c.text}</button>`).join('')}</div>
  `
  $screen.querySelectorAll('.choice').forEach(btn=>btn.onclick=()=>choose(scene.choices[+btn.dataset.i],scene))
}

function choose(choice, scene){
  const e=choice.effects
  const s=state.stats
  s.security=Math.max(0,Math.min(5,s.security+e.security))
  s.xp=Math.max(0,s.xp+e.xp)
  s.focus=Math.max(0,Math.min(5,s.focus+e.focus))
  s.risk=Math.max(0,s.risk+e.risk)
  if(choice.risk==='low') s.safe++
  else s.danger++
  if(e.wrong) state.mistakes[e.wrong]++
  if(e.habit) state.habits.add(e.habit)

  state.last={scene,choice}
  state.screen='result'
  tone(choice.risk==='low'?760:200, .12, choice.risk==='low'?'triangle':'sawtooth', .04)
  render()
}

function resultScreen(){
  const {scene,choice}=state.last
  const ok=choice.risk==='low'
  $screen.innerHTML=`
    <span class="badge">Результат сцены</span>
    <div class="result ${ok?'success':'danger'}">
      <p><b>${ok?'Безопасное решение':'Рискованное решение'}</b></p>
      <p>${choice.why}</p>
      <p class="muted">Тип угрозы: ${scene.threat}</p>
    </div>
    <div class="btns"><button class="btn-primary" id="next">Дальше</button></div>`
  document.getElementById('next').onclick=()=>{
    state.idx++
    if(state.idx>=scenes.length || state.stats.security<=0){state.screen='final'} else state.screen='game'
    render()
  }
}

function ending(){
  const s=state.stats
  const score=s.security*12+s.xp+s.safe*8-s.danger*8-s.risk*2
  if(score<40) return ['Плохая','День пошёл не по плану. Но теперь ты знаешь, где были уязвимости.']
  if(score<70) return ['Средняя','Ты справился частично. Ещё немного практики — и будет отлично.']
  if(score<100) return ['Хорошая','Круто! Ты уверенно распознаёшь большинство ловушек.']
  return ['Идеальная','Ты прошёл день как кибер-герой: спокойно и безопасно.']
}

function finalScreen(){
  const [rate,text]=ending()
  const top=Object.entries(state.mistakes).sort((a,b)=>b[1]-a[1]).slice(0,3)
  $screen.innerHTML=`
    <h2 class="title">${rate} концовка</h2>
    <p>${text}</p>
    <p><b>Правильных решений:</b> ${state.stats.safe} · <b>Опасных:</b> ${state.stats.danger}</p>
    <h3>Усвоенные привычки</h3>
    <ul>${[...state.habits].map(h=>`<li>${h}</li>`).join('') || '<li>Пока нет — попробуй ещё раз.</li>'}</ul>
    <h3>Частые ошибки</h3>
    <ul>${top.map(([k,v])=>`<li>${k}: ${v}</li>`).join('')}</ul>
    <div class="btns">
      <button class="btn-primary" id="again">Сыграть ещё раз</button>
      <a class="btn btn-secondary" href="../index.html">На главную</a>
    </div>
  `
  document.getElementById('again').onclick=()=>{
    state.screen='start';state.idx=0
    state.stats={security:4,xp:0,focus:3,risk:0,safe:0,danger:0}
    state.mistakes={sms:0,email:0,wifi:0,code:0,final:0}
    state.habits=new Set();state.last=null
    render()
  }
}

function render(){
  hud()
  if(state.screen==='start') startScreen()
  else if(state.screen==='game') sceneScreen()
  else if(state.screen==='result') resultScreen()
  else finalScreen()
}

render()
