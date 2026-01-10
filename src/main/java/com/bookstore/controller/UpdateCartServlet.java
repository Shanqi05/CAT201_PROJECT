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

@WebServlet("/UpdateCartServlet")
public class UpdateCartServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        // 1. Setup Response Type and CORS headers (handled by filter usually, but good practice here)
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        // 2. Get parameters from the request
        String bookIdStr = request.getParameter("bookId");
        String quantityStr = request.getParameter("quantity");

        if (bookIdStr != null && quantityStr != null) {
            HttpSession session = request.getSession(false);

            if (session != null) {
                Cart cart = (Cart) session.getAttribute("cart");

                if (cart != null) {
                    try {
                        int bookId = Integer.parseInt(bookIdStr);
                        int newQuantity = Integer.parseInt(quantityStr);

                        // 3. Find the item in the cart and update quantity
                        // Note: If you added a specific method in Cart.java, use that instead.
                        // Here we iterate through the list to find the matching book.
                        for (CartItem item : cart.getItems()) {
                            if (item.getBook().getId() == bookId) {
                                // Ensure quantity is at least 1
                                if (newQuantity > 0) {
                                    item.setQuantity(newQuantity);
                                }
                                break;
                            }
                        }

                        // 4. Return success response
                        response.getWriter().write("{\"status\": \"success\", \"message\": \"Cart updated\"}");
                        return;

                    } catch (NumberFormatException e) {
                        e.printStackTrace();
                    }
                }
            }
        }

        // 5. Return error if something failed
        response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
        response.getWriter().write("{\"status\": \"error\", \"message\": \"Failed to update cart\"}");
    }
}