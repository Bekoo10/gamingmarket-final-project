GamingMarket – Web Programming Final Project

GamingMarket is a full-stack web application developed as a final project for the Web Programming course. The project is designed as a simple e-commerce system for gaming-related products such as laptops, components, peripherals and accessories. The application includes product listing, product detail view, cart management and a basic checkout flow.

The frontend of the application is implemented using React and Material UI, and the backend is developed using Spring Boot. Product data is stored in a PostgreSQL database and is accessed through REST API endpoints provided by the backend.

The project structure is organized as follows

SourceCodefrontend — React + Material UI frontend
SourceCodebackend — Spring Boot backend application
SourceCodedatabase — PostgreSQL database backup file (structure + sample data)

Before running the project, the database must be restored in PostgreSQL using the backup file located in the database folder. After restoring the database, the backend configuration file (application.properties) should be updated if the PostgreSQL username, password or database name is different on the target system.

The backend application can be started using Spring Boot and runs on localhost. The frontend application contains all dependency definitions in the package.json file. The dependencies can be installed using npm install, and the application can be started using npm start. The frontend communicates with the backend API and retrieves product data from the database through the backend service.

This project demonstrates the development of a functional full-stack web application and the integration of frontend, backend and database components within a single system.
