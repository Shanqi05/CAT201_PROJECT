package com.bookstore.controller;

import com.bookstore.dao.OrderDAO;
import com.bookstore.model.User;
import com.google.gson.Gson;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.util.List;
import java.util.Map;

@WebServlet("/getUserOrders")
public class GetUserOrdersServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        HttpSession session = request.getSession(false);
        User user = (session != null) ? (User) session.getAttribute("user") : null;

        if (user == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("{\"error\": \"Not logged in\"}");
            return;
        }

        try {
            OrderDAO dao = new OrderDAO();
            // Fetch orders for the logged-in user ID
            List<Map<String, Object>> orders = dao.getOrdersByUserId(user.getUserId());

            Gson gson = new Gson();
            response.getWriter().write(gson.toJson(orders));
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }
}