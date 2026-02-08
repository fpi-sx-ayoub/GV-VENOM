# GV VENOM - VIP Likes System TODO

## Database & Schema
- [x] Create custom_users table for VIP users (username, password, expiryDate, createdAt)
- [x] Create admin_credentials table for owner (FPI-SX-BOT) with hashed password
- [x] Add indexes for username lookups

## Authentication & Authorization
- [x] Implement custom login system for VIP users (username/password)
- [x] Implement admin login system (FPI-SX-BOT credentials)
- [x] Create session management for both user types
- [x] Add password hashing utility (PBKDF2)
- [x] Implement subscription expiry validation

## Admin Panel (Dashboard)
- [x] Create admin dashboard layout
- [x] Add user management section (list, add, edit, delete)
- [x] Create form to add new VIP users (username, password, days)
- [x] Display user list with expiry dates
- [x] Add logout functionality for admin
- [x] Implement admin-only route protection

## VIP User Pages
- [x] Create VIP login page (username/password form)
- [x] Create VIP dashboard after login
- [x] Create likes sending page (UID input form)
- [x] Implement API integration with https://api-like-alliff-v2.vercel.app/like?uid=
- [x] Display API response results (LikesAfter, LikesBefore, PlayerNickname, SuccessfulRequests)
- [x] Add "GV VENOM" branding to results display
- [x] Add logout functionality for VIP users

## Home Page & Navigation
- [x] Create attractive home page with GV VENOM branding
- [x] Add button to navigate to VIP login page
- [x] Add button to navigate to admin login page
- [x] Implement responsive navigation

## UI/UX Design
- [x] Design modern, attractive color scheme
- [x] Implement responsive layout (mobile, tablet, desktop)
- [x] Add loading states for API calls
- [x] Add error handling and user feedback (toasts)
- [x] Create consistent component styling with Tailwind

## API & Backend
- [x] Create tRPC procedures for user login (VIP)
- [x] Create tRPC procedures for admin login
- [x] Create tRPC procedures for adding users (admin only)
- [x] Create tRPC procedures for getting user list (admin only)
- [x] Create tRPC procedures for sending likes (protected)
- [x] Create tRPC procedures for validating subscription expiry
- [x] Implement error handling and validation

## Notifications
- [x] Send owner notification when new user is added
- [x] Send owner notification on failed login attempts
- [x] Implement notification system integration

## Testing & Deployment
- [ ] Write vitest tests for authentication procedures
- [ ] Write vitest tests for user management procedures
- [ ] Test subscription expiry logic
- [ ] Test API integration with external likes service
- [ ] Deploy to Vercel
- [x] Create checkpoint after completion

## Security
- [x] Hash all passwords (PBKDF2)
- [x] Validate input data
- [x] Protect admin routes
- [x] Protect VIP routes
- [ ] Implement rate limiting for API calls
- [x] Secure session management
