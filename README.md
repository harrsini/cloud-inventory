# 📦 Cloud-Based Inventory Management System

A **serverless inventory management system** built using AWS services to help businesses manage products, track stock levels, record sales, and receive low-stock alerts in real time.

---

## 🚀 Features

- 🔐 Secure authentication using Amazon Cognito (JWT-based)
- 📊 View inventory and product details
- ➕ Add new products
- 🔄 Update stock levels
- 🧾 Record sales transactions
- ⚠️ Automatic low-stock alerts via Email & SMS
- 🌐 Fully serverless and scalable
- 🧪 Backend APIs tested using Postman

---

## 🛠️ Tech Stack

- **Frontend**: React  
- **Frontend Hosting & Setup**: AWS Amplify  
- **Authentication**: Amazon Cognito (User Pool + JWT Authorizer)  
- **API Layer**: Amazon API Gateway (HTTP API)  
- **Backend**: AWS Lambda (Node.js)  
- **Database**: Amazon DynamoDB  
- **Notifications**: Amazon SNS (Email & SMS)  
- **Testing Tool**: Postman  


## 🔐 Authentication Flow

1. User logs in via Cognito Hosted UI
2. Cognito issues a JWT access token
3. Token is sent in every API request:
Authorization: Bearer <JWT_TOKEN>
4. API Gateway validates the token using JWT Authorizer

---

## 🌐 API Gateway Routes

Base URL:
https://psrd9jxg84.execute-api.us-east-1.amazonaws.com


| Method | Route       | Description                  |
|------|------------|------------------------------|
| GET  | /inventory | Fetch inventory summary      |
| POST | /products  | Add new product              |
| GET  | /products  | Get all products             |
| PUT  | /stock     | Update stock quantity        |
| POST | /sales     | Record sales transaction     |
| OPTIONS | /stock  | CORS preflight handling      |

> ✅ All routes use the **same Lambda integration** and **same Cognito authorizer**

---

## 🧠 Backend Logic (Lambda)

Each Lambda function handles a specific responsibility:

- **addProduct** → Adds product to DynamoDB  
- **getProducts** → Fetches product catalog  
- **getInventory** → Fetches stock status  
- **updateStock** → Updates stock & checks threshold  

Low-stock logic:
If stockCount < threshold → trigger SNS alert
🗄️ DynamoDB Tables
Products Table
productId (Partition Key)

productName

category

price

quantity

threshold

createdAt

lastUpdated

Inventory Table
productId (Partition Key)

stockCount

lastUpdated

Capacity Mode: On-Demand

📢 Low-Stock Alerts (SNS)
SNS Topic: low-stock-alerts

Triggered from updateStock Lambda

Notifications sent via:

📧 Email

📱 SMS

Example alert:
⚠️ Low Stock Alert: Product XYZ is below threshold
🌍 CORS Configuration
OPTIONS /stock route enabled

API Gateway returns:
Access-Control-Allow-Origin: *
Access-Control-Allow-Headers: Authorization, Content-Type
Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS
Ensures smooth browser-to-API communication from React frontend

🧪 Backend Testing (Postman)
Backend APIs were tested using Postman before frontend integration:

JWT token added as Bearer Token

Verified:

Authorization

Request/response payloads

DynamoDB read/write

SNS alert triggering

This ensured backend stability before UI integration.

🔁 End-to-End Workflow
React (Amplify)
   ↓
Cognito Authentication (JWT)
   ↓
API Gateway (Authorizer + CORS)
   ↓
AWS Lambda
   ↓
DynamoDB
   ↓
SNS (Low-Stock Alerts)
📌 Project Highlights
Fully serverless architecture

Secure JWT-based authentication

Event-driven alert system

Scalable & cost-efficient

Industry-standard AWS design

👩‍💻 Author
Harrsini M S
AWS Cloud Intern @ F13 Technologies
AWS Cloud Intern

