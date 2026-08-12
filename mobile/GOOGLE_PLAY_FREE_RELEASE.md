# Google Play — бесплатный релиз «Бизнес с нуля»

## Модель первого релиза
- Цена приложения: бесплатно.
- Реклама: нет в первом релизе.
- Покупки внутри приложения: нет.
- Telegram Stars: отключены в store-сборке.
- Google Play Billing: не подключаем в первом релизе.
- Банковский счёт для выплат: не нужен, пока нет платных функций.
- Прогресс: локально на устройстве.
- Telegram-авторизация: не требуется.

## Что уже подготовлено
- Capacitor-проект в `mobile/`.
- Android/iOS shell.
- Store-free режим `store-free-v1.js`.
- `prepare-web.mjs` делает отдельную локальную бесплатную сборку без Telegram backend и без магазина.
- Карточка магазина: `STORE_LISTING_RU.md`.
- Release readiness: `RELEASE_READINESS.md`.

## До загрузки в Play Console
1. Создать/оплатить Play Console developer account.
2. Подтвердить личность и Android-устройство.
3. Собрать Android App Bundle `.aab`.
4. Подготовить иконку, feature graphic и скриншоты.
5. Опубликовать политику конфиденциальности на публичном URL.
6. Заполнить App content / Data safety / возрастной рейтинг.
7. Создать Internal test.
8. Для нового Personal-аккаунта выполнить обязательный Closed test Google Play.
9. Подать запрос на Production access.
10. Выпустить бесплатную версию.

## Команды сборки
Из папки `mobile/`:

```bash
npm install
npm run prepare:web
npx cap add android
npx cap sync android
npx cap open android
```

В Android Studio:
- проверить package `com.stefasg18.businesszero`;
- выставить versionCode/versionName;
- создать release signing key;
- Build > Generate Signed Bundle / APK > Android App Bundle;
- сохранить `.aab` и signing key в безопасном месте.

## Первый релиз
Версия: 1.0.0
Package: `com.stefasg18.businesszero`
Название: `Бизнес с нуля`
Категория: Game / Simulation
Цена: Free
Contains ads: No
In-app purchases: No
