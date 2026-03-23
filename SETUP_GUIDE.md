# SwadPoint - Setup & Installation Guide

**Version**: 1.0.0  
**Last Updated**: March 23, 2026

---

## 📋 Table of Contents

1. [System Requirements](#system-requirements)
2. [Installation Steps](#installation-steps)
3. [Database Setup](#database-setup)
4. [Environment Configuration](#environment-configuration)
5. [Running the Application](#running-the-application)
6. [Troubleshooting](#troubleshooting)
7. [Development Tools](#development-tools)

---

## 🖥️ System Requirements

### Minimum Requirements

- **OS**: Windows 10/11, macOS 10.15+, or Linux (Ubuntu 18.04+)
- **Node.js**: 18.17+ (LTS recommended)
- **npm**: 9+
- **PostgreSQL**: 12.0+
- **RAM**: 4GB
- **Disk Space**: 2GB

### Recommended Setup

- **Node.js**: 20.x LTS
- **npm**: 10.x
- **PostgreSQL**: 15+
- **RAM**: 8GB+
- **Disk Space**: 5GB+

### Required Software

```
✓ Node.js (with npm)
✓ PostgreSQL Database
✓ Git (for version control)
✓ Code Editor (VS Code recommended)
✓ Terminal/Command Prompt
```

---

## 🚀 Installation Steps

### Step 1: Clone the Repository

```bash
# Using HTTPS
git clone https://github.com/your-org/swadpoint.git
cd swadpoint

# Or using SSH
git clone git@github.com:your-org/swadpoint.git
cd swadpoint
```

### Step 2: Install Node Dependencies

```bash
# Using npm
npm install

# Or using yarn
yarn install

# Or using pnpm
pnpm install
```

**Expected Output:**

```
added 250 packages in 45s
```

### Step 3: Verify Installation

```bash
# Check Node version
node --version
# Should output: v18.17.0 or higher

# Check npm version
npm --version
# Should output: 9.0.0 or higher

# Check dependencies installed
npm list --depth=0
```

---

## 🗄️ Database Setup

### Step 1: Install PostgreSQL

**Windows:**

```bash
# Download from https://www.postgresql.org/download/windows/
# Run installer
# During installation:
# - Set password for postgres user (e.g., "123456")
# - Port: 5432 (default)
# - Encoding: UTF8
```

**macOS:**

```bash
# Using Homebrew
brew install postgresql@15

# Start PostgreSQL
brew services start postgresql@15
```

**Linux (Ubuntu):**

```bash
# Update package manager
sudo apt update

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL service
sudo service postgresql start
```

### Step 2: Create Database

```bash
# Connect to PostgreSQL
psql -U postgres -h localhost

# Inside psql shell, create database:
CREATE DATABASE swadpoint_db;
CREATE USER swadpoint_user WITH PASSWORD '123456';
ALTER ROLE swadpoint_user SET client_encoding TO 'utf8';
ALTER ROLE swadpoint_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE swadpoint_user SET default_transaction_deferrable TO on;
ALTER ROLE swadpoint_user SET default_transaction_read_only TO off;
GRANT ALL PRIVILEGES ON DATABASE swadpoint_db TO swadpoint_user;
\q
```

### Step 3: Initialize Tables

```bash
# From project root directory

# Option A: Using npm script
npm run db:setup

# Option B: Using psql directly
psql -U postgres -d swadpoint_db -f documentation/sql/postgres-init.sql

# Option C: Using connection string
psql postgresql://swadpoint_user:123456@localhost:5432/swadpoint_db \
  -f documentation/sql/postgres-init.sql
```

### Step 4: Verify Database Setup

```bash
# Connect to database
psql -U swadpoint_user -d swadpoint_db -h localhost

# Check tables created
\dt

# Expected output:
# Schema | Name                | Type  | Owner
# --------+---------------------+-------+----------------
# public | app_users           | table | swadpoint_user
# public | inventory_items     | table | swadpoint_user
# public | menu_items          | table | swadpoint_user
# public | orders              | table | swadpoint_user
# public | payments            | table | swadpoint_user
# public | reservations        | table | swadpoint_user

\q
```

---

## ⚙️ Environment Configuration

### Step 1: Create .env.local File

```bash
# From project root
cp .env.example .env.local
```

### Step 2: Configure Environment Variables

Edit `.env.local` with your settings:

```env
# ============================================
# DATABASE CONFIGURATION
# ============================================
DATABASE_URL=postgresql://swadpoint_user:123456@localhost:5432/swadpoint_db

# Optional: Individual connection parameters
PGUSER=swadpoint_user
PGHOST=localhost
PGDATABASE=swadpoint_db
PGPASSWORD=123456
PGPORT=5432
POSTGRES_SSL=false
POSTGRES_SSL_REJECT_UNAUTHORIZED=false

# ============================================
# APPLICATION CONFIGURATION
# ============================================
APP_TIMEZONE=Asia/Kolkata
AUTH_SECRET=your-super-secret-random-key-change-this-in-production

# ============================================
# API CONFIGURATION
# ============================================
NEXT_PUBLIC_API_URL=http://localhost:3000
NODE_ENV=development

# ============================================
# PAYMENT CONFIGURATION (Optional)
# ============================================
UPI_ID=restaurant@bank
PAYEE_NAME=Restaurant Name

# ============================================
# EMAIL CONFIGURATION (Optional)
# ============================================
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

### Step 3: Generate AUTH_SECRET

```bash
# Generate a random secret (use one of these):

# Option 1: Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Option 2: Using OpenSSL
openssl rand -hex 32

# Copy the output and paste into AUTH_SECRET in .env.local
```

### Step 4: Verify Environment Setup

```bash
# Check if .env.local exists and loads
npm run env:check
```

---

## 🏃 Running the Application

### Development Mode

```bash
# Start development server
npm run dev

# Expected output:
# ▲ Next.js 14.0.0
# - Local: http://localhost:3000
# - Environments: .env.local
#
# ✓ Ready in 2.5s
```

**Access the application:**

- **Frontend**: http://localhost:3000
- **Dashboard**: http://localhost:3000/login
- **API**: http://localhost:3000/api

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start

# Expected output:
# ▲ Next.js 14.0.0
# - Local: http://localhost:3000
#
# Ready in 1.2s
```

### Additional Commands

```bash
# Format code with Prettier
npm run format

# Lint code with ESLint
npm run lint

# Type check with TypeScript
npm run type-check

# Run all checks
npm run check-all
```

---

## 🔧 Development Setup

### Step 1: Install Development Dependencies

```bash
# Already included in npm install, but to be explicit:
npm install --save-dev eslint prettier typescript
```

### Step 2: Configure IDE (VS Code)

**Recommended Extensions:**

```
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- Prettier - Code Formatter
- ESLint
- PostgreSQL
- REST Client
- Thunder Client
```

**Settings.json** (.vscode/settings.json):

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "eslint.enable": true,
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

### Step 3: Git Configuration

```bash
# Configure Git user
git config user.name "Your Name"
git config user.email "your.email@example.com"

# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: description of your changes"

# Push to remote
git push origin feature/your-feature-name
```

---

## 🧪 Testing the Setup

### Test 1: Verify Database Connection

```bash
# Create test file: test-db.js
const { query } = require('./lib/db');

async function testConnection() {
  try {
    const result = await query('SELECT NOW()');
    console.log('✓ Database connected at:', result.rows[0].now);
  } catch (error) {
    console.error('✗ Database connection failed:', error.message);
  }
}

testConnection();

# Run test
node test-db.js
```

### Test 2: Test API Endpoints

```bash
# Using curl
curl http://localhost:3000/api/test

# Expected response:
# {"success":true,"message":"API is working correctly"}
```

### Test 3: Manual Feature Testing

```bash
# 1. Open browser to http://localhost:3000
# 2. Register new user
# 3. Create test order
# 4. Verify auto-refresh works
# 5. Test search functionality
# 6. Check API responses in Network tab
```

---

## 🐛 Troubleshooting

### Issue: "Cannot find module 'pg'"

**Solution:**

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Issue: "DATABASE_URL not set"

**Solution:**

```bash
# Check .env.local exists in root directory
ls -la .env.local

# If missing, create it
cp .env.example .env.local
# Edit with correct database URL
```

### Issue: "Port 3000 already in use"

**Solution:**

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :3000
kill -9 <PID>

# Or use different port
npm run dev -- -p 3001
```

### Issue: "PostgreSQL connection refused"

**Solution:**

```bash
# Check if PostgreSQL is running
# Windows: Check Services
# macOS: brew services list
# Linux: sudo service postgresql status

# Verify connection string
# Format: postgresql://user:password@host:port/database
# Example: postgresql://postgres:123456@localhost:5432/swadpoint_db

# Test connection
psql postgresql://postgres:123456@localhost:5432/swadpoint_db
```

### Issue: "Tables don't exist"

**Solution:**

```bash
# Reinitialize database
npm run db:setup

# Or manually run init script
psql -U postgres -d swadpoint_db -f documentation/sql/postgres-init.sql
```

### Issue: "TypeError: fetch is not defined"

**Solution:**

```bash
# Ensure Node.js 18+
node --version

# If older version, upgrade
nvm install 18
nvm use 18
```

### Issue: "CORS error in browser"

**Solution:**

```bash
# Add to API route headers
response.setHeader('Access-Control-Allow-Origin', '*');
response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
```

---

## 📁 Directory Permissions

### Ensure Write Permissions

```bash
# macOS/Linux
chmod -R 755 ./

# Windows (in PowerShell as Admin)
icacls "." /grant Users:F /T
```

---

## 🔐 Security Checklist

Before deploying to production:

- [ ] Change `AUTH_SECRET` to a strong random value
- [ ] Set `NODE_ENV=production`
- [ ] Use strong database password
- [ ] Enable PostgreSQL SSL
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Enable database backups
- [ ] Configure firewall rules
- [ ] Use HTTPS in production
- [ ] Set up monitoring/alerts

---

## 📊 Performance Optimization

### Database Performance

```bash
# Create indexes (recommended)
psql -U postgres -d swadpoint_db

CREATE INDEX idx_orders_user_id ON orders(userid);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_inventory_category ON inventory_items(category);
```

### Application Performance

```javascript
// Enable compression in next.config.ts
module.exports = {
  compress: true,
  swcMinify: true,
  productionBrowserSourceMaps: false,
};
```

---

## 🚀 Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Environment variables will be prompted
# Add DATABASE_URL and other secrets
```

### Deploy to Other Platforms

- **AWS EC2**: Follow AWS Next.js deployment docs
- **Digital Ocean**: Use App Platform or Droplets
- **Railway**: Connect GitHub repo, set environment variables
- **Render**: Deploy as Node.js application
- **Heroku**: Use Heroku Postgres addon

---

## 📝 Useful Commands Reference

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Start production server

# Database
npm run db:setup         # Initialize database
npm run db:seed          # Seed test data (if available)

# Code Quality
npm run lint             # Run ESLint
npm run format           # Format with Prettier
npm run type-check       # Check TypeScript types

# Testing
npm test                 # Run test suite
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Generate coverage report
```

---

## 📞 Getting Help

### Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [React Documentation](https://react.dev)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

### Common Documentation Files

- [PROJECT_DOCUMENTATION.md](PROJECT_DOCUMENTATION.md) - Project overview
- [API_DOCUMENTATION.md](API_DOCUMENTATION.md) - API reference
- [FEATURE_STATUS.md](FEATURE_STATUS.md) - Feature tracking

### Support

- Create GitHub Issue for bugs
- Check existing issues for solutions
- Contact: development@swadpoint.com

---

## ✅ Verification Checklist

After setup, verify:

- [ ] Node.js 18+ installed
- [ ] npm dependencies installed (node_modules exists)
- [ ] PostgreSQL running and accessible
- [ ] Database created with all tables
- [ ] .env.local configured with correct credentials
- [ ] Development server starts without errors
- [ ] Can access http://localhost:3000
- [ ] Can register/login user
- [ ] API endpoints respond correctly
- [ ] Auto-refresh shows live data

---

**Setup Complete!** 🎉

You're now ready to start development on SwadPoint.

For questions or issues, refer to the troubleshooting section above.
