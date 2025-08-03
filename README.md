# 🌟 Vesturo - Fashion Affiliate Marketing Platform

**🚀 LIVE WEBSITE:** https://vesturo-fashion.vercel.app
**👨‍💼 ADMIN PANEL:** https://vesturo-fashion.vercel.app/udishrav/U-admin

A complete, modern fashion affiliate marketing website with Instagram integration, built with React, Node.js, and MongoDB. **SEO optimized to rank #1 on Google for fashion keywords.**

## ✨ Features

### 🎨 **Modern Design**

- **Dark Theme**: Consistent black gradient theme (#000000 to #1a1a1a)
- **Glass Morphism**: Modern UI with blur effects and transparency
- **Responsive Design**: Perfect across all devices (mobile, tablet, desktop)
- **Custom Animations**: Smooth transitions and micro-interactions

### 👤 **User Experience**

- **Instagram-Style Interface**: Familiar social media layout
- **9:16 Image Ratios**: Optimized for modern content consumption
- **Category-Based Navigation**: Easy content discovery
- **Post Engagement**: Like, share, and view functionality
- **Affiliate Links**: Integrated shopping experience

### 🔐 **Admin Panel**

- **Secure Authentication**: JWT-based admin login
- **Content Management**: Create, edit, delete posts and categories
- **Image Upload**: Cloudinary integration for optimized storage
- **Real-time Updates**: Instant content publishing
- **Analytics Dashboard**: Track engagement and performance

### 🚀 **Technical Excellence**

- **Modern Stack**: React 18, Node.js, Express, MongoDB
- **Security First**: Helmet, rate limiting, CORS protection
- **Performance Optimized**: Compression, caching, lazy loading
- **Production Ready**: Docker support, CI/CD ready
- **SEO Friendly**: Meta tags, structured data

## 🛠️ Tech Stack

### Frontend

- **React 18** with Hooks and Context API
- **Material-UI (MUI)** for components
- **Vite** for fast development and building
- **Zustand** for state management
- **React Router** for navigation

### Backend

- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Cloudinary** for image storage
- **Helmet** for security headers
- **Express Rate Limit** for API protection

### DevOps & Deployment

- **Docker** containerization
- **Docker Compose** for multi-service setup
- **PM2** for process management
- **Nginx** for reverse proxy (optional)

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Cloudinary account

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd vesturo-project
   ```

2. **Install all dependencies**

   ```bash
   npm run install:all
   ```

3. **Environment Setup**

   ```bash
   cp backend/.env.production backend/.env
   ```

   Update `backend/.env` with your credentials:

   ```env
   MONGODB_URI=your-mongodb-connection-string
   JWT_SECRET=your-super-secure-jwt-secret-32-chars-minimum
   CLOUDINARY_CLOUD_NAME=your-cloudinary-name
   CLOUDINARY_API_KEY=your-cloudinary-key
   CLOUDINARY_API_SECRET=your-cloudinary-secret
   ```

4. **Start Development**

   ```bash
   npm run dev
   ```

5. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Admin Panel: http://localhost:3000/udishrav/U-admin

### Default Admin Credentials

- **Email**: udithshankar5@gmail.com
- **Password**: (Set during first setup)

## 📁 Project Structure

```
vesturo-project/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── store/          # Zustand state management
│   │   ├── utils/          # Utility functions
│   │   └── App.jsx         # Main app component
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
├── backend/                 # Node.js backend API
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API route handlers
│   ├── middleware/         # Custom middleware
│   ├── uploads/            # Local file uploads
│   └── server.js           # Express server
├── docker-compose.yml      # Docker services configuration
├── Dockerfile             # Container build instructions
└── package.json           # Root package configuration
```

## 🔧 Configuration

### Environment Variables

**Backend (.env)**

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/vesturo

# Authentication
JWT_SECRET=your-jwt-secret-minimum-32-characters
JWT_EXPIRE=7d

# File Storage
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Security
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
MAX_FILE_SIZE=10485760
```

### Admin Routes

- `/udishrav/U-admin` - Admin login
- `/udishrav/U-admin/dashboard` - Admin dashboard
- `/udishrav/U-admin/dashboard/categories` - Category management
- `/udishrav/U-admin/dashboard/create-post` - Post creation
- `/udishrav/U-admin/dashboard/all-posts` - Post management

## 🧪 Testing

### Run Production Tests

```bash
node test-production.js
```

### Manual Testing Checklist

- [ ] Homepage loads correctly
- [ ] Category navigation works
- [ ] Post viewing and interactions
- [ ] Admin login functionality
- [ ] Content management (CRUD operations)
- [ ] Image uploads work
- [ ] Responsive design on all devices
- [ ] Performance (< 3s load times)

## 🚀 Deployment

### Option 1: Traditional Server

```bash
npm run production:setup
npm run production:start
```

### Option 2: Docker

```bash
docker-compose up -d
```

### Option 3: Cloud Platforms

- **Vercel/Netlify**: Frontend deployment
- **Heroku/Railway**: Backend deployment
- **DigitalOcean**: Full-stack deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

## 🔒 Security Features

- **Helmet.js**: Security headers
- **Rate Limiting**: API protection
- **CORS**: Cross-origin request security
- **JWT Authentication**: Secure admin access
- **Input Validation**: Data sanitization
- **File Upload Restrictions**: Size and type limits

## 📈 Performance Optimizations

- **Code Splitting**: Lazy loading of components
- **Image Optimization**: Cloudinary transformations
- **Compression**: Gzip compression enabled
- **Caching**: Browser and API caching
- **Bundle Optimization**: Tree shaking and minification

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- Create an issue on GitHub
- Check the [DEPLOYMENT.md](DEPLOYMENT.md) guide
- Review the troubleshooting section

## 🎯 Production Checklist

- [ ] Environment variables configured
- [ ] Database connection established
- [ ] Cloudinary setup completed
- [ ] Admin user created
- [ ] SSL certificate installed
- [ ] Domain configured
- [ ] Monitoring setup
- [ ] Backup strategy implemented
- [ ] Performance testing completed
- [ ] Security audit passed

---

**Built with ❤️ for the fashion community**
