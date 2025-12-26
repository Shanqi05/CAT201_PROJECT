package com.bookstore.controller;

import com.bookstore.dao.AccessoryDAO; // 假设你有这个DAO
import com.bookstore.model.Accessory; // 假设你有这个Model
import com.bookstore.model.User;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.MultipartConfig;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.File;
import java.io.IOException;

// 1. URL 映射要和 React fetch 的地址对应
@WebServlet("/addAccessory")
@MultipartConfig(fileSizeThreshold = 1024 * 1024 * 2, maxFileSize = 1024 * 1024 * 10, maxRequestSize = 1024 * 1024 * 50)
public class AddAccessoryServlet extends HttpServlet {

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // 2. 必备的 CORS 设置
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
        response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        response.setHeader("Access-Control-Allow-Credentials", "true");

        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            response.setStatus(HttpServletResponse.SC_OK);
            return;
        }

        // 3. 登录检查
        HttpSession session = request.getSession();
        User currentUser = (User) session.getAttribute("user");
        if (currentUser == null) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "User not logged in");
            return;
        }

        // 4. 获取参数 (根据前端 FormData)
        String title = request.getParameter("title");
        String category = request.getParameter("category"); // 前端传的是 category
        double price = 0.0;
        try {
            price = Double.parseDouble(request.getParameter("price"));
        } catch (NumberFormatException e) { price = 0.0; }

        // 5. 图片处理 (逻辑同 Book)
        Part part = request.getPart("image");
        String fileName = extractFileName(part);
        String savePath = getServletContext().getRealPath("") + File.separator + "images";
        File fileSaveDir = new File(savePath);
        if (!fileSaveDir.exists()) fileSaveDir.mkdir();
        part.write(savePath + File.separator + fileName);

        // 6. 保存到数据库 (需要你自己创建 Accessory 模型和 DAO)
        Accessory accessory = new Accessory(title, category, price, "images/" + fileName);
        AccessoryDAO dao = new AccessoryDAO();
        boolean success = dao.addAccessory(accessory); // 真正存入数据库

        // boolean success = true; // 删除这行模拟代码

        if (success) {
            response.setStatus(HttpServletResponse.SC_OK);
        } else {
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Database Insert Failed");
        }
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
