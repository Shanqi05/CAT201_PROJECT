package com.bookstore.controller;

import com.bookstore.dao.UserDAO;
import com.bookstore.model.User;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;

// 1. @WebServlet inform Tomcat：when access /login, run this code
@WebServlet("/login")
public class LoginServlet extends HttpServlet {

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // 2. get frontend username & password
        String user = request.getParameter("username");
        String pass = request.getParameter("password");

        // 3. UserDAO check database
        UserDAO dao = new UserDAO();
        User currentUser = dao.checkLogin(user, pass);

        if (currentUser != null) {
            // 4. log in success：save user to Session
            HttpSession session = request.getSession();
            session.setAttribute("user", currentUser);

            // 5. jump to main page
            response.sendRedirect("index.jsp");
        } else {
            // 6. log in failed, return to login page
            response.sendRedirect("login.jsp?error=InvalidCredentials");
        }
    }
}