package com.bookstore.controller;

import com.bookstore.dao.AccessoryDAO;
import com.bookstore.model.Accessory;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.MultipartConfig;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.File;
import java.io.IOException;

@WebServlet("/addAccessory")
@MultipartConfig(
        fileSizeThreshold = 1024 * 1024 * 2,
        maxFileSize = 1024 * 1024 * 10,
        maxRequestSize = 1024 * 1024 * 50
)
public class AddAccessoryServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        String title = request.getParameter("title");
        String category = request.getParameter("category");
        double price = 0.0;
        try {
            price = Double.parseDouble(request.getParameter("price"));
        } catch (Exception e) { price = 0.0; }

        Part part = request.getPart("image");
        String fileName = "";
        if (part != null && part.getSize() > 0) {
            fileName = extractFileName(part);
            String savePath = getServletContext().getRealPath("") + File.separator + "images";
            File fileSaveDir = new File(savePath);
            if (!fileSaveDir.exists()) fileSaveDir.mkdir();
            part.write(savePath + File.separator + fileName);
        }

        Accessory accessory = new Accessory();
        accessory.setTitle(title);
        accessory.setCategory(category);
        accessory.setPrice(price);

        if (!fileName.isEmpty()) {
            accessory.setImagePath("images/" + fileName);
        }

        AccessoryDAO dao = new AccessoryDAO();
        boolean success = dao.addAccessory(accessory);

        if (success) {
            response.setStatus(HttpServletResponse.SC_OK);
        } else {
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Database Insert Failed");
        }
    }

    private String extractFileName(Part part) {
        String contentDisp = part.getHeader("content-disposition");
        String[] items = contentDisp.split(";");
        for (String s : items) {
            if (s.trim().startsWith("filename")) {
                return s.substring(s.indexOf("=") + 2, s.length() - 1);
            }
        }
        return "";
    }
}