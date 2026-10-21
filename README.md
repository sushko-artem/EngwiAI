# EngwiAI

## Установка версии Node

- в корне проекта выполнить команду `nvm use` для установки нужной версии node (необходим установленный nvm локально)

## Настройка окружения

1. В корне проекта создать файл `.env` и скопировать туда содержимое файла `.env.example`

## Настройка фронтенда и бэкенда

2. В каждой из папок создать файлы `.env.local`:
   - `frontend/.env.local` - скопировать содержимое `frontend/.env.example`
   - `backend/.env.local` - скопировать содержимое `backend/.env.example`
     \*Если в блоке **AI sentences generation** переменным оставить пустые значения (удалить), для генерации предложений будут использованы моковые данные. Либо использовать собственные AI API.

## Разработка (команды выполнять в корне проекта)

- `npm run dev:up` - запустить приложение
  В ходе сборки проекта будет создан "User" (с коллекциями).
  Учетные данные для входа в приложение, используя учетную запись "User":
  _email_: **dev@example.com**
  _password_: **qwerty**
- `npm run dev:down` - остановить работу приложения (docker compose down)
- `npm run dev:rebuild` - пересобрать
- `npm run dev:frontend` - пересобрать только фронт
- `npm run dev:backend` - пересобрать только бэк
- `npm run dev:reset` - сбросить тома и пересобрать
- `npm run migrate --<имя миграции>` - после внесения изменений в схеме Prisma
  Команды в package.json корня проекта.

## Приложение будет доступно по адресу:

- localhost:${APP_EXTERNAL_PORT} из корневого **.env**

## Фронтенд:

- localhost:${FRONTEND_EXTERNAL_PORT} из корневого **.env**

## Бэкенд:

- localhost:${BACKEND_EXTERNAL_PORT} из корневого **.env**

## База данных pgAdmin:

- localhost:${PGADMIN_EXTERNAL_PORT} из корневого **.env**
