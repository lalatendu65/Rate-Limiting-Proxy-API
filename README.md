**Project Overview**

ProxyApiservices_backend is a backend service designed to handle API requests and proxies them to other services. 
It follows a modular structure with clearly separated concerns for controllers, middleware, models, routes, and utilities.


**Prerequisites**:

Before you begin, ensure you have met the following requirements:

Node.js (v20 or higher)

npm or yarn

TypeScript (if not globally installed)

**Installation**: 

Clone the repository:(https://github.com/lalatendu65/Rate-Limiting-Proxy-API.git)

Navigate to the project directory:cd ProxyApiservices_backend

Install dependencies:npm install

**Usage**:

Create a .env file in the root directory of the project. You can use the provided 

In env files include PORT ,MONGO_URL, JWT_SECRET_KEY,NODE_TLS_REJECT_UNAUTHORIZED

Start the application:npm run dev

The server will start on the default port (8080). You can access the API at http://localhost:8080

**Environment Variables**:

The following environment variables are required for the application to run:

MONGODB_URI: The connection string for your MongoDB database.

PORT: (Optional) The port the server will run on (default is 8080).
JWT_SECRET_KEY : to create the token 
NODE_TLS_REJECT_UNAUTHORIZED=0

Make sure to create your own values for these variables.

**API Endpoints:**

Go through the APi documnet that avalibale  POSTMAN 

POSTAMN LINK : https://lunar-astronaut-645857.postman.co/workspace/Team-Workspace~35e4d489-294a-4077-8a2d-6625c7dec53c/collection/24434283-de60299b-973e-4147-9c95-9c5a6adffacf?action=share&creator=24434283


