# 🔥 FLAMES - AI Love Analyzer

A modern web application that uses the FLAMES algorithm to analyze romantic compatibility between two people. Built with React, Vite, Firebase Authentication, and Firebase Realtime Database.

## ✨ Features

- **FLAMES Algorithm** - Classic relationship compatibility test with modern UI
- **User Authentication** - Secure login/signup with Firebase Auth
- **Cloud History** - Save all analyses to Firebase Realtime Database
- **Spinning Wheel** - Animated wheel spin reveals your destiny
- **AI-Powered Messages** - Generate personalized love/roast messages
- **Multiple Modes** - Normal mode or fun Roast mode
- **User Levels** - Unlock levels based on analyses count
- **Daily Challenges** - Daily streak tracking system
- **Responsive Design** - Mobile-friendly glassmorphic UI
- **Result Sharing** - Download results, share on WhatsApp/Twitter
- **Dark Theme** - Beautiful gradient dark mode interface

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: CSS3 (Glassmorphism, Gradients, Animations)
- **Authentication**: Firebase Authentication
- **Database**: Firebase Realtime Database
- **Build Tool**: Vite (lightning-fast builds)
- **UI Effects**: Confetti animations, particle effects, smooth transitions

## 📋 Prerequisites

- Node.js 16+ and npm
- Firebase project with Realtime Database enabled
- Git

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/flames.git
cd flames
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Firebase

Create a `.env` file in the root directory with your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_DATABASE_URL=https://your_project-default-rtdb.region.firebasedatabase.app
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Set Up Firebase Rules

In Firebase Console → Realtime Database → Rules, add:

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "auth != null && auth.uid === $uid",
        ".write": "auth != null && auth.uid === $uid"
      }
    }
  }
}
```

### 5. Start Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 6. Build for Production
```bash
npm run build
```

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── Home.jsx         # Landing page
│   ├── Login.jsx        # Login screen
│   ├── Signup.jsx       # Signup screen
│   ├── InputForm.jsx    # Name input form
│   ├── Loader.jsx       # Loading animation
│   ├── FlamesWheel.jsx  # Spinning wheel
│   ├── ResultCard.jsx   # Results display
│   ├── History.jsx      # Saved analyses
│   └── ...
├── context/             # React Context
│   └── AuthContext.jsx  # Authentication state
├── firebase/            # Firebase config
│   └── config.js        # Firebase setup
├── services/            # API services
│   └── firestoreService.js  # Realtime DB operations
├── utils/               # Utilities
│   └── flames.js        # FLAMES algorithm & helpers
├── App.jsx              # Main app component
└── main.jsx             # Entry point
```

## 🎮 How to Use

1. **Sign Up** - Create an account with email and password
2. **Enter Names** - Input two people's names
3. **Choose Mode** - Select Normal or Roast mode
4. **Analyze** - Click "Analyze ❤️" to run FLAMES algorithm
5. **Spin Wheel** - Watch the animated wheel reveal your result
6. **View Result** - See love score, AI message, and stats
7. **Share** - Download image or share on social media
8. **View History** - Check all your past analyses

## 🔐 Authentication Flow

- **Signup**: Creates account and signs user out (must login to continue)
- **Login**: Returns to home after successful login
- **Logout**: Clears session and returns to login screen
- **Forgot Password**: Send reset email via Firebase

## 💾 Data Storage

### Realtime Database Structure
```
users/
└── {userId}/
    └── history/
        └── {autoId}/
            ├── name1: string
            ├── name2: string
            ├── result: string (Friends|Lovers|Affection|Marriage|Enemies|Siblings)
            ├── timestamp: number (server timestamp in ms)
            └── humanReadableTime: string (e.g. "Mar 21, 2026 02:30 PM")
```

## 🎯 FLAMES Results

- **F** 🤝 Friends - You share a beautiful bond
- **L** ❤️ Lovers - Intense romantic chemistry
- **A** 💕 Affection - Warm, tender connection
- **M** 💍 Marriage - Soulmate-level compatibility
- **E** ⚔️ Enemies - Passionate conflict
- **S** 👫 Siblings - Familial bond

## 🎨 UI Components

- **Glassmorphic Cards** - Frosted glass effect backgrounds
- **Gradient Animations** - Smooth color transitions
- **Confetti Effects** - Celebration particle animations
- **Smooth Page Transitions** - Fade in/out animations
- **Responsive Grid** - Mobile and desktop layouts

## 🚨 Security Notes

- Keep `.env` file private and never commit to git
- Firebase rules restrict database access to authenticated users only
- Each user can only read/write their own data
- Passwords are hashed by Firebase Authentication

## 🐛 Troubleshooting

### Data Not Saving?
1. Verify `.env` includes `VITE_FIREBASE_DATABASE_URL`
2. Check Firebase Realtime Database rules are published
3. Ensure user is logged in before analyzing
4. Check browser console for Firebase errors

### Wheel Stuck?
1. Check browser console for errors
2. Ensure result calculation completed
3. Try refreshing the page

### Login Issues?
1. Verify Firebase project is active
2. Check credentials in `.env`
3. Clear browser cache and try again

## 📝 License

This project is licensed under the MIT License - see LICENSE file for details.

## 👨‍💻 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For issues and questions, please open a GitHub Issue or contact the development team.

## 🙏 Acknowledgments

- FLAMES algorithm - Classic relationship test
- Firebase - Backend infrastructure
- React - UI library
- Vite - Build tool
- Glassmorphism design inspiration

---

Made with ❤️ by the FLAMES team

⭐ If you found this helpful, please give it a star!
