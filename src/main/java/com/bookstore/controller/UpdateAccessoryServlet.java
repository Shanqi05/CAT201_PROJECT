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

@WebServlet("/updateAccessory")
@MultipartConfig(
        fileSizeThreshold = 1024 * 1024 * 2,
        maxFileSize = 1024 * 1024 * 10,
        maxRequestSize = 1024 * 1024 * 50
)
public class UpdateAccessoryServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        int id = Integer.parseInt(request.getParameter("id"));
        String title = request.getParameter("title");
        String category = request.getParameter("category");
        double price = Double.parseDouble(request.getParameter("price"));
        int stock = Integer.parseInt(request.getParameter("stock"));

        Part part = request.getPart("image");
        String fileName = null;

        // Check if a new image was uploaded
        if (part != null && part.getSize() > 0) {
            fileName = Paths.get(part.getSubmittedFileName()).getFileName().toString();
            String uniqueFileName = System.currentTimeMillis() + "_" + fileName;

            String savePath = getServletContext().getRealPath("") + File.separator + "uploads";
            File fileSaveDir = new File(savePath);
            if (!fileSaveDir.exists()) fileSaveDir.mkdir();

            part.write(savePath + File.separator + uniqueFileName);
            fileName = uniqueFileName;
        }

        Accessory accessory = new Accessory();
        accessory.setAccessoryId(id);
        accessory.setTitle(title);
        accessory.setCategory(category);
        accessory.setPrice(price);
        accessory.setStock(stock);
        accessory.setImagePath(fileName); // Null if no new image

        AccessoryDAO dao = new AccessoryDAO();
        boolean success = dao.updateAccessory(accessory);

        if (success) {
            response.setStatus(HttpServletResponse.SC_OK);
        } else {
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Update Failed");
        }
    }
}