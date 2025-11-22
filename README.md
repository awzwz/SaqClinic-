# SAQ Esthetic Clinic Landing

Многостраничный лендинг для SAQ Esthetic Clinic с backend на .NET 8 (minimal API) и frontend на Angular 17. Проект включает:

- посадочную страницу с плавными анимациями и блоками «Косметологические услуги», «Обучение», «Магазин»;
- форму обратной связи с отправкой данных в базу (SQLite) через backend API;
- административную страницу для просмотра всех заявок;
- адаптивный дизайн в фирменной зелёно-золотой палитре;
- готовность к деплою (Docker инструкции) и привязке собственного домена.

## Структура проекта

```
backend/
  SaqClinic.Api/        # ASP.NET Core minimal API + EF Core + SQLite
frontend/
  saq-clinic/          # Angular приложение с лендингом и страницей заявок
```

## Подготовка окружения

1. Установите .NET SDK 8.0 и Node.js LTS (18+).
2. Клонируйте репозиторий и перейдите в корень:
   ```bash
   git clone <repo-url>
   cd SaqClinic-
   ```

## Запуск backend

```bash
cd backend/SaqClinic.Api
# восстановление пакетов и запуск
 dotnet restore
 dotnet run
```

API стартует на `http://localhost:5000` и создаст файл `saqclinic.db` с таблицей заявок.

### Основные эндпоинты

- `GET /api/submissions` — список заявок (сортировка по дате).
- `POST /api/submissions` — создание заявки, ожидает JSON:
  ```json
  {
    "fullName": "Имя",
    "phoneNumber": "+7...",
    "email": "опционально",
    "preferredService": "Услуга",
    "message": "Комментарий"
  }
  ```
- `GET /api/health` — health-check для мониторинга.

## Запуск frontend

```bash
cd frontend/saq-clinic
npm install
npm start
```

Angular dev server слушает `http://localhost:4200`. Все запросы формы направляются на API (`environment.apiBaseUrl`).

## Сборка production версии

```bash
# Angular build
cd frontend/saq-clinic
npm run build

# Backend publish
cd ../../backend/SaqClinic.Api
dotnet publish -c Release -o ../../publish/backend
```

## Docker (опционально)

Создайте файл `docker-compose.yml` (пример):

```yaml
version: '3.8'
services:
  api:
    build: ./backend/SaqClinic.Api
    ports:
      - "5000:8080"
  web:
    build:
      context: ./frontend/saq-clinic
      dockerfile: Dockerfile
    ports:
      - "4200:80"
    depends_on:
      - api
```

*Примечание:* добавьте production Dockerfile для Angular (ng build → Nginx) и для API (dotnet publish).

## Привязка домена

1. Разверните фронтенд (например, на Vercel/Netlify или собственном сервере с Nginx).
2. Настройте backend на VPS/PAAS (Azure App Service, Render и т.д.), убедитесь в корректной конфигурации CORS и HTTPS.
3. В DNS панели домена создайте A/AAAA записи, указывающие на IP сервера, и/или CNAME на хостинг фронтенда.
4. Обновите `environment.prod.ts`, указав реальный URL API, и пересоберите приложение.

## Лицензия

Проект предоставлен «как есть». Все права на фирменный стиль и контент принадлежат заказчику.
