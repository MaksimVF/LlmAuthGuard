# Auth Service - Микросервис Аутентификации

## Описание

Микросервис аутентификации на TypeScript для проекта агрегатора доступа к LLM через API Gateway (Kong). Предоставляет полный набор функций для регистрации, входа в систему и управления пользователями.

## Технологии

- **TypeScript** - для типизации и безопасности кода
- **Express.js 4.x** - веб-фреймворк
- **Prisma** - ORM для работы с базой данных
- **PostgreSQL** - база данных
- **JWT** - токены для аутентификации
- **Argon2** - хеширование паролей
- **Express-validator** - валидация входных данных

## Функциональность

### Эндпоинты

1. **POST /auth/register** - Регистрация нового пользователя
   - Поля: `email`, `password`
   - Возвращает: JWT токен в HttpOnly cookie

2. **POST /auth/login** - Вход в систему
   - Поля: `email`, `password`
   - Возвращает: JWT токен в HttpOnly cookie

3. **POST /auth/logout** - Выход из системы
   - Очищает HttpOnly cookie

4. **GET /auth/me** - Получение информации о текущем пользователе
   - Требует авторизации
   - Возвращает: id, email, роль, дату создания

5. **GET /health** - Проверка состояния сервиса

### Роли пользователей

- **USER** - обычный пользователь (по умолчанию)
- **ADMIN** - администратор

### Безопасность

- Хеширование паролей с помощью Argon2
- JWT токены с временем жизни 1 час
- HttpOnly cookies для предотвращения XSS атак
- Валидация всех входных данных
- Rate limiting для предотвращения атак
- Helmet для установки безопасных заголовков
- CORS для контроля доступа

## Установка и запуск

### Локальная разработка

1. Установите зависимости:
```bash
npm install
```

2. Настройте переменные окружения (создайте `.env` файл):
```env
DATABASE_URL="postgresql://username:password@localhost:5432/auth_db"
JWT_SECRET="your-super-secret-jwt-key-at-least-32-characters-long"
NODE_ENV="development"
PORT=5000
ALLOWED_ORIGINS="http://localhost:3000,http://localhost:5000"
```

3. Настройте базу данных:
```bash
npx prisma generate
npx prisma db push
```

4. Запустите сервис:
```bash
npm run dev
```

### Сборка для продакшена

```bash
npm run build
npm start
```

## Развертывание в Docker

```bash
# Создание образа
docker build -t auth-service .

# Запуск контейнера
docker run -p 5000:5000 \
  -e DATABASE_URL="your-database-url" \
  -e JWT_SECRET="your-jwt-secret" \
  -e NODE_ENV="production" \
  auth-service
```

## Интеграция с Kong API Gateway

Для интеграции с Kong API Gateway используйте следующие настройки:

```json
{
  "name": "auth-service",
  "url": "http://auth-service:5000",
  "plugins": [
    {
      "name": "cors"
    },
    {
      "name": "rate-limiting",
      "config": {
        "minute": 100
      }
    }
  ]
}
```

## Примеры использования

### Регистрация пользователя

```bash
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password123!"
  }'
```

### Вход в систему

```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password123!"
  }' -c cookies.txt
```

### Получение информации о пользователе

```bash
curl -X GET http://localhost:5000/auth/me -b cookies.txt
```

### Выход из системы

```bash
curl -X POST http://localhost:5000/auth/logout -b cookies.txt
```

## Структура проекта

```
src/
├── config/         # Конфигурация
├── middleware/     # Middleware для Express
├── routes/         # Маршруты API
├── services/       # Бизнес-логика
├── types/          # TypeScript типы
├── utils/          # Вспомогательные функции
├── app.ts          # Настройка Express приложения
└── server.ts       # Точка входа

prisma/
└── schema.prisma   # Схема базы данных

Dockerfile          # Конфигурация Docker
.env.example        # Пример переменных окружения
```

## Переменные окружения

| Переменная | Обязательная | Описание |
|------------|-------------|----------|
| `DATABASE_URL` | Да | URL подключения к PostgreSQL |
| `JWT_SECRET` | Да | Секретный ключ для JWT (мин. 32 символа) |
| `NODE_ENV` | Нет | Окружение (development/production) |
| `PORT` | Нет | Порт для запуска сервиса (по умолчанию 5000) |
| `ALLOWED_ORIGINS` | Нет | Разрешенные CORS origins |

## Мониторинг

Сервис предоставляет эндпоинт `/health` для проверки состояния:

```json
{
  "status": "healthy",
  "timestamp": "2025-07-08T08:35:05.434Z",
  "service": "auth-service",
  "version": "1.0.0"
}
```

## Логирование

Все ошибки логируются в консоль с подробной информацией:
- Сообщение об ошибке
- Stack trace
- URL запроса
- HTTP метод
- Временная метка

## Разработка

### Доступные скрипты

- `npm run dev` - Запуск в режиме разработки
- `npm run build` - Сборка TypeScript
- `npm start` - Запуск собранного приложения
- `npm run lint` - Проверка кода с ESLint
- `npm run format` - Форматирование кода с Prettier

### Архитектура

Сервис построен по принципу разделения ответственности:
- **Routes** - обработка HTTP запросов
- **Services** - бизнес-логика
- **Middleware** - аутентификация и валидация
- **Config** - конфигурация приложения

## Лицензия

ISC License