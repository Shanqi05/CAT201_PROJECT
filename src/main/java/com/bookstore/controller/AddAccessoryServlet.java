package com.bookstore.controller;

import com.bookstore.dao.AccessoryDAO;
import com.bookstore.model.Accessory;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.MultipartConfig;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;

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
        int stock = 0;

        try {
            price = Double.parseDouble(request.getParameter("price"));
        } catch (Exception e) { price = 0.0; }

        try {
            String stockParam = request.getParameter("stock");
            if (stockParam != null && !stockParam.isEmpty()) {
                stock = Integer.parseInt(stockParam);
            }
        } catch (Exception e) { stock = 0; }

        Part part = request.getPart("image");
        String fileName = "";

        if (part != null && part.getSize() > 0) {
            String rawFileName = Paths.get(part.getSubmittedFileName()).getFileName().toString();

            // Sanitize Filename: Remove spaces and special characters
            // Replaces spaces with underscores, removes anything that isn't a letter, number, dot, underscore, or dash
            String sanitizedFileName = rawFileName.replaceAll("\\s+", "_").replaceAll("[^a-zA-Z0-9._-]", "");

            String uniqueFileName = System.currentTimeMillis() + "_" + sanitizedFileName;

            // Ensure we save to 'uploads' matching React frontend expectation
            String savePath = getServletContext().getRealPath("") + File.separator + "uploads";
            File fileSaveDir = new File(savePath);
            if (!fileSaveDir.exists()) fileSaveDir.mkdir();

            part.write(savePath + File.separator + uniqueFileName);
            fileName = uniqueFileName;
        }

        Accessory accessory = new Accessory();
        accessory.setTitle(title);
        accessory.setCategory(category);
        accessory.setPrice(price);
        accessory.setStock(stock);

        if (!fileName.isEmpty()) {
            accessory.setImagePath(fileName);
        }

        AccessoryDAO dao = new AccessoryDAO();
        boolean success = dao.addAccessory(accessory);

        if (success) {
            response.setStatus(HttpServletResponse.SC_OK);
        } else {
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Database Insert Failed");
        }
    }
}