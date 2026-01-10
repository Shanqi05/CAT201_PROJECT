package com.bookstore.controller;

import com.bookstore.dao.BookDAO;
import com.bookstore.model.Book;
import com.bookstore.model.Cart;
import java.io.IOException;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@WebServlet("/AddToCartServlet")
public class AddToCartServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        // 1. Get Book ID from the request
        String bookIdStr = request.getParameter("bookId");
        int bookId = 0;

        try {
            bookId = Integer.parseInt(bookIdStr);
        } catch (NumberFormatException e) {
            response.sendRedirect("index.jsp"); // Redirect if ID is invalid
            return;
        }

        // 2. Retrieve the Book from Database
        BookDAO bookDAO = new BookDAO();
        Book book = bookDAO.getBookById(bookId);

        if (book != null) {
            // 3. Get the existing Session
            HttpSession session = request.getSession();

            // 4. Retrieve the Cart from Session, or create a new one if it doesn't exist
            Cart cart = (Cart) session.getAttribute("cart");
            if (cart == null) {
                cart = new Cart();
                session.setAttribute("cart", cart);
            }

            // 5. Add the book to the cart (Default quantity is 1)
            // You can also get quantity from request if you have an input field for it
            cart.addBook(book, 1);

            // Optional: Set a success message
            session.setAttribute("message", "Book added to cart successfully!");
        }

        // 6. Redirect back to the shopping page or cart page
        // Change "booklist.jsp" to whatever your product page is named
        response.sendRedirect("cart.jsp");
    }
}