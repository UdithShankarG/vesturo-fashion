# Vesturo Fashion Platform - Deployment Guide

## 🚀 Production Deployment

### Prerequisites

1. **Node.js** (v18 or higher)
2. **MongoDB Atlas** account or MongoDB instance
3. **Cloudinary** account for image storage
4. **Domain name** (optional but recommended)

### Environment Setup

1. **Backend Environment Variables**
   ```bash
   cp backend/.env.production backend/.env
   ```
   
   Update the following variables in `backend/.env`:
   ```env
   NODE_ENV=production
   MONGODB_URI=your-production-mongodb-uri
   JWT_SECRET=your-super-secure-jwt-secret-minimum-32-chars
   CLOUDINARY_CLOUD_NAME=your-cloudinary-name
   CLOUDINARY_API_KEY=your-cloudinary-key
   CLOUDINARY_API_SECRET=your-cloudinary-secret
   ```

2. **Frontend Configuration**
   Update `frontend/vite.config.js` for production:
   ```javascript
   export default defineConfig({
     plugins: [react()],
     build: {
       outDir: 'dist',
       sourcemap: false,
       minify: 'terser',
       rollupOptions: {
         output: {
           manualChunks: {
             vendor: ['react', 'react-dom'],
             mui: ['@mui/material', '@mui/icons-material']
           }
         }
       }
     }
   });
   ```

### Deployment Options

#### Option 1: Traditional VPS/Server Deployment

1. **Install Dependencies**
   ```bash
   npm run install:all
   ```

2. **Build Frontend**
   ```bash
   npm run build
   ```

3. **Start Production Server**
   ```bash
   npm run production:start
   ```

4. **Process Manager (PM2)**
   ```bash
   npm install -g pm2
   pm2 start backend/server.js --name "vesturo-api"
   pm2 startup
   pm2 save
   ```

#### Option 2: Docker Deployment

1. **Build Docker Image**
   ```bash
   docker build -t vesturo-app .
   ```

2. **Run with Docker Compose**
   ```bash
   docker-compose up -d
   ```

#### Option 3: Cloud Platform Deployment

**Heroku:**
1. Create Heroku app
2. Set environment variables in Heroku dashboard
3. Deploy using Git or GitHub integration

**Vercel (Frontend) + Railway/Render (Backend):**
1. Deploy frontend to Vercel
2. Deploy backend to Railway or Render
3. Update CORS settings in backend

**DigitalOcean App Platform:**
1. Connect GitHub repository
2. Configure build and run commands
3. Set environment variables

### Database Setup

1. **MongoDB Atlas**
   - Create cluster
   - Create database user
   - Whitelist IP addresses
   - Get connection string

2. **Initial Data**
   ```bash
   # Create admin user (run once)
   node backend/scripts/createAdmin.js
   ```

### Security Checklist

- [ ] Environment variables are secure
- [ ] JWT secret is strong (32+ characters)
- [ ] CORS is configured for production domain
- [ ] Rate limiting is enabled
- [ ] HTTPS is configured
- [ ] Database access is restricted
- [ ] File upload limits are set

### Performance Optimization

1. **Frontend**
   - Gzip compression enabled
   - Images optimized
   - Code splitting implemented
   - CDN for static assets (optional)

2. **Backend**
   - Database indexes created
   - Response caching
   - Image compression via Cloudinary

### Monitoring

1. **Health Checks**
   - `/api/health` endpoint
   - Database connectivity
   - External service availability

2. **Logging**
   - Error tracking (Sentry recommended)
   - Performance monitoring
   - User analytics

### Backup Strategy

1. **Database Backups**
   - MongoDB Atlas automatic backups
   - Manual export scripts

2. **File Backups**
   - Cloudinary automatic storage
   - Local upload folder backup

### SSL Certificate

1. **Let's Encrypt (Free)**
   ```bash
   sudo certbot --nginx -d yourdomain.com
   ```

2. **Cloudflare (Recommended)**
   - Free SSL/TLS encryption
   - CDN and DDoS protection
   - Performance optimization

### Domain Configuration

1. **DNS Settings**
   ```
   A Record: @ -> Your server IP
   CNAME: www -> yourdomain.com
   ```

2. **Nginx Configuration** (if using)
   ```nginx
   server {
     listen 80;
     server_name yourdomain.com www.yourdomain.com;
     return 301 https://$server_name$request_uri;
   }

   server {
     listen 443 ssl;
     server_name yourdomain.com www.yourdomain.com;
     
     location / {
       proxy_pass http://localhost:5000;
       proxy_set_header Host $host;
       proxy_set_header X-Real-IP $remote_addr;
     }
   }
   ```

### Post-Deployment Testing

1. **Functionality Tests**
   - [ ] Homepage loads correctly
   - [ ] Admin login works
   - [ ] Category creation/management
   - [ ] Post creation/management
   - [ ] Image uploads work
   - [ ] Responsive design on mobile

2. **Performance Tests**
   - [ ] Page load times < 3 seconds
   - [ ] Image optimization working
   - [ ] API response times acceptable

3. **Security Tests**
   - [ ] Admin routes protected
   - [ ] File upload restrictions work
   - [ ] Rate limiting active
   - [ ] HTTPS redirect working

### Troubleshooting

**Common Issues:**
1. **CORS Errors**: Update CORS configuration in server.js
2. **Database Connection**: Check MongoDB URI and network access
3. **Image Upload Fails**: Verify Cloudinary credentials
4. **Build Errors**: Check Node.js version compatibility

**Logs Location:**
- Application logs: PM2 logs or container logs
- Error logs: Check console output
- Access logs: Nginx/Apache logs

### Maintenance

1. **Regular Updates**
   - Security patches
   - Dependency updates
   - Performance monitoring

2. **Backup Verification**
   - Test restore procedures
   - Verify data integrity

3. **Performance Monitoring**
   - Database performance
   - Server resource usage
   - User experience metrics
