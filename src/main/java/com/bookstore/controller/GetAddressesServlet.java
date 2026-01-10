package com.bookstore.controller;

import com.bookstore.dao.AddressDAO;
import com.bookstore.model.Address;
import com.bookstore.model.User;
import com.google.gson.Gson;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.util.List;

@WebServlet("/getAddresses")
public class GetAddressesServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
        response.setHeader("Access-Control-Allow-Credentials", "true");
        response.setContentType("application/json");

        HttpSession session = request.getSession(false);
        User user = (session != null) ? (User) session.getAttribute("user") : null;

        if (user == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        try {
            AddressDAO dao = new AddressDAO();
            List<Address> addresses = dao.getAddressesByUserId(user.getUserId());
            response.getWriter().write(new Gson().toJson(addresses));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}