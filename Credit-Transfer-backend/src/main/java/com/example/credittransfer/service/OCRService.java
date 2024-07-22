package com.example.credittransfer.service;

import net.sourceforge.tess4j.Tesseract;
import net.sourceforge.tess4j.TesseractException;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class OCRService {

    public List<String> getCourseId() throws IOException {
        Tesseract tesseract = new Tesseract();
        String fileName = "ใบเกรด 2.pdf";
        File pdfFile = new ClassPathResource("templates/" + fileName).getFile();

        File file = new ClassPathResource("templates/" + fileName).getFile();
        String text ="";
        try {
            tesseract.setDatapath("C:\\Program Files\\Tesseract-OCR\\tessdata");
            text = tesseract.doOCR(file);
        } catch (
                TesseractException e) {
            e.printStackTrace();
        }
        return filterData(text);

    }

    private List<String> filterData(String ocrText) {
        Pattern pattern = Pattern.compile("(\\d{5}-\\d{4})");
        Matcher matcher = pattern.matcher(ocrText);
        List<String> result = new ArrayList<>();

        while (matcher.find()) {
            String courseCode = matcher.group(1);
            result.add(courseCode);
        }
        return result;
    }
}
