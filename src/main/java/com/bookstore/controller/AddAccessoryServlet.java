package com.bookstore.controller;

import com.bookstore.dao.AccessoryDAO;
import com.bookstore.model.Accessory;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.MultipartConfig;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;

@WebServlet("/addAccessory")
@MultipartConfig
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

        String imagePath = request.getParameter("imagePath");

        Accessory accessory = new Accessory();
        accessory.setTitle(title);
        accessory.setCategory(category);
        accessory.setPrice(price);
        accessory.setStock(stock);
        accessory.setImagePath(imagePath);

        AccessoryDAO dao = new AccessoryDAO();
        boolean success = dao.addAccessory(accessory);

        if (success) {
            response.setStatus(HttpServletResponse.SC_OK);
        } else {
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Database Insert Failed");
        }
    }
}