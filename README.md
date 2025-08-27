# ☕️ Chaya Kada

**Chaya Kada** is a real-time virtual "tea shop" web app. Users can:
- Find and chat with strangers (anonymously, or as friends)
- Create private benches for friends
- Earn coins through daily challenges
- Purchase and share virtual items (like Chai, Snacks!)
- Manage profiles, avatars, and more

---

## 🚀 Features

- 🔗 **Find a Stranger & Chat**: Instantly connect, 1-on-1, in a safe and anonymous environment.
- 👥 **Private Benches**: Create or join your own virtual adda!
- 🏆 **Daily Challenges**: Earn coins for logging in, making friends, and more.
- 🛍️ **Virtual Shop**: Buy, collect, and share items (Chai, Snacks, Gifts).
- 🏅 **Profile & Avatars**: Track coins, activity, and personalize your presence.

---

## 📦 Tech Stack

- **Backend**: Django, Django Channels (WebSockets)
- **Frontend**: HTML, CSS, JavaScript
- **Database**: PostgreSQL (production) or SQLite (dev)
- **Real-time**: Redis (for WebSockets, matchmaking, presence)
- **Deployment**: Render, Docker

---
git clone https://github.com/MrWings22/chaya_kada.git
cd chaya_kada

2. **Set up your environment**
- Copy `.env.example` to `.env` and fill in secrets and DB info.
- Install dependencies:
  ```
  python -m venv venv
  source venv/bin/activate
  pip install -r requirements.txt
  ```

3. **Run migrations**
```
python manage.py migrate
```
4. **Create a superuser**
```
python manage.py createsuperuser
```
5. **(Optional for real-time) Start Redis**

`redis-server`

6. **Run the server**
```
python manage.py runserver
```
Then visit http://127.0.0.1:8000/

---

## 🌍 Production Deployment

- **Render**:
1. Set environment variables (`DATABASE_URL`, `SECRET_KEY`, etc) in dashboard
2. Add `runtime.txt` or `.python-version` (`python-3.12.10`)
3. Render will pip install & migrate on deploy
4. Start command:  
  ```
  gunicorn chaya_kada.wsgi:application
  ```
  *(or, for Channels/ASGI, use Daphne/Uvicorn)*

- Use `/custom-admin/` for the custom admin dashboard.

---

## 👤 Admin & Management

- Use Django `/admin/` for all core model CRUD.


---

## 💡 Contributing

Pull requests welcome! For major changes, open an issue first.

---

## 🙏 Credits

Chaya Kada by [Albin Thomas](mailto:albinthomas6210@gmail.com)  
Inspired by Kerala tea-shop vibes ☕️

---

## 📄 License

MIT License (see LICENSE)


## ⚡️ Quickstart (Local Dev)

1. **Clone the repo**
