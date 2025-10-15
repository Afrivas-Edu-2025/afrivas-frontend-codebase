# Requirements Documentation for Backend Endpoints

## Student Dashboard Endpoints

1. **GET /api/student/profile**
   - **Description**: Retrieve student profile information.
   - **Request Method**: GET
   - **Response**: JSON object containing student details.
   - **Data Types**: 
     - `id`: integer
     - `fullname`: string
     - `email`: string
     - `dob`: string (ISO date format)
     - `year`: integer2000005
     - `semester`: integer
     - `faculty`: string
     - `department`: string

2. **POST /api/student/signup**
   - **Description**: Register a new student.
   - **Request Method**: POST
   - **Request Body**: JSON object with student details.
   - **Data Types**: 
     - `fullname`: string
     - `email`: string
     - `password`: string
     - `dob`: string (ISO date format)
     - `year`: integer
     - `semester`: integer
     - `faculty`: string
     - `department`: string
   - **Response**: JSON object with success message and student ID.

3. **PUT /api/student/update**
   - **Description**: Update student profile information.
   - **Request Method**: PUT
   - **Request Body**: JSON object with updated student details.
   - **Response**: JSON object with success message.

## Lecturer/Teacher Dashboard Endpoints

1. **GET /api/teacher/profile**
   - **Description**: Retrieve teacher profile information.
   - **Request Method**: GET
   - **Response**: JSON object containing teacher details.
   - **Data Types**: 
     - `id`: integer
     - `fullname`: string
     - `email`: string
     - `department`: string

2. **POST /api/teacher/signup**
   - **Description**: Register a new teacher.
   - **Request Method**: POST
   - **Request Body**: JSON object with teacher details.
   - **Data Types**: 
     - `fullname`: string
     - `email`: string
     - `password`: string
     - `department`: string
   - **Response**: JSON object with success message and teacher ID.

3. **PUT /api/teacher/update**
   - **Description**: Update teacher profile information.
   - **Request Method**: PUT
   - **Request Body**: JSON object with updated teacher details.
   - **Response**: JSON object with success message.

## Common Endpoints

1. **POST /api/auth/login**
   - **Description**: Authenticate user and return a token.
   - **Request Method**: POST
   - **Request Body**: JSON object with email and password.
   - **Response**: JSON object with authentication token.

2. **GET /api/auth/logout**
   - **Description**: Logout user and invalidate token.
   - **Request Method**: GET
   - **Response**: JSON object with success message.

## Additional Information
- All endpoints should handle errors gracefully and return appropriate HTTP status codes.
- Authentication is required for all endpoints except signup and login.
- Use JWT for authentication and authorization.
- Ensure data validation and sanitization on all inputs to prevent SQL injection and XSS attacks.
