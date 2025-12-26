package com.bookstore.controller;

import com.bookstore.dao.BookDAO;
import com.bookstore.model.Book;
import com.bookstore.model.User;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.MultipartConfig;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.File;
import java.io.IOException;

// 确保这里的名字和你 Tomcat 日志里的 Context Path 对应
@WebServlet("/addBook")
@MultipartConfig(
        fileSizeThreshold = 1024 * 1024 * 2,
        maxFileSize = 1024 * 1024 * 10,
        maxRequestSize = 1024 * 1024 * 50
)
public class AddBookServlet extends HttpServlet {

    // >>> 关键修复 1：新增 doOptions 方法处理预检请求 <<<
    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        setCorsHeaders(resp); // 设置允许跨域
        resp.setStatus(HttpServletResponse.SC_OK); // 告诉前端：允许访问
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // >>> 关键修复 2：POST 请求里也要带上 Header <<<
        setCorsHeaders(response);

        // 1. 登录检查
        HttpSession session = request.getSession();
        User currentUser = (User) session.getAttribute("user");

        // 为了方便测试，如果 session 里没用户，我们可以先模拟一个 admin (仅测试用)
        // 如果你已经实现了登录，就把下面这行注释掉
        if (currentUser == null) {
            // response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "User not logged in");
            // return;
        }

        // 假设当前用户ID是 1 (防止空指针报错，测试完删掉)
        int userId = (currentUser != null) ? currentUser.getId() : 1;

        // 2. 获取参数
        String title = request.getParameter("title");
        String author = request.getParameter("author");
        String type = request.getParameter("type");
        double price = 0.0;
        try {
            price = Double.parseDouble(request.getParameter("price"));
        } catch (Exception e) { price = 0.0; }

        // 3. 图片处理
        Part part = request.getPart("image");
        String fileName = "";
        if (part != null && part.getSize() > 0) {
            fileName = extractFileName(part);
            String savePath = getServletContext().getRealPath("") + File.separator + "images";
            File fileSaveDir = new File(savePath);
            if (!fileSaveDir.exists()) fileSaveDir.mkdir();
            part.write(savePath + File.separator + fileName);
        }

        // 4. 保存到数据库
        // 注意：这里用 userId 变量
        Book book = new Book(title, author, price, type, userId);
        if (!fileName.isEmpty()) {
            book.setImagePath("images/" + fileName);
        }

        BookDAO dao = new BookDAO();
        boolean success = dao.addBook(book);

        if (success) {
            response.setStatus(HttpServletResponse.SC_OK);
        } else {
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Database Insert Failed");
        }
    }

    // 辅助方法：统一设置 CORS 头，防止漏写
    private void setCorsHeaders(HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
        response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        response.setHeader("Access-Control-Allow-Credentials", "true");
    }

    private String extractFileName(Part part) {
        String contentDisp = part.getHeader("content-disposition");
        String[] items = contentDisp.split(";");
        for (String s : items) {
            if (s.trim().startsWith("filename")) {
                return s.substring(s.indexOf("=") + 2, s.length() - 1);
            }
        }
        return "";
    }
}