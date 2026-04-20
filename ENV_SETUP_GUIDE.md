# Environment Variables Setup Guide for Deployment

This guide explains all environment variables required for deploying the Ghumgham platform.

## Quick Start

1. Copy `.env.example` to `.env` in each service directory
2. Replace placeholder values with production secrets
3. Use the guides below for each service

---

## 🗄️ Database & Cache Configuration

### MongoDB
- **Variable**: `MONGO_URI`
- **Example (Docker)**: `mongodb://db:27017`
- **Example (Cloud)**: `mongodb+srv://user:password@cluster.mongodb.net`
- **Required**: Yes for all backend services
- **Get it**: Use MongoDB Atlas (cloud) or self-hosted MongoDB

### Redis
- **Variables**: `REDIS_HOST`, `REDIS_PORT`
- **Default**: `redis:6379` (Docker)
- **Required**: Yes for Auth, Hotel, Admin, Notifications services
- **Get it**: Redis Docker image or Redis Cloud

---

## 🔐 Authentication & JWT

### JWT Secret
- **Variable**: `JWT_SECRET`
- **Requirements**: Minimum 32 characters, random, secure
- **How to generate**: 
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- **Required**: Yes (all backend services)
- **Security**: Keep secret, never commit to git, unique per environment

### JWT Expiry
- **Variable**: `JWT_EXPIRES_IN`
- **Recommended**: `7d` (7 days)
- **Example values**: `1d`, `7d`, `30d`, `24h`

---

## 🌐 Google OAuth Configuration

### Setup Instructions
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable "Google+ API"
4. Create OAuth 2.0 Client ID credentials
5. Add authorized redirect URIs

### Variables
- **`GOOGLE_CLIENT_ID`**: Your Google Client ID
  - Format: `xxxxxxxxx-xxxxxxx.apps.googleusercontent.com`
  
- **`GOOGLE_CLIENT_SECRET`**: Your Google Client Secret
  - Keep secret, never share
  
- **`GOOGLE_CALLBACK_URL`**: Callback URL after auth
  - Local: `http://localhost:3000/auth/google/callback`
  - Production: `https://yourdomain.com/auth/google/callback`

### Required: Yes (for Auth service)

---

## 📧 Email Configuration

