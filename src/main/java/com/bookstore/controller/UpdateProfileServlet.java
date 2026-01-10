package com.bookstore.controller;

import com.bookstore.dao.UserDAO;
import com.bookstore.model.User;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.BufferedReader;
import java.io.IOException;

@WebServlet("/updateProfile")
public class UpdateProfileServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");

        HttpSession session = request.getSession(false);
        User sessionUser = (session != null) ? (User) session.getAttribute("user") : null;

        if (sessionUser == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        try {
            // Read JSON body
            BufferedReader reader = request.getReader();
            JsonObject json = JsonParser.parseReader(reader).getAsJsonObject();

            String action = json.get("action").getAsString();
            UserDAO dao = new UserDAO();
            boolean success = false;

            if ("updateInfo".equals(action)) {
                String newUsername = json.get("username").getAsString();
                String newEmail = json.get("email").getAsString();
                success = dao.updateUserProfile(sessionUser.getUserId(), newUsername, newEmail);

                if(success) {
                    // Update session object
                    sessionUser.setUsername(newUsername);
                    sessionUser.setEmail(newEmail);
                    session.setAttribute("user", sessionUser);
                }

            } else if ("changePassword".equals(action)) {
                String currentPass = json.get("currentPassword").getAsString();
                String newPass = json.get("newPassword").getAsString();

                if (dao.verifyPassword(sessionUser.getUserId(), currentPass)) {
                    success = dao.updatePassword(sessionUser.getUserId(), newPass);
                } else {
                    response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                    response.getWriter().write("{\"success\": false, \"message\": \"Incorrect current password\"}");
                    return;
                }
            }

            if (success) {
                response.getWriter().write("{\"success\": true}");
            } else {
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                response.getWriter().write("{\"success\": false, \"message\": \"Database error\"}");
            }

        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }
}