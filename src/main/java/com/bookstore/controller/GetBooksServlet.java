package com.bookstore.controller;

import com.bookstore.dao.BookDAO;
import com.bookstore.model.Book;
import com.google.gson.Gson; // 确保你引入了 Gson 库

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.util.List;

@WebServlet("/getBooks")
public class GetBooksServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // 1. 设置跨域 (CORS) - 允许前端 React 访问
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, DELETE");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        response.setHeader("Access-Control-Allow-Credentials", "true");

        // 2. 设置响应类型为 JSON
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        try {
            // 3. 从数据库获取所有书
            BookDAO bookDAO = new BookDAO();
            List<Book> books = bookDAO.getAllBooks();

            // 4. 使用 Gson 自动转换成 JSON 字符串
            // 这会自动调用 Book.java 里的所有 getXxx() 方法
            Gson gson = new Gson();
            String json = gson.toJson(books);

            // 5. 发送给前端
            response.getWriter().write(json);

        } catch (Exception e) {
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error fetching books");
        }
    }
}