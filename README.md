# HelpHub - Social Emergency Help Platform

A web application designed to connect people in emergency situations with nearby assistance and resources. HelpHub enables users to request help, browse available assistance, and manage their profiles in a secure and efficient manner.

## 🌟 Features

- **User Authentication & Authorization**: Register and login with secure credentials
- **Emergency Help Requests**: Create and manage help requests with location-based features
- **Help Discovery**: Browse and respond to help requests in your area
- **User Profiles**: Manage personal information and help history
- **Real-time Location Mapping**: Integrated map view for help requests using Leaflet
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

### Backend
- **Java 23** - Modern JVM runtime
- **Spring Boot 4.0.5** - Enterprise framework
- **Spring Data JPA** - ORM and database access
- **MySQL 8.0** - Relational database
- **Maven 3.9.14** - Build and dependency management
- **Hibernate 7.2.7** - Object-relational mapping

### Frontend
- **React 19.2.4** - UI library
- **Vite 8.0.1** - Build tool and dev server
- **React Router 7.13.2** - Client-side routing
- **Leaflet + React-Leaflet** - Interactive maps
- **Tailwind CSS** (via Heroicons) - Styling and UI components

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Java Development Kit (JDK) 23** or higher
- **Node.js 16** or higher
- **npm 8** or higher
- **MySQL Server 8.0** or higher
- **Git** for version control

## 🚀 Getting Started

### Clone the Repository

```bash
git clone https://github.com/anishr01/HelpHub.git
cd HelpHub
```

### Setup MySQL Database

1. Create a MySQL database:
```sql
CREATE DATABASE helphubdb;
```

2. Update database credentials in `backend/src/main/resources/application.properties`:
```properties
spring.datasource.username=YOUR_DB_USER
spring.datasource.password=YOUR_DB_PASSWORD
```

### Build and Run Backend

```bash
cd backend

# Set Java 23 as the active JDK
set JAVA_HOME=C:\Program Files\Java\jdk-23

# Build the project
mvnw clean install

# Run the server (defaults to http://localhost:8082)
mvnw spring-boot:run
```

The backend API will be available at `http://localhost:8082`

### Build and Run Frontend

In a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be available at `http://localhost:5173` (or next available port)

## 📁 Project Structure

```
HelpHub/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/helphub/
│   │   │   │   ├── BackendApplication.java
│   │   │   │   ├── config/          # Spring configuration
│   │   │   │   ├── controllers/     # REST API endpoints
│   │   │   │   ├── models/          # Entity classes
│   │   │   │   ├── repositories/    # Database access
│   │   │   │   └── services/        # Business logic
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/                    # Test classes
│   ├── pom.xml                      # Maven configuration
│   └── mvnw/mvnw.cmd               # Maven wrapper
│
├── frontend/
│   ├── src/
│   │   ├── components/             # React components
│   │   ├── pages/                  # Page components
│   │   ├── context/                # React context
│   │   ├── App.jsx                 # Root component
│   │   └── main.jsx                # Entry point
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── eslint.config.js
│
└── README.md
```

## 🔧 Configuration

### Backend Configuration (`backend/src/main/resources/application.properties`)

```properties
# Server Port
server.port=8082

# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/helphubdb
spring.datasource.username=root
spring.datasource.password=1234

# Hibernate Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
```

### Frontend Configuration

The frontend is configured in `vite.config.js` and communicates with the backend API at `http://localhost:8082`

## 🧪 Testing

### Run Backend Tests

```bash
cd backend
mvnw clean test
```

## 🛠️ Build for Production

### Backend

```bash
cd backend
mvnw clean package
```

### Frontend

```bash
cd frontend
npm run build
```

The production build will be available in the `frontend/dist/` directory.

## 📝 API Endpoints

### User Management
- `GET /api/users` - Get all users
- `GET /api/users/{id}` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

### Help Requests
- `GET /api/help-requests` - Get all help requests
- `GET /api/help-requests/{id}` - Get help request by ID
- `POST /api/help-requests` - Create new help request
- `PUT /api/help-requests/{id}` - Update help request
- `DELETE /api/help-requests/{id}` - Delete help request

## 🔒 Security

- CORS is configured for secure cross-origin requests
- Input validation on all API endpoints
- Password encryption for user authentication
- SQL parameterized queries to prevent SQL injection

## 🚨 Troubleshooting

### Port Already in Use
If port 8082 (backend) or 5173 (frontend) is already in use, you can change them in:
- Backend: `backend/src/main/resources/application.properties` (`server.port`)
- Frontend: `frontend/vite.config.js` or it will auto-increment to the next available port

### Database Connection Error
Ensure MySQL is running and accessible with the credentials specified in `application.properties`

### Node Module Issues
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

## 📦 Dependencies

### Backend Major Dependencies
- spring-boot-starter-web
- spring-boot-starter-data-jpa
- spring-boot-starter-validation
- mysql-connector-j
- projectlombok
- hibernate-core

### Frontend Major Dependencies
- react
- react-dom
- react-router-dom
- leaflet
- react-leaflet
- @heroicons/react

See `backend/pom.xml` and `frontend/package.json` for complete dependency lists.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📧 Contact

For questions or suggestions, please reach out:
- GitHub: [@anishr01](https://github.com/anishr01)
- Project Link: [HelpHub on GitHub](https://github.com/anishr01/HelpHub)

## 🙏 Acknowledgments

- Spring Boot framework and community
- React and Vite teams
- Leaflet.js for mapping functionality
- All contributors and supporters

---

**Last Updated**: March 30, 2026
