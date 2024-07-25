package com.example.credittransfer.service;

import com.example.credittransfer.dto.response.DipCourseResponse;
import com.example.credittransfer.dto.response.TransferCreditResponse;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.io.OutputStream;
import java.util.List;

@Service
public class PDFGeneratorService {

    public void createPdf(List<TransferCreditResponse> transferCreditResponseList, OutputStream os) throws IOException {


        float marginLeft = 10;
        float marginRight = 10;
        float marginTop = 10;
        float marginBottom = 10;
        Document document = new Document(PageSize.A4, marginLeft, marginRight, marginTop, marginBottom);

        try {
            PdfWriter.getInstance(document, os);
            document.open();


            File fontFile = new ClassPathResource("/font/THSarabunNew.ttf").getFile();
            BaseFont baseFont = BaseFont.createFont(fontFile.getAbsolutePath(), BaseFont.IDENTITY_H, BaseFont.EMBEDDED);
            Font font = new Font(baseFont, 12);

            PdfPTable table = new PdfPTable(7);
            table.setWidthPercentage(100);

            // กำหนดความกว้างของแต่ละคอลัมน์
            float[] columnWidths = {2f, 7f, 1f, 1.3f, 1.5f, 7f, 1.3f};
            table.setWidths(columnWidths);


            table.addCell(new Paragraph("รหัสวิชา \nCourse Code", font));
            table.addCell(new Paragraph("วิชาที่ขอเทียบโอนจาก \nCourse transferred from\n สถานบัน (institute)…………………………\n คณะ (School of)…………………………", font));
            table.addCell(new Paragraph("เกรด \nGrade", font));
            table.addCell(new Paragraph("หน่วยกิต \nCredit", font));
            table.addCell(new Paragraph("รหัสวิชา \nCourse Code", font));
            table.addCell(new Paragraph("วิชาที่เทียบโอนหน่วยกิตได้ \nTransferred Course Equivalents", font));
            table.addCell(new Paragraph("หน่วยกิต \nCredit", font));

            for (TransferCreditResponse response : transferCreditResponseList) {
                int dipCourseListSize = response.getDiplomaCourseList().size();
                boolean firstRow = true;

                for (DipCourseResponse dipCourse : response.getDiplomaCourseList()) {
                    table.addCell(new Paragraph(dipCourse.getDipCourseId(), font));
                    table.addCell(new Paragraph(dipCourse.getDipCourseName(), font));
                    table.addCell(new Paragraph(String.valueOf(dipCourse.getGrade()), font));
                    table.addCell(new Paragraph(String.valueOf(dipCourse.getDipCredit()), font));

                    if (firstRow) {
                        PdfPCell uniCourseIdCell = new PdfPCell(new Paragraph(response.getUniCourseId(), font));
                        PdfPCell uniCourseNameCell = new PdfPCell(new Paragraph(response.getUniCourseName(), font));
                        PdfPCell uniCreditCell = new PdfPCell(new Paragraph(String.valueOf(response.getUniCredit()), font));

                        uniCourseIdCell.setRowspan(dipCourseListSize);
                        uniCourseNameCell.setRowspan(dipCourseListSize);
                        uniCreditCell.setRowspan(dipCourseListSize);
                        uniCourseIdCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
                        uniCourseNameCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
                        uniCreditCell.setVerticalAlignment(Element.ALIGN_MIDDLE);

                        table.addCell(uniCourseIdCell);
                        table.addCell(uniCourseNameCell);
                        table.addCell(uniCreditCell);

                        firstRow = false;
                    }
                }
                if (!firstRow) {
                    table.completeRow();
                }
            }

            document.add(table);
            document.close();
        } catch (DocumentException e) {
            throw new RuntimeException(e);
        }
    }
}
