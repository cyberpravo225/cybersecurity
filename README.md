# Binary Battle (legit/fake edition)

Этот репозиторий содержит веб-проект по кибербезопасности с обновлённой игрой **Binary Battle**:

- одиночный соревновательный режим (`binary-competitive.html`);
- турнирный режим через лобби (`binary-tournament.html`);
- лидерборд на главной (`index.html`) с разделением по `age_group`;
- сохранение результатов в Supabase (новые таблицы + обратная совместимость со старой `leaderboard`).

## Что обновлено

1. Главная страница (`index.html`)
   - добавлена большая карточка Binary Battle;
   - добавлен встроенный leaderboard блок с табами `10-16` / `16+`;
   - загрузка топа сначала из `leaderboard_entries + solo_runs + profiles`, fallback на legacy `leaderboard`.

2. Соревновательный режим (`binary-competitive.html`)
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

## Ручные шаги после деплоя

- Проверить, что в `profiles` у пользователей заполнены `nickname` и `age_group`.
- При желании включить сидирование `questions`/`question_variants` через отдельный migration seed.
- При необходимости настроить сезонность (`seasons`) и логику активного сезона для `leaderboard_entries`.
