# Signal or Fake (new standalone game)

Этот репозиторий содержит веб-проект по кибербезопасности с новой отдельной игрой **Signal or Fake** (не как часть Binary Battle):

- одиночный соревновательный режим (`signal-or-fake-solo.html`);
- турнирный режим через лобби (`signal-or-fake-tournament.html`);
- лидерборд на главной (`index.html`) с разделением по `age_group`;
- сохранение результатов в Supabase (новые таблицы + обратная совместимость со старой `leaderboard`).

## Что обновлено

1. Главная страница (`index.html`)
   - добавлена большая карточка Signal or Fake;
   - добавлен встроенный leaderboard блок с табами `10-16` / `16+`;
   - загрузка топа сначала из `leaderboard_entries + solo_runs + profiles`, fallback на legacy `leaderboard`.

2. Соревновательный режим (`signal-or-fake-solo.html`)
   - механика изменена на legit/fake для доменов, Telegram, email, URL;
   - scoring учитывает правильность, скорость, серию и сложность;
   - после завершения сохраняются:
     - `solo_runs`
     - `solo_run_answers`
     - `leaderboard_entries`
     - legacy `leaderboard` (для совместимости).

3. Игровое ядро
   - `js/digital-entities.js` — банк вопросов, генерация раундов, scoring, summary.

4. Supabase
   - `supabase/binary_battle_schema.sql` содержит целевую структуру таблиц:
     - `profiles`, `questions`, `question_variants`, `solo_runs`, `solo_run_answers`,
       `leaderboard_entries`, `seasons`, `lobbies`, `lobby_players`, `lobby_rounds`,
       `lobby_answers`, `achievements`, `user_achievements`, `question_flags`;
   - добавлены индексы и RLS-политики.

## Применение SQL

1. Откройте SQL Editor в Supabase.
2. Выполните `supabase/leaderboard.sql` (если legacy-таблица ещё нужна).
3. Выполните `supabase/binary_battle_schema.sql`.

## Подробно: что нужно сделать вручную

Ниже — практический чеклист, который нужно выполнить руками после выкладки кода.

### 1) Применить SQL-структуру в Supabase

1. Откройте проект в Supabase → **SQL Editor**.
2. Запустите `supabase/leaderboard.sql`, если хотите сохранить обратную совместимость со старой таблицей `leaderboard`.
3. Запустите `supabase/binary_battle_schema.sql`.
4. Проверьте в **Table Editor**, что появились таблицы:
   - `profiles`, `questions`, `question_variants`
   - `solo_runs`, `solo_run_answers`, `leaderboard_entries`
   - `seasons`
   - `lobbies`, `lobby_players`, `lobby_rounds`, `lobby_answers`
   - `achievements`, `user_achievements`, `question_flags`.

### 2) Проверить профильные данные пользователей

Для корректного лидерборда нужны `nickname` и `age_group`.

1. Убедитесь, что у существующих пользователей заполнены поля `profiles.nickname` и `profiles.age_group`.
2. `age_group` должен быть строго одним из значений:
   - `10-16`
   - `16+`
3. Если у старых пользователей заполнены только `username`/`birth_date`, сделайте one-time миграцию:
   - заполните `nickname` из `username`, где это возможно;
   - заполните `age_group` по вашей бизнес-логике (или вручную для критичных аккаунтов).

### 3) Заполнить банк вопросов (обязательно для реального запуска)

Сейчас в коде есть локальный JS-банк вопросов, но для production-регулирования нужно иметь данные в БД.

1. Добавьте вопросы в `questions`:
   - `type` (`domain` / `telegram` / `email` / `url`)
   - `prompt`
   - `correct_answer` (`legit` или `fake`)
   - `explanation`
   - `difficulty` (1..3)
   - `is_active = true`.
2. Для каждого вопроса добавьте варианты в `question_variants`, минимум 2:
   - `label='Legit', value='legit', is_correct=true/false`
   - `label='Fake', value='fake', is_correct=true/false`.
3. Проверьте, что неактивные вопросы имеют `is_active=false` и не участвуют в выдаче.

### 4) Проверить RLS и права доступа (очень важно)

1. В Supabase → **Authentication** создайте тестового пользователя.
2. Под этим пользователем проверьте:
   - запись в `solo_runs`, `solo_run_answers`, `leaderboard_entries` проходит;
   - чужие приватные данные не редактируются;
   - публичное чтение лидерборда и минимальных полей профиля работает.
3. Если используете Edge Functions или service role — убедитесь, что service ключ не утекает в клиент.

### 5) Настроить сезонность (опционально, но рекомендуется)

1. Создайте запись в `seasons` с `is_active=true`.
2. Обновите серверную/клиентскую логику (если требуется), чтобы новые записи в `leaderboard_entries` получали `season_id`.
3. Закройте прошлый сезон (`is_active=false`) и проверьте, что фильтрация по сезону работает корректно.

### 6) Проверить турнирный режим вживую (минимум 2 клиента)

1. Откройте два браузера/профиля (или браузер + инкогнито).
2. Создайте комнату в `signal-or-fake-tournament.html`.
3. Зайдите вторым клиентом по коду комнаты.
4. Запустите матч и убедитесь, что:
   - игроки видят прогресс;
   - финишные результаты передаются через realtime;
   - итоговая таблица отображается корректно.

### 7) Проверить главную страницу и leaderboard-виджет

1. На `index.html` убедитесь, что:
   - есть карточка Signal or Fake;
   - есть блок лидерборда;
   - переключение `10-16` / `16+` обновляет таблицу.
2. Убедитесь, что при пустых данных показывается корректное empty-state сообщение.
3. Проверьте, что в лидерборде не отображаются приватные поля (например, дата рождения).

### 8) Обновить/проверить эксплуатационные настройки

1. Убедитесь, что URL и anon key Supabase актуальны для окружения (dev/stage/prod).
2. Проверьте CORS и allowed redirect URLs для `auth.html`.
3. Если есть CDN/кеш, сбросьте кеш для `index.html`, `signal-or-fake-solo.html`, `signal-or-fake-tournament.html`, `js/digital-entities.js`.

### 9) Финальная smoke-проверка перед релизом

1. Войти в аккаунт.
2. Запустить solo-режим (`signal-or-fake-solo.html`) и завершить раунд.
3. Убедиться в записи в:
   - `solo_runs`
   - `solo_run_answers`
   - `leaderboard_entries` (и `leaderboard` для legacy).
4. Открыть `index.html` и убедиться, что новый результат виден в соответствующей возрастной группе.
