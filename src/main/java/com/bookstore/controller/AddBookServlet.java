package com.bookstore.controller;

import com.bookstore.dao.BookDAO;
import com.bookstore.model.Book;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.MultipartConfig;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;

@WebServlet("/addBook")
@MultipartConfig(
        fileSizeThreshold = 1024 * 1024 * 2, // 2MB
        maxFileSize = 1024 * 1024 * 10,      // 10MB
        maxRequestSize = 1024 * 1024 * 50    // 50MB
)
public class AddBookServlet extends HttpServlet {

    private static final String UPLOAD_DIR = "uploads";

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        // 1. 设置 CORS (允许前端 React 访问)
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
        response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        response.setHeader("Access-Control-Allow-Credentials", "true");

        try {
            // 2. 接收普通文本字段
            String title = request.getParameter("title");
            String author = request.getParameter("author");
            String type = request.getParameter("type"); // 前端发来的是 "SELL" 或 "DONATE"
            String priceStr = request.getParameter("price");
            String condition = request.getParameter("condition");

            if (title == null || priceStr == null) {
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Missing required fields");
                return;
            }

            double price = Double.parseDouble(priceStr);

            // 3. 处理图片上传
            Part filePart = request.getPart("image");
            String fileName = "default.jpg";

            if (filePart != null && filePart.getSize() > 0) {
                // 获取文件名
                fileName = Paths.get(filePart.getSubmittedFileName()).getFileName().toString();
                // 防止文件名重复 (加个时间戳)
                fileName = System.currentTimeMillis() + "_" + fileName;

                // 获取上传路径
                String applicationPath = request.getServletContext().getRealPath("");
                String uploadFilePath = applicationPath + File.separator + UPLOAD_DIR;

                // 创建目录（如果不存在）
                File uploadDir = new File(uploadFilePath);
                if (!uploadDir.exists()) {
                    uploadDir.mkdirs();
                }

                // 保存文件
                filePart.write(uploadFilePath + File.separator + fileName);
            }

            // 4. 创建 Book 对象 (使用 Setters 修复报错)
            Book newBook = new Book();
            newBook.setTitle(title);
            newBook.setAuthor(author);
            newBook.setPrice(price);
            newBook.setCondition(condition != null ? condition : "Good");
            newBook.setImagePath(fileName); // 存文件名，不是完整路径

            // 适配新数据库字段
            // 将前端的 'type' 存入 'category' (或者你可以根据业务逻辑改)
            newBook.setCategory(type != null ? type : "General");

            // 设置默认值 (因为前端 ManageBooks.jsx 还没传这几个值)
            newBook.setCondition("Good");
            newBook.setStock(1);
            newBook.setRating(0.0);
            newBook.setStatus("Active");

            // 5. 保存到数据库
            BookDAO bookDAO = new BookDAO();
            boolean success = bookDAO.addBook(newBook);

            if (success) {
                response.setStatus(HttpServletResponse.SC_OK);
                response.getWriter().write("{\"message\": \"Book added successfully\"}");
            } else {
                response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Database insertion failed");
            }

        } catch (Exception e) {
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error: " + e.getMessage());
        }
    }

    // 处理 OPTIONS 预检请求 (CORS)
    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
        resp.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
        resp.setHeader("Access-Control-Allow-Headers", "Content-Type");
        resp.setHeader("Access-Control-Allow-Credentials", "true");
        resp.setStatus(HttpServletResponse.SC_OK);
    }
}