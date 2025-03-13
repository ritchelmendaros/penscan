package com.softeng.penscan.service;

import com.softeng.penscan.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.bson.BsonBinarySubType;
import com.google.gson.JsonObject;
import com.google.gson.JsonArray;
import com.google.gson.JsonParser;
import org.bson.types.Binary;
import java.util.function.Function;
import java.util.stream.Collectors;

import com.softeng.penscan.repository.ActivityLogRepository;
import com.softeng.penscan.repository.ItemAnalysisRepository;
import com.softeng.penscan.repository.QuizRepository;
import com.softeng.penscan.repository.StudentQuizRepository;
import com.softeng.penscan.repository.StudentRepository;
import com.softeng.penscan.repository.UserRepository;
import com.softeng.penscan.utils.ImagePreprocessing;
import com.softeng.penscan.utils.MultipartFileUtil;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.util.HashMap;
import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.Optional;
import java.util.TreeMap;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.net.URL;
import java.nio.charset.StandardCharsets;

@Service
public class StudentQuizService {

    @Autowired
    private StudentQuizRepository studentQuizRepository;

    @Autowired
    private AzureTextRecognitionService azureTextRecognitionService;

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ActivityLogRepository activityLogRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private ItemAnalysisRepository itemAnalysisRepository;

    @Autowired
    private MongoTemplate mongoTemplate;

    @Autowired
    private ImagePreprocessing imagePreprocessing;

    public String addStudentQuiz(String quizid, MultipartFile image) throws IOException, InterruptedException {
        String recognizedText = azureTextRecognitionService.recognizeText(image);

        String normalizedText = normalizeRecognizedText(recognizedText);
        String[] recognizedLines = normalizedText.split("\\n");

        String name = recognizedLines.length > 0 ? recognizedLines[0].trim() : "";
        String[] nameParts = name.split("\\s+");
        if (nameParts.length < 2) {
            throw new IllegalArgumentException("Invalid name format in recognized text: " + name);
        }
        String firstname = nameParts[0];
        String lastname = nameParts[1];

        Optional<User> userOptional = userRepository.findByFirstnameAndLastname(firstname, lastname);
        if (!userOptional.isPresent()) {
            throw new IllegalArgumentException("User not found with name: " + name);
        }
        User user = userOptional.get();
        String studentId = user.getUserid();

        // Check if the student already has a quiz entry
        Optional<StudentQuiz> existingStudentQuiz = studentQuizRepository.findByStudentidAndQuizid(studentId, quizid);
        if (existingStudentQuiz.isPresent()) {
            throw new IllegalArgumentException("Student already has a score for this quiz");
        }

        StudentQuiz studentQuiz = new StudentQuiz();
        studentQuiz.setQuizid(quizid);
        studentQuiz.setQuizimage(new Binary(BsonBinarySubType.BINARY, image.getBytes()));
        studentQuiz.setStudentid(studentId);

        studentQuiz.setBonusscore(0);
        studentQuiz.setEditedstatus(StudentQuiz.EditedStatus.NONE);
        studentQuiz.setScorestatus(StudentQuiz.ScoreStatus.NONE);
        studentQuiz.setFinalscore(0);

        List<StudentQuiz.RecognizedAnswer> recognizedAnswers = new ArrayList<>();
        Pattern answerPattern = Pattern.compile("^(\\d+)\\.\\s*(.*)$"); // Regex to match "1. Answer"

        // Iterate through recognized lines to create RecognizedAnswer objects
        for (String line : recognizedLines) {
            Matcher matcher = answerPattern.matcher(line.trim());
            if (matcher.find()) {
                int itemNumber = Integer.parseInt(matcher.group(1));
                String answer = matcher.group(2).trim();
                recognizedAnswers.add(new StudentQuiz.RecognizedAnswer(itemNumber, answer, false));
            }
        }

        // Set recognized answers to student quiz
        studentQuiz.setRecognizedAnswers(recognizedAnswers);
        // Create edited answers based on normalized text

        Pattern editPattern = Pattern.compile("^(\\d+)\\.\\s*(.*)$");
        int highestItemCount = 0;
        Map<Integer, String> recognizedItems = new HashMap<>();

        // First, collect recognized items and determine the highest item number
        for (String line : recognizedLines) {
            Matcher matcher = editPattern.matcher(line.trim());
            if (matcher.find()) {
                int itemNumber = Integer.parseInt(matcher.group(1));
                String editedItem = matcher.group(2).trim();
                recognizedItems.put(itemNumber, editedItem);
                if (itemNumber > highestItemCount) {
                    highestItemCount = itemNumber;
                }
            }
        }

        Optional<Quiz> quizOptional = quizRepository.findById(quizid);
        if (!quizOptional.isPresent()) {
            throw new IllegalArgumentException("Quiz not found with quizid: " + quizid);
        }
        Quiz quiz = quizOptional.get();

        // Changed: Instead of String answerKey, we will use List<Quiz.AnswerKeyItem>
        List<Quiz.AnswerKeyItem> answerKeyItems = quiz.getQuizanswerkey();
        int matchingAnswersCount = 0;
        Pattern pattern = Pattern.compile("^(\\d+)\\.\\s(.*)$");

        List<ItemAnalysis> existingItemAnalyses = itemAnalysisRepository.findByQuizid(quizid);

        Map<Integer, ItemAnalysis> itemAnalysisMap = new HashMap<>();

        for (ItemAnalysis existingItemAnalysis : existingItemAnalyses) {
            itemAnalysisMap.put(existingItemAnalysis.getItemNumber(), existingItemAnalysis);
        }

        // Iterate over recognized answers to match with answer key
        for (StudentQuiz.RecognizedAnswer recognizedAnswer : studentQuiz.getRecognizedAnswers()) {
            int lineNumber = recognizedAnswer.getItemnumber();
            String recognizedAnswerText = recognizedAnswer.getAnswer();

            // Check if the recognized item number exists in the answer key
            Optional<Quiz.AnswerKeyItem> answerKeyItemOptional = answerKeyItems.stream()
                    .filter(item -> item.getItemnumber() == lineNumber) // Compare by item number
                    .findFirst();

            if (answerKeyItemOptional.isPresent()) {
                String correctAnswer = answerKeyItemOptional.get().getAnswer();
                boolean isCorrect = recognizedAnswerText.equalsIgnoreCase(correctAnswer);
                recognizedAnswer.setCorrect(isCorrect);

                // Increment matching answers count if the answer is correct
                if (isCorrect) {
                    matchingAnswersCount++;
                }

                // Check if an item analysis already exists for the current quiz ID and item
                // number
                Optional<ItemAnalysis> existingItemAnalysis = existingItemAnalyses.stream()
                        .filter(item -> item.getItemNumber() == lineNumber)
                        .findFirst();

                if (existingItemAnalysis.isPresent()) {
                    // Update existing item analysis
                    ItemAnalysis itemAnalysis = existingItemAnalysis.get();
                    if (isCorrect) {
                        itemAnalysis.setCorrectCount(itemAnalysis.getCorrectCount() + 1);
                    } else {
                        itemAnalysis.setIncorrectCount(itemAnalysis.getIncorrectCount() + 1);
                    }
                    itemAnalysisMap.put(lineNumber, itemAnalysis); // Update the map
                } else {
                    // Create a new item analysis
                    ItemAnalysis newItemAnalysis = new ItemAnalysis();
                    newItemAnalysis.setQuizid(quizid);
                    newItemAnalysis.setItemNumber(lineNumber);
                    if (isCorrect) {
                        newItemAnalysis.setCorrectCount(1);
                        newItemAnalysis.setIncorrectCount(0);
                    } else {
                        newItemAnalysis.setCorrectCount(0);
                        newItemAnalysis.setIncorrectCount(1);
                    }
                    itemAnalysisMap.put(lineNumber, newItemAnalysis);
                }
            }
        }

        // Handle any items that were not recognized (missing in recognized answers)
        for (int i = 1; i <= highestItemCount; i++) {
            if (!itemAnalysisMap.containsKey(i)) {
                // Create an ItemAnalysis for the item if it wasn't recognized (null)
                ItemAnalysis newItemAnalysis = new ItemAnalysis();
                newItemAnalysis.setQuizid(quizid);
                newItemAnalysis.setItemNumber(i);
                newItemAnalysis.setCorrectCount(0);
                newItemAnalysis.setIncorrectCount(1);
                itemAnalysisMap.put(i, newItemAnalysis);
            }
        }

        // Save or update item analyses in the database
        for (ItemAnalysis itemAnalysis : itemAnalysisMap.values()) {
            itemAnalysisRepository.save(itemAnalysis);
        }

        // Set the score based on matching answers count
        int score = matchingAnswersCount;
        studentQuiz.setScore(score);
        studentQuiz.setBonusscore(0);

        studentQuiz = studentQuizRepository.insert(studentQuiz);

        // Update the student's quiz list
        Optional<Student> studentOptional = studentRepository.findByUserid(user.getUserid());
        if (!studentOptional.isPresent()) {
            throw new IllegalArgumentException("Student not found with userid: " + user.getUserid());
        }
        Student student = studentOptional.get();
        List<String> quizIds = student.getQuizid();
        quizIds.add(quizid);
        student.setQuizid(quizIds);
        studentRepository.save(student);

        return studentQuiz.getStudentquizid();
    }

    private String normalizeRecognizedText(String text) {
        // Step 1: Split the text into lines
        String[] lines = text.split("\\n");
        StringBuilder normalizedText = new StringBuilder();

        // Step 2: Append the name (assume it's the first line)
        if (lines.length > 0) {
            normalizedText.append(lines[0].trim()).append("\n");
        }

        // Step 3: Process the rest of the text
        StringBuilder answersText = new StringBuilder();
        for (int i = 1; i < lines.length; i++) {
            answersText.append(lines[i].trim()).append(" ");
        }

        // Step 4: Regex to match answers, allowing multi-word phrases
        String answersString = answersText.toString();
        Pattern pattern = Pattern.compile("(\\d+)\\s*\\.\\s*([\\d\\.]+|[^\\d]+(?:\\s+/\\s*[^\\d]+)?)");
        Matcher matcher = pattern.matcher(answersString);

        Map<Integer, String> answersMap = new TreeMap<>();
        int lastItemNumber = 0;

        while (matcher.find()) {
            int itemNumber = Integer.parseInt(matcher.group(1));
            String answer = matcher.group(2).trim();

            // Handle cases where the scanned item number is out of sequence
            if (itemNumber <= lastItemNumber) {
                itemNumber = lastItemNumber + 1;
            }
            lastItemNumber = itemNumber;

            answersMap.put(itemNumber, answer);
        }

        // Step 5: Fill in blanks for missing items
        int highestItemNumber = answersMap.keySet().stream().max(Integer::compare).orElse(0);
        for (int i = 1; i <= highestItemNumber; i++) {
            String answer = answersMap.getOrDefault(i, "");
            normalizedText.append(i).append(". ").append(answer).append("\n");
        }
        System.out.println("normalized" + normalizedText.toString().trim());
        return normalizedText.toString().trim();
    }

    public StudentQuiz getStudentQuiz(String id) {
        return studentQuizRepository.findById(id).orElse(null);
    }

    public StudentQuiz getStudentQuizByStudentIdAndQuizId(String studentId, String quizId) {
        return studentQuizRepository.findByStudentidAndQuizid(studentId, quizId).orElse(null);
    }

    public Map<String, Integer> getScoresAndStudentIdsByQuizId(String quizId) {
        List<StudentQuiz> studentQuizzes = studentQuizRepository.findByQuizid(quizId);
        Map<String, Integer> scoresAndStudentIds = new HashMap<>();

        for (StudentQuiz studentQuiz : studentQuizzes) {
            scoresAndStudentIds.put(studentQuiz.getStudentid(), studentQuiz.getScore());
        }

        return scoresAndStudentIds;
    }

    public void editStudentQuiz(String studentQuizId, String userId, String newText, String comment,
            String editedAnswer,
            int bonusScore, String editedStatus) throws IOException {
        // Retrieve the student quiz by ID
        Optional<StudentQuiz> studentQuizOptional = studentQuizRepository.findById(studentQuizId);
        if (!studentQuizOptional.isPresent()) {
            throw new IllegalArgumentException("Student quiz not found with ID: " + studentQuizId);
        }

        StudentQuiz studentQuiz = studentQuizOptional.get();
        String quizId = studentQuiz.getQuizid();

        // Set the comment for the student quiz
        studentQuiz.setComment(comment);

        // Get existing edited answers, or initialize to an empty list if null
        List<StudentQuiz.EditedAnswer> editedAnswers = studentQuiz.getEditedanswer();
        if (editedAnswers == null) {
            editedAnswers = new ArrayList<>();
        }

        Pattern pattern1 = Pattern.compile("^(\\d+)\\.\\s(.*)$");

        // Split the new text into lines and process each line
        String[] newLines1 = newText.split("\\n");
        for (String line : newLines1) {
            Matcher matcher = pattern1.matcher(line.trim());
            if (matcher.find()) {
                // Extract the item number from the text
                int itemNumber = Integer.parseInt(matcher.group(1));

                // Extract the edited answer from the text
                String editedItem = matcher.group(2).trim();

                // Check for existing answers
                boolean alreadyExists = false;

                for (StudentQuiz.EditedAnswer existingAnswer : editedAnswers) {
                    if (existingAnswer.getItemnumber() == itemNumber) {
                        // If the existing answer is already approved or disapproved, skip this item
                        if (existingAnswer.isIsapproved() || existingAnswer.isIsdisapproved()) {
                            alreadyExists = true;
                            break;
                        } else {
                            // If it exists and is not approved/disapproved, we can update it
                            existingAnswer.setEditedItem(editedItem);
                            existingAnswer.markAsEdited();
                            alreadyExists = true;
                            break;
                        }
                    }
                }

                // If it doesn't already exist in an approved/disapproved state, create a new
                // EditedAnswer
                if (!alreadyExists) {
                    // Create a new EditedAnswer object and set its properties
                    StudentQuiz.EditedAnswer newAnswer = new StudentQuiz.EditedAnswer();
                    newAnswer.setItemnumber(itemNumber);
                    newAnswer.setEditedItem(editedItem);
                    newAnswer.setIsapproved(false);
                    newAnswer.setIsdisapproved(false);
                    newAnswer.markAsEdited();
                    newAnswer.setEditedby("teacher");

                    // Add the new edited answer to the list
                    editedAnswers.add(newAnswer);
                }
            }
        }

        // Set the edited answers back to the student quiz
        studentQuiz.setEditedanswer(editedAnswers);

        // Set the bonus score
        studentQuiz.setBonusscore(bonusScore);

        // Set the edited status if provided
        if (!editedStatus.isEmpty()) {
            studentQuiz.setEditedstatus(StudentQuiz.EditedStatus.valueOf(editedStatus));
        }

        // Create an ActivityLog for the EDIT action
        ActivityLog activityLog = ActivityLog.create(userId, ActivityLog.Activity.EDIT);

        activityLogRepository.save(activityLog);

        if (studentQuiz.getActivityLogIds() == null) {
            studentQuiz.setActivityLogIds(new ArrayList<>());
        }

        studentQuiz.getActivityLogIds().add(activityLog.getId());

        // Save the updated student quiz
        studentQuizRepository.save(studentQuiz);
    }

    // private static final String ENDPOINT =
    // "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";
    // private static final String API_KEY = "115886813786636038388";

    // public String callGeminiForNormalization(String recognizedText) throws
    // IOException {
    // // Prepare the JSON payload
    // JsonObject systemMessage = new JsonObject();
    // systemMessage.addProperty("role", "system");
    // systemMessage.addProperty("content",
    // "You are a helpful assistant specializing in text normalization and
    // formatting. Ignore any unrecognizable or misinterpreted words, and do not
    // attempt to correct them. Only normalize the recognizable text and follow the
    // formatting instructions exactly.");

    // JsonObject userMessage = new JsonObject();
    // userMessage.addProperty("role", "user");
    // userMessage.addProperty("content",
    // "Normalize this text according to the following rules:\n"
    // + "1. Ignore any unrecognizable or garbled words; do not attempt to correct
    // or modify them.\n"
    // + "2. Format the list as: Item Number (followed by a period and a space),
    // then the answer (e.g., '1. Answer').\n"
    // + "3. Exclude the first line that contains the name and other information
    // unrelated to the list items.\n"
    // + "4. Ensure that the text follows a clean and consistent format, while
    // leaving unrecognized words unaltered.\n\n"
    // + "Here is the text to normalize:\n"
    // + recognizedText.replace("\"", "\\\"").replace("\n", "\\n").replace("\r",
    // "\\r"));

    // JsonArray messages = new JsonArray();
    // messages.add(systemMessage);
    // messages.add(userMessage);

    // JsonObject payload = new JsonObject();
    // payload.add("messages", messages);
    // payload.addProperty("temperature", 0.7);

    // // Establish HTTP connection to Gemini API
    // HttpURLConnection connection = (HttpURLConnection) new
    // URL(ENDPOINT).openConnection();
    // connection.setRequestMethod("POST");
    // connection.setRequestProperty("Content-Type", "application/json");
    // connection.setRequestProperty("Authorization", "Bearer " + API_KEY);
    // connection.setDoOutput(true);

    // // Send the request payload
    // try (OutputStream os = connection.getOutputStream()) {
    // byte[] input = payload.toString().getBytes(StandardCharsets.UTF_8);
    // os.write(input, 0, input.length);
    // }

    // // Handle the response
    // int status = connection.getResponseCode();
    // if (status == 200) {
    // try (BufferedReader br = new BufferedReader(
    // new InputStreamReader(connection.getInputStream(), StandardCharsets.UTF_8)))
    // {
    // StringBuilder response = new StringBuilder();
    // String responseLine;
    // while ((responseLine = br.readLine()) != null) {
    // response.append(responseLine.trim());
    // }

    // // Parse the response and return normalized text
    // String responseBody = response.toString();
    // JsonObject responseJson =
    // JsonParser.parseString(responseBody).getAsJsonObject();
    // return responseJson
    // .getAsJsonArray("choices")
    // .get(0)
    // .getAsJsonObject()
    // .get("message")
    // .getAsJsonObject()
    // .get("content")
    // .getAsString();
    // }
    // } else {
    // // Log the error response for debugging
    // try (BufferedReader br = new BufferedReader(
    // new InputStreamReader(connection.getErrorStream(), StandardCharsets.UTF_8)))
    // {
    // StringBuilder errorResponse = new StringBuilder();
    // String errorLine;
    // while ((errorLine = br.readLine()) != null) {
    // errorResponse.append(errorLine.trim());
    // }
    // System.err.println("Error Response: " + errorResponse.toString());
    // }
    // throw new IOException("Failed to call Gemini API. Status: " + status);
    // }
    // }
    private static final String ENDPOINT = "https://ritch-m4au4pfl-swedencentral.cognitiveservices.azure.com/openai/deployments/gpt-4/chat/completions?api-version=2024-08-01-preview";
    private static final String API_KEY = "BObQOaaO2iPXEoB7dE5qghJBaLeS8kuXI9h5kgFHiiALhTNCAZSwJQQJ99ALACfhMk5XJ3w3AAAAACOGoUgR";

    public String callAzureGPT4ForNormalization(String recognizedText) throws IOException {
        // Prepare the JSON payload
        JsonObject systemMessage = new JsonObject();
        systemMessage.addProperty("role", "system");
        systemMessage.addProperty("content",
                "You are a helpful assistant specializing in text normalization and formatting.");

        JsonObject userMessage = new JsonObject();
        userMessage.addProperty("role", "user");
        userMessage.addProperty("content", "Normalize this text to structure it to the correct format:\n"
                + recognizedText.replace("\"", "\\\"").replace("\n", "\\n").replace("\r", "\\r"));

        JsonArray messages = new JsonArray();
        messages.add(systemMessage);
        messages.add(userMessage);

        JsonObject payload = new JsonObject();
        payload.add("messages", messages);
        payload.addProperty("temperature", 0.7);

        // Establish HTTP connection
        HttpURLConnection connection = (HttpURLConnection) new URL(ENDPOINT).openConnection();
        connection.setRequestMethod("POST");
        connection.setRequestProperty("Content-Type", "application/json");
        connection.setRequestProperty("api-key", API_KEY);
        connection.setDoOutput(true);

        // Send the request payload
        try (OutputStream os = connection.getOutputStream()) {
            byte[] input = payload.toString().getBytes(StandardCharsets.UTF_8);
            os.write(input, 0, input.length);
        }

        // Handle the response
        int status = connection.getResponseCode();
        if (status == 200) {
            try (BufferedReader br = new BufferedReader(
                    new InputStreamReader(connection.getInputStream(), StandardCharsets.UTF_8))) {
                StringBuilder response = new StringBuilder();
                String responseLine;
                while ((responseLine = br.readLine()) != null) {
                    response.append(responseLine.trim());
                }

                // Parse the response and return normalized text
                String responseBody = response.toString();
                JsonObject responseJson = JsonParser.parseString(responseBody).getAsJsonObject();
                return responseJson
                        .getAsJsonArray("choices")
                        .get(0)
                        .getAsJsonObject()
                        .get("message")
                        .getAsJsonObject()
                        .get("content")
                        .getAsString();
            }
        } else if (status == 429) {
            String retryAfterHeader = connection.getHeaderField("Retry-After");
            int retryAfterSeconds = 10;

            if (retryAfterHeader != null) {
                try {
                    retryAfterSeconds = Integer.parseInt(retryAfterHeader);
                } catch (NumberFormatException e) {
                    retryAfterSeconds = 10;
                }
            }

            throw new IOException("Rate limit exceeded since we are using free API. Please try again after "
                    + retryAfterSeconds + " seconds.");
        } else {
            try (BufferedReader br = new BufferedReader(
                    new InputStreamReader(connection.getErrorStream(), StandardCharsets.UTF_8))) {
                StringBuilder errorResponse = new StringBuilder();
                String errorLine;
                while ((errorLine = br.readLine()) != null) {
                    errorResponse.append(errorLine.trim());
                }
                System.err.println("Error Response: " + errorResponse.toString());
                throw new IOException("Failed to call Azure GPT-4 API.");
            }
        }
    }

    private static final String EXPRESS_SERVER_URL = "https://structurize-api-dva4hjavffbzggad.southeastasia-01.azurewebsites.net/api/structure";

    public String callGroqThroughExpress(String recognizedText) throws IOException {
        // Prepare the JSON payload
        JsonObject payload = new JsonObject();
        payload.addProperty("text", recognizedText);

        // Establish HTTP connection to Express server
        HttpURLConnection connection = (HttpURLConnection) new URL(EXPRESS_SERVER_URL).openConnection();
        connection.setRequestMethod("POST");
        connection.setRequestProperty("Content-Type", "application/json");
        connection.setDoOutput(true);

        // Send the request payload
        try (OutputStream os = connection.getOutputStream()) {
            byte[] input = payload.toString().getBytes(StandardCharsets.UTF_8);
            os.write(input, 0, input.length);
        }

        // Handle the response from the Express server
        int status = connection.getResponseCode();
        if (status == 200) {
            try (BufferedReader br = new BufferedReader(
                    new InputStreamReader(connection.getInputStream(), StandardCharsets.UTF_8))) {
                StringBuilder response = new StringBuilder();
                String responseLine;
                while ((responseLine = br.readLine()) != null) {
                    response.append(responseLine.trim());
                }

                // Parse the response and return the normalized text
                String responseBody = response.toString();
                JsonObject responseJson = JsonParser.parseString(responseBody).getAsJsonObject();
                System.out.println("GROQ");
                return responseJson.get("normalizedText").getAsString();
            }
        } else {
            throw new IOException("Failed to call Express server, status code: " + status);
        }
    }

    // student upload
    public String addStudentQuiz(String quizid, String userid, MultipartFile image)
            throws IOException, InterruptedException {

        byte[] preprocessedImageBytes = imagePreprocessing.preprocessImage(image.getBytes());
        // Create a new MultipartFile from the preprocessed image
        MultipartFile preprocessedImage = MultipartFileUtil.createMultipartFile(
                preprocessedImageBytes,
                image.getName(),
                image.getOriginalFilename(),
                image.getContentType());
        // Perform OCR on the preprocessed image
        String recognizedText = azureTextRecognitionService.recognizeText(preprocessedImage);

        // String recognizedText = azureTextRecognitionService.recognizeText(image);

        String normalizedText = callGroqThroughExpress(recognizedText);
        System.out.println("Normalized Text:\n" + normalizedText);

        String[] recognizedLines = normalizedText.split("\\n");

        User user = userRepository.findByUserid(userid);
        if (user == null) {
            throw new IllegalArgumentException("User not found with userid: " + userid);
        }

        Optional<StudentQuiz> existingStudentQuiz = studentQuizRepository.findByStudentidAndQuizid(userid, quizid);
        if (existingStudentQuiz.isPresent()) {
            throw new IllegalArgumentException("Student already has a score for this quiz");
        }

        StudentQuiz studentQuiz = new StudentQuiz();
        studentQuiz.setQuizid(quizid);
        studentQuiz.setQuizimage(new Binary(BsonBinarySubType.BINARY, image.getBytes()));
        studentQuiz.setStudentid(userid);
        studentQuiz.setBonusscore(0);
        studentQuiz.setEditedstatus(StudentQuiz.EditedStatus.NONE);
        studentQuiz.setScorestatus(StudentQuiz.ScoreStatus.NONE);
        studentQuiz.setFinalscore(0);

        // Recognize answers from the text
        List<StudentQuiz.RecognizedAnswer> recognizedAnswers = new ArrayList<>();
        Pattern answerPattern = Pattern.compile("^(\\d+)\\.\\s*(.*)$");

        // Iterate through recognized lines to create RecognizedAnswer objects
        for (String line : recognizedLines) {
            Matcher matcher = answerPattern.matcher(line.trim());
            if (matcher.find()) {
                int itemNumber = Integer.parseInt(matcher.group(1));
                String answer = matcher.group(2).trim();
                recognizedAnswers.add(new StudentQuiz.RecognizedAnswer(itemNumber, answer, false));
            }
        }

        // Set recognized answers to student quiz
        studentQuiz.setRecognizedAnswers(recognizedAnswers);

        // Retrieve the quiz details from the repository
        Optional<Quiz> quizOptional = quizRepository.findById(quizid);
        if (!quizOptional.isPresent()) {
            throw new IllegalArgumentException("Quiz not found with quizid: " + quizid);
        }
        Quiz quiz = quizOptional.get();
        List<Quiz.AnswerKeyItem> answerKeyItems = quiz.getQuizanswerkey();

        // Match recognized answers with the answer key
        int matchingAnswersCount = 0;
        List<ItemAnalysis> existingItemAnalyses = itemAnalysisRepository.findByQuizid(quizid);
        Map<Integer, ItemAnalysis> itemAnalysisMap = new HashMap<>();

        for (ItemAnalysis existingItemAnalysis : existingItemAnalyses) {
            itemAnalysisMap.put(existingItemAnalysis.getItemNumber(), existingItemAnalysis);
        }

        for (StudentQuiz.RecognizedAnswer recognizedAnswer : studentQuiz.getRecognizedAnswers()) {
            int lineNumber = recognizedAnswer.getItemnumber();
            String recognizedAnswerText = recognizedAnswer.getAnswer();

            Optional<Quiz.AnswerKeyItem> answerKeyItemOptional = answerKeyItems.stream()
                    .filter(item -> item.getItemnumber() == lineNumber)
                    .findFirst();

            if (answerKeyItemOptional.isPresent()) {
                String correctAnswer = answerKeyItemOptional.get().getAnswer();
                boolean isCorrect = recognizedAnswerText.equalsIgnoreCase(correctAnswer);
                recognizedAnswer.setCorrect(isCorrect);

                if (isCorrect) {
                    matchingAnswersCount++;
                }

                ItemAnalysis itemAnalysis = itemAnalysisMap.getOrDefault(lineNumber, new ItemAnalysis());
                itemAnalysis.setQuizid(quizid);
                itemAnalysis.setItemNumber(lineNumber);

                if (isCorrect) {
                    itemAnalysis.setCorrectCount(itemAnalysis.getCorrectCount() + 1);
                } else {
                    itemAnalysis.setIncorrectCount(itemAnalysis.getIncorrectCount() + 1);
                }
                itemAnalysisMap.put(lineNumber, itemAnalysis);
            }
        }

        // Handle any items that were not recognized
        for (int i = 1; i <= answerKeyItems.size(); i++) {
            if (!itemAnalysisMap.containsKey(i)) {
                ItemAnalysis newItemAnalysis = new ItemAnalysis();
                newItemAnalysis.setQuizid(quizid);
                newItemAnalysis.setItemNumber(i);
                newItemAnalysis.setCorrectCount(0);
                newItemAnalysis.setIncorrectCount(1);
                itemAnalysisMap.put(i, newItemAnalysis);
            }
        }

        // Save or update item analyses in the database
        for (ItemAnalysis itemAnalysis : itemAnalysisMap.values()) {
            itemAnalysisRepository.save(itemAnalysis);
        }

        // Set the score based on the matching answers count
        studentQuiz.setScore(matchingAnswersCount);

        // Log the upload activity
        ActivityLog activityLog = ActivityLog.create(userid, ActivityLog.Activity.UPLOAD);

        activityLogRepository.save(activityLog);

        if (studentQuiz.getActivityLogIds() == null) {
            studentQuiz.setActivityLogIds(new ArrayList<>());
        }

        studentQuiz.getActivityLogIds().add(activityLog.getId());

        // Save the student quiz to the repository
        studentQuizRepository.insert(studentQuiz);

        // Update the student's quiz list
        Optional<Student> studentOptional = studentRepository.findByUserid(userid);
        if (!studentOptional.isPresent()) {
            throw new IllegalArgumentException("Student not found with userid: " + userid);
        }
        Student student = studentOptional.get();
        List<String> quizIds = student.getQuizid();
        quizIds.add(quizid);
        student.setQuizid(quizIds);
        studentRepository.save(student);

        return studentQuiz.getStudentquizid();
    }

    // student edit
    public void editStudentQuiz(String studentQuizId, String userId, String newText, String editedAnswer,
            String editedStatus)
            throws IOException {
        Optional<StudentQuiz> studentQuizOptional = studentQuizRepository.findById(studentQuizId);
        if (!studentQuizOptional.isPresent()) {
            throw new IllegalArgumentException("Student quiz not found with ID: " + studentQuizId);
        }

        StudentQuiz studentQuiz = studentQuizOptional.get();
        String quizId = studentQuiz.getQuizid();

        // Get existing edited answers, or initialize to an empty list if null
        List<StudentQuiz.EditedAnswer> editedAnswers = studentQuiz.getEditedanswer();
        if (editedAnswers == null) {
            editedAnswers = new ArrayList<>();
        }

        Pattern pattern1 = Pattern.compile("^(\\d+)\\.\\s(.*)$");

        // Split the new text into lines and process each line
        String[] newLines1 = newText.split("\\n");
        for (String line : newLines1) {
            Matcher matcher = pattern1.matcher(line.trim());
            if (matcher.find()) {
                // Extract the item number from the text
                int itemNumber = Integer.parseInt(matcher.group(1));

                // Extract the edited answer from the text
                String editedItem = matcher.group(2).trim();

                // Check for existing answers
                boolean alreadyExists = false;

                for (StudentQuiz.EditedAnswer existingAnswer : editedAnswers) {
                    if (existingAnswer.getItemnumber() == itemNumber) {
                        // If the existing answer is already approved or disapproved, skip this item
                        if (existingAnswer.isIsapproved() || existingAnswer.isIsdisapproved()) {
                            alreadyExists = true;
                            break;
                        } else if (existingAnswer.isIsedited()) {
                            alreadyExists = true;
                            break;
                        }
                    }
                }

                // If it doesn't already exist in an approved/disapproved state, create a new
                // EditedAnswer
                if (!alreadyExists) {
                    // Create a new EditedAnswer object and set its properties
                    StudentQuiz.EditedAnswer newAnswer = new StudentQuiz.EditedAnswer();
                    newAnswer.setItemnumber(itemNumber);
                    newAnswer.setEditedItem(editedItem);
                    newAnswer.setIsapproved(false);
                    newAnswer.setIsdisapproved(false);
                    newAnswer.markAsEdited();
                    newAnswer.setEditedby("student");

                    // Add the new edited answer to the list
                    editedAnswers.add(newAnswer);
                }
            }
        }

        // Set the edited answers back to the student quiz
        studentQuiz.setEditedanswer(editedAnswers);

        // Set the edited status if provided
        if (!editedStatus.isEmpty()) {
            studentQuiz.setEditedstatus(StudentQuiz.EditedStatus.valueOf(editedStatus));
        }
        // Create an ActivityLog for the EDIT action
        ActivityLog activityLog = ActivityLog.create(userId, ActivityLog.Activity.EDIT);
        activityLogRepository.save(activityLog);

        if (studentQuiz.getActivityLogIds() == null) {
            studentQuiz.setActivityLogIds(new ArrayList<>());
        }

        studentQuiz.getActivityLogIds().add(activityLog.getId());

        // Save the updated student quiz
        studentQuizRepository.save(studentQuiz);
    }

    public ActivityLog createActivityLog(String user, ActivityLog.Activity activity) {
        return ActivityLog.create(user, activity);
    }

    public List<StudentQuiz> getStudentQuizzesByQuizId(String quizId) {
        return studentQuizRepository.findByQuizid(quizId);
    }

    public void reEvaluateQuiz(StudentQuiz studentQuiz, List<Quiz.AnswerKeyItem> newAnswerKey,
            List<ItemAnalysis> itemAnalysisList) {
        int updatedScore = 0;

        // Create maps for faster lookups
        Map<Integer, Quiz.AnswerKeyItem> answerKeyMap = newAnswerKey.stream()
                .collect(Collectors.toMap(Quiz.AnswerKeyItem::getItemnumber, Function.identity()));

        Map<Integer, ItemAnalysis> itemAnalysisMap = itemAnalysisList.stream()
                .collect(Collectors.toMap(ItemAnalysis::getItemNumber, Function.identity()));

        // Check if there are no edited answers
        boolean hasEditedAnswers = studentQuiz.getEditedanswer() != null && !studentQuiz.getEditedanswer().isEmpty();

        for (StudentQuiz.RecognizedAnswer recognizedAnswer : studentQuiz.getRecognizedAnswers()) {
            Quiz.AnswerKeyItem answerKeyItem = answerKeyMap.get(recognizedAnswer.getItemnumber());
            ItemAnalysis itemAnalysis = itemAnalysisMap.get(recognizedAnswer.getItemnumber());

            if (answerKeyItem == null || itemAnalysis == null) {
                continue; // Skip if no answer key or item analysis is found
            }

            boolean isCorrect = recognizedAnswer.getAnswer().equalsIgnoreCase(answerKeyItem.getAnswer());

            // Only check edited answers if they exist
            if (hasEditedAnswers) {
                StudentQuiz.EditedAnswer editedAnswer = studentQuiz.getEditedanswer().stream()
                        .filter(edit -> edit.getItemnumber() == recognizedAnswer.getItemnumber() && edit.isIsapproved())
                        .findFirst()
                        .orElse(null);

                if (editedAnswer != null) {
                    isCorrect = editedAnswer.getEditeditem().equalsIgnoreCase(answerKeyItem.getAnswer());
                }
            }

            boolean wasCorrectBefore = recognizedAnswer.isCorrect();
            recognizedAnswer.setCorrect(isCorrect);

            // Update ItemAnalysis
            if (wasCorrectBefore && !isCorrect) {
                itemAnalysis.decrementCorrectCount();
                itemAnalysis.incrementIncorrectCount();
            } else if (!wasCorrectBefore && isCorrect) {
                itemAnalysis.decrementIncorrectCount();
                itemAnalysis.incrementCorrectCount();
            }

            if (isCorrect) {
                updatedScore++;
            }

            // Save changes to ItemAnalysis
            itemAnalysisRepository.save(itemAnalysis);
        }

        studentQuiz.setScore(updatedScore);
        studentQuizRepository.save(studentQuiz);
    }

    public void deleteStudentQuiz(String studentQuizId) {
        if (studentQuizId == null || studentQuizId.isEmpty()) {
            throw new IllegalArgumentException("StudentQuiz ID must not be null or empty");
        }
        // Check if the StudentQuiz exists before trying to delete
        if (!studentQuizRepository.existsById(studentQuizId)) {
            throw new IllegalArgumentException("StudentQuiz with ID " + studentQuizId + " does not exist");
        }
        studentQuizRepository.deleteById(studentQuizId);
    }

    public void saveStudentQuiz(StudentQuiz studentQuiz) {
        studentQuizRepository.save(studentQuiz);
    }

    public List<StudentQuiz> getHighScorersByQuizId(String quizid) {
        List<StudentQuiz> studentQuizzes = mongoTemplate.find(
                Query.query(Criteria.where("quizid").is(quizid)),
                StudentQuiz.class);

        studentQuizzes.sort((a, b) -> Integer.compare(b.getScore(), a.getScore()));

        int size = studentQuizzes.size();
        int threshold = (int) Math.ceil(size * 0.27);

        return studentQuizzes.subList(0, threshold);
    }

    public List<StudentQuiz> getLowScorersByQuizId(String quizid) {
        List<StudentQuiz> studentQuizzes = mongoTemplate.find(
                Query.query(Criteria.where("quizid").is(quizid)),
                StudentQuiz.class);

        studentQuizzes.sort((a, b) -> Integer.compare(a.getScore(), b.getScore()));

        int size = studentQuizzes.size();
        int threshold = (int) Math.ceil(size * 0.27);

        return studentQuizzes.subList(0, threshold);
    }

    public List<StudentQuiz> getStudentQuizzesByQuizIds(List<String> quizIds) {
        return studentQuizRepository.findByQuizidIn(quizIds);
    }
}