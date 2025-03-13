package com.softeng.penscan.utils;

import org.opencv.core.*;
import org.opencv.imgcodecs.Imgcodecs;
import org.opencv.imgproc.Imgproc;
import org.opencv.photo.Photo;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;

@Service
public class ImagePreprocessing {

    // private static final String DEBUG_DIR = "src/main/resources/debug/";

    // static {
    // File debugDir = new File(DEBUG_DIR);
    // if (!debugDir.exists()) {
    // debugDir.mkdirs();
    // }
    // }

    public static byte[] preprocessImage(byte[] imageBytes) throws IOException {
        Mat original = Imgcodecs.imdecode(new MatOfByte(imageBytes), Imgcodecs.IMREAD_COLOR);

        Mat gray = new Mat();
        Imgproc.cvtColor(original, gray, Imgproc.COLOR_BGR2GRAY);
        // saveDebugImage(gray, "1_grayscale");

        Mat denoised = new Mat();
        Photo.fastNlMeansDenoising(gray, denoised, 30, 7, 21);
        // saveDebugImage(denoised, "2_denoised");

        MatOfByte processedBytes = new MatOfByte();
        Imgcodecs.imencode(".png", denoised, processedBytes);
        return processedBytes.toArray();
    }

    // private static void saveDebugImage(Mat image, String stepName) {
    // String filePath = DEBUG_DIR + stepName + ".png";
    // Imgcodecs.imwrite(filePath, image);
    // System.out.println("Debug image saved: " + filePath);
    // }
}
