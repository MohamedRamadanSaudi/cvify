# API Reference

## Base URL

```
http://localhost:3000/api
```

## Profiles Endpoints

### Create Profile

```http
POST /api/profiles
Content-Type: application/json

{
  "profileName": "John Doe - Software Engineer",
  "email": "john@example.com"
}
```

**Response:** Profile object with ID

---

### Get All Profiles

```http
GET /api/profiles
```

**Response:** Array of profiles (summary only)

```json
[
  {
    "id": 1,
    "profileName": "John Doe - Software Engineer",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

### Get Profile by ID

```http
GET /api/profiles/:id
```

**Response:** Complete profile object with all data

---

### Update Profile

```http
PATCH /api/profiles/:id
Content-Type: application/json

{
  "fullName": "John Doe",
  "title": "Senior Software Engineer",
  "phone": "+1234567890",
  "location": "San Francisco, CA",
  "summary": "Experienced developer...",
  "skills": ["JavaScript", "React", "Node.js"],
  "links": [
    {"label": "GitHub", "url": "https://github.com/johndoe"}
  ],
  "education": [
    {
      "institution": "University",
      "degree": "BS Computer Science",
      "startDate": "2015",
      "endDate": "2019"
    }
  ],
  "experiences": [
    {
      "company": "Tech Corp",
      "position": "Software Engineer",
      "startDate": "2019",
      "endDate": "Present",
      "description": "Built web applications"
    }
  ],
  "projects": [],
  "activities": [],
  "volunteering": [],
  "certificates": [
    {
      "name": "Certified Kubernetes Administrator",
      "issuer": "CNCF",
      "date": "2023-05",
      "url": "https://...",
      "summary": "..."
    }
  ]
}
```

**Response:** Updated profile object

---

### Delete Profile

```http
DELETE /api/profiles/:id
```

**Response:** Deleted profile object

**Note:** This also deletes all associated CVs and PDF files

---

## CVs Endpoints

### Generate CV

```http
POST /api/cvs/generate
Content-Type: application/json

{
  "profileId": 1,
  "jobDescription": "We are looking for a Senior Software Engineer..."
}
```

**Response:** PDF file (application/pdf)

**Headers:**

- Content-Type: application/pdf
- Content-Disposition: attachment; filename=cv.pdf

---

### Get All CVs

```http
GET /api/cvs
```

**Response:** Array of all CVs with profile info

```json
[
  {
    "id": 1,
    "profileId": 1,
    "jobDescription": "...",
    "pdfPath": "uploads/cvs/cv_1_1234567890.pdf",
    "cvData": {...},
    "createdAt": "2024-01-01T00:00:00.000Z",
    "profile": {
      "id": 1,
      "email": "john@example.com",
      "fullName": "John Doe"
    }
  }
]
```

---

### Get CV by ID

```http
GET /api/cvs/:id
```

**Response:** Single CV object with profile info

---

### Get CVs by Profile

```http
GET /api/cvs/profile/:profileId
```

**Response:** Array of CVs for specific profile

---

### Download CV

```http
GET /api/cvs/:id/download
```

**Response:** PDF file

---

### Regenerate CV

```http
GET /api/cvs/:id/regenerate
```

**Response:** Regenerated PDF from stored data (no AI call)

---

### Update CV Data

```http
PATCH /api/cvs/:id/cv-data
Content-Type: application/json

{
  // Complete CV data structure
}
```

**Response:** Updated CV object

**Note:** This regenerates the PDF with new data

---

### Delete CV

```http
DELETE /api/cvs/:id
```

**Response:** Deleted CV object

**Note:** This also deletes the PDF file

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "statusCode": 400,
  "message": "Error message here",
  "error": "Bad Request"
}
```

Common status codes:

- `400` - Bad Request (validation error)
- `404` - Not Found
- `500` - Internal Server Error
