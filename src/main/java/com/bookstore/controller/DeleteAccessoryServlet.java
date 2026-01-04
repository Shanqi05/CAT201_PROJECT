package com.bookstore.controller;

import com.bookstore.dao.AccessoryDAO;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;

@WebServlet("/deleteAccessory")
public class DeleteAccessoryServlet extends HttpServlet {

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

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
}