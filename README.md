# Loan Management System - Frontend

A comprehensive React-based frontend for the Loan Management System, providing customers with a complete digital loan experience including loan applications, repayment tracking, and account management.

## Features

### Customer Accounts
- Easy registration and login
- Secure authentication with JWT tokens
- Profile management and updates
- Document upload functionality

### Loan Products
- Browse available loan products
- View detailed loan information
- Filter by category (Personal, Business, Education, Home, Auto)
- Compare different loan options

### Loan Applications
- Online loan application form
- Real-time loan calculator
- Document upload support
- Application status tracking

### Repayment Tracking
- View repayment schedules
- Track payment history
- Monitor upcoming payments
- Identify overdue payments
- Early repayment options

### Notifications
- Real-time notification system
- Email, SMS, and in-app alerts
- Customizable notification preferences
- Loan status updates
- Payment reminders

### Dashboard
- Overview of loan portfolio
- Quick access to key metrics
- Recent activity feed
- Quick action buttons

## Project Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable components
│   │   ├── Navbar.js     # Navigation bar
│   │   └── Footer.js     # Footer component
│   ├── contexts/         # React contexts
│   │   ├── AuthContext.js    # Authentication state
│   │   └── NotificationContext.js  # Notification state
│   ├── pages/            # Page components
│   │   ├── Home.js               # Landing page
│   │   ├── Login.js              # Login page
│   │   ├── Register.js           # Registration page
│   │   ├── Dashboard.js          # Customer dashboard
│   │   ├── Profile.js            # Profile management
│   │   ├── LoanProducts.js       # Loan products listing
│   │   ├── LoanApplication.js    # Loan application form
│   │   ├── MyLoans.js            # User's loans
│   │   ├── RepaymentSchedule.js  # Repayment schedule
│   │   ├── Payments.js           # Payment management
│   │   └── Notifications.js      # Notification center
│   ├── services/         # API services
│   │   └── api.js        # Axios API client
│   ├── utils/            # Utility functions
│   ├── App.js            # Main app component with routing
│   ├── App.css           # Global styles
│   └── index.js          # Entry point
├── package.json          # Dependencies
└── README.md            # This file
```

## Technology Stack

- **Frontend Framework**: React 19.2.6
- **Routing**: React Router DOM 6.20.0
- **HTTP Client**: Axios 1.6.0
- **Styling**: CSS3 with custom design system
- **State Management**: React Context API
- **Build Tool**: Create React App

## Installation

### Prerequisites
- Node.js 14+ 
- npm or yarn

### Steps

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```

4. **Access the application**:
   - Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts

### `npm start`
Runs the app in development mode. The page will reload when you make changes.

### `npm test`
Launches the test runner in interactive watch mode.

### `npm run build`
Builds the app for production to the `build` folder.

### `npm run eject`
Removes the single build dependency (one-way operation).

## Pages and Routes

### Public Routes
- **/** - Home page with landing content
- **/login** - User login
- **/register** - User registration

### Protected Routes (Require Authentication)
- **/dashboard** - Customer dashboard
- **/profile** - Profile management
- **/loan-products** - Browse loan products
- **/apply-loan/:productId** - Apply for a specific loan
- **/my-loans** - View user's loans
- **/repayment-schedule/:loanId** - View repayment schedule
- **/payments** - Manage payments
- **/notifications** - Notification center

## API Integration

The frontend communicates with the Django backend through REST API endpoints. All API calls are handled through the `api.js` service.

## Authentication Flow

1. User registers or logs in
2. JWT token stored in localStorage
3. Token added to all API requests
4. Protected routes check authentication status
5. Auto-logout on token expiration

## Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Static Hosting
The `build` folder can be deployed to:
- Netlify
- Vercel
- AWS S3 + CloudFront
- GitHub Pages
- Any static hosting service

## License

This project is for educational purposes.
