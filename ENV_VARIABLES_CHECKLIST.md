# Environment Variables Checklist

Use this checklist to ensure all required environment variables are configured for deployment.

## ✅ Root Level (./.env)

| Variable | Required | Example | Notes |
|----------|----------|---------|-------|
| MONGO_URI | ✅ | `mongodb://db:27017` | Docker or MongoDB Atlas cloud URL |
| REDIS_HOST | ✅ | `redis` | For Docker compose |
| REDIS_PORT | ✅ | `6379` | Default Redis port |
| PORT_AUTH | ✅ | `3000` | Auth service port |
| PORT_ADMIN | ✅ | `4001` | Admin service port |
| PORT_BOOKING | ✅ | `5002` | Booking service port |
| PORT_HOTEL | ✅ | `3001` | Hotel service port |
| PORT_NOTIFICATIONS | ✅ | `6000` | Notifications service port |
| JWT_SECRET | ✅ | `32+ char random string` | Generate securely |
| JWT_EXPIRES_IN | ✅ | `7d` | Token expiry time |
| CLIENT_URL | ✅ | `https://yourdomain.com` | Frontend domain |
| GOOGLE_CLIENT_ID | ✅ | `xxx.apps.googleusercontent.com` | From Google Console |
| GOOGLE_CLIENT_SECRET | ✅ | `GOCSPX-xxxxx` | Keep secret |
| GOOGLE_CALLBACK_URL | ✅ | `https://yourdomain.com/auth/google/callback` | Must match Google settings |
| RESEND_API | ✅ | `re_xxxxx` | From Resend.com |
| CLOUDINARY_CLOUD_NAME | ✅ | `your-cloud-name` | From Cloudinary |
| CLOUDINARY_API_KEY | ✅ | `123456789012345` | From Cloudinary |
| CLOUDINARY_API_SECRET | ✅ | `xxxxx` | Keep secret |
| NODE_ENV | ✅ | `production` | For all services |

## ✅ Auth Service (./Travallee-Backend/Services/Auth/.env)

| Variable | Required | Example | Notes |
|----------|----------|---------|-------|
| MONGO_URI | ✅ | `mongodb://db:27017` | Database connection |
| MONGO_DB_NAME | ✅ | `authentication` | Database name |
| PORT_AUTH | ✅ | `3000` | Service port |
| NODE_ENV | ✅ | `production` | Environment |
| JWT_SECRET | ✅ | `32+ char random` | Generate securely |
| JWT_EXPIRES_IN | ✅ | `7d` | Token expiry |
| CLIENT_URL | ✅ | `https://yourdomain.com` | CORS origin |
| GOOGLE_CLIENT_ID | ✅ | `xxx.apps.googleusercontent.com` | OAuth ID |
| GOOGLE_CLIENT_SECRET | ✅ | `GOCSPX-xxxxx` | OAuth secret |
| GOOGLE_CALLBACK_URL | ✅ | `https://yourdomain.com/auth/google/callback` | OAuth callback |
| RESEND_API | ✅ | `re_xxxxx` | Email service |
| GMAIL_USER | ⚠️ | `noreply@yourdomain.com` | If not using Resend |
| GMAIL_APP_PASSWORD | ⚠️ | `xxxx xxxx xxxx xxxx` | If not using Resend |
| REDIS_HOST | ✅ | `redis` | Cache service |
| REDIS_PORT | ✅ | `6379` | Cache port |
| CLOUDINARY_CLOUD_NAME | ✅ | `your-cloud-name` | File storage |
| CLOUDINARY_API_KEY | ✅ | `123456789012345` | File storage key |
| CLOUDINARY_API_SECRET | ✅ | `xxxxx` | File storage secret |

## ✅ Admin Service (./Travallee-Backend/Services/admin/.env)

| Variable | Required | Example | Notes |
|----------|----------|---------|-------|
| MONGO_URI | ✅ | `mongodb://db:27017` | Database connection |
| MONGO_DB_NAME | ✅ | `adminDB` | Database name |
| PORT | ✅ | `4001` | Service port |
| NODE_ENV | ✅ | `production` | Environment |
| JWT_SECRET | ✅ | `32+ char random` | Generate securely |
| CLIENT_URL | ✅ | `https://yourdomain.com` | CORS origin |
| CLOUDINARY_CLOUD_NAME | ✅ | `your-cloud-name` | File storage |
| CLOUDINARY_API_KEY | ✅ | `123456789012345` | File storage key |
| CLOUDINARY_API_SECRET | ✅ | `xxxxx` | File storage secret |
| REDIS_HOST | ✅ | `redis` | Cache service |
| REDIS_PORT | ✅ | `6379` | Cache port |

## ✅ Booking Service (./Travallee-Backend/Services/booking/.env)

| Variable | Required | Example | Notes |
|----------|----------|---------|-------|
| DATABASE_URL | ✅ | `mongodb://db:27017` | Database connection |
| DATABASE_NAME | ✅ | `booking` | Database name |
| PORT | ✅ | `5002` | Service port |
| NODE_ENV | ✅ | `production` | Environment |
| JWT_SECRET | ✅ | `32+ char random` | Generate securely |
| CLIENT_URL | ✅ | `https://yourdomain.com` | CORS origin |
| REDIS_HOST | ✅ | `redis` | Cache service |
| REDIS_PORT | ✅ | `6379` | Cache port |
| STRIPE_SECRET_KEY | ⚠️ | `sk_live_xxxxx` | If using Stripe |
| STRIPE_PUBLISHABLE_KEY | ⚠️ | `pk_live_xxxxx` | If using Stripe |

## ✅ Hotel Service (./Travallee-Backend/Services/Hotel/.env)

| Variable | Required | Example | Notes |
|----------|----------|---------|-------|
| MONGO_URI | ✅ | `mongodb://db:27017` | Database connection |
| MONGO_DB_NAME | ✅ | `ghumgham` | Database name |
| PORT | ✅ | `3001` | Service port |
| NODE_ENV | ✅ | `production` | Environment |
| JWT_SECRET | ✅ | `32+ char random` | Generate securely |
| CLIENT_URL | ✅ | `https://yourdomain.com` | CORS origin |
| CLOUDINARY_CLOUD_NAME | ✅ | `your-cloud-name` | File storage |
| CLOUDINARY_API_KEY | ✅ | `123456789012345` | File storage key |
| CLOUDINARY_API_SECRET | ✅ | `xxxxx` | File storage secret |
| REDIS_HOST | ✅ | `redis` | Cache service |
| REDIS_PORT | ✅ | `6379` | Cache port |

## ✅ Notifications Service (./Travallee-Backend/Services/notifications/.env)

| Variable | Required | Example | Notes |
|----------|----------|---------|-------|
| MONGODB_URI | ✅ | `mongodb://db:27017` | Database connection |
| MONGODB_DB_NAME | ✅ | `notifications` | Database name |
| PORT | ✅ | `6000` | Service port |
| NODE_ENV | ✅ | `production` | Environment |
| REDIS_HOST | ✅ | `redis` | Cache service |
| REDIS_PORT | ✅ | `6379` | Cache port |
| RESEND_API | ✅ | `re_xxxxx` | Email service |
| GMAIL_USER | ⚠️ | `noreply@yourdomain.com` | If not using Resend |
| GMAIL_APP_PASSWORD | ⚠️ | `xxxx xxxx xxxx xxxx` | If not using Resend |
| CLIENT_URL | ✅ | `https://yourdomain.com` | CORS origin |

## ✅ Packages (./Travallee-Backend/Packages/.env)

| Variable | Required | Example | Notes |
|----------|----------|---------|-------|
| CLOUDINARY_CLOUD_NAME | ✅ | `your-cloud-name` | File storage |
| CLOUDINARY_API_KEY | ✅ | `123456789012345` | File storage key |
| CLOUDINARY_API_SECRET | ✅ | `xxxxx` | File storage secret |
| RESEND_API | ✅ | `re_xxxxx` | Email service |
| GMAIL_USER | ⚠️ | `noreply@yourdomain.com` | If not using Resend |
| GMAIL_APP_PASSWORD | ⚠️ | `xxxx xxxx xxxx xxxx` | If not using Resend |

## ✅ Hotel Admin Frontend (./HotelAdmin-Frontend/.env)

| Variable | Required | Example | Notes |
|----------|----------|---------|-------|
| VITE_API_URL | ✅ | `https://yourdomain.com/api/v1` | Backend API URL |
| VITE_ENV | ✅ | `production` | Environment |
| VITE_APP_NAME | ⚠️ | `Hotel Manager` | App name |
| VITE_APP_VERSION | ⚠️ | `1.0.0` | App version |

## ✅ User Frontend (./User-Frontend/.env)

| Variable | Required | Example | Notes |
|----------|----------|---------|-------|
| VITE_API_BASE_URL | ✅ | `https://yourdomain.com/api/v1` | Backend API URL |
| VITE_ENV | ✅ | `production` | Environment |
| VITE_APP_NAME | ⚠️ | `Travallee` | App name |
| VITE_APP_VERSION | ⚠️ | `1.0.0` | App version |

## ✅ Mobile App (./Travallee-App/.env)

| Variable | Required | Example | Notes |
|----------|----------|---------|-------|
| API_BASE_URL | ✅ | `https://yourdomain.com/api/v1` | Backend API URL |
| NODE_ENV | ✅ | `production` | Environment |
| EXPO_PUBLIC_APP_NAME | ⚠️ | `Travallee` | App name |
| EXPO_PUBLIC_API_BASE_URL | ✅ | `https://yourdomain.com/api/v1` | API URL |

---

## Legend

- **✅ Required**: Must be configured
- **⚠️ Optional**: Configure based on use case
- **Notes**: Additional information or alternatives

## Verification Commands

```bash
# Check if all required .env files exist
ls -la .env
ls -la Travallee-Backend/Services/Auth/.env
ls -la Travallee-Backend/Services/admin/.env
ls -la Travallee-Backend/Services/booking/.env
ls -la Travallee-Backend/Services/Hotel/.env
ls -la Travallee-Backend/Services/notifications/.env
ls -la Travallee-Backend/Packages/.env
ls -la HotelAdmin-Frontend/.env
ls -la User-Frontend/.env
ls -la Travallee-App/.env

# Verify no missing variables in root .env
grep -E "^[A-Z_]+=.+$" .env

# Check for missing .env files
for dir in Travallee-Backend/Services/Auth Travallee-Backend/Services/admin Travallee-Backend/Services/booking Travallee-Backend/Services/Hotel Travallee-Backend/Services/notifications; do
  if [ ! -f "$dir/.env" ]; then
    echo "Missing: $dir/.env"
  fi
done

# Ensure .env files are not in git
git check-ignore .env
git check-ignore Travallee-Backend/Services/Auth/.env
```

---

## Deployment Steps

1. ✅ Copy all `.env.example` to `.env` in respective directories
2. ✅ Update all variables with production values
3. ✅ Verify all required variables are present
4. ✅ Test environment variables before deploying
5. ✅ Ensure `.env` files are in `.gitignore`
6. ✅ Deploy with `docker-compose up -d`
7. ✅ Verify services are running: `docker-compose ps`
8. ✅ Check logs for errors: `docker-compose logs -f`

---

For detailed information on each variable, see `ENV_SETUP_GUIDE.md`
