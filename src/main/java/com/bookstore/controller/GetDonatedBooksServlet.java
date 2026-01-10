package com.bookstore.controller;

import com.bookstore.dao.DonatedBookDAO;
import com.bookstore.model.DonatedBook;
import com.google.gson.Gson;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.util.List;

@WebServlet("/getDonatedBooks")
public class GetDonatedBooksServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        try {
            DonatedBookDAO dao = new DonatedBookDAO();
            List<DonatedBook> books = dao.getAllDonatedBooks();

            Gson gson = new Gson();
            String json = gson.toJson(books);
            response.getWriter().write(json);

        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
}
