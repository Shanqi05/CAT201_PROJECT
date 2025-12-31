package com.bookstore.controller;

import com.bookstore.dao.UserDAO;
import com.bookstore.model.User;
import com.google.gson.Gson;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Map;

@WebServlet("/register")
public class RegisterServlet extends HttpServlet {

    private UserDAO userDAO;

    public void init() {
        userDAO = new UserDAO();
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        // Setup Response
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();

        // Get Data
        String name = request.getParameter("name");
        String email = request.getParameter("email");
        String username = request.getParameter("username");
        String password = request.getParameter("password");
        String address = request.getParameter("address");
        String role = request.getParameter("role");

        // Fill User
        User newUser = new User();
        newUser.setName(name);
        newUser.setUsername(username);
        newUser.setPassword(password);
        newUser.setEmail(email);
        newUser.setAddress(address);
        newUser.setRole(role != null ? role : "customer");

        // Save DB
        boolean isRegistered = userDAO.registerUser(newUser);

        // Respond
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

        out.print(gson.toJson(jsonResponse));
        out.flush();
    }
}