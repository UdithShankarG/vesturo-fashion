@echo off
echo 🚀 Deploying Vesturo Fashion Website to GitHub...

REM Initialize git repository
git init

REM Add all files
git add .

REM Create initial commit
git commit -m "🌟 Initial commit: Vesturo Fashion Platform with SEO optimization for Google #1 ranking

✨ Features:
- Modern React frontend with dark theme
- Node.js backend with MongoDB
- Admin panel for content management
- Cloudinary image storage
- SEO optimized for fashion keywords
- Mobile-responsive design
- Instagram-style interface

🎯 SEO Optimizations:
- Meta tags for fashion keywords
- Structured data markup
- XML sitemap
- Robots.txt
- Open Graph tags
- Performance optimized

🚀 Ready for deployment to Vercel + Render"

REM Add remote repository
git remote add origin https://github.com/UdithShankarG/vesturo-fashion.git

REM Push to GitHub
git branch -M main
git push -u origin main

echo ✅ Successfully deployed to GitHub!
echo 🌐 Repository: https://github.com/UdithShankarG/vesturo-fashion
echo 📋 Next: Deploy to Vercel and Render for live website

pause
