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

    // 1. Handle OPTIONS request (CORS Preflight - Required to prevent React CORS errors)
    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setHeader("Access-Control-Allow-Origin", "http://localhost:5177"); // Your React Frontend URL
        resp.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
        resp.setHeader("Access-Control-Allow-Headers", "Content-Type");
        resp.setHeader("Access-Control-Allow-Credentials", "true"); // Allow Cookies/Session
        resp.setStatus(HttpServletResponse.SC_OK);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // 2. Set Response Headers (CORS + JSON)
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:5177");
        response.setHeader("Access-Control-Allow-Credentials", "true");
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        try {
            // [DEBUG] Log to confirm request received
            System.out.println("--- Login Request Received ---");

            String user = request.getParameter("username");
            String pass = request.getParameter("password");

            UserDAO dao = new UserDAO();
            User currentUser = dao.checkLogin(user, pass);

            if (currentUser != null) {
                // 3. Login Success
                System.out.println("Login Success: " + currentUser.getUsername());

                // Save Session (Optional for REST API, but good for hybrid approaches)
                HttpSession session = request.getSession();
                session.setAttribute("user", currentUser);

                // [CRITICAL FIX]: Do NOT use sendRedirect! Return JSON instead!
                Gson gson = new Gson();
                String json = gson.toJson(currentUser);
                response.getWriter().write(json);

            } else {
                // 4. Login Failed
                System.out.println("Login Failed");

                // Return 401 status code and error JSON
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("{\"message\": \"Invalid Credentials\"}");
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Server Error: " + e.getMessage());
        }
    }
}