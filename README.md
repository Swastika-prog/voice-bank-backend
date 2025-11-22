# Audio to Text API using OpenAI Whisper

A Node.js and Express.js backend API that converts speech audio to text using OpenAI's Whisper API.

## Features

- 🎤 Audio to text transcription using OpenAI Whisper
- 📁 Support for multiple audio formats (mp3, wav, m4a, webm, ogg, flac)
- 🚀 RESTful API with Express.js
- 🔒 Secure file upload handling
- 📝 Configurable transcription options
- 📂 Process local files or upload files
- 📋 List available audio files in directory

## Prerequisites

- Node.js (v18 or higher) - Required for File API support
- npm or yarn
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

## Setup

1. **Clone or navigate to the project directory**
   ```bash
   cd "hackathon backend"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```bash
   touch .env
   ```
   
   Then edit `.env` and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_actual_api_key_here
   PORT=3000
   ```
   
   **Note:** Replace `your_actual_api_key_here` with your actual OpenAI API key from [OpenAI Platform](https://platform.openai.com/api-keys)

4. **Start the server**
   ```bash
   npm start
   ```

   The server will start on `http://localhost:3000`

## API Endpoints

### Health Check
```
GET /health
```
Returns server status.

### List Audio Files
```
GET /files
```
Returns a list of audio files in the current directory.

**Response:**
```json
{
  "success": true,
  "directory": "/path/to/directory",
  "files": ["samplemp3.mp3", "audio.wav"],
  "count": 2
}
```

### Transcribe Audio (Upload)
```
POST /transcribe
```
Upload and convert audio file to text.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body:
  - `audio` (file): Audio file to transcribe
  - `language` (optional, string): Language code (e.g., 'en', 'es', 'fr')
  - `temperature` (optional, number): Temperature for transcription (0-1)

**Response:**
```json
{
  "success": true,
  "text": "Transcribed text here",
  "language": "en",
  "duration": 10.5
}
```

### Transcribe Local File
```
POST /transcribe-file
```
Convert a local audio file (already in the directory) to text.

**Request:**
- Method: `POST`
- Content-Type: `application/json`
- Body:
  ```json
  {
    "filename": "samplemp3.mp3",
    "language": "en",
    "temperature": 0
  }
  ```

**Response:**
```json
{
  "success": true,
  "filename": "samplemp3.mp3",
  "text": "Transcribed text here",
  "language": "en",
  "duration": 10.5,
  "fileSize": "0.31 MB"
}
```

## Usage Examples

### List Available Files
```bash
curl -X GET http://localhost:3000/files
```

### Transcribe Local File (Recommended)
```bash
curl -X POST http://localhost:3000/transcribe-file \
  -H "Content-Type: application/json" \
  -d '{"filename": "samplemp3.mp3", "language": "en"}'
```

### Upload and Transcribe File
```bash
curl -X POST http://localhost:3000/transcribe \
  -F "audio=@path/to/your/audio.mp3" \
  -F "language=en"
```

### Using JavaScript (Fetch API)

**Transcribe Local File:**
```javascript
const response = await fetch('http://localhost:3000/transcribe-file', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    filename: 'samplemp3.mp3',
    language: 'en'
  }),
});

const result = await response.json();
console.log(result.text);
```

**Upload and Transcribe:**
```javascript
const formData = new FormData();
formData.append('audio', audioFile);
formData.append('language', 'en');

const response = await fetch('http://localhost:3000/transcribe', {
  method: 'POST',
  body: formData,
});

const result = await response.json();
console.log(result.text);
```

### Using Postman

**For Local Files:**
1. Create a POST request to `http://localhost:3000/transcribe-file`
2. Go to Body → raw → JSON
3. Add JSON: `{"filename": "samplemp3.mp3", "language": "en"}`
4. Send the request

**For File Upload:**
1. Create a POST request to `http://localhost:3000/transcribe`
2. Go to Body → form-data
3. Add a key `audio` with type `File` and select your audio file
4. (Optional) Add a key `language` with value like `en`
5. Send the request

## Supported Audio Formats

- MP3
- WAV
- M4A
- WebM
- OGG
- FLAC

## File Size Limit

Maximum file size: 25MB (OpenAI Whisper API limit)

## Error Handling

The API returns appropriate error messages for:
- Missing audio file
- Invalid file type
- File size too large
- Missing API key
- OpenAI API errors

## License

ISC

