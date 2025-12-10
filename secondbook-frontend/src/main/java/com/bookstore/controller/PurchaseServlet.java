package com.bookstore.controller;

import com.bookstore.dao.OrderDAO;
import com.bookstore.model.User;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;

@WebServlet("/purchase")
public class PurchaseServlet extends HttpServlet {

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // 1. Check login status
        HttpSession session = request.getSession();
        User currentUser = (User) session.getAttribute("user");
        if (currentUser == null) {
            response.sendRedirect("login.jsp");
            return;
        }

        // 2. Get the book ID that user want to buy
        int bookId = Integer.parseInt(request.getParameter("bookId"));

        // 3. OrderDAO (Transaction Logic)
        OrderDAO orderDAO = new OrderDAO();
        String result = orderDAO.placeOrder(bookId, currentUser.getId());

        // 4. Result
        if ("SUCCESS".equals(result)) {
            // Update session to reload the new balance
            currentUser.setBalance(currentUser.getBalance() - getBookPrice(bookId));
            session.setAttribute("user", currentUser);

            response.sendRedirect("index.jsp?msg=OrderSuccess");
        } else {
            response.sendRedirect("book_details.jsp?id=" + bookId + "&error=" + result);
        }
    }

    // get price
    private double getBookPrice(int bookId) {
        // BookDAO.getBookById(bookId).getPrice()
        return new com.bookstore.dao.BookDAO().getBookById(bookId).getPrice();
    }
}
