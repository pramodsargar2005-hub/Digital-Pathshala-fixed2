# Digital Pathshala — Basic Computer Skills for Rural School Students

**Created by: Pramod Vishnu Sargar**

A beginner-friendly learning website with computer lessons, keyboard practice, videos, a file lab, fake-message safety activities, quizzes, progress tracking, and student/teacher login.

## Requirements
- Node.js 18 or newer
- npm

## Run on Windows
1. Extract this ZIP to a normal folder.
2. Open that folder in File Explorer.
3. Click the address bar, type `cmd`, and press Enter.
4. Run:
   ```bat
   npm install
   npm start
   ```
5. Open **http://localhost:3000** in Chrome or Edge.

Keep the command window open while using the site. Press `Ctrl+C` in that window to stop the server.

## Troubleshooting
- If `npm` is not recognized, install Node.js from https://nodejs.org and reopen Command Prompt.
- If port 3000 is already in use, run `set PORT=3001` and then `npm start`; open http://localhost:3001.
- The File Lab, saved progress, and login features require the server. Do not open `index.html` directly as a file.
- The app stores its demo data locally in the project folder. Back up the `data` and `student-workspace` folders before resetting or replacing the project.

## Project author
Pramod Vishnu Sargar
