# PDF Generation Feature

## Overview

Implemented CV generation as PDF using pdfmake library. When a user requests `/cvs/generate`, the system generates an optimized CV based on a job description and returns it as a downloadable PDF file.

## Implementation Details

### Dependencies Installed

```bash
pnpm add pdfmake
pnpm add -D @types/pdfmake
```

### Architecture

#### Flow

1. **Request** → POST `/cvs/generate` with `{ userId, jobDescription }`
2. **Fetch User Data** → Get user profile from database (Prisma)
3. **Generate Optimized CV** → Use Groq AI to analyze job description and optimize CV
4. **Create PDF** → Use pdfmake to generate formatted PDF
5. **Response** → Return PDF file as download

### Files Modified

#### 1. `src/app.module.ts`

- Added `ConfigModule.forRoot({ isGlobal: true })` to make environment variables available globally

#### 2. `src/groq/groq.module.ts`

- Imported `ConfigModule` to make `ConfigService` available
- Exported `GroqService` for use in other modules

#### 3. `src/groq/groq.service.ts`

- Fixed prompt file path to use `path.join(__dirname, 'prompt.md')`
- This ensures the prompt file is found regardless of where the app is run from

#### 4. `src/cvs/cvs.module.ts`

- Imported `PrismaModule` and `GroqModule` for dependency injection

#### 5. `src/cvs/cvs.controller.ts`

- Updated to return PDF as response
- Set proper headers:
  - `Content-Type: application/pdf`
  - `Content-Disposition: attachment; filename=cv.pdf`
  - `Content-Length: [buffer length]`

#### 6. `src/cvs/cvs.service.ts`

- Complete rewrite to handle PDF generation
- Fetches user data from database
- Calls Groq service to get optimized CV JSON
- Generates formatted PDF with multiple sections

### PDF Design

The generated PDF includes the following sections (when data is available):

1. **Header**
   - Full name (large, bold)
   - Job title
   - Contact info (email, phone, location)

2. **Links**
   - Professional links (LinkedIn, GitHub, Portfolio, etc.)

3. **Professional Summary**
   - Tailored summary matching job requirements

4. **Skills**
   - Comma-separated list of relevant skills

5. **Experience**
   - Job title, company, location
   - Employment type and dates
   - Description of responsibilities and achievements

6. **Projects**
   - Project title and dates
   - Description
   - Technologies used

7. **Education**
   - Degree and field of study
   - School name and location
   - Grade (if available)
   - Additional description

8. **Activities**
   - Title, role, and dates
   - Description

9. **Volunteering**
   - Role and organization
   - Location and dates
   - Description

### Styling

```typescript
styles: {
  header: { fontSize: 24, bold: true, color: '#2c3e50' },
  subheader: { fontSize: 16, color: '#34495e' },
  contact: { fontSize: 10, color: '#7f8c8d' },
  sectionHeader: { fontSize: 14, bold: true, color: '#2c3e50', decoration: 'underline' },
  jobTitle: { fontSize: 12, bold: true },
  company: { fontSize: 11, color: '#34495e', italics: true },
  date: { fontSize: 10, color: '#7f8c8d' },
  employmentType: { fontSize: 10, color: '#7f8c8d' },
  technologies: { fontSize: 10, color: '#16a085', italics: true },
}
```

### Error Handling

- Returns 500 error if user not found
- Returns 500 error if Groq fails to generate CV data
- Returns 500 error if PDF generation fails
- All errors are properly logged

### API Usage

#### Endpoint

```
POST /cvs/generate
```

#### Request Body

```json
{
  "userId": 1,
  "jobDescription": "We are looking for a Senior Full-Stack Developer with experience in React, Node.js, and PostgreSQL..."
}
```

#### Response

- **Content-Type**: `application/pdf`
- **Status**: 200 OK
- **Body**: PDF file (binary)

#### Example with cURL

```bash
curl -X POST http://localhost:3000/cvs/generate \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "jobDescription": "Senior Developer position requiring React and Node.js experience"
  }' \
  --output cv.pdf
```

#### Example with Postman

1. Method: POST
2. URL: `http://localhost:3000/cvs/generate`
3. Headers: `Content-Type: application/json`
4. Body (raw JSON):

```json
{
  "userId": 1,
  "jobDescription": "Your job description here"
}
```

5. Click "Send and Download" to save the PDF

### Environment Variables Required

Make sure you have a `.env` file with:

```env
GROQ_API_KEY=your_groq_api_key_here
DATABASE_URL=your_postgresql_connection_string
```

### PDF Generation Process

The `generatePdf()` method:

1. Defines fonts (uses pdfmake's built-in Roboto)
2. Creates a `PdfPrinter` instance
3. Builds document definition with content and styles
4. Creates PDF document using `printer.createPdfKitDocument()`
5. Returns a Promise that resolves to a Buffer
6. Buffer is sent as HTTP response

### Benefits

✅ **Professional Format** - Clean, readable CV layout  
✅ **Tailored Content** - AI-optimized for specific job requirements  
✅ **Automatic Formatting** - Consistent styling across all CVs  
✅ **Download Ready** - Instant PDF download  
✅ **Comprehensive** - Includes all relevant sections  
✅ **Flexible** - Handles missing data gracefully (empty arrays)

### Future Enhancements

- [ ] Add template selection (different CV styles)
- [ ] Include profile photo
- [ ] Custom color schemes
- [ ] Multiple language support
- [ ] Save generated CVs to database
- [ ] Add caching for frequently generated CVs

## Date Implemented

October 18, 2025
