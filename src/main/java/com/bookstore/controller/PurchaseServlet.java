package com.bookstore.controller;

import com.bookstore.dao.OrderDAO;
import com.bookstore.model.Order;
import com.bookstore.model.OrderItem;
import com.bookstore.model.User;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;

@WebServlet("/purchase")
public class PurchaseServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        // 1. Check if user is logged in
        HttpSession session = request.getSession();
        User currentUser = (User) session.getAttribute("user");

        if (currentUser == null) {
            // User not logged in, redirect to login page
            response.sendRedirect("login.jsp");
            return;
        }

        try {
            // 2. Get parameters from request
            // Frontend MUST send 'bookId' and 'price'
            String bookIdStr = request.getParameter("bookId");
            String priceStr = request.getParameter("price");

            if (bookIdStr == null || priceStr == null) {
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Missing bookId or price");
                return;
            }

            int bookId = Integer.parseInt(bookIdStr);
            double price = Double.parseDouble(priceStr);

            // 3. Prepare the Order Object (The "Header")
            // Constructor: Order(int userId, double totalAmount, String shippingAddress, String paymentMethod)
            // Note: Ensure your User model has getAddress() method, or use a hardcoded string for testing
            String address = (currentUser.getAddress() != null) ? currentUser.getAddress() : "Default Address";

            Order newOrder = new Order(
                    currentUser.getId(),
                    price,        // Total amount
                    address,      // Shipping address
                    "Credit Card" // Default payment method
            );

            // 4. Prepare the OrderItem Object (The "Item")
            // Constructor: OrderItem(int bookId, int quantity, double priceAtPurchase)
            OrderItem item = new OrderItem(bookId, 1, price);

            // 5. Add item to the order list
            newOrder.addItem(item);

            // 6. Call the new DAO method
            OrderDAO orderDAO = new OrderDAO();
            boolean isSuccess = orderDAO.createOrder(newOrder);

            // 7. Redirect based on result
            if (isSuccess) {
                // Success: Redirect to the order list page
                // Ensure you have a page to view orders (e.g., myOrders.html or viewOrders.jsp)
                response.sendRedirect("index.jsp");
            } else {
                response.getWriter().write("Order Failed: Database Error");
            }

        } catch (NumberFormatException e) {
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid number format for ID or Price");
        } catch (Exception e) {
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Server Error: " + e.getMessage());
        }
    }
}