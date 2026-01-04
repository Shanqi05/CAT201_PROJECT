package com.bookstore.controller;

import com.bookstore.dao.AccessoryDAO; // [修改1] 引入 AccessoryDAO
import com.bookstore.dao.DashboardDAO;
import com.bookstore.model.Book;
import com.google.gson.Gson;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@WebServlet("/dashboard-stats")
public class DashboardServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        try {
            // [修改2] 初始化两个 DAO
            DashboardDAO dashboardDao = new DashboardDAO();
            AccessoryDAO accessoryDao = new AccessoryDAO();

            // 2. Fetch Stats, Recent Books AND Accessory Count
            DashboardDAO.DashboardStats stats = dashboardDao.getStats();
            List<Book> recentBooks = dashboardDao.getRecentBooks();

            // [修改3] 获取配件总数
            int totalAccessories = accessoryDao.getTotalAccessoriesCount();

            // 3. Combine data
            Map<String, Object> result = new HashMap<>();

            // 原有的数据
            result.put("stats", stats);
            result.put("recentBooks", recentBooks);

            // [修改4] 把配件总数放进返回结果里
            // 注意：前端获取时，需要用 data.totalAccessories (而不是在 data.stats 里面)
            result.put("totalAccessories", totalAccessories);

            // 4. Send JSON
            Gson gson = new Gson();
            response.getWriter().write(gson.toJson(result));

        } catch (Exception e) {
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error fetching dashboard data");
        }
    }
}