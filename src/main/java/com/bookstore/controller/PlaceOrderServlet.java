package com.bookstore.controller;

import com.bookstore.dao.OrderDAO;
import com.bookstore.model.Order;
import com.bookstore.model.OrderItem;
import com.bookstore.model.User;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.BufferedReader;
import java.io.IOException;

@WebServlet("/placeOrder")
public class PlaceOrderServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        HttpSession session = request.getSession(false);
        User user = (session != null) ? (User) session.getAttribute("user") : null;

        if (user == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("{\"error\": \"User not logged in\"}");
            return;
        }

        try {
            BufferedReader reader = request.getReader();
            JsonObject json = JsonParser.parseReader(reader).getAsJsonObject();

            int addressId = json.get("addressId").getAsInt();
            String paymentMethod = json.get("paymentMethod").getAsString();
            double totalAmount = json.get("total").getAsDouble();
            JsonArray itemsArray = json.getAsJsonArray("items");

            Order order = new Order();
            order.setUserId(user.getUserId());
            order.setShippingAddressId(addressId);
            order.setPaymentMethod(paymentMethod);
            order.setTotalAmount(totalAmount);
            order.setStatus("Processing");

            for (int i = 0; i < itemsArray.size(); i++) {
                JsonObject itemJson = itemsArray.get(i).getAsJsonObject();

                int id = itemJson.get("id").getAsInt();
                int quantity = itemJson.get("quantity").getAsInt();
                double price = itemJson.get("price").getAsDouble();

                // [FIX] Read the type
                String type = itemJson.has("type") ? itemJson.get("type").getAsString() : "book";

                OrderItem item = new OrderItem();

                // [FIX] Conditionally set ID
                if ("accessory".equalsIgnoreCase(type)) {
                    item.setAccessoryId(id);
                    item.setBookId(0); // Ensure bookId is 0 or null
                } else {
                    item.setBookId(id);
                    item.setAccessoryId(0);
                }

                item.setQuantity(quantity);
                item.setPriceAtPurchase(price);

                order.addItem(item);
            }

            OrderDAO dao = new OrderDAO();
            boolean success = dao.createOrder(order);

            if (success) {
                response.getWriter().write("{\"success\": true, \"message\": \"Order placed successfully\"}");
            } else {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.getWriter().write("{\"error\": \"Order failed.\"}");
            }

        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
}