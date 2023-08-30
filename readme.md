## cryptocurrency-exchanger-backend

### Ендпоінти для відгуків:

```
Schema: {
    "_id": "64ec91a6a3ffc1c8e78cf255",
    "review": "Good good",
    "status": "pending",
    "owner": {
        "_id": "64eba0aeb684e6205be8b91f",
        "email": "ddd@eіxample.com",
        "name": "User Name",
        "role": "admin",
        "createdAt": "2023-08-27T19:14:54.929Z"
    },
    "createdAt": "2023-08-28T12:23:02.807Z",
    "updatedAt": "2023-08-28T14:27:31.431Z"
},
```

- `( get/post/delete ) url/api/review/my` => ендпоінти для роботи з власними відгуками авторизованого користувача.
- Один юзер може залишити один відгук - наступні пост запити будуть просто редагувати існуючий його відгук.
- `( get ) url/api/review?page=1` => ендпоінт для отримання усіх відгуків, у яких статус accepted, реалізована пагінація (по 5 елементів на сторінці поки)
- `( patch) url/api/review/:id` => Статус ревью, може змінювати лише адмін

- `http://localhost:3001/api/review` - get all reviews with status pending

- `http://localhost:3001/api/review?status=accepted` - get all reviews with status accepted

- `http://localhost:3001/api/review?status=rejected`- get all reviews with status rejected

- `http://localhost:3001/api/review?status=pending&limit=5` - на сторінці буде по 5 елементів, по дефолту стоїть поки що 2 для зручності тестування. Краще задавати одразу скільки потрібно елементів.
