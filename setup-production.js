#!/usr/bin/env node

/**
 * Vesturo Production Setup Script
 * Automated setup for production deployment
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class ProductionSetup {
  constructor() {
    this.envPath = path.join(__dirname, 'backend', '.env');
    this.requiredVars = [
      'MONGODB_URI',
      'JWT_SECRET',
      'CLOUDINARY_CLOUD_NAME',
      'CLOUDINARY_API_KEY',
      'CLOUDINARY_API_SECRET'
    ];
  }

  generateJWTSecret() {
    return crypto.randomBytes(32).toString('hex');
  }

  createProductionEnv() {
    console.log('🔧 Setting up production environment...');
    
    const envContent = `# Vesturo Production Environment
# Generated on ${new Date().toISOString()}

# Server Configuration
PORT=5000
NODE_ENV=production

# Database Configuration
# Replace with your production MongoDB URI
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/vesturo?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=${this.generateJWTSecret()}
JWT_EXPIRE=7d

# Cloudinary Configuration
# Replace with your production Cloudinary credentials
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# CORS Configuration
FRONTEND_URL=http://localhost:3000
PRODUCTION_DOMAIN=https://your-production-domain.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Upload Limits
MAX_FILE_SIZE=10485760
MAX_FILES_PER_REQUEST=10

# Security
BCRYPT_ROUNDS=12
`;

    fs.writeFileSync(this.envPath, envContent);
    console.log('✅ Environment file created at backend/.env');
    console.log('⚠️  Please update the placeholder values with your actual credentials');
  }

  checkDependencies() {
    console.log('📦 Checking dependencies...');
    
    const backendPackage = path.join(__dirname, 'backend', 'package.json');
    const frontendPackage = path.join(__dirname, 'frontend', 'package.json');
    
    if (!fs.existsSync(backendPackage)) {
      console.log('❌ Backend package.json not found');
      return false;
    }
    
    if (!fs.existsSync(frontendPackage)) {
      console.log('❌ Frontend package.json not found');
      return false;
    }
    
    console.log('✅ Package files found');
    return true;
  }

  checkBuildFiles() {
    console.log('🏗️ Checking build files...');
    
    const distPath = path.join(__dirname, 'frontend', 'dist');
    const indexPath = path.join(distPath, 'index.html');
    
    if (!fs.existsSync(distPath)) {
      console.log('❌ Frontend dist directory not found');
      console.log('💡 Run: cd frontend && npm run build');
      return false;
    }
    
    if (!fs.existsSync(indexPath)) {
      console.log('❌ Frontend index.html not found');
      console.log('💡 Run: cd frontend && npm run build');
      return false;
    }
    
    console.log('✅ Build files found');
    return true;
  }

  createStartupScript() {
    console.log('🚀 Creating startup scripts...');
    
    const startScript = `#!/bin/bash
# Vesturo Production Startup Script

echo "🌟 Starting Vesturo Fashion Platform..."

# Check if .env exists
if [ ! -f backend/.env ]; then
    echo "❌ Environment file not found!"
    echo "💡 Run: node setup-production.js"
    exit 1
fi

# Start the application
echo "🚀 Starting backend server..."
cd backend && npm start
`;

    const windowsStartScript = `@echo off
REM Vesturo Production Startup Script for Windows

echo 🌟 Starting Vesturo Fashion Platform...

REM Check if .env exists
if not exist "backend\\.env" (
    echo ❌ Environment file not found!
    echo 💡 Run: node setup-production.js
    exit /b 1
)

REM Start the application
echo 🚀 Starting backend server...
cd backend && npm start
`;

    fs.writeFileSync('start-production.sh', startScript);
    fs.writeFileSync('start-production.bat', windowsStartScript);
    
    // Make shell script executable on Unix systems
    try {
      fs.chmodSync('start-production.sh', '755');
    } catch (e) {
      // Ignore on Windows
    }
    
    console.log('✅ Startup scripts created');
  }

  createDockerIgnore() {
    console.log('🐳 Creating .dockerignore...');
    
    const dockerIgnoreContent = `# Dependencies
node_modules
*/node_modules
npm-debug.log*

# Environment files
.env
.env.local
.env.development
.env.test

# Build outputs
frontend/dist
backend/dist

# Logs
logs
*.log

# Git
.git
.gitignore

# Documentation
README.md
docs/

# Test files
test/
tests/
*.test.js
*.spec.js
`;

    fs.writeFileSync('.dockerignore', dockerIgnoreContent);
    console.log('✅ .dockerignore created');
  }

  validateEnvironment() {
    console.log('🔍 Validating environment...');
    
    if (!fs.existsSync(this.envPath)) {
      console.log('❌ Environment file not found');
      return false;
    }
    
    const envContent = fs.readFileSync(this.envPath, 'utf8');
    const missingVars = [];
    
    this.requiredVars.forEach(varName => {
      const regex = new RegExp(`^${varName}=.+`, 'm');
      if (!regex.test(envContent) || envContent.includes(`${varName}=your-`)) {
        missingVars.push(varName);
      }
    });
    
    if (missingVars.length > 0) {
      console.log('❌ Missing or placeholder environment variables:');
      missingVars.forEach(varName => {
        console.log(`   • ${varName}`);
      });
      return false;
    }
    
    console.log('✅ Environment variables configured');
    return true;
  }

  printInstructions() {
    console.log('\n📋 Next Steps:');
    console.log('==============');
    console.log('1. Update backend/.env with your actual credentials:');
    console.log('   • MongoDB connection string');
    console.log('   • Cloudinary credentials');
    console.log('   • Production domain');
    console.log('');
    console.log('2. Install dependencies:');
    console.log('   npm run install:all');
    console.log('');
    console.log('3. Build frontend:');
    console.log('   npm run build');
    console.log('');
    console.log('4. Test the setup:');
    console.log('   node test-production.js');
    console.log('');
    console.log('5. Start production server:');
    console.log('   npm run production:start');
    console.log('   # or use: ./start-production.sh (Linux/Mac)');
    console.log('   # or use: start-production.bat (Windows)');
    console.log('');
    console.log('🚀 For deployment options, see DEPLOYMENT.md');
  }

  async run() {
    console.log('🌟 Vesturo Production Setup\n');
    
    // Check dependencies
    if (!this.checkDependencies()) {
      process.exit(1);
    }
    
    // Create environment file
    this.createProductionEnv();
    
    // Create startup scripts
    this.createStartupScript();
    
    // Create Docker ignore
    this.createDockerIgnore();
    
    // Check build files
    this.checkBuildFiles();
    
    // Print instructions
    this.printInstructions();
    
    console.log('\n✅ Production setup complete!');
    console.log('⚠️  Remember to update the environment variables before deploying.');
  }
}

// Run setup if called directly
if (require.main === module) {
  const setup = new ProductionSetup();
  setup.run().catch(console.error);
}

module.exports = ProductionSetup;
