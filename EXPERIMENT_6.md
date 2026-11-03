# Experiment 6: REST API with Node.js and Express

## Aim

Build and consume a REST API for campus assignments using Node.js and Express, with middleware to parse JSON and enable cross-origin requests.

## Resource and Current Routes

The resource is `assignments`. The current API is implemented in `server/src/index.js` and stores records in memory.

| Method | Endpoint | Purpose | Observed result |
| --- | --- | --- | --- |
| GET | `/api/assignments` | Read all assignments | 200 OK |
| GET | `/api/assignments/:id` | Read a single assignment by ID | 200 OK (or 404) |
| POST | `/api/assignments` | Create a new assignment | 201 Created |
| PUT | `/api/assignments/:id` | Update an existing assignment | 200 OK |
| PUT | `/api/assignments/:id/submit` | Mark an assignment submitted (used by frontend) | 200 OK; updated assignment returned |
| DELETE | `/api/assignments/:id` | Delete an assignment by ID | 200 OK; deleted record returned |

The server uses `express.json()` to parse JSON request bodies, `cors()` to allow cross-origin client requests, and a custom logging middleware `[timestamp] METHOD URL` to log every incoming request. Data is temporarily managed in memory.

## Run the Project

Start the assignment API in one terminal:

```powershell
npm --prefix server run dev:assignments
```

Start the client in another terminal:

```powershell
npm --prefix client run dev
```

Open `http://localhost:5173/`, enter the Student Portal, then open Assignments. Restart the API to restore the initial in-memory records if the pending assignment has already been submitted.

## Verified Output

The following results were observed against the running API on October 1, 2026.

### Read assignments

Request: `GET http://localhost:5000/api/assignments`

Response status: `200 OK`

The response contained two seeded records: `Lab 2: React Routing` (Pending) and `ER Diagram Report` (Submitted).

### Create an assignment

Request: `POST http://localhost:5000/api/assignments`

JSON body:

```json
{
  "subject": "CS3301 - Full Stack",
  "title": "Experiment 6 POST test"
}
```

Response status: `201 Created`

```json
{
  "id": 3,
  "subject": "CS3301 - Full Stack",
  "title": "Experiment 6 POST test",
  "status": "Pending"
}
```

### Submit an assignment

The Student Portal sends this request when **Submit Assignment** is clicked:

`PUT http://localhost:5000/api/assignments/1/submit`

Response status: `200 OK`

```json
{
  "id": 1,
  "subject": "CS3301 - Full Stack",
  "title": "Lab 2: React Routing",
  "status": "Submitted"
}
```

## Chrome Network Capture

1. Open the site in Chrome and press `F12` (or right-click and choose **Inspect**).
2. Select **Network**, then filter to **Fetch/XHR**.
3. Open the Student Portal and select **Assignments**. The list request is `GET /api/assignments`.
4. Click **Submit Assignment** on a pending item.
5. Select the `PUT /api/assignments/1/submit` request. Record its **Request Method**, **Status Code**, and the JSON under **Response**.
6. Capture a screenshot with the request selected and include it with the submission.

Expected submission request details: method `PUT`, path `/api/assignments/1/submit`, status `200`, response status `Submitted`.
