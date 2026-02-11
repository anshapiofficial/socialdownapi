# 🚀 Video Downloader API

A powerful media extraction API available in two versions:

* ✅ **Cloudflare Worker (JavaScript)** – Deployable on Cloudflare
* ✅ **Flask API (Python)** – Deployable on VPS / Render / Railway / etc.

This API extracts encrypted media links, decrypts them, and returns direct downloadable video/audio URLs.

---

# 📦 Versions Included

## 1️⃣ Cloudflare Worker Version (JavaScript)

* Edge deployable
* Fast global performance
* No server required
* Suitable for high traffic

## 2️⃣ Flask Version (Python)

* Traditional backend deployment
* Easy to modify & extend
* Can run with Gunicorn / VPS

Both versions provide the same endpoints and logic.

---

# 🌐 API Endpoints

## 🔹 `/`

Returns available endpoint list.

---

## 🔹 `/download?url=VIDEO_URL`

Returns full media result including:

* Title
* All available formats
* Best video
* Best audio
* No watermark video (if available)

### Example:

```
/download?url=https://example.com/video-link
```

---

## 🔹 `/info?url=VIDEO_URL`

Returns only metadata:

* Title
* Total formats
* Available qualities
* Has video / audio boolean

---

## 🔹 `/direct/{type}?url=ENCRYPTED_URL`

Decrypts encrypted URL and returns direct media link.

---

# ⚙️ Installation (Flask Version)

```bash
pip install flask requests
python app.py
```

Production:

```bash
gunicorn -w 4 -b 0.0.0.0:8080 app:app
```

---

# ☁️ Deploying Cloudflare Version

1. Install Wrangler
2. Create Worker
3. Paste JS code
4. Deploy using:

```bash
wrangler deploy
```

---

# 🔥 Features

* Auto title extraction
* Encrypted link decoding
* Best quality auto-detection
* Audio/video separation
* No watermark detection
* CORS enabled
* Developer header included

---

# 🛡 Notes

* Uses third-party media parsing services.
* Add rate limiting for production.
* Recommended to use caching layer.

---

# 👨‍💻 Developer & Credit

**Full Credit:** Ansh API

**Developer:** [https://t.me/anshapi](https://t.me/anshapi)

If you use this project, please keep the credit intact.

---

# 📜 License

This project is provided for educational and research purposes only.
Use responsibly.

---

💎 Built with dedication and clean backend logic.
