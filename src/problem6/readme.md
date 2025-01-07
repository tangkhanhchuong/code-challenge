# SCOREBOARD API MODULE SPECIFICATION
## 1. Generate Description
This module handles the scoreboard functionality for our web application. It is responsible for updating user scores in real time and providing the top 10 scores to the frontend.
## 2. Functional requirements
- **a. Live Scoreboard Updates:** The module provides real-time updates to the scoreboard displayed on the website.
- **b. Score Update:** It listens for API calls dispatched by users when they complete actions that increase their scores.
- **c. Authorization Checks:** The module includes mechanisms to prevent unauthorized score increases.

## 3. API Design
**a. Login:**
- **Endpoint:** POST /api/login
- **Description:** User login to application
- **Request Body:**
```
{
    "username": string,
	"password": string
}
```
**- Response:**
***Success (200):***
```
{
    "message": "Login successfully",
    "accessToken": "string"
}
```
***User not found (404):***
```
{
    "message": "User not found",
}
```
***Invalid username or password (401):***
```
{
    "message": "Invalid username or password",
}
```

**b. Update Score:**
- **Endpoint:** POST /api/action/complete
- **Description:** User completes an action to update his/her scores
- **Authorization:** Bearer
- **Request Body:**
```
{
    "userId": "uuid",
    "actionId": "uuid"
}
```
- **Response:**

***Success (200):***
```
{
    "message": "Score updated successfully",
    "newTotalScore": "integer"
}
```

***Error (401):***
```
{
    "message": "Unauthorized score update attempt"
}
```
**c. Get Leaderboard**
- **Endpoint:** GET /api/leaderboard
- **Description:** Fetches the top 10 user scores.
- **Response:**

***Success (200):***
```
[
    {
        "userId": "string",
        "username": "string",
        "score": "integer"
    }
]
```

## 4. Database Design
**a. Users Table**:
- **id**: uuid (primary key)
- **username**: string (not null, unique)
- **email**: string (not null, unique)
- **password**: string (not null)
- **score**: integer (not null, > 0)
- **created_at**: timestamp (default now)
- **updated_at**: timestamp (default now)
---------------------------------------------------
**b. Actions Table**
- **id**: uuid (primary key)
- **action_name**: string (not null)
- **score_increment**: integer (not null, > 0)
- **created_at**: timestamp (default now)
- **updated_at**: timestamp (default now)
- -------------------------------------------------
**c. Score Update Logs Table**
- **id**: uuid (primary key)
- **user_id**: string (not null, foreign key refer to **user**.id)
- **action_id**: string (not null, foreign key refer to **action**.id)
- **score_increment**: integer (not null, > 0)
- **created_at**: timestamp (default now)

## 5. Flow diagram
![alt text](<Screenshot from 2025-01-07 14-33-01.png>)

## 6. Additional Improvement
- **Rate Limiting:** Implement rate limiting on the score update endpoint to prevent abuse from rapid API calls.
- **WebSocket Implementation:** Consider using WebSocket for real-time updates, allowing the frontend to receive updates without polling the server.