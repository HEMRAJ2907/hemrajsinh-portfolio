# Hemrajsinh Portfolio

A modern, professional portfolio website with backend analytics and visitor tracking.

## ✨ Features

- 🎨 **Modern UI**: Beautiful dark theme with glassmorphism and animations
- 📊 **Visitor Tracking**: Track who visits your portfolio with detailed analytics
- 🔔 **Email Notifications**: Get notified when someone visits or contacts you
- 📱 **Fully Responsive**: Works perfectly on all devices
- 🔒 **Admin Dashboard**: Manage projects, experience, and view analytics
- 📧 **Contact Form**: Receive messages directly with email notifications
- 🚀 **Easy Deployment**: Ready to deploy on any platform

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Email**: Nodemailer

## 📁 Project Structure

```
hemrajsinh-portfolio/
├── public/                 # Frontend files
│   ├── css/               # Stylesheets
│   ├── js/                # JavaScript files
│   ├── assets/            # Images and other assets
│   ├── index.html         # Homepage
│   ├── about.html         # About page
│   ├── projects.html      # Projects page
│   ├── experience.html    # Experience page
│   ├── contact.html       # Contact page
│   └── admin.html         # Admin dashboard
├── server/                # Backend files
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── utils/             # Utility functions
│   └── index.js           # Server entry point
├── .env.example           # Environment variables template
├── package.json           # Dependencies
└── README.md              # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd hemrajsinh-portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

4. **Start the server**
   ```bash
   npm start
   # Or for development with auto-reload:
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

## ⚙️ Configuration

Edit the `.env` file:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/hemrajsinh_portfolio

# Email notifications (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_TO=notification-email@gmail.com

# Admin login
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-password
```

## 📧 Email Setup (Gmail)

1. Enable 2-Step Verification in your Google Account
2. Generate an App Password: Google Account → Security → App Passwords
3. Use the generated password in `EMAIL_PASS`

## 🔐 Admin Dashboard

Access: `http://localhost:3000/admin.html`

Default credentials:
- Username: `admin`
- Password: `hemraj2026`

**Change these in production!**

## 📦 Deployment

### Option 1: Vercel/Render

1. Push to GitHub
2. Connect to Vercel/Render
3. Set environment variables
4. Deploy!

### Option 2: VPS/Server

1. Clone repository on server
2. Install dependencies
3. Set up PM2 for process management
4. Configure Nginx as reverse proxy
5. Set up SSL with Let's Encrypt

## 🎨 Customization

### Adding Your Information

1. Update personal details in HTML files
2. Replace placeholder images in `public/assets/images/`
3. Add your projects through the admin dashboard or API
4. Add your experience through the admin dashboard or API

### Adding Projects via API

```bash
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Project",
    "shortDescription": "A brief description",
    "description": "Full description",
    "category": "web",
    "technologies": ["React", "Node.js"],
    "liveUrl": "https://example.com",
    "githubUrl": "https://github.com/...",
    "featured": true
  }'
```

## 📄 License

MIT License - feel free to use for your own portfolio!

## 👤 Author

**Hemrajsinh**

---

⭐ Star this repo if you found it helpful!
