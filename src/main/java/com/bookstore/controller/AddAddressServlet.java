package com.bookstore.controller;

import com.bookstore.dao.AddressDAO;
import com.bookstore.model.Address;
import com.bookstore.model.User;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;

@WebServlet("/addAddress")
public class AddAddressServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        User user = (session != null) ? (User) session.getAttribute("user") : null;

        if (user == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        Address address = new Address();
        address.setUserId(user.getUserId());
        address.setHouseNo(request.getParameter("houseNo"));
        address.setStreet(request.getParameter("street"));
        address.setPostcode(request.getParameter("postcode"));
        address.setCity(request.getParameter("city"));
        address.setState(request.getParameter("state"));
        address.setPhone(request.getParameter("phone"));

        AddressDAO dao = new AddressDAO();
        if (dao.addAddress(address)) {
            response.setStatus(HttpServletResponse.SC_OK);
        } else {
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Database error");
        }
    }
}