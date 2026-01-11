package com.bookstore.controller;

import com.bookstore.dao.BookDAO;
import com.bookstore.dao.DonatedBookDAO;
import com.bookstore.model.Book;
import com.bookstore.model.DonatedBook;
import com.google.gson.Gson;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;

@WebServlet("/updateDonationStatus")
public class UpdateDonationStatusServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        try {
            int id = Integer.parseInt(request.getParameter("id"));
            String status = request.getParameter("status");

            DonatedBookDAO donationDAO = new DonatedBookDAO();
            boolean success = false;

            // If collected, move to Book Inventory
            if ("Collected".equalsIgnoreCase(status)) {
                DonatedBook dBook = donationDAO.getDonatedBookById(id);

                if (dBook != null) {
                    Book book = new Book();
                    book.setTitle(dBook.getTitle());
                    book.setAuthor(dBook.getAuthor());
                    book.setCategory(dBook.getCategory());
                    // Mapping "Like New" etc. to DB schema if needed, assuming direct map for now
                    book.setCondition(dBook.getBookCondition());
                    book.setGenres(dBook.getGenres());
                    book.setImagePath(dBook.getImagePath());
                    book.setPrice(0.00); // Default price, Admin must edit later
                    book.setStatus("Available"); // Make it available immediately

                    BookDAO bookDAO = new BookDAO();
                    // First add to books table
                    if (bookDAO.addBook(book)) {
                        // If successful, update the donation status
                        success = donationDAO.updateStatus(id, status);
                    } else {
                        throw new Exception("Failed to transfer book to inventory.");
                    }
                } else {
                    throw new Exception("Donation record not found.");
                }
            } else {
                // Normal status update (Pending, Approved, Rejected)
                success = donationDAO.updateStatus(id, status);
            }

            Gson gson = new Gson();
            if (success) {
                response.getWriter().write(gson.toJson(new Response(true, "Status updated successfully")));
            } else {
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                response.getWriter().write(gson.toJson(new Response(false, "Failed to update status")));
            }

        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"success\": false, \"message\": \"" + e.getMessage() + "\"}");
        }
    }

    private static class Response {
        boolean success;
        String message;

        Response(boolean success, String message) {
            this.success = success;
            this.message = message;
        }
    }
}