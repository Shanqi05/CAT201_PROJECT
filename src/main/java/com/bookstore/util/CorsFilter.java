package com.bookstore.util; // Make sure this matches your package structure

import jakarta.servlet.*; // Use 'javax.servlet.*' if using Tomcat 9
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

// This annotation makes it apply to EVERY request automatically
@WebFilter("/*")
public class CorsFilter implements Filter {

    public void init(FilterConfig filterConfig) {}

    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest request = (HttpServletRequest) req;
        HttpServletResponse response = (HttpServletResponse) res;

        // 1. Allow your React Frontend URL
        // (If your team uses port 3000, change 5173 to 3000)
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");

        // 2. Allow these standard methods
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

        // 3. Allow headers like "Content-Type" (JSON)
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

        // 4. Allow cookies/login sessions (Important for later!)
        response.setHeader("Access-Control-Allow-Credentials", "true");

        // 5. Handle "Preflight" OPTIONS requests
        // (React sends a 'Test' request first; we must say OK immediately)
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            response.setStatus(HttpServletResponse.SC_OK);
        } else {
            // Pass the request down the chain to your Servlets
            chain.doFilter(req, res);
        }
    }

    public void destroy() {}
}