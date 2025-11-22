# How to Run the Server Manually

## Step 1: Start the Server

Open a terminal in the project directory and run:

```bash
cd "/Users/durgaprasadnayak/Desktop/hackathon backend"
npm start
```

Or directly with Node.js:

```bash
node server.js
```

You should see:

```
Server is running on http://localhost:3000
Make sure to set OPENAI_API_KEY in your .env file
```

## Step 2: Test the Endpoints

### Option 1: Using cURL (Command Line)

#### 1. Check server health

```bash
curl http://localhost:3000/health
```

#### 2. List available audio files

```bash
curl http://localhost:3000/files
```

#### 3. Transcribe a local file (samplemp3.mp3)

```bash
curl -X POST http://localhost:3000/transcribe-file \
  -H "Content-Type: application/json" \
  -d '{"filename": "samplemp3.mp3", "language": "en"}'
```

#### 4. Upload and transcribe a file

```bash
curl -X POST http://localhost:3000/transcribe \
  -F "audio=@samplemp3.mp3" \
  -F "language=en"
```

### Option 2: Using Browser

Open these URLs in your browser:

1. **Health check:**

   ```
   http://localhost:3000/health
   ```

2. **List files:**

   ```
   http://localhost:3000/files
   ```

3. **API info:**
   ```
   http://localhost:3000
   ```

### Option 3: Using Postman

1. **Health Check:**

   - Method: `GET`
   - URL: `http://localhost:3000/health`
   - Click "Send"

2. **List Files:**

   - Method: `GET`
   - URL: `http://localhost:3000/files`
   - Click "Send"

3. **Transcribe Local File:**

   **Step-by-step:**

   1. Method: Select `POST` from dropdown
   2. URL: Enter `http://localhost:3000/transcribe-file`
   3. Go to **Headers** tab:
      - Key: `Content-Type`
      - Value: `application/json`
      - Make sure it's enabled (checkbox is checked)
   4. Go to **Body** tab:
      - Select **raw** (radio button)
      - In the dropdown next to "raw", select **JSON** (not Text)
      - In the text area, paste:
        ```json
        {
          "filename": "samplemp3.mp3",
          "language": "en"
        }
        ```
   5. Click **Send**

   **Important:**

   - Make sure "raw" is selected (not "form-data" or "x-www-form-urlencoded")
   - Make sure "JSON" is selected in the dropdown (not "Text")
   - The JSON must be valid (check for quotes, commas, brackets)
   - Make sure the Content-Type header is set to `application/json`

4. **Upload and Transcribe:**
   - Method: `POST`
   - URL: `http://localhost:3000/transcribe`
   - Body: Select "form-data"
   - Add key `audio` with type `File` and select your audio file
   - (Optional) Add key `language` with value `en`
   - Click "Send"

### Option 4: Using JavaScript/Node.js

Create a test file `test.js`:

```javascript
// Test transcribe-file endpoint
async function testTranscribeFile() {
  const response = await fetch("http://localhost:3000/transcribe-file", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      filename: "samplemp3.mp3",
      language: "en",
    }),
  });

  const result = await response.json();
  console.log("Transcription:", result.text);
}

// Run the test
testTranscribeFile();
```

Run it:

```bash
node test.js
```

## Step 3: Stop the Server

Press `Ctrl + C` in the terminal where the server is running.

## Quick Test Commands

Run these in order to test everything:

```bash
# 1. Start server (in one terminal)
npm start

# 2. In another terminal, test endpoints:

# Check health
curl http://localhost:3000/health

# List files
curl http://localhost:3000/files

# Transcribe samplemp3.mp3
curl -X POST http://localhost:3000/transcribe-file \
  -H "Content-Type: application/json" \
  -d '{"filename": "samplemp3.mp3", "language": "en"}'
```

## Troubleshooting

### Server won't start

- Check if port 3000 is already in use
- Make sure `.env` file exists with `OPENAI_API_KEY`
- Check Node.js version: `node --version` (should be 18+)

### File not found

- Make sure the audio file is in the same directory as `server.js`
- Check the filename is correct (case-sensitive)
- Use `GET /files` to see available files

### API key error

- Make sure `.env` file exists
- Check `OPENAI_API_KEY` is set correctly
- Restart the server after changing `.env`

### Postman "Filename is required" error

If you get `{"error": "Filename is required"}` in Postman:

1. **Check Body tab:**

   - Make sure **raw** is selected (not form-data)
   - Make sure **JSON** is selected in dropdown (not Text)
   - Check your JSON is valid:
     ```json
     {
       "filename": "samplemp3.mp3",
       "language": "en"
     }
     ```

2. **Check Headers tab:**

   - Make sure `Content-Type` header is set to `application/json`
   - The header should be enabled (checkbox checked)

3. **Verify the request:**

   - Method should be `POST`
   - URL should be `http://localhost:3000/transcribe-file`
   - Check the server console for debug logs

4. **Test with cURL first:**
   ```bash
   curl -X POST http://localhost:3000/transcribe-file \
     -H "Content-Type: application/json" \
     -d '{"filename": "samplemp3.mp3", "language": "en"}'
   ```
   If this works, the issue is with Postman configuration.

## Example Output

When you transcribe a file, you'll get:

```json
{
  "success": true,
  "filename": "samplemp3.mp3",
  "text": "The Maestro Cochlear Implant System was developed...",
  "language": null,
  "duration": null,
  "fileSize": "0.31 MB"
}
```
