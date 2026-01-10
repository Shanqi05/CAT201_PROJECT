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

        String houseNo = request.getParameter("houseNo");
        String street = request.getParameter("street");
        String postcode = request.getParameter("postcode");
        String city = request.getParameter("city");
        String state = request.getParameter("state");

        Address address = new Address();
        address.setUserId(user.getUserId());
        address.setHouseNo(houseNo);
        address.setStreet(street);
        address.setPostcode(postcode);
        address.setCity(city);
        address.setState(state);

        AddressDAO dao = new AddressDAO();
        boolean success = dao.addAddress(address);

        if (success) {
            response.setStatus(HttpServletResponse.SC_OK);
        } else {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }
}