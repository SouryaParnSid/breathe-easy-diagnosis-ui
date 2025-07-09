# 🫁✨ Breathe Easy - Pneumonia Detection System ✨🫁

<div align="center">
  <img src="https://em-content.zobj.net/source/microsoft-teams/363/lungs_1fac8.png" width="90" alt="lungs"/>
  <h2 style="color:#7ed6df;">Welcome to <span style="color:#e17055;">Breathe Easy!</span></h2>
  <p style="font-size:1.2em;">Detect pneumonia from chest X-rays in seconds with a friendly, modern web app.<br/>Built for everyone, from doctors to curious minds! 🩺💖</p>
  <br/>
  <img src="https://em-content.zobj.net/source/microsoft-teams/363/face-with-medical-mask_1f637.png" width="60" alt="mask"/>
  <br/>
  <b>Stay healthy, stay curious, and Breathe Easy! 🫁💙</b>
</div>

---

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&pause=1000&color=7ED6DF&center=true&vCenter=true&width=435&lines=AI-powered+X-ray+analysis+with+cuteness!;Fast%2C+friendly%2C+and+fun+to+use!"/>
</p>

---

<div align="center">

![Pastel Badge](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-7ed6df?style=for-the-badge&logo=react)
![Pastel Badge](https://img.shields.io/badge/Backend-Flask%20%2B%20PyTorch-e17055?style=for-the-badge&logo=flask)
![Pastel Badge](https://img.shields.io/badge/Deployed%20on-Render-00b894?style=for-the-badge&logo=render)
![Pastel Badge](https://img.shields.io/badge/Cute%20Factor-100%25-ffb6b6?style=for-the-badge)

</div>

---

## 🐻‍❄️ Meet Breezy, your AI X-ray Buddy!

```
      (\_/)   
     ( •_•)   
    / >🍪   Breezy says: "Upload your X-ray and I'll check it for you!"
```

---

## 🌟✨ Features

- 🖼️ **Drag & Drop X-ray Upload**
- 🤖 **Deep Learning Model (PyTorch CNN)**
- 📊 **Instant Results with Confidence Scores**
- 🎨 **Cute, Modern UI (React + Tailwind CSS)**
- 💬 **Friendly, Encouraging Messages**
- 🔗 **Seamless Frontend-Backend Integration**
- 🌐 **Deployed on Render (Free Tier Ready!)**
- 🧸 **Mascot & Pastel Gradients for Extra Cuteness!**

---

## 🚀 Quick Start

### 1. **Clone the Repo**
```bash
git clone https://github.com/yourusername/breathe-easy-diagnosis-ui.git
cd breathe-easy-diagnosis-ui
```

### 2. **Start Locally (Dev Mode)**
```bash
# Start backend
cd backend
pip install -r requirements.txt
python run.py
# In a new terminal, start frontend
cd ..
npm install
npm run dev
```
- Backend: [http://localhost:5000](http://localhost:5000)
- Frontend: [http://localhost:8080](http://localhost:8080)

### 3. **All-in-One Start (Windows/Linux/Mac)**
```bash
# Windows
start-dev.bat
# Linux/Mac
./start-dev.sh
```

---

## 🗂️ Dataset

- **Source:** [Kaggle - Chest X-Ray Images (Pneumonia)](https://www.kaggle.com/datasets/paultimothymooney/chest-xray-pneumonia)
- **Download:** Handled automatically by the backend using `kagglehub`.
- **Structure:**
  ```
  chest_xray/
    train/
      NORMAL/
      PNEUMONIA/
    val/
      NORMAL/
      PNEUMONIA/
    test/
      NORMAL/
      PNEUMONIA/
  ```

---

## 🏗️ Project Structure

```
breathe-easy-diagnosis-ui/
├── src/           # Frontend (React + TS)
│   ├── components/
│   ├── lib/
│   └── ...
├── backend/       # Backend (Flask + PyTorch)
│   ├── main.py
│   ├── train_model.py
│   └── ...
├── public/
├── package.json
├── render.yaml
└── ...
```

---

## 💻 How to Use (So Easy, Even Breezy Can Do It!)

1. **Upload a chest X-ray image** (PNG/JPG)
2. **Click "Start Analysis"**
3. **Get instant results**: Diagnosis + confidence + cute UI feedback!

---

## 🛠️ Tech Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend:** Flask, PyTorch, Pillow, Flask-CORS
- **Model:** Custom CNN, trained on Kaggle dataset
- **Deployment:** Render (free tier)

---

## 🌈 Deployment

### 🚦 **Live Demo**
- **Frontend:** [https://breathe-easy-ui.onrender.com](https://breathe-easy-ui.onrender.com)
- **Backend:** [https://breathe-easy-diagnosis-ui.onrender.com](https://breathe-easy-diagnosis-ui.onrender.com)

### 📝 **Deploy Your Own**
See [DEPLOYMENT.md](./DEPLOYMENT.md) for step-by-step instructions (free tier friendly!)

---

## 🧸 Cute Touches

- Animated gradients & soft glassmorphism
- Friendly icons and emojis everywhere
- Breezy the Bear as your AI buddy
- Pastel badges and soft color palette
- Encouraging messages for users
- Designed to make medical AI less intimidating!

---

## 🙋 FAQ

**Q: Is my data safe?**
- Yes! Images are processed in-memory and never stored.

**Q: Can I use my own model?**
- Absolutely! Swap out `pneumonia_detection_model.pth` in `backend/`.

**Q: Who is this for?**
- Anyone! Medical students, doctors, or anyone curious about AI in healthcare.

---

## 🦄 Contributing

Pull requests are welcome! For major changes, open an issue first to discuss what you’d like to change.

---

## 📫 Contact

- **Author:** Sourya Sarkar
- **Email:** souryasarkar2003@gmail.com

---

<div align="center">
  <img src="https://em-content.zobj.net/source/microsoft-teams/363/face-with-medical-mask_1f637.png" width="60" alt="mask"/>
  <br/>
  <b>Stay healthy, stay curious, and Breathe Easy! 🫁💙</b>
</div>
