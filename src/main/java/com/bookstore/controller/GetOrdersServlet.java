package com.bookstore.controller;

import com.bookstore.dao.OrderDAO;
import com.google.gson.Gson;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.util.List;
import java.util.Map;

@WebServlet("/getOrders")
public class GetOrdersServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        setCorsHeaders(response); // Handle CORS

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        try {
            OrderDAO dao = new OrderDAO();
            // Get all order data
            List<Map<String, Object>> orders = dao.getAllOrders();

            Gson gson = new Gson();
            String json = gson.toJson(orders);

            response.getWriter().write(json);

        } catch (Exception e) {
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error fetching orders");
        }
    }

    // CORS Configuration
    private void setCorsHeaders(HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:5175");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        response.setHeader("Access-Control-Allow-Credentials", "true");
    }
}