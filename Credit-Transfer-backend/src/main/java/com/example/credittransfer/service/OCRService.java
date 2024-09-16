package com.example.credittransfer.service;

import com.example.credittransfer.dto.request.TransferCreditRequest;
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
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class OCRService {

    private final DiplomaCourseService diplomaCourseService;
    private final TransferCreditService transferCreditService;

    public OCRService(DiplomaCourseService diplomaCourseService, TransferCreditService transferCreditService) {
        this.diplomaCourseService = diplomaCourseService;
        this.transferCreditService = transferCreditService;
    }

    public String getCourseId2() throws IOException {
        Tesseract tesseract = new Tesseract();
        String fileName = "ใบเกรด 2.pdf";
        File pdfFile = new ClassPathResource("templates/" + fileName).getFile();

        String text = "";
        try {
            tesseract.setDatapath("C:\\Program Files\\Tesseract-OCR\\tessdata");
            tesseract.setLanguage("eng");
            text = tesseract.doOCR(pdfFile);
        } catch (TesseractException e) {
            e.printStackTrace();
        }

        return text;
    }

    public String getCourseId3() throws IOException {
        Tesseract tesseract = new Tesseract();
        String fileName = "ใบเกรด 2.pdf";
        List<TransferCreditRequest> transferCreditRequestList = new ArrayList<>();
        File pdfFile = new ClassPathResource("templates/" + fileName).getFile();
        String newStr = "";
        String text = "";
        try {
            tesseract.setDatapath("C:\\Program Files\\Tesseract-OCR\\tessdata");
            tesseract.setLanguage("eng");
            text = tesseract.doOCR(pdfFile);

            // Replace unwanted characters with '|'
            text = text.replaceAll("-(?!\\d{4})", "|");
            text = text.replaceAll("[\\[\\]^{}/\\\\()]", "|");
            text = text.replaceAll("\\|\\|", "|");
            text = text.replaceAll("°", "").trim();


            // Add '|' after non-numeric text
            Pattern pattern = Pattern.compile("(\\d{5}-\\d{4}\\s*[^|]*?)\\s+(\\d|\\d{1,2})");
            Matcher matcher = pattern.matcher(text);
            StringBuffer result = new StringBuffer();
            while (matcher.find()) {
                matcher.appendReplacement(result, matcher.group(1) + "|" + matcher.group(2));
            }
            matcher.appendTail(result);
            text = result.toString();

            // Ensure '|' is added after non-numeric sections before the numbers
            pattern = Pattern.compile("([a-zA-Z\\s]+)(?=\\d)");
            matcher = pattern.matcher(text);
            result = new StringBuffer();
            while (matcher.find()) {
                matcher.appendReplacement(result, matcher.group(1).trim() + "|");
            }
            matcher.appendTail(result);
            text = result.toString();

            // Remove extra '|' at the end of each line
            pattern = Pattern.compile("\\|+$");
            matcher = pattern.matcher(text);
            result = new StringBuffer();
            while (matcher.find()) {
                matcher.appendReplacement(result, "");
            }
            matcher.appendTail(result);
            text = result.toString();

            // Ensure there's no extra '|' if there are multiple '|' at the end of the line
            pattern = Pattern.compile("\\|{2,}");
            matcher = pattern.matcher(text);
            result = new StringBuffer();
            while (matcher.find()) {
                matcher.appendReplacement(result, "|");
            }
            matcher.appendTail(result);
            text = result.toString();

            // Replace numbers greater than 12 with X.Y format
            pattern = Pattern.compile("\\b([1-9][0-9])\\b");
            matcher = pattern.matcher(text);
            result = new StringBuffer();
            while (matcher.find()) {
                int number = Integer.parseInt(matcher.group(1));
                if (number > 16) {
                    matcher.appendReplacement(result, number / 10 + "." + (number % 10));
                } else {
                    matcher.appendReplacement(result, matcher.group(1));
                }
            }
            matcher.appendTail(result);
            text = result.toString();
            text = text.replaceAll("\\s+", "").trim();
            text = text.replaceAll("4\\.[1-9]", "4");



            pattern = Pattern.compile(
                    "\\|(\\d{5}-\\d{4})\\|" +
                            "([^|]+?)\\|" +
                            "([^|]+?)\\|" +
                            "([^|]+?)\\|" +
                            "(?!\\d{5}-\\d{4}\\|)([0-9]+(?:\\.\\d)?)\\|" +
                            "(?!\\d{5}-\\d{4}\\|)([0-9]+(?:\\.\\d)?)\\|" +
                            "(?!\\d{5}-\\d{4}\\|)([0-9]+(?:\\.\\d)?)"

            );
            matcher = pattern.matcher(text);
            String resultExtend = "";
            while (matcher.find()) {
                String matched = matcher.group(0);
                String[] parts = matched.split("\\|");
                if (parts.length >= 7) {
                        if(Double.parseDouble(parts[6]) >0) {
                            resultExtend = resultExtend + "|" + String.join("|", parts[1], parts[2], parts[5], parts[6], parts[7]);
                            TransferCreditRequest request = transferCreditService.mapToTransferCreditRequest(parts[1], Double.parseDouble(parts[6]));
                            transferCreditRequestList.add(request);
                        }
                }
            }
            if (!resultExtend.isEmpty()) {
                text = matcher.replaceAll("");
                text = text + resultExtend;
                System.out.println("result ex = " + resultExtend);

            }

            pattern = Pattern.compile(
                    "\\|(\\d{5}-\\d{4})\\|" +
                            "([^|]+?)\\|" +
                            "([^|]{1,2})\\|" +
                            "([^|]{1,2})\\|" +
                            "(?!\\d{5}-\\d{4}\\|)([0-9]+(?:\\.\\d)?)\\|" +
                            "(?!\\d{5}-\\d{4}\\|)([0-9]+(?:\\.\\d)?)"

            );
            matcher = pattern.matcher(text);
            String resultExtend2 = "";
            while (matcher.find()) {
                String matched = matcher.group(0);
                String[] parts = matched.split("\\|");
                if (parts.length >= 6) {
                    if(Double.parseDouble(parts[5]) > 0){
                        resultExtend2 = resultExtend2 + "|" + String.join("|", parts[1], parts[2], parts[4], parts[5], parts[6]);
                        TransferCreditRequest request = transferCreditService.mapToTransferCreditRequest(parts[1], Double.parseDouble(parts[5]));
                        transferCreditRequestList.add(request);
                    }

                }
            }
            if (!resultExtend2.isEmpty()) {
                text = matcher.replaceAll("");
                text = text + resultExtend2;
            }

            pattern = Pattern.compile("\\|(\\d{5}-\\d{4})\\|" +
                    "([^|]+?)\\|" +
                    "([0-9]|[0-9]\\.\\d)\\|" +
                    "([0-9]|[0-9]\\.\\d)\\|" +
                    "(?!\\d{5}-\\d{4}\\|)([0-9]+(?:\\.\\d)?)");
            matcher = pattern.matcher(text);
            List<String> normalForm = new ArrayList<>();
            StringBuffer newStrBuffer = new StringBuffer();
            while (matcher.find()) {
                newStrBuffer.setLength(0);
                newStrBuffer.append(matcher.group(0)).append("\n");
                String temp = newStrBuffer.toString().trim();
                normalForm.add(temp);

            }
            System.out.println("size = " + normalForm.size());
            for (String patternToRemove : normalForm) {
                String[] parts = patternToRemove.split("\\|");
                if(!Objects.isNull(parts[4]))
                {
                    TransferCreditRequest request = transferCreditService.mapToTransferCreditRequest(parts[1], Double.parseDouble(parts[4]));
                    if (!Objects.isNull(request.getDiplomaCourse())) {
                        transferCreditRequestList.add(request);
                    }
                }

                text = text.replace(patternToRemove, "|").trim();
                System.out.println(patternToRemove);
            }

            newStr = newStrBuffer.toString();

            pattern = Pattern.compile("\\|(\\d{5}-\\d{4})\\|" +
                    "([^|]+?)\\|" +
                    "([0-9]|[0-9]\\.\\d)\\|" +
                    "([0-9]|[0-9]\\.\\d)");
            matcher = pattern.matcher(text);
            List<String> lessOne = new ArrayList<>();
            StringBuffer newStrBuffer2 = new StringBuffer();
            while (matcher.find()) {
                newStrBuffer2.setLength(0);
                newStrBuffer2.append(matcher.group(0)).append("\n");
                String temp = newStrBuffer2.toString().trim();
                lessOne.add(temp);
            }
            System.out.println("size = " + lessOne.size());

            newStr = newStr + newStrBuffer2.toString();
            for (String patternToRemove : lessOne) {
                String[] parts = patternToRemove.split("\\|");
                if(!Objects.isNull(parts[3]))
                {
                    TransferCreditRequest request = transferCreditService.mapToTransferCreditRequest(parts[1], Double.parseDouble(parts[3]));
                    if (!Objects.isNull(request.getDiplomaCourse())) {
                        transferCreditRequestList.add(request);
                    }
                }
                text = text.replace(patternToRemove, "|").trim();
                System.out.println(patternToRemove);
            }

        } catch (TesseractException e) {
            e.printStackTrace();
        }

        return text;
    }

    public List<TransferCreditRequest> getCourse(File file) throws IOException {
        List<TransferCreditRequest> transferCreditRequestList = new ArrayList<>();
        Tesseract tesseract = new Tesseract();
        String fileName = "ใบเกรด 2.pdf";
        String newStr = "";
        File pdfFile = new ClassPathResource("templates/" + fileName).getFile();
        String text = "";

        try {
            tesseract.setDatapath("C:\\Program Files\\Tesseract-OCR\\tessdata");
            tesseract.setLanguage("eng");
            text = tesseract.doOCR(file);

            // Replace unwanted characters with '|'
            text = text.replaceAll("[\\[\\]^{}/\\\\()]", "|");
            text = text.replaceAll("\\|\\|", "|");
            text = text.replaceAll("°", "").trim();

            // Add '|' after non-numeric text
            Pattern pattern = Pattern.compile("(\\d{5}-\\d{4}\\s*[^|]*?)\\s+(\\d|\\d{1,2})");
            Matcher matcher = pattern.matcher(text);
            StringBuffer result = new StringBuffer();
            while (matcher.find()) {
                matcher.appendReplacement(result, matcher.group(1) + "|" + matcher.group(2));
            }
            matcher.appendTail(result);
            text = result.toString();

            // Ensure '|' is added after non-numeric sections before the numbers
            pattern = Pattern.compile("([a-zA-Z\\s]+)(?=\\d)");
            matcher = pattern.matcher(text);
            result = new StringBuffer();
            while (matcher.find()) {
                matcher.appendReplacement(result, matcher.group(1).trim() + "|");
            }
            matcher.appendTail(result);
            text = result.toString();

            // Remove extra '|' at the end of each line
            pattern = Pattern.compile("\\|+$");
            matcher = pattern.matcher(text);
            result = new StringBuffer();
            while (matcher.find()) {
                matcher.appendReplacement(result, "");
            }
            matcher.appendTail(result);
            text = result.toString();

            // Ensure there's no extra '|' if there are multiple '|' at the end of the line
            pattern = Pattern.compile("\\|{2,}");
            matcher = pattern.matcher(text);
            result = new StringBuffer();
            while (matcher.find()) {
                matcher.appendReplacement(result, "|");
            }
            matcher.appendTail(result);
            text = result.toString();

            // Replace numbers greater than 12 with X.Y format
            pattern = Pattern.compile("\\b([1-9][0-9])\\b");
            matcher = pattern.matcher(text);
            result = new StringBuffer();
            while (matcher.find()) {
                int number = Integer.parseInt(matcher.group(1));
                if (number > 16) {
                    matcher.appendReplacement(result, number / 10 + "." + (number % 10));
                } else {
                    matcher.appendReplacement(result, matcher.group(1));
                }
            }

            matcher.appendTail(result);
            text = result.toString();
            text = text.replaceAll("\\s+", "").trim();
            text = text.replaceAll("4\\.[1-9]", "4");
            text = text.replaceAll("9", "4");

            pattern = Pattern.compile(
                    "\\|(\\d{5}-\\d{4})\\|" +
                            "([^|]+?)\\|" +
                            "([^|]+?)\\|" +
                            "([^|]+?)\\|" +
                            "(?!\\d{5}-\\d{4}\\|)([0-9]+(?:\\.\\d)?)\\|" +
                            "(?!\\d{5}-\\d{4}\\|)([0-9]+(?:\\.\\d)?)\\|" +
                            "(?!\\d{5}-\\d{4}\\|)([0-9]+(?:\\.\\d)?)"

            );
            matcher = pattern.matcher(text);
            String resultExtend = "";
            while (matcher.find()) {
                String matched = matcher.group(0);
                String[] parts = matched.split("\\|");
                if (parts.length >= 7) {
                    if(Double.parseDouble(parts[6]) >0) {
                        resultExtend = resultExtend + "|" + String.join("|", parts[1], parts[2], parts[5], parts[6], parts[7]);
                        TransferCreditRequest request = transferCreditService.mapToTransferCreditRequest(parts[1], Double.parseDouble(parts[6]));
                        transferCreditRequestList.add(request);
                    }
                }
            }
            if (!resultExtend.isEmpty()) {
                text = matcher.replaceAll("");
                text = text + resultExtend;
                System.out.println("result ex = " + resultExtend);

            }

            pattern = Pattern.compile(
                    "\\|(\\d{5}-\\d{4})\\|" +
                            "([^|]+?)\\|" +
                            "([^|]{1,2})\\|" +
                            "([^|]{1,2})\\|" +
                            "(?!\\d{5}-\\d{4}\\|)([0-9]+(?:\\.\\d)?)\\|" +
                            "(?!\\d{5}-\\d{4}\\|)([0-9]+(?:\\.\\d)?)"

            );
            matcher = pattern.matcher(text);
            String resultExtend2 = "";
            while (matcher.find()) {
                String matched = matcher.group(0);
                String[] parts = matched.split("\\|");
                if (parts.length >= 6) {
                    if(Double.parseDouble(parts[5]) > 0){
                        resultExtend2 = resultExtend2 + "|" + String.join("|", parts[1], parts[2], parts[4], parts[5], parts[6]);
                        TransferCreditRequest request = transferCreditService.mapToTransferCreditRequest(parts[1], Double.parseDouble(parts[5]));
                        transferCreditRequestList.add(request);
                    }

                }
            }
            if (!resultExtend2.isEmpty()) {
                text = matcher.replaceAll("");
                text = text + resultExtend2;
            }


            pattern = Pattern.compile("\\|(\\d{5}-\\d{4})\\|" +
                    "([^|]+?)\\|" +
                    "([0-9]|[0-9]\\.\\d)\\|" +
                    "([0-9]|[0-9]\\.\\d)\\|" +
                    "(?!\\d{5}-\\d{4}\\|)([0-9]+(?:\\.\\d)?)");
            matcher = pattern.matcher(text);
            List<String> normalForm = new ArrayList<>();
            StringBuffer newStrBuffer = new StringBuffer();
            while (matcher.find()) {
                newStrBuffer.setLength(0);
                newStrBuffer.append(matcher.group(0)).append("\n");
                String temp = newStrBuffer.toString().trim();
                normalForm.add(temp);

            }
            System.out.println("size = " + normalForm.size());
            for (String patternToRemove : normalForm) {
                String[] parts = patternToRemove.split("\\|");
                if(Double.parseDouble(parts[3]) > 0)
                {
                    TransferCreditRequest request = transferCreditService.mapToTransferCreditRequest(parts[1], Double.parseDouble(parts[4]));
                    if (!Objects.isNull(request.getDiplomaCourse()) && request.getDipGrade() > 0) {
                        transferCreditRequestList.add(request);
                    }
                }
                text = text.replace(patternToRemove, "|").trim();
                System.out.println(patternToRemove);
            }

            newStr = newStrBuffer.toString();

            pattern = Pattern.compile("\\|(\\d{5}-\\d{4})\\|" +
                    "([^|]+?)\\|" +
                    "([0-9]|[0-9]\\.\\d)\\|" +
                    "([0-9]|[0-9]\\.\\d)");
            matcher = pattern.matcher(text);
            List<String> lessOne = new ArrayList<>();
            StringBuffer newStrBuffer2 = new StringBuffer();
            while (matcher.find()) {
                newStrBuffer2.setLength(0);
                newStrBuffer2.append(matcher.group(0)).append("\n");
                String temp = newStrBuffer2.toString().trim();
                lessOne.add(temp);
            }
            System.out.println("size = " + lessOne.size());

            newStr = newStr + newStrBuffer2.toString();
            for (String patternToRemove : lessOne) {
                String[] parts = patternToRemove.split("\\|");
                if(Double.parseDouble(parts[3]) > 0 )
                {
                    System.out.println(patternToRemove);
                    System.out.println("Not al");
                    TransferCreditRequest request = transferCreditService.mapToTransferCreditRequest(parts[1], Double.parseDouble(parts[3]));
                    if (!Objects.isNull(request.getDiplomaCourse())  && request.getDipGrade() > 0) {
                        transferCreditRequestList.add(request);
                    }
                }
                text = text.replace(patternToRemove, "|").trim();

            }

        } catch (TesseractException e) {
            e.printStackTrace();
        }

        return transferCreditRequestList;
    }


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

        if (filter.isEmpty()) {
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
        if (dotIndex > 0 && dotIndex < fileName.length() - 1) {
            fileExtension = fileName.substring(dotIndex + 1).toLowerCase();
        }

        for (String extension : allowedExtensions) {
            if (fileExtension.equals(extension)) {
                return true;
            }
        }
        return false;
    }
}
