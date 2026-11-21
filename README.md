# EscapeRentals 🏡
### Discover your perfect stay. Book your next escape.

EscapeRentals is a full-stack property rental platform designed to help users discover, explore, and book beautiful properties for their next vacation or getaway. The platform provides an intuitive browsing experience, detailed property listings, secure user authentication, booking management, wishlists, and reviews.

Built with **Next.js, React, FastAPI, and MySQL**, EscapeRentals offers a modern, responsive, and user-friendly experience for travelers and property managers.

---

## ✨ Features

### 👤 User Features
- User registration and login
- JWT-based authentication
- User profile management
- Profile image uploads
- Browse available properties
- Explore properties by category
- Search and filter properties
- View detailed property information
- Property image gallery
- View property location on map
- Booking with check-in, check-out, and guest selection
- Manage personal bookings
- Update booking details
- Cancel bookings
- Add properties to wishlist
- Remove properties from wishlist
- View property reviews and ratings

### 🏡 Property Features
- Property listings with detailed information
- Property categories
- Property descriptions
- Property location
- Price per night
- Guest capacity
- Multiple property images
- Cover image
- Availability and active status
- Latitude and longitude for map integration

### 🛠️ Admin Features
- Admin authentication and authorization
- Category management
- Property management
- Create, update, and delete properties
- Manage property images
- Manage property categories
- View and manage users
- Administrative data management

### 🎨 UI & Experience
- Responsive design
- Modern and clean user interface
- Reusable React components
- Interactive property cards
- Image sliders and galleries
- Loading indicators
- Form validation
- User-friendly error handling

---

## 🧰 Tech Stack

### Frontend
- Next.js
- React.js
- JavaScript (ES6+)
- Tailwind CSS
- Formik
- Yup
- Axios
- React Icons
- React Slick
- Redux Toolkit

### Backend
- FastAPI
- Python
- SQLAlchemy
- Pydantic
- JWT Authentication
- Passlib
- REST API

### Database
- MySQL

### Tools
- Git
- GitHub
- VS Code
- Postman

---

## 📁 Project Structure

### Frontend

```text
EscapeRentals/
├── app/
│   ├── (protected)/
│   ├── properties/
│   ├── booking/
│   ├── update-booking/
│   ├── cancel-booking/
│   ├── my-bookings/
│   ├── wishlist/
│   ├── profile/
│   ├── contact/
│   ├── about/
│   └── login/
│
├── components/
│   ├── layout/
│   ├── properties/
│   ├── booking/
│   ├── contact/
│   ├── about/
│   └── common/
│
├── redux/
├── utils/
├── public/
├── package.json
└── README.md
```

### Backend

```text
Backend/
├── routers/
│   ├── users/
│   ├── properties/
│   ├── categories/
│   ├── booking/
│   ├── wishlist/
│   └── reviews/
│
├── models/
├── schemas/
├── database/
├── uploads/
├── utils/
├── main.py
├── requirements.txt
└── .env
```

*Folder structures may vary depending on the current implementation.*

---

## ⚙️ Installation & Setup

### Prerequisites

Make sure you have installed:

- Node.js
- npm
- Python
- MySQL
- Git

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/escape-rentals.git
```

Navigate to the project directory:

```bash
cd escape-rentals
```

---

### 2. Frontend Setup

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env.local` file in your frontend root:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/
```

Run the development server:

```bash
npm run dev
```

Frontend will be available at:

```text
http://localhost:3000
```

---

### 3. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate the virtual environment.

#### Windows

```bash
venv\Scripts\activate
```

#### Linux / macOS

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

---

### 4. Database Configuration

Create a MySQL database:

```sql
CREATE DATABASE escape_rentals;
```

Configure your backend `.env` file:

```env
DATABASE_URL=mysql+pymysql://username:password@localhost/escape_rentals

SECRET_KEY=your_secret_key
ALGORITHM=HS256

ACCESS_TOKEN_EXPIRE_MINUTES=30
```

Replace the database credentials and secret values with your own configuration.

---

### 5. Run the Backend

Start the FastAPI server:

```bash
uvicorn main:app --reload
```

Backend API:

```text
http://127.0.0.1:8000
```

FastAPI interactive API documentation:

```text
http://127.0.0.1:8000/docs
```

---

## 🔐 Authentication

EscapeRentals uses JWT-based authentication to secure user-specific operations.

Authentication features include:

- User registration
- Login
- Access tokens
- Refresh tokens
- Protected API endpoints
- User-specific booking management
- Wishlist access
- Admin authorization

Protected requests use the Bearer token format:

```http
Authorization: Bearer <access_token>
```

---

## 🏘️ Property Booking Workflow

1. Browse available properties.
2. Explore property details and images.
3. Select check-in and check-out dates.
4. Enter the number of guests.
5. Review booking information.
6. Submit the booking.
7. Manage bookings from the My Bookings section.

---

## 🗺️ Property Location

Properties can include geographical coordinates:

- Latitude
- Longitude

These coordinates can be used to display property locations and support map-based property discovery.

---

## 📡 API Overview

| Module | Description |
|---|---|
| Users | Registration, login, profile, authentication |
| Properties | Property listing and property details |
| Categories | Property category management |
| Booking | Create and manage bookings |
| Wishlist | Manage saved properties |
| Reviews | Ratings and guest feedback |
| Contact | Contact form submissions |

API endpoints and request formats are documented through FastAPI Swagger UI.

---

## 🎯 Project Goals

EscapeRentals aims to:

- Simplify property discovery
- Provide an intuitive booking experience
- Connect travelers with suitable accommodations
- Make property information easy to access
- Provide secure user account management
- Improve the overall vacation rental experience

---

## 🚀 Future Improvements

- Online payment integration
- Advanced property filters
- Real-time booking availability
- Email notifications
- Booking confirmation emails
- Improved admin analytics dashboard
- Advanced map-based property search
- Automated review system
- Booking-related notifications

---

## 👨‍💻 Developer

**Adarshraj Shah**

Full Stack Developer | Python | FastAPI | React | Next.js

GitHub: [@adarshrajshah04](https://github.com/adarshrajshah04)

---

## 📄 License

This project is developed for learning, development, and portfolio purposes.

---

<p align="center">
  Made with ❤️ for better travel experiences.
</p>