### Option 1: Resend API (Recommended for Production)
1. Sign up at [Resend.com](https://resend.com)
2. Get your API key from dashboard
3. Set environment variable:
   ```
   RESEND_API=re_xxxxxxxxxxxxxxxxxxxx
   ```

### Option 2: Gmail with App Password
1. Enable 2-factor authentication on Gmail
2. Generate [App Password](https://myaccount.google.com/apppasswords)
3. Set environment variables:
   ```
   GMAIL_USER=your-email@gmail.com
   GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
   ```

### Required: Yes (for Auth and Notifications services)

---

## 🖼️ Cloudinary Configuration (File Storage)

### Setup Instructions
1. Sign up at [Cloudinary.com](https://cloudinary.com)
2. Go to Settings > API
3. Copy your credentials:
   - **`CLOUDINARY_CLOUD_NAME`**: Your cloud name
   - **`CLOUDINARY_API_KEY`**: Your API key
   - **`CLOUDINARY_API_SECRET`**: Your API secret (keep secure!)

### Required: Yes (for Auth, Admin, Hotel services)

---

## 🏨 Service-Specific Configuration

### Auth Service (Port: 3000)
```env
MONGO_URI=mongodb://db:27017
MONGO_DB_NAME=authentication
PORT_AUTH=3000
JWT_SECRET=your-32-char-secret-key
JWT_EXPIRES_IN=7d
CLIENT_URL=https://yourdomain.com
GOOGLE_CLIENT_ID=your-google-id
GOOGLE_CLIENT_SECRET=your-google-secret
GOOGLE_CALLBACK_URL=https://yourdomain.com/auth/google/callback
RESEND_API=your-resend-key
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password
REDIS_HOST=redis
REDIS_PORT=6379
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Admin Service (Port: 4001)
```env
MONGO_URI=mongodb://db:27017
MONGO_DB_NAME=adminDB
PORT=4001
JWT_SECRET=your-32-char-secret-key
CLIENT_URL=https://yourdomain.com
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
REDIS_HOST=redis
REDIS_PORT=6379
```

### Booking Service (Port: 5002)
```env
DATABASE_URL=mongodb://db:27017
DATABASE_NAME=booking
PORT=5002
JWT_SECRET=your-32-char-secret-key
CLIENT_URL=https://yourdomain.com
REDIS_HOST=redis
REDIS_PORT=6379
```

### Hotel Service (Port: 3001)
```env
MONGO_URI=mongodb://db:27017
MONGO_DB_NAME=ghumgham
PORT=3001
JWT_SECRET=your-32-char-secret-key
CLIENT_URL=https://yourdomain.com
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
REDIS_HOST=redis
REDIS_PORT=6379
```

### Notifications Service (Port: 6000)
```env
MONGODB_URI=mongodb://db:27017
MONGODB_DB_NAME=notifications
PORT=6000
REDIS_HOST=redis
REDIS_PORT=6379
RESEND_API=your-resend-key
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password
CLIENT_URL=https://yourdomain.com
```

---

## 🎨 Frontend Configuration

### Hotel Admin Frontend
```env
VITE_API_URL=https://yourdomain.com/api/v1
VITE_ENV=production
VITE_APP_NAME=Hotel Manager
VITE_APP_VERSION=1.0.0
```

### User Frontend
```env
VITE_API_BASE_URL=https://yourdomain.com/api/v1
VITE_ENV=production
VITE_APP_NAME=Travallee
VITE_APP_VERSION=1.0.0
```

### Mobile App
```env
API_BASE_URL=https://yourdomain.com/api/v1
NODE_ENV=production
EXPO_PUBLIC_APP_NAME=Travallee
EXPO_PUBLIC_API_BASE_URL=https://yourdomain.com/api/v1
```

---

## 🚀 Deployment Checklist

- [ ] All JWT secrets are 32+ characters
- [ ] All API keys are from production accounts (not dev)
- [ ] Google OAuth credentials are set to production
- [ ] Email service is configured (Resend or Gmail)
- [ ] Cloudinary account is set up with credentials
- [ ] Database is pointing to production MongoDB
- [ ] Redis is set to production instance
- [ ] `CLIENT_URL` points to production domain
- [ ] All callback URLs use HTTPS
- [ ] `.env` files are NOT committed to git
- [ ] `.env.example` is committed as reference only
- [ ] All sensitive values are in secure secret manager (not plain .env)

---

## 🔒 Security Best Practices

1. **Never commit `.env` files** - Add to `.gitignore`
2. **Use environment variables in CI/CD** - Not hardcoded values
3. **Rotate secrets regularly** - Especially API keys
4. **Use strong JWT secrets** - Minimum 32 characters, random
5. **Use HTTPS URLs only** - All callback URLs must be HTTPS
6. **Separate dev and prod secrets** - Never use dev keys in production
7. **Use secret manager** - AWS Secrets Manager, Vault, or similar for production
8. **Monitor API usage** - Check Cloudinary, Resend, Google APIs for unusual activity

---

## 📝 Example .env File (Root Directory)

```env
# Database & Cache
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/travallee
REDIS_HOST=redis-prod.example.com
REDIS_PORT=6379

# Auth Service
PORT_AUTH=3000
AUTH_DB_NAME=authentication
JWT_SECRET=abc123def456ghi789jkl012mno345pqr678stu901vwx234yza
JWT_EXPIRES_IN=7d
CLIENT_URL=https://yourdomain.com

# Google OAuth
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxx
GOOGLE_CALLBACK_URL=https://yourdomain.com/auth/google/callback

# Email
RESEND_API=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GMAIL_USER=noreply@yourdomain.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx

# File Storage
CLOUDINARY_CLOUD_NAME=your-cloud
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=xxxxxxxxxxxxxxxxxxxxx

# Environment
NODE_ENV=production
```

---

## 🆘 Troubleshooting

### "Invalid JWT Secret"
- JWT secret must be at least 32 characters
- Use `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` to generate

### "Cannot connect to MongoDB"
- Verify MongoDB URI is correct
- Check if MongoDB is running (if self-hosted)
- Whitelist IP address in MongoDB Atlas (if cloud)

### "Redis connection failed"
- Verify Redis hostname and port
- Check if Redis is running
- Verify firewall rules allow Redis port

### "Email not sending"
- Verify API key is correct
- Check email rate limits
- Verify sender email is authorized (Gmail)

### "Google OAuth callback mismatch"
- Ensure redirect URI matches exactly with Google Console
- Use HTTPS for production URLs
- Include full path: `/auth/google/callback`

---

## 📚 Additional Resources

- [MongoDB Atlas Setup](https://docs.atlas.mongodb.com/getting-started/)
- [Resend Documentation](https://resend.com/docs)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)
- [JWT.io](https://jwt.io) - JWT debugger and reference

---

For questions or issues, refer to `CONTRIBUTING.md` and `SECURITY.md` in the root directory.
