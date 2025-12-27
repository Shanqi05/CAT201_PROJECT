package com.bookstore.controller;

import com.bookstore.dao.AccessoryDAO;
import com.bookstore.model.Accessory;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.MultipartConfig;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.File;
import java.io.IOException;

@WebServlet("/addAccessory") // 前端 fetch 的就是这个地址
@MultipartConfig(
        fileSizeThreshold = 1024 * 1024 * 2,
        maxFileSize = 1024 * 1024 * 10,
        maxRequestSize = 1024 * 1024 * 50
)
public class AddAccessoryServlet extends HttpServlet {

    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        setCorsHeaders(resp);
        resp.setStatus(HttpServletResponse.SC_OK);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        setCorsHeaders(response);

        // 1. 获取参数 (Accessory 没有 author, 但有 category)
        String title = request.getParameter("title");
        String category = request.getParameter("category"); // 前端传过来的是 "category"
        double price = 0.0;
        try {
            price = Double.parseDouble(request.getParameter("price"));
        } catch (Exception e) { price = 0.0; }

        // 2. 图片处理 (代码逻辑和 Book 一样)
        Part part = request.getPart("image");
        String fileName = "";
        if (part != null && part.getSize() > 0) {
            fileName = extractFileName(part);
            // 建议把图片存在同一个 images 文件夹，或者新建 accessories 文件夹
            String savePath = getServletContext().getRealPath("") + File.separator + "images";
            File fileSaveDir = new File(savePath);
            if (!fileSaveDir.exists()) fileSaveDir.mkdir();
            part.write(savePath + File.separator + fileName);
        }

        // 3. 保存到数据库
        // 假设你有一个 Accessory 类
        Accessory accessory = new Accessory();
        accessory.setTitle(title);
        accessory.setCategory(category);
        accessory.setPrice(price);

        if (!fileName.isEmpty()) {
            accessory.setImagePath("images/" + fileName);
        }

        // 假设你有一个 AccessoryDAO
        AccessoryDAO dao = new AccessoryDAO();
        boolean success = dao.addAccessory(accessory);

        if (success) {
            response.setStatus(HttpServletResponse.SC_OK);
        } else {
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Database Insert Failed");
        }
    }

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