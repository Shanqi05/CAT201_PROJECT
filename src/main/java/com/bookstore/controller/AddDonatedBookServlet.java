package com.bookstore.controller;

import com.bookstore.dao.DonatedBookDAO;
import com.bookstore.model.DonatedBook;
import com.google.gson.Gson;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;

@WebServlet("/addDonatedBook")
public class AddDonatedBookServlet extends HttpServlet {

    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setHeader("Access-Control-Allow-Origin", "http://localhost:5175");
        resp.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
        resp.setHeader("Access-Control-Allow-Headers", "Content-Type");
        resp.setHeader("Access-Control-Allow-Credentials", "true");
        resp.setStatus(HttpServletResponse.SC_OK);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:5175");
        response.setHeader("Access-Control-Allow-Credentials", "true");
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        try {
            // Get parameters from request
            String donorName = request.getParameter("donorName");
            String donorEmail = request.getParameter("donorEmail");
            String donorPhone = request.getParameter("donorPhone");
            String bookTitle = request.getParameter("bookTitle");
            String author = request.getParameter("author");
            String bookCondition = request.getParameter("bookCondition");
            String category = request.getParameter("category");
            int quantity = Integer.parseInt(request.getParameter("quantity"));
            String pickupAddress = request.getParameter("pickupAddress");
            String message = request.getParameter("message");

            // Create DonatedBook object
            DonatedBook book = new DonatedBook(donorName, donorEmail, donorPhone, bookTitle,
                    author, bookCondition, category, quantity, pickupAddress, message);

            // Save to database
            DonatedBookDAO dao = new DonatedBookDAO();
            boolean success = dao.addDonatedBook(book);

            Gson gson = new Gson();
            if (success) {
                response.getWriter().write(gson.toJson(new Response(true, "Book donation submitted successfully!")));
            } else {
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                response.getWriter().write(gson.toJson(new Response(false, "Failed to submit donation")));
            }

        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"success\": false, \"message\": \"" + e.getMessage() + "\"}");
        }
    }

    // Inner class for JSON response
    private static class Response {
        boolean success;
        String message;

        Response(boolean success, String message) {
            this.success = success;
            this.message = message;
        }
    }
}
