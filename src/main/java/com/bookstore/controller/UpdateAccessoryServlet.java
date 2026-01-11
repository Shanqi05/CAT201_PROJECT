package com.bookstore.controller;

import com.bookstore.dao.AccessoryDAO;
import com.bookstore.model.Accessory;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.MultipartConfig;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;

@WebServlet("/updateAccessory")
@MultipartConfig
public class UpdateAccessoryServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        int id = Integer.parseInt(request.getParameter("id"));
        String title = request.getParameter("title");
        String category = request.getParameter("category");
        double price = Double.parseDouble(request.getParameter("price"));
        int stock = Integer.parseInt(request.getParameter("stock"));
        String imagePath = request.getParameter("imagePath");

        Accessory accessory = new Accessory();
        accessory.setAccessoryId(id);
        accessory.setTitle(title);
        accessory.setCategory(category);
        accessory.setPrice(price);
        accessory.setStock(stock);

        // DAO logic should only update image_path if this string is not null/empty
        accessory.setImagePath(imagePath);

        AccessoryDAO dao = new AccessoryDAO();
        boolean success = dao.updateAccessory(accessory);

        if (success) {
            response.setStatus(HttpServletResponse.SC_OK);
        } else {
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Update Failed");
        }
    }
}