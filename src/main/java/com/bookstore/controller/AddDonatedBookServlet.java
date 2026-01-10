package com.bookstore.controller;

import com.bookstore.dao.DonatedBookDAO;
import com.bookstore.dao.DonorDAO;
import com.bookstore.model.DonatedBook;
import com.bookstore.model.Donor;
import com.google.gson.Gson;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;

@WebServlet("/addDonatedBook")
public class AddDonatedBookServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        try {
            // 1. Extract Donor Info
            String donorName = request.getParameter("donorName");
            String donorEmail = request.getParameter("donorEmail");
            String donorPhone = request.getParameter("donorPhone");

            // 2. Extract Book Info
            String bookTitle = request.getParameter("bookTitle");
            String author = request.getParameter("author");
            String bookCondition = request.getParameter("bookCondition");
            String category = request.getParameter("category");
            String message = request.getParameter("message");

            // 3. Extract Address
            String houseNo = request.getParameter("houseNo");
            String street = request.getParameter("street");
            String postcode = request.getParameter("postcode");
            String city = request.getParameter("city");
            String state = request.getParameter("state");

            // --- Step A: Save Donor ---
            Donor donor = new Donor(donorEmail, donorName, donorPhone);
            DonorDAO donorDAO = new DonorDAO();
            boolean donorSaved = donorDAO.saveDonor(donor);

            if (!donorSaved) {
                throw new Exception("Failed to save donor info.");
            }

            // --- Step B: Save Book ---
            DonatedBook book = new DonatedBook();
            book.setDonorEmail(donorEmail); // Link to donor
            book.setTitle(bookTitle);
            book.setAuthor(author);
            book.setBookCondition(bookCondition);
            book.setCategory(category);
            book.setMessage(message);

            // Set Address
            book.setPickupHouseNo(houseNo);
            book.setPickupStreet(street);
            book.setPickupPostcode(postcode);
            book.setPickupCity(city);
            book.setPickupState(state);

            DonatedBookDAO bookDAO = new DonatedBookDAO();
            boolean success = bookDAO.addDonatedBook(book);

            Gson gson = new Gson();
            if (success) {
                response.getWriter().write("{\"success\": true, \"message\": \"Donation submitted successfully!\"}");
            } else {
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                response.getWriter().write("{\"success\": false, \"message\": \"Database error saving book\"}");
            }

        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"success\": false, \"message\": \"" + e.getMessage() + "\"}");
        }
    }
}