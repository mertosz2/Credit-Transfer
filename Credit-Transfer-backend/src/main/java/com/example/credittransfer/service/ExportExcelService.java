package com.example.credittransfer.service;

import com.example.credittransfer.dto.response.DipCourseResponse;
import com.example.credittransfer.dto.response.TransferCreditResponse;
import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

@Service
public class ExportExcelService {

    private XSSFWorkbook workbook;
    private XSSFSheet sheet;


    private void createCell(Row row, int columnCount, Object value, CellStyle style) {
        Cell cell = row.createCell(columnCount);
        if (value instanceof Integer){
            cell.setCellValue((Integer) value);
        }else if (value instanceof Double){
            cell.setCellValue((Double) value);
        }else if (value instanceof Boolean){
            cell.setCellValue((Boolean) value);
        }else if (value instanceof Long){
            cell.setCellValue((Long) value);
        }else {
            cell.setCellValue((String) value);
        }
        cell.setCellStyle(style);
    }

    private void createHeaderRow(List<String> headerList) {
        sheet = this.workbook.createSheet("sheet 1");
        Row row = sheet.createRow(4);
        CellStyle cellStyle = workbook.createCellStyle();
        XSSFFont font = workbook.createFont();
        font.setBold(true);
        font.setFontHeight(18);
        cellStyle.setFont(font);
        cellStyle.setAlignment(HorizontalAlignment.CENTER);
        cellStyle.setWrapText(true);
        setBorder(cellStyle);

        int count = 3;
        for(String header : headerList) {
            createCell(row, count++, header, cellStyle);
        }
        for (int i = 3; i < headerList.size() + 3; i++) {
            sheet.autoSizeColumn(i);
        }
    }

