package com.bookstore.controller;

import com.bookstore.dao.AccessoryDAO;
import com.bookstore.model.Accessory;
import com.google.gson.Gson; // 确保引入了 Gson

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.util.List;

@WebServlet("/getAccessories") // 对应前端 fetch 的路径
public class GetAccessoriesServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // 1. 设置 CORS (允许 React 访问)
        setCorsHeaders(response);

        // 2. 设置返回类型为 JSON
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        try {
            // 3. 从 DAO 获取数据
            AccessoryDAO dao = new AccessoryDAO();
            List<Accessory> list = dao.getAllAccessories();

            // 4. 转换成 JSON 并输出
            Gson gson = new Gson();
            String json = gson.toJson(list);

            response.getWriter().write(json);

        } catch (Exception e) {
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error fetching data");
        }
    }

    // 辅助方法：设置 CORS
    private void setCorsHeaders(HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:5175");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        response.setHeader("Access-Control-Allow-Credentials", "true");
    }
}