package com.example.credittransfer.service;

import com.example.credittransfer.dto.response.DipCourseIdResponse;
import com.example.credittransfer.exception.NotFoundCourseException;
import net.sourceforge.tess4j.Tesseract;
import net.sourceforge.tess4j.TesseractException;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class OCRService {

    private final DiplomaCourseService diplomaCourseService;

    public OCRService(DiplomaCourseService diplomaCourseService) {
        this.diplomaCourseService = diplomaCourseService;
    }

//    public List<String> getCourseId() throws IOException {
//        Tesseract tesseract = new Tesseract();
//        String fileName = "ใบเกรด 2.pdf";
//        File pdfFile = new ClassPathResource("templates/" + fileName).getFile();
//
//        File file = new ClassPathResource("templates/" + fileName).getFile();
//        String text ="";
//        try {
//            tesseract.setDatapath("C:\\Program Files\\Tesseract-OCR\\tessdata");
//            text = tesseract.doOCR(file);
//        } catch (
//                TesseractException e) {
//            e.printStackTrace();
//        }
//        List<String> filter = filterData(text);
//
//        return Collections.singletonList(diplomaCourseService.validateDipCourseId(filter));
//
//    }

    public DipCourseIdResponse getCourseIdByImport(File file) throws IOException {
        Tesseract tesseract = new Tesseract();
        String text = "";
        try {
            tesseract.setDatapath("C:\\Program Files\\Tesseract-OCR\\tessdata");
            text = tesseract.doOCR(file);
        } catch (
                TesseractException e) {
            e.printStackTrace();
        }
        List<String> filter = filterData(text);

        if(filter.isEmpty()) {
            throw new NotFoundCourseException(file.getName());
        }
        List<String> founded = diplomaCourseService.getExistDipCourseId(filter);
        List<String> notFound = diplomaCourseService.validateDipCourseId(filter);
        DipCourseIdResponse dipCourseIdResponse = new DipCourseIdResponse();
        dipCourseIdResponse.setFoundedDipCourseIdList(founded);
        dipCourseIdResponse.setTotalFounded(founded.size());
        dipCourseIdResponse.setNotFoundedDipCourseIdList(notFound);
        dipCourseIdResponse.setTotalNotFounded(notFound.size());
        dipCourseIdResponse.setTotal(filter.size());

        return dipCourseIdResponse;

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

    public File convertFile(MultipartFile multipartFile) throws IOException {
        File resourceTempDir = new ClassPathResource("temp/").getFile();
        Path tempDirPath = resourceTempDir.toPath();
        if (!Files.exists(tempDirPath)) {
            Files.createDirectories(tempDirPath);
        }
        String fileName = Objects.requireNonNull(multipartFile.getOriginalFilename());
        Path filePath = tempDirPath.resolve(fileName);
        File file = filePath.toFile();
        multipartFile.transferTo(file);

        return file;
    }

    public boolean isValidFileExtension(String fileName) {
        String[] allowedExtensions = {"pdf", "jpg", "png"};
        String fileExtension = "";
        int dotIndex = fileName.lastIndexOf(".");
        if(dotIndex > 0 && dotIndex < fileName.length() - 1){
            fileExtension = fileName.substring(dotIndex + 1).toLowerCase();
        }

        for(String extension : allowedExtensions){
            if(fileExtension.equals(extension)){
                return true;
            }
        }
        return false;
    }
}
