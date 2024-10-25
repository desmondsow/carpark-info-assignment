# Carpark-Info
A take-home coding assignment for backend developer interview. 

## Your Task
1. Given the CSV dataset (hdb-carpark-information-<timestamp>.csv) that contains details of a list of carparks, design the database to store the given information in the dataset and to support the below given user stories. ER diagram should be provided.
2. Write a batch job that will process and store the information into the database of your choice. This is a daily delta file that will be interfaced over from source. In the event there is an error processing the records in the file, the entire file should rollback.
3. Write the APIs that will fulfill the below given user stories. Swagger documentation should be provided. No front-end screens are required to be developed - just the APIs. However, you should be prepared to articulate how the APIs are envisoned to be utilised by the front-end developer. :)

### User Stories
* As a user, I want to be able to filter the list of carpark by the following criteria:
  - Carpark that offer free parking
  - Carpark that offer night parking
  - Carpark that can meet my vehicle height requirement.
* As a user, I want to be able to add a specific carpark as my favourite.

## Getting Started
Please review the information in this section before you get started with your development. 

* Create a personal fork of the project on Github.
* Clone the fork on your local machine.
* Implement your solution and the rest of git basics applies.
* When you are ready, submit the forked repo for review by providing the link to the repo to our recruitment team.

### Tech Stack
You may choose to develop the application using either of the following stack:
* Spring Boot / Spring Batch with H2 database and ORM of your choice
* .NET Core 6.x with SQLite database and ORM of your choice
* Node.js with an in-memory database of your choice

Note: You are encouraged to try out .NET Core as Microsoft technologies are primarily used within the firm.

### Tools
You are free to choose the IDE (Integrated Development Environment) tool you are most comfortable with.

## Basic Expectation
* Ability to design data schema, apply normalisation technique and enhance query performances, if applicable.
* Write readable, maintainable, performant and well-documented codes.
* Code design / architecture should support implementation of unit testing.
* Code design / architecture should be flexible to changes / open to extensions, e.g. changing of data access technology, changing of interface file format from csv to JSON etc.
* Write clear and concise commit message.

## Challenge Yourself
Additional consideration to fine-tune your solution. It's not a must to implement in this assignment but please be prepared to discuss:
* The dataset has the potential to be large in size.
* Minimal human intervention for job recovery.
* Secure coding practices
* API authentication and authorisation

## Time Estimates
This assignment should take about 2 to 4 hours of your time depending on your level of experiences. 

## Need Help
Create a github issue. We'll get back to you.

## Running the Application

### Prerequisites
- Node.js (v20.18.0)
- npm

### Installation
1. Clone the repository:   
   ```bash
   git clone <repository-url>
   cd carpark-info
   ```

2. Install dependencies:   
   ```bash
   npm ci   
   ```

3. Create environment file:   
   ```bash
   cp .env.example .env   
   ```

4. Configure your environment variables in `.env` file:   
   ```env
   PORT=3000
   JWT_SECRET=your-secret-key
   DB_DIALECT=sqlite
   DB_STORAGE=./db/db.sqlite
   DB_LOGGING=false   
   ```

### Running the Application
1. Start the server:
   ```bash
   npm start   
   ```
   For development with auto-reload:
   ```bash
   npm run dev   
   ```

2. The server will start on http://localhost:3000

### API Documentation
- Swagger documentation is available at http://localhost:3000/api-docs
- You can test the APIs directly from the Swagger UI

### Authentication
1. Register a new user:   
   ```bash
   curl -X POST http://localhost:3000/api/auth/register \
   -H "Content-Type: application/json" \
   -d '{"username":"testuser","password":"password123"}'   
   ```

2. Login to get JWT token:
   ```bash
   curl -X POST http://localhost:3000/api/auth/login \
   -H "Content-Type: application/json" \
   -d '{"username":"testuser","password":"password123"}'   
   ```

3. Use the JWT token in subsequent requests:   
   ```bash
   curl -X GET http://localhost:3000/api/carparks \
   -H "Authorization: Bearer <your-jwt-token>"   
   ```