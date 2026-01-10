package com.bookstore.controller;

import com.bookstore.dao.UserDAO;
import com.bookstore.model.User;
import com.google.gson.Gson;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;

@WebServlet("/getUserProfile")
public class UserProfileServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        HttpSession session = request.getSession(false);
        User sessionUser = (session != null) ? (User) session.getAttribute("user") : null;

        if (sessionUser == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        UserDAO dao = new UserDAO();
        User freshUser = dao.getUserById(sessionUser.getUserId());

        // Don't send password hash to frontend
        if(freshUser != null) freshUser.setPassword(null);

        Gson gson = new Gson();
        response.getWriter().write(gson.toJson(freshUser));
    }
}