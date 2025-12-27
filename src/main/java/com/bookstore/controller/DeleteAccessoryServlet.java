package com.bookstore.controller;

import com.bookstore.dao.AccessoryDAO;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;

@WebServlet("/deleteAccessory")
public class DeleteAccessoryServlet extends HttpServlet {

    // 处理预检请求 (Preflight request)
    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        setCorsHeaders(resp);
        resp.setStatus(HttpServletResponse.SC_OK);
    }

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // 1. 设置 CORS
        setCorsHeaders(response);

        try {
            // 2. 获取 ID 参数 (例如: /deleteAccessory?id=5)
            String idStr = request.getParameter("id");
            if (idStr == null || idStr.isEmpty()) {
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Missing ID");
                return;
            }

            int id = Integer.parseInt(idStr);

            // 3. 调用 DAO 删除
            AccessoryDAO dao = new AccessoryDAO();
            boolean success = dao.deleteAccessory(id);

            if (success) {
                response.setStatus(HttpServletResponse.SC_OK); // 200 OK
            } else {
                response.sendError(HttpServletResponse.SC_NOT_FOUND, "Item not found or delete failed");
            }

        } catch (NumberFormatException e) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid ID format");
        } catch (Exception e) {
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Server Error");
        }
    }

    private void setCorsHeaders(HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:5175");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        response.setHeader("Access-Control-Allow-Credentials", "true");
    }
}