package com.softeng.penscan.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
public class AzureTextRecognitionService {

    @Value("${azure.cognitive.services.endpoint}")
    private String endpoint;

    @Value("${azure.cognitive.services.api-key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public String recognizeText(MultipartFile image) throws IOException, InterruptedException {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Ocp-Apim-Subscription-Key", apiKey);
        headers.set("Content-Type", "application/octet-stream");

        HttpEntity<byte[]> entity = new HttpEntity<>(image.getBytes(), headers);
        ResponseEntity<Map> response = restTemplate.exchange(endpoint, HttpMethod.POST, entity, Map.class);

        if (response.getStatusCodeValue() == 202) {
            String resultUrl = response.getHeaders().get("Operation-Location").get(0);
            Thread.sleep(5000);

            ResponseEntity<Map> resultResponse = restTemplate.exchange(resultUrl, HttpMethod.GET,
                    new HttpEntity<>(headers), Map.class);
            return extractText(resultResponse.getBody());
        } else {
            return extractText(response.getBody());
        }
    }

    private String extractText(Map<String, Object> result) {
        StringBuilder recognizedText = new StringBuilder();
        List<Map<String, Object>> readResults = (List<Map<String, Object>>) ((Map<String, Object>) result
                .get("analyzeResult")).get("readResults");

        for (Map<String, Object> readResult : readResults) {
            List<Map<String, Object>> lines = (List<Map<String, Object>>) readResult.get("lines");
            for (Map<String, Object> line : lines) {
                recognizedText.append(line.get("text")).append("\n");
            }
        }

        return recognizedText.toString();
    }
}
