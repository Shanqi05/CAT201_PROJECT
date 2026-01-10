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

        try {
            // 2. Get Data (Removed Address)
            String name = request.getParameter("name");
            String email = request.getParameter("email");
            String username = request.getParameter("username");
            String password = request.getParameter("password");

            // 3. Fill User Model
            User newUser = new User();
            newUser.setName(name);
            newUser.setUsername(username);
            newUser.setPassword(password);
            newUser.setEmail(email);
            newUser.setRole("USER"); // Default role

            // 4. Save to DB
            boolean isRegistered = userDAO.registerUser(newUser);

            // 5. Response
            Map<String, String> jsonResponse = new HashMap<>();
            Gson gson = new Gson();

            if (isRegistered) {
                jsonResponse.put("status", "success");
                response.setStatus(HttpServletResponse.SC_OK);
            } else {
                jsonResponse.put("status", "failure");
                jsonResponse.put("message", "Username or Email already exists");
                response.setStatus(HttpServletResponse.SC_CONFLICT);
            }

            response.getWriter().write(gson.toJson(jsonResponse));

        } catch (Exception e) {
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Server Error");
        }
    }
}