## cryptocurrency-exchanger-backend

### Ендпоінти для відгуків:

```
Schema: {
"review": "Good app",
"id": "64eb5ac981281a81a9aff02f",
"status": "pending/accepted/not accepted"
}
```

- `( get/post/delete ) url/api/review/my` => ендпоінти для роботи з власними відгуками авторизованого користувача.
- Один юзер може залишити один відгук - наступні пост запити будуть просто редагувати існуючий його відгук.
- `( get ) url/api/review?page=1` => ендпоінт для отримання усіх відгуків, у яких статус accepted, реалізована пагінація (по 5 елементів на сторінці поки)
- `( patch) url/api/review/:id` => Статус ревью, може змінювати лише адмін
