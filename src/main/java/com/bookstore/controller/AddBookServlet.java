package com.bookstore.controller;

import com.bookstore.dao.BookDAO;
import com.bookstore.model.Book;
import com.bookstore.model.User;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.MultipartConfig;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.File;
import java.io.IOException;

@WebServlet("/addBook")
@MultipartConfig( // for upload document
        fileSizeThreshold = 1024 * 1024 * 2, // 2MB
        maxFileSize = 1024 * 1024 * 10,      // 10MB
        maxRequestSize = 1024 * 1024 * 50    // 50MB
)
public class AddBookServlet extends HttpServlet {

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // 1. check whether login
        HttpSession session = request.getSession();
        User currentUser = (User) session.getAttribute("user");
        if (currentUser == null) {
            response.sendRedirect("login.jsp");
            return;
        }

        // 2. Get text data
        String title = request.getParameter("title");
        String author = request.getParameter("author");
        String type = request.getParameter("type"); // "SELL" or "DONATE"
        double price = 0.0;
        try {
            price = Double.parseDouble(request.getParameter("price"));
        } catch (NumberFormatException e) { price = 0.0; }

        // 3. Process image upload
        Part part = request.getPart("image"); // 前端 <input type="file" name="image">
        String fileName = extractFileName(part);

        // Image save path (Stored in the Tomcat deployment directory or the project runtime directory)
        String savePath = getServletContext().getRealPath("") + File.separator + "images";
        File fileSaveDir = new File(savePath);
        if (!fileSaveDir.exists()) fileSaveDir.mkdir();

        part.write(savePath + File.separator + fileName);

        // 4. Save into database
        Book book = new Book(title, author, price, type, currentUser.getId());
        book.setImagePath("images/" + fileName); // 存相对路径

        BookDAO dao = new BookDAO();
        boolean success = dao.addBook(book);

        if (success) {
            response.sendRedirect("index.jsp?msg=BookAdded");
        } else {
            response.sendRedirect("add_book.jsp?error=DatabaseError");
        }
    }

    // Helper method: Extract file name from HTTP header
    private String extractFileName(Part part) {
        String contentDisp = part.getHeader("content-disposition");
        String[] items = contentDisp.split(";");
        for (String s : items) {
            if (s.trim().startsWith("filename")) {
                return s.substring(s.indexOf("=") + 2, s.length() - 1);
            }
        }
        return "";
    }
}
