# 🚀 How to Start Sihabi Cars Application

## ⚠️ IMPORTANT: You Need to Run BOTH Frontend AND Backend

Your application has two parts:
1. **Frontend** (React/Vite) - Port 5173
2. **Backend** (Node.js/Express) - Port 4000

Both must be running for the app to work!

---

## 🎯 Quick Start (Recommended)

### Option 1: Run Both Together (One Command)

```bash
npm run dev:all
```

This will start:
- ✅ Backend server on http://localhost:4000
- ✅ Frontend on http://localhost:5173

---

## 🔧 Manual Start (Two Terminals)

### Terminal 1: Start Backend Server

```bash
npm run server
```

You should see:
```
⏰ Reminder scheduler started (runs every hour)
Server running on http://localhost:4000
```

### Terminal 2: Start Frontend

```bash
npm run dev
```

You should see:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

---

## ✅ Verify Everything is Running

### Check Backend:
```bash
curl http://localhost:4000/api/health
```

Should return: `{"status":"ok"}`

### Check Frontend:
Open browser: http://localhost:5173

---

## 🐛 Troubleshooting

### "Failed to fetch" error when logging in?
**Problem:** Backend server is not running  
**Solution:** Start the backend server with `npm run server`

### Port already in use?
**Problem:** Another process is using port 4000 or 5173  
**Solution:** 
```bash
# Kill process on port 4000
lsof -ti:4000 | xargs kill -9

# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

### Database errors?
**Problem:** Database file missing or corrupted  
**Solution:** Delete and restart server (it will recreate)
```bash
rm server/wheelie.db
npm run server
```

---

## 📝 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start frontend only (Vite) |
| `npm run server` | Start backend only (Node.js) |
| `npm run dev:all` | Start both frontend + backend |
| `npm run build` | Build for production |
| `npm run test:email` | Test email notifications |

---

## 🔍 What Each Server Does

### Backend (Port 4000)
- Handles authentication (login/register)
- Manages database (SQLite)
- Processes bookings
- Sends email notifications
- Provides API endpoints

### Frontend (Port 5173)
- React application
- User interface
- Makes API calls to backend
- Displays data from backend

---

## 🎯 Development Workflow

1. **Start both servers:**
   ```bash
   npm run dev:all
   ```

2. **Open browser:**
   ```
   http://localhost:5173
   ```

3. **Make changes:**
   - Frontend changes: Auto-reload (hot module replacement)
   - Backend changes: Restart server (Ctrl+C, then `npm run server`)

4. **Check logs:**
   - Frontend: Browser console (F12)
   - Backend: Terminal where server is running

---

## 📊 Server Status Check

### Backend Health Check:
```bash
curl http://localhost:4000/api/health
```

### Test Login API:
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@drivex.com","password":"admin1234"}'
```

Should return a token and user object.

---

## 🔐 Default Admin Credentials

**Email:** admin@drivex.com  
**Password:** admin1234

(Change these in `.env` file)

---

## 🚨 Common Errors

### Error: "Failed to fetch"
- ❌ Backend not running
- ✅ Run: `npm run server`

### Error: "EADDRINUSE: address already in use"
- ❌ Port already taken
- ✅ Kill the process or change port

### Error: "Cannot find module"
- ❌ Dependencies not installed
- ✅ Run: `npm install`

### Error: "SMTP error" (emails)
- ❌ Email not configured
- ✅ Add SMTP credentials to `.env` (see EMAIL_SETUP.md)

---

## 📦 Production Deployment

### Build Frontend:
```bash
npm run build
```

### Start Backend:
```bash
NODE_ENV=production node server/index.js
```

### Serve Frontend:
Use a static file server (nginx, Apache) to serve the `dist/` folder

---

## 💡 Tips

1. **Always run backend first** - Frontend needs it
2. **Check both terminals** - Errors appear in respective terminals
3. **Use `npm run dev:all`** - Easiest way to start everything
4. **Keep terminals open** - Don't close them while developing
5. **Check browser console** - Frontend errors show there

---

## 🆘 Still Having Issues?

1. Check both servers are running
2. Check browser console (F12) for errors
3. Check backend terminal for errors
4. Verify ports 4000 and 5173 are free
5. Try restarting both servers
6. Clear browser cache and localStorage

---

**Ready to start?** Run: `npm run dev:all` 🚀
