package com.bookstore.controller;

import com.bookstore.dao.UserDAO;
import com.bookstore.model.User;
import com.google.gson.Gson; // Make sure Gson library is imported

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;

@WebServlet("/login")
public class LoginServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // Set Response Headers (JSON)
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        try {
            String user = request.getParameter("username");
            String pass = request.getParameter("password");

            UserDAO dao = new UserDAO();
            User currentUser = dao.checkLogin(user, pass);

            if (currentUser != null) {
                // Success
                HttpSession session = request.getSession();
                session.setAttribute("user", currentUser);

                Gson gson = new Gson();
                String json = gson.toJson(currentUser);
                response.getWriter().write(json);

            } else {
                // Failure
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("{\"message\": \"Invalid Credentials\"}");
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Server Error: " + e.getMessage());
        }
    }
}