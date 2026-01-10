package com.bookstore.controller;

import com.bookstore.model.Cart;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;

@WebServlet("/RemoveFromCartServlet")
public class RemoveFromCartServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        // Setup CORS and Type
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String bookIdStr = request.getParameter("bookId");

        if (bookIdStr != null) {
            HttpSession session = request.getSession(false);
            if (session != null) {
                Cart cart = (Cart) session.getAttribute("cart");
                if (cart != null) {
                    try {
                        int bookId = Integer.parseInt(bookIdStr);
                        cart.removeBook(bookId);
                        response.getWriter().write("{\"status\": \"success\"}");
                        return;
                    } catch (NumberFormatException e) {
                        e.printStackTrace();
                    }
                }
            }
        }
        response.getWriter().write("{\"status\": \"error\"}");
    }
}