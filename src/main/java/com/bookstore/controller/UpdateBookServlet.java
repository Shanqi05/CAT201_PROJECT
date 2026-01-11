package com.bookstore.controller;

import com.bookstore.dao.BookDAO;
import com.bookstore.model.Book;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.MultipartConfig;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;

@WebServlet("/updateBook")
@MultipartConfig
public class UpdateBookServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        try {
            // Retrieve parameters
            int id = Integer.parseInt(request.getParameter("id"));
            String title = request.getParameter("title");
            String author = request.getParameter("author");
            double price = Double.parseDouble(request.getParameter("price"));
            String category = request.getParameter("category");
            String condition = request.getParameter("condition");
            String status = request.getParameter("status");
            String[] genres = request.getParameterValues("genres");

            // [UPDATED] Get Supabase URL string
            String imagePath = request.getParameter("imagePath");

            Book book = new Book();
            book.setBookId(id);
            book.setTitle(title);
            book.setAuthor(author);
            book.setPrice(price);
            book.setCategory(category);
            book.setCondition(condition);
            book.setStatus(status);
            book.setGenres(genres);

            // Only updates if a new URL is provided (handled by DAO if not null)
            book.setImagePath(imagePath);

            BookDAO dao = new BookDAO();
            boolean success = dao.updateBook(book);

            if (success) {
                response.getWriter().write("{\"success\": true}");
            } else {
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                response.getWriter().write("{\"error\": \"Update failed\"}");
            }

        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
}