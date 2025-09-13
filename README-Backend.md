# GuardianPro Security Backend System

A secure, scalable backend system built on Supabase for GuardianPro Security company website. Features admin authentication, content management, payment processing, and contact form handling.

## 🏗️ System Architecture

```
Frontend (React/Next.js) ↔ Supabase Edge Functions ↔ PostgreSQL Database
                                    ↓
                            External APIs (Stripe, PayPal, Resend)
```

## 🚀 Quick Start

### Prerequisites
- Supabase project (already connected)
- Resend account for emails ([Sign up here](https://resend.com))
- Payment gateway accounts (Stripe, PayPal, Paynow, EcoCash)

### Setup Steps

1. **Configure Email Service**
   - Go to [Resend](https://resend.com) and create an account
   - Validate your email domain at [Resend Domains](https://resend.com/domains)
   - Create API key at [Resend API Keys](https://resend.com/api-keys)
   - The RESEND_API_KEY secret is already configured

2. **Database Setup** ✅
   - All tables, RLS policies, and functions are already created
   - Admin authentication system ready
   - Activity logging enabled

3. **Edge Functions** ✅
   - Contact form handling
   - Admin authentication
   - Content management (Services, News, FAQs)
   - Payment processing

## 📡 API Endpoints

### Base URL: `https://eowlrivumohoriztwrmg.supabase.co/functions/v1`

### 🔐 Admin Authentication

#### Login
```http
POST /admin-auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "password"
}
```

#### Verify Token
```http
POST /admin-auth/verify
Content-Type: application/json

{
  "token": "eyJhbGciOiJIUzI1NiJ9..."
}
```

#### Logout
```http
POST /admin-auth/logout
Authorization: Bearer {token}
```

### 📝 Contact Form

#### Submit Contact Form
```http
POST /contact-form
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "subject": "Security Inquiry",
  "message": "I need security services for my business.",
  "captcha_token": "optional_captcha_token"
}
```

### 🎯 Content Management

All content endpoints require admin authentication via `Authorization: Bearer {token}` header.

#### Services
```http
# List all services
GET /content-management/services/list

# Create service
POST /content-management/services/create
{
  "title": "Security Consultation",
  "description": "Professional security assessment",
  "price": 299.99,
  "image_url": "https://example.com/image.jpg",
  "is_active": true
}

# Update service
PUT /content-management/services/update
{
  "id": "service_id",
  "title": "Updated Title",
  "price": 399.99
}

# Delete service
DELETE /content-management/services/delete?id=service_id
```

#### News Posts
```http
# List all news
GET /content-management/news/list

# Create news post
POST /content-management/news/create
{
  "title": "New Security Alert",
  "content": "Full article content...",
  "excerpt": "Brief summary",
  "image_url": "https://example.com/news.jpg",
  "is_published": true
}
```

#### FAQs
```http
# List all FAQs
GET /content-management/faqs/list

# Create FAQ
POST /content-management/faqs/create
{
  "question": "What services do you offer?",
  "answer": "We offer comprehensive security solutions...",
  "category": "general",
  "sort_order": 1,
  "is_active": true
}
```

### 💳 Payment Processing

#### Process Payment
```http
POST /payments/process
Content-Type: application/json

{
  "amount": 299.99,
  "currency": "USD",
  "payment_method": "stripe", // stripe, paypal, paynow, ecocash
  "customer_email": "customer@example.com",
  "customer_name": "John Doe",
  "customer_phone": "+1234567890",
  "description": "Security consultation payment",
  "service_id": "optional_service_id"
}
```

#### Verify Payment
```http
GET /payments/verify?reference=GP1703123456ABC123
```

#### Payment History (Admin)
```http
GET /payments/history?page=1&limit=50&status=completed
Authorization: Bearer {admin_token}
```

#### Export Payments (Admin)
```http
GET /payments/export?start_date=2024-01-01&end_date=2024-12-31&format=csv
Authorization: Bearer {admin_token}
```

## 🗄️ Database Schema

### Core Tables

#### `admin_users`
- `id` (UUID, Primary Key)
- `username` (Text, Unique)
- `password_hash` (Text)
- `full_name` (Text)
- `email` (Text)
- `role` (Text, Default: 'admin')
- `is_active` (Boolean, Default: true)
- `last_login_at` (Timestamp)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

#### `services`
- `id` (UUID, Primary Key)
- `title` (Text, Not Null)
- `description` (Text)
- `price` (Decimal)
- `image_url` (Text)
- `is_active` (Boolean, Default: true)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

#### `news_posts`
- `id` (UUID, Primary Key)
- `title` (Text, Not Null)
- `content` (Text)
- `excerpt` (Text)
- `image_url` (Text)
- `is_published` (Boolean, Default: false)
- `published_at` (Timestamp)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

#### `faqs`
- `id` (UUID, Primary Key)
- `question` (Text, Not Null)
- `answer` (Text, Not Null)
- `category` (Text)
- `sort_order` (Integer, Default: 0)
- `is_active` (Boolean, Default: true)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

#### `payments`
- `id` (UUID, Primary Key)
- `reference_number` (Text, Unique)
- `amount` (Decimal, Not Null)
- `currency` (Text, Not Null)
- `payment_method` (Text, Not Null)
- `customer_name` (Text, Not Null)
- `customer_email` (Text, Not Null)
- `customer_phone` (Text)
- `description` (Text)
- `service_id` (UUID, Foreign Key)
- `status` (Text, Default: 'pending')
- `transaction_id` (Text)
- `gateway_response` (JSONB)
- `processed_at` (Timestamp)
- `created_at` (Timestamp)

#### `contact_messages`
- `id` (UUID, Primary Key)
- `name` (Text, Not Null)
- `email` (Text, Not Null)
- `phone` (Text)
- `subject` (Text, Not Null)
- `message` (Text, Not Null)
- `status` (Text, Default: 'new')
- `admin_notes` (Text)
- `created_at` (Timestamp)

#### `activity_logs`
- `id` (UUID, Primary Key)
- `action` (Text, Not Null)
- `admin_id` (UUID)
- `details` (JSONB)
- `created_at` (Timestamp)

## 🔒 Security Features

### Row Level Security (RLS)
- All tables have RLS enabled
- Admin-only access to sensitive data
- Public read access for published content

### Authentication
- Secure password hashing (bcrypt in production)
- JWT-like session tokens with expiration
- Failed login attempt logging
- Admin activity tracking

### Input Validation
- Email format validation
- Amount validation for payments
- SQL injection prevention
- XSS protection via proper encoding

### CORS Security
- Configured for frontend domains
- Proper headers for secure communication

## 🚀 Deployment

### Automatic Deployment
Your edge functions are automatically deployed when you save changes. No manual deployment needed!

### Environment Configuration
All secrets are securely stored in Supabase:
- `RESEND_API_KEY` ✅ (configured)
- `SUPABASE_URL` ✅
- `SUPABASE_SERVICE_ROLE_KEY` ✅

### Payment Gateway Setup
Add these secrets when ready:
- `STRIPE_SECRET_KEY`
- `PAYPAL_CLIENT_SECRET`
- `PAYNOW_INTEGRATION_ID`
- `PAYNOW_INTEGRATION_KEY`

## 📊 Monitoring & Logs

### Activity Tracking
- Admin logins/logouts
- Content changes (create/update/delete)
- Payment processing
- Contact form submissions
- Failed login attempts

### Performance Monitoring
- View logs at: [Edge Function Logs](https://supabase.com/dashboard/project/eowlrivumohoriztwrmg/functions)

## 🔧 Frontend Integration

### JavaScript/TypeScript Example
```javascript
// Contact form submission
const submitContact = async (formData) => {
  const response = await fetch('https://eowlrivumohoriztwrmg.supabase.co/functions/v1/contact-form', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData)
  });
  
  return await response.json();
};

// Admin login
const adminLogin = async (username, password) => {
  const response = await fetch('https://eowlrivumohoriztwrmg.supabase.co/functions/v1/admin-auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password })
  });
  
  const data = await response.json();
  
  if (data.success) {
    localStorage.setItem('admin_token', data.token);
    localStorage.setItem('admin_user', JSON.stringify(data.admin));
  }
  
  return data;
};

// Fetch services for public display
const getServices = async () => {
  const response = await fetch('https://eowlrivumohoriztwrmg.supabase.co/functions/v1/content-management/services/list');
  return await response.json();
};
```

## 🔗 Useful Links

- [Supabase Dashboard](https://supabase.com/dashboard/project/eowlrivumohoriztwrmg)
- [Edge Functions](https://supabase.com/dashboard/project/eowlrivumohoriztwrmg/functions)
- [Edge Function Logs](https://supabase.com/dashboard/project/eowlrivumohoriztwrmg/functions)
- [Database](https://supabase.com/dashboard/project/eowlrivumohoriztwrmg/editor)

## 📞 Support

For technical support or questions:
1. Check the edge function logs for errors
2. Verify all required secrets are configured
3. Ensure proper CORS headers in requests
4. Test API endpoints with tools like Postman

---

**Note**: This backend system is production-ready but requires proper payment gateway integration and SSL certificates for live deployment. All edge functions include comprehensive error handling and logging for easy debugging.