package com.bookstore.controller;

import com.bookstore.dao.BookDAO;
import com.bookstore.model.Book;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

// 1. 设置访问路径
@WebServlet("/getBooks")
public class GetBooksServlet extends HttpServlet {

    // 2. 处理 CORS 预检 (和你的 AddBookServlet 一样，防止跨域报错)
    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        setCorsHeaders(resp);
        resp.setStatus(HttpServletResponse.SC_OK);
    }

    // 3. 处理 GET 请求 (获取数据)
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // 设置响应头
        setCorsHeaders(response);
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        response.setHeader("Access-Control-Allow-Credentials", "true");
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        // 从数据库获取所有书
        BookDAO dao = new BookDAO();
        List<Book> books = dao.getAllBooks(); // 确保你的 BookDAO 里有这个方法！

        // 4. 手动拼接 JSON 字符串
        PrintWriter out = response.getWriter();
        StringBuilder json = new StringBuilder("[");

        for (int i = 0; i < books.size(); i++) {
            Book b = books.get(i);

            // 防止字符串里有引号导致 JSON 格式错误
            String title = escape(b.getTitle());
            String author = escape(b.getAuthor());
            String category = escape(b.getListingType()); // >>> 重点：把 listingType 映射为 category
            String image = (b.getImagePath() != null) ? b.getImagePath() : ""; // >>> 重点：把 imagePath 映射为 image

            json.append("{")
                    .append("\"id\":").append(b.getId()).append(",")
                    .append("\"title\":\"").append(title).append("\",")
                    .append("\"author\":\"").append(author).append("\",")
                    .append("\"price\":").append(b.getPrice()).append(",")
                    .append("\"category\":\"").append(category).append("\",") // 前端用 category
                    .append("\"image\":\"").append(image).append("\"")       // 前端用 image
                    .append("}");

            // 如果不是最后一个，加逗号
            if (i < books.size() - 1) {
                json.append(",");
            }
        }
        json.append("]");

        // 发送给前端
        out.print(json.toString());
        out.flush();
    }

    // 简单的转义工具，防止书名里有双引号破坏 JSON
    private String escape(String text) {
        if (text == null) return "";
        return text.replace("\"", "\\\"").replace("\n", " ");
    }

    // 统一的 CORS 设置
    private void setCorsHeaders(HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
        response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        response.setHeader("Access-Control-Allow-Credentials", "true");
    }
}