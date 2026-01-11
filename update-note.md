Login Integration & Profile Page
I have successfully integrated the frontend and backend login, implemented a user profile page, and restricted access to dashboards as requested.

*Changes Made*
Backend Integration
Unified Login: The authentication middleware now checks both the university (for Admins) and users (for Students and Lecturers) tables.
Enhanced Response: The 
AuthController
 now returns both the user data and the access/refresh tokens in the JSON response body, ensuring compatibility with the frontend's client-side state management.
Role-Based Logging: 
AuthService
 was updated to log device information and login activities in the appropriate tables based on whether the user is a University Admin or a regular User.
Token Management: Updated token generation to store refresh tokens in the correct table (university_refresh_token vs refresh_token).
Frontend Integration
API Configuration: Updated 
authServices.ts
 to point to the backend server (port 5050) and use the correct /auth/login endpoint.
Profile Page: Created a new 
profile/page.tsx
 that displays:
Full Name (or Username/University Name)
Role
Email Address
Account Type
Institution/University Name
Dashboard Restriction:
Overrode role-based dashboard redirects in 
auth-form.tsx
 and the login page to always land on the Profile page.
Updated 
Navbar.tsx
 to show a "Profile" button instead of "Dashboard".
Verification Plan
Automated Tests
Ran backend server using npm run dev and verified it's listening on port 5050.
Verified /api/v1/auth/login endpoint logic via code review and manual integration checks.
Manual Verification
Login:
Navigate to /login.
Sign in with valid credentials.
Verify that you are redirected to /profile after 2 seconds.
Profile:
Verify that your name, email, and role are correctly displayed.
Click "Sign Out" to ensure logout works and you are returned to the login page.
Accessibility:
Verify that the Navbar "Profile" button correctly navigates to your details.
Verify that Dashboards are not directly accessible via the UI for now.
NOTE

I fixed an inconsistency in the backend where some tables used browser and others used broswer. The code now maps to the correct property for each table as defined in the Prisma schema.

