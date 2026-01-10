package com.bookstore.controller;

import com.bookstore.model.Cart;
import com.bookstore.model.CartItem;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

@WebServlet("/GetCartServlet")
public class GetCartServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        // 1. Setup JSON Response headers
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();

        // 2. Get Session and Cart
        HttpSession session = request.getSession(false); // false means don't create if not exists
        Cart cart = (session != null) ? (Cart) session.getAttribute("cart") : null;

        // 3. Construct JSON manually (to avoid needing external libraries like Gson/Jackson for now)
        StringBuilder json = new StringBuilder();
        json.append("{"); // Start Object

        if (cart == null || cart.getItems().isEmpty()) {
            json.append("\"status\": \"empty\", ");
            json.append("\"items\": [], ");
            json.append("\"total\": 0.00");
        } else {
            json.append("\"status\": \"success\", ");
            json.append("\"total\": ").append(cart.getGrandTotal()).append(", ");
            json.append("\"items\": ["); // Start Array

            List<CartItem> items = cart.getItems();
            for (int i = 0; i < items.size(); i++) {
                CartItem item = items.get(i);

                json.append("{");
                json.append("\"bookId\": ").append(item.getBook().getId()).append(", ");
                // Escape quotes in title to prevent JSON errors
                json.append("\"title\": \"").append(item.getBook().getTitle().replace("\"", "\\\"")).append("\", ");
                json.append("\"image\": \"").append(item.getBook().getImagePath()).append("\", ");
                json.append("\"price\": ").append(item.getBook().getPrice()).append(", ");
                json.append("\"quantity\": ").append(item.getQuantity()).append(", ");
                json.append("\"totalPrice\": ").append(item.getTotalPrice());
                json.append("}");

                // Add comma if not the last item
                if (i < items.size() - 1) {
                    json.append(", ");
                }
            }
            json.append("]"); // End Array
        }

        json.append("}"); // End Object

        // 4. Send JSON back to React
        out.print(json.toString());
        out.flush();
    }
}