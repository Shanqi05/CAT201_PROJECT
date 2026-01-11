package com.bookstore.controller;

import com.bookstore.dao.UserDAO;
import com.bookstore.model.User;
import com.google.gson.Gson;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@WebServlet("/register")
public class RegisterServlet extends HttpServlet {

    private UserDAO userDAO;

    public void init() {
        userDAO = new UserDAO();
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        Map<String, String> jsonResponse = new HashMap<>();
        Gson gson = new Gson();

        try {
            // 1. Get Data
            String name = request.getParameter("name");
            String email = request.getParameter("email");
            String username = request.getParameter("username");
            String password = request.getParameter("password");

            // 2. Validation Checks
            if (userDAO.isEmailTaken(email)) {
                jsonResponse.put("status", "failure");
                // [REQUESTED MESSAGE]
                jsonResponse.put("message", "Account associated with this email already exists");
                response.setStatus(HttpServletResponse.SC_CONFLICT);
                response.getWriter().write(gson.toJson(jsonResponse));
                return;
            }

            if (userDAO.isUsernameTaken(username)) {
                jsonResponse.put("status", "failure");
                jsonResponse.put("message", "Username is already taken");
                response.setStatus(HttpServletResponse.SC_CONFLICT);
                response.getWriter().write(gson.toJson(jsonResponse));
                return;
            }

            // 3. Fill User Model
            User newUser = new User();
            newUser.setName(name);
            newUser.setUsername(username);
            newUser.setPassword(password);
            newUser.setEmail(email);
            newUser.setRole("USER");

            // 4. Save to DB
            boolean isRegistered = userDAO.registerUser(newUser);

            // 5. Response
            if (isRegistered) {
                jsonResponse.put("status", "success");
                response.setStatus(HttpServletResponse.SC_OK);
            } else {
                jsonResponse.put("status", "failure");
                jsonResponse.put("message", "Database error occurred during registration");
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            }

            response.getWriter().write(gson.toJson(jsonResponse));

        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            jsonResponse.put("status", "error");
            jsonResponse.put("message", "Server Error: " + e.getMessage());
            response.getWriter().write(gson.toJson(jsonResponse));
        }
    }
}