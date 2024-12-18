# Penscan

The increasing workload for educators, particularly in grading handwritten assessments, has created demand for tools that enhance efficiency without compromising accuracy. PenScan is an AI-powered application designed to automate the grading process for handwritten exam papers while providing detailed item analysis to support teaching and learning. The application integrates Optical Character Recognition (OCR) technology and advanced AI algorithms. PenScan offers features such as automated scoring, error review, feedback systems, and analytics. This study evaluates PenScan’s performance by testing its ability to recognize diverse handwriting styles, produce accurate and timely grades, and generate actionable insights through features like item difficulty and discrimination indices.

## Development

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
| Docker  |                       |

#### DATABASE

We primarily utilized `MongoDB`, a NoSQL database for the project.

## Installing Dependencies

-   Navigate to the client directory and run `npm install` to install the necessary client-side dependencies

### Running the program in development mode

-   To start both the client and server concurrently, navigate to the `client` directory and run the command: `npm run dev`