    private void writeData(List<TransferCreditResponse> transferCreditResponseList) {
        int totalDipCredit = 0;
        int totalUniCredit = 0;
        CellStyle defaultStyle = workbook.createCellStyle();
        XSSFFont font = workbook.createFont();
        font.setFontHeight(14);
        defaultStyle.setFont(font);
        defaultStyle.setWrapText(true);
        setBorder(defaultStyle);

        CellStyle mergeStyle = workbook.createCellStyle();
        mergeStyle.setVerticalAlignment(VerticalAlignment.CENTER);
        mergeStyle.setWrapText(true);
        mergeStyle.setFont(font);
        setBorder(mergeStyle);

        CellStyle numberStyle = workbook.createCellStyle();
        numberStyle.setAlignment(HorizontalAlignment.CENTER);
        numberStyle.setFont(font);
        numberStyle.setWrapText(true);
        setBorder(numberStyle);

        CellStyle numberMergeStyle = workbook.createCellStyle();
        numberMergeStyle.setVerticalAlignment(VerticalAlignment.CENTER);
        numberMergeStyle.setAlignment(HorizontalAlignment.CENTER);
        numberMergeStyle.setFont(font);
        numberMergeStyle.setWrapText(true);
        setBorder(numberMergeStyle);

        CellStyle totalCreditStyle = workbook.createCellStyle();
        totalCreditStyle.setVerticalAlignment(VerticalAlignment.CENTER);
        totalCreditStyle.setAlignment(HorizontalAlignment.CENTER);
        XSSFFont totalCreditFont = workbook.createFont();
        totalCreditFont.setFontHeight(18);
        totalCreditFont.setBold(true);
        totalCreditStyle.setFont(totalCreditFont);
        setBorder(totalCreditStyle);

        CellStyle style;
        int rowCount = 5;


        for (TransferCreditResponse response : transferCreditResponseList) {
            int dipCourseListSize = response.getDiplomaCourseList().size();
            boolean firstRow = true;
            boolean merged = false;
            int columnCount = 3;
            int startRow = 0;
            int startColumn = 0;
            int endRow = 0;
            int endColumn = 0;

            totalUniCredit = totalUniCredit + response.getUniCredit();
            for (DipCourseResponse dipCourse : response.getDiplomaCourseList()) {
                totalDipCredit = totalDipCredit + dipCourse.getDipCredit();
                style = defaultStyle;
                if (!firstRow) {
                    columnCount = 3;
                    Row row = sheet.createRow(rowCount++);
                    row.setHeightInPoints(40);
                    createCell(row, columnCount++, dipCourse.getDipCourseId(), style);
                    createCell(row, columnCount++, dipCourse.getDipCourseName(), style);
                    createCell(row, columnCount++, dipCourse.getGrade(), numberStyle);
                    createCell(row, columnCount++, dipCourse.getDipCredit(), numberStyle);
                } else {
                    Row row = sheet.createRow(rowCount++);
                    row.setHeightInPoints(40);
                    createCell(row, columnCount++, dipCourse.getDipCourseId(), style);
                    createCell(row, columnCount++, dipCourse.getDipCourseName(), style);
                    createCell(row, columnCount++, dipCourse.getGrade(), numberStyle);
                    createCell(row, columnCount++, dipCourse.getDipCredit(), numberStyle);

                    if(dipCourseListSize > 1) {
                        startRow = rowCount - 1;
                        endRow = (startRow + dipCourseListSize) - 1;
                        startColumn = columnCount;
                        endColumn = startColumn;
                        style = mergeStyle;
                        merged = true;
                    }
                    createCell(row, columnCount++, response.getUniCourseId(), style);
                    createCell(row, columnCount++, response.getUniCourseName(), style);

                    if(merged) {
                        createCell(row, columnCount++, response.getUniCredit(), numberMergeStyle);
                        merged = false;
                    } else {
                        createCell(row, columnCount++, response.getUniCredit(), numberStyle);
                    }
                    firstRow = false;
                }

            }
            if (dipCourseListSize > 1 ) {
                mergeAndSetBorder(new CellRangeAddress(startRow, endRow, startColumn, endColumn), mergeStyle);
                startColumn++;
                endColumn++;
                mergeAndSetBorder(new CellRangeAddress(startRow, endRow, startColumn, endColumn), mergeStyle);
                startColumn++;
                endColumn++;
                mergeAndSetBorder(new CellRangeAddress(startRow, endRow, startColumn, endColumn), numberMergeStyle);
            }

        }
        Row lastRow = sheet.createRow(sheet.getLastRowNum() + 1);
        lastRow.setHeightInPoints(40);
        createCell(lastRow, 4, "รวม", totalCreditStyle);
        createCell(lastRow, 6, totalDipCredit, totalCreditStyle);
        createCell(lastRow, 8, "รวม", totalCreditStyle);
        createCell(lastRow, 9, totalUniCredit, totalCreditStyle);

        for (int i = 3; i < 10; i++) {
            sheet.autoSizeColumn(i);
        }
    }

    public void exportDataToExcel(HttpServletResponse response, List<String> headerList, List<TransferCreditResponse> transferCreditResponseList) throws IOException {
        workbook = new XSSFWorkbook();
        createHeaderRow(headerList);
        writeData(transferCreditResponseList);
        ServletOutputStream outputStream = response.getOutputStream();
        workbook.write(outputStream);
        workbook.close();
        outputStream.close();
    }

    private CellStyle setBorder(CellStyle style) {
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        return style;
    }

    private void mergeAndSetBorder(CellRangeAddress region, CellStyle style) {
        sheet.addMergedRegion(region);
        for (int i = region.getFirstRow(); i <= region.getLastRow(); i++) {
            Row row = sheet.getRow(i);
            if (row == null) {
                row = sheet.createRow(i);
            }
            for (int j = region.getFirstColumn(); j <= region.getLastColumn(); j++) {
                Cell cell = row.getCell(j);
                if (cell == null) {
                    cell = row.createCell(j);
                }
                cell.setCellStyle(style);
            }
        }
    }
}
