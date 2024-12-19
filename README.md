<div style="display: flex; align-items: center;">
  <img src="https://github.com/ritchelmendaros/penscan/blob/main/client/public/penscan.png?raw=true" alt="PenScan Logo" style="height: 80px; margin-right: 10px;">
  <h1>Penscan: Handwritten Exam Checker and Analytics</h1>
</div>


<div align="justify">
The increasing workload for educators, particularly in grading handwritten assessments, has created demand for tools that enhance efficiency without compromising accuracy. PenScan is an AI-powered application designed to automate the grading process for handwritten exam papers while providing detailed item analysis to support teaching and learning. The application integrates Optical Character Recognition (OCR) technology and advanced AI algorithms. PenScan offers features such as automated scoring, error review, feedback systems, and analytics. This study evaluates PenScan’s performance by testing its ability to recognize diverse handwriting styles, produce accurate and timely grades, and generate actionable insights through features like item difficulty and discrimination indices.
</div>


## Development

### Technology Stack
We used the following tech-stack for development:

  
#### CLIENT-SIDE

| Package      | Version  |
| ------------ | -------- |
| Vite         | v.5.3.4  |
| React        | v.18.3.1 |
| TypeScript   | v.5.2.2  |
| Sass         | v.1.77.8 |
| Tailwind CSS | v.3.4.15 |

#### SERVER-SIDE

| Package | Version               |
| ------- | --------------------- |
| OpenJDK | openjdk:17-jdk-alpine |
| Docker  | v.27.1.1              |

#### DATABASE

We primarily utilized `MongoDB`, a NoSQL database for the project.

## Installing Dependencies

### Client-Side Setup
#### 1. Install client-side dependencies
- Navigate to the `client` directory and run `npm install` to install the necessary client-side dependencies
#### 2. Create an Environment File
- Create a .env file in the `root` of the `client` directory with the following content:
```bash
VITE_API_BASE_URL=http://localhost:8080/
```
- Replace http://localhost:8080/ with the actual server API URL based on your setup.

### Server-Side Setup
#### 1. Set Up Azure Computer Vision API
- Create an Azure Account: Sign up for an Azure account if you don’t already have one.
- Create a Computer Vision Resource:
  
    - Navigate to the Azure portal and search for "Computer Vision."
    - Create a resource and note the Endpoint and API Key.
#### 2. Set Up Groq API
- Sign Up for Groq API: Visit the Groq API page and set up an account.
- Generate an API Key:
  
    - Follow the instructions to generate an API key for your application.

## Running the program in development mode

-   To start both the client and server concurrently, navigate to the `client` directory and run the command: `npm run dev`

## User Access Guide Instructions
### For Teacher Access

#### 1. Sign Up as a Teacher:

- Go to the "Sign Up" page and create an account with the "Teacher" role.
  
#### 2. Log In:

- Use the credentials from the sign-up process to log in.
  
#### 3. Create a Class:

- Navigate to the "Classes" section.
- Click "Add New Class" and provide the required details (e.g., class name).
- Take note of the Class Code generated after creating the class. Share this code with students so they can join the class.

#### 4. Add Students (Optional):

- If preferred, manually add students to the class by clicking "Add Students" in the class details.
  
#### 5. Add a Quiz:

- Navigate to the "Quizzes" section.
- Select the class and create a quiz by adding questions.
- View Uploaded Quizzes and Analytics:

#### 6. Navigate to the "Dashboard" to view submitted quizzes and analytics for the class.
#### 7. Access the "Item Analysis" feature for insights into question performance (e.g., item difficulty, discrimination indices).

### For Student Access

#### 1. Sign Up as a Student:

- Go to the "Sign Up" page and create an account with the "Student" role.
  
#### 2. Join a Class:

- Obtain the Class Code from your teacher.
- Navigate to the "Join Class" section and enter the class code to join.
  
#### 3. Navigate to a Class:

- After joining, select the class from the dashboard to access its contents.
  
#### 4. Upload a Quiz:

- In the class view, view a Quiz and then use the "Upload" feature to submit scanned answer sheets.
  
#### 5. Review Your Submission:

- Review your uploaded quiz to ensure everything is correct.
- Edit or resubmit if necessary.
