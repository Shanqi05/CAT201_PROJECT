package com.bookstore.controller;

import com.bookstore.dao.BookDAO;
import com.bookstore.model.Book;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.MultipartConfig;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;

@WebServlet("/addBook")
@MultipartConfig(
        fileSizeThreshold = 1024 * 1024 * 2, // 2MB
        maxFileSize = 1024 * 1024 * 10,      // 10MB
        maxRequestSize = 1024 * 1024 * 50    // 50MB
)
public class AddBookServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");

        try {
            // 1. Retrieve Fields
            String title = request.getParameter("title");
            String author = request.getParameter("author");
            double price = Double.parseDouble(request.getParameter("price"));
            String category = request.getParameter("category");
            String condition = request.getParameter("condition");
            String[] genres = request.getParameterValues("genres");

            // 2. Handle Image Upload
            Part filePart = request.getPart("image");
            String fileName = Paths.get(filePart.getSubmittedFileName()).getFileName().toString();

            // Ensure unique filename
            String uniqueFileName = System.currentTimeMillis() + "_" + fileName;
            String uploadPath = getServletContext().getRealPath("") + File.separator + "uploads";

            File uploadDir = new File(uploadPath);
            if (!uploadDir.exists()) uploadDir.mkdir();

            filePart.write(uploadPath + File.separator + uniqueFileName);

            // 3. Create Model
            Book book = new Book();
            book.setTitle(title);
            book.setAuthor(author);
            book.setPrice(price);
            book.setCategory(category);
            book.setCondition(condition);
            book.setGenres(genres); // Set Array
            book.setImagePath(uniqueFileName);
            book.setStatus("Active");

            // 4. Save via DAO
            BookDAO dao = new BookDAO();
            boolean success = dao.addBook(book);

            if (success) {
                response.getWriter().write("{\"success\": true, \"message\": \"Book added successfully\"}");
            } else {
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                response.getWriter().write("{\"error\": \"Database insertion failed\"}");
            }

        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
}