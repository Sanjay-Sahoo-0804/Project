# WanderLust - Online Room Booking Platform

WanderLust is a full-stack web application modeled as a property marketplace platform, allowing users to list, discover, rent, and review unique accommodations worldwide. Built using the **MERN** stack with server-side rendering, the project implements secure user authentication, robust data validation, and seamless cloud-based media storage following the **Model-View-Controller (MVC)** architectural pattern.

---

## 🚀 Key Features

- **Full CRUD Functionality:** Seamlessly create, read, update, and delete property listings and user reviews.
- **Robust Authentication & Authorization:** Secured user registration, login sessions, and strict path authorization using Passport.js.
- **Data Validation & Sanitization:** Layered request sanitization using Joi validation schemas to protect database integrity.
- **Cloud-Based Asset Management:** Distributed media handling for property listings via Multer and Cloudinary integration.
- **Interactive Review System:** Multi-user review and feedback metrics styled with visual star-rating components.

---

## 🛠️ Tech Stack & Dependencies

- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose (ODM)
- **Templating Engine:** EJS (Embedded JavaScript), EJS-Mate (Layouts)
- **Authentication:** Passport.js, Passport-Local, Passport-Local-Mongoose
- **File Uploads:** Multer, Multer-Storage-Cloudinary, Cloudinary SDK
- **Validation & Security:** Joi, Method-Override, Connect-Flash, Cookie-Parser, Express-Session, Dotenv

---

## 📁 Project Architecture & Directory Structure

```text
WanderLust/
├── controllers/            # Business logic layer (maps models to views)
│   ├── listing.js          # Listing operations (Index, Show, Create, Edit, Delete)
│   ├── reviews.js          # Review creation and nested deletion logic
│   └── users.js            # User signup, login, and logout routines
├── init/                   # Database seeding and initialization tools
│   ├── data.js             # Mock property data array
│   └── index.js            # Seeding engine script
├── layouts/                # Global layout wrappers
│   └── boilerplate.ejs     # Main application layout frame (Navbar, Footer, Bootstrap)
├── models/                 # Database schema structures (Mongoose)
│   ├── listing.js          # Property Listing structure with review cascade deletion
│   ├── review.js           # Star rating and comment fields
│   └── user.js             # User identity structure integrated with Passport
├── public/                 # Static assets folder
│   ├── css/                # Custom cascading stylesheets (style.css, rating.css)
│   └── js/                 # Client-side utility scripts (script.js)
├── routes/                 # Express router endpoint files
│   ├── listing.js          # Modular listing router mappings
│   ├── review.js           # Modular review router with parameter merging
│   └── user.js             # Authentication routing paths
├── utils/                  # Global utilities and helper hooks
│   ├── ExpressError.js     # Custom asynchronous error builder class
│   └── wrapAsync.js        # Try-catch abstraction handler wrapper
├── views/                  # UI Templates (EJS)
│   ├── includes/           # Component fragments (navbar, footer, flash alerts)
│   ├── listings/           # Property interface templates (index, show, edit, new)
│   └── users/              # Auth workflows (login, signup layouts)
├── .env                    # Cloudinary & environment variable vault (gitignored)
├── app.js                  # Central system orchestration and server init script
├── schema.js               # Global Joi structural verification schemas
└── package.json            # Manifest file managing project dependencies
```

---

## ⚙️ Installation & Local Setup

Follow these sequential steps to set up the development environment locally:

### 1. Prerequisites
Ensure you have **Node.js** (v16+) and a **MongoDB** local instance or Atlas URI ready.

### 2. Clone the Repository
```bash
git clone https://github.com
cd Project-main
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Create a file named `.env` in the root folder of the project and plug in your cloud credentials:
```env
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
```

### 5. Seed the Database
Populate your MongoDB database cluster with fresh sample marketplace assets:
```bash
node init/index.js
```

### 6. Boot the Application Server
```bash
node app.js
```
The server will bind onto `http://localhost:8080/listings`. Open this link in your browser to verify execution.

---

## 🛣️ API & Route Endpoint Blueprint

### Property Listing Routes (`/listings`)
- `GET /listings` - Display all available marketplace properties.
- `GET /listings/new` - Render the form to build a new listing (Requires login).
- `POST /listings` - Process property insertion along with Cloudinary upload parameters.
- `GET /listings/:id` - Show deep specifications for a distinct property with its nested review array.
- `GET /listings/:id/edit` - Render the change management view layout (Requires listing ownership).
- `PUT /listings/:id` - Persist modified asset fields back to MongoDB.
- `DELETE /listings/:id` - Remove listing record and trigger cascading cleanup on attached reviews.

### Review Management Routes (`/listings/:id/reviews`)
- `POST /listings/:id/reviews` - Build a review object tied to a specific listing (Requires login).
- `DELETE /listings/:id/reviews/:reviewId` - Decouple reference links and wipe a review out from the database.

### Authentication & Account Routes (`/`)
- `GET /signup` - Fetch user registration interface layout.
- `POST /signup` - Register user profile credentials through encryption handlers.
- `GET /login` - Fetch session identity login page.
- `POST /login` - Authenticate profile attributes via Passport strategy blocks.
- `GET /logout` - Invalidate target session cookie to securely sign out the active profile.
