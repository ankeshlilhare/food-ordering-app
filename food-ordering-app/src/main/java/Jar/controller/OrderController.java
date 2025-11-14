package Jar.controller;

import Jar.dto.CreateOrderRequest;
import Jar.dto.OrderDTO;
import Jar.service.OrderService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderService orderService;

    /**
     * Create an order (ADMIN, MANAGER)
     */
    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody CreateOrderRequest request,
                                         HttpServletRequest httpRequest) {
        String role = extractRole(httpRequest);
        String username = extractUsername(httpRequest);
        Integer countryId = extractCountryId(httpRequest);

        if (!hasAnyRole(role, "ADMIN", "MANAGER")) {
            return forbidden("Access denied: Only ADMIN or MANAGER can create orders");
        }
        if (username == null) {
            return unauthorized();
        }

        OrderDTO newOrder = orderService.createOrder(request, username, role, countryId);
        return ResponseEntity.status(HttpStatus.CREATED).body(newOrder);
    }

    /**
     * View current user's orders (ALL roles)
     */
    @GetMapping
    public ResponseEntity<?> getMyOrders(HttpServletRequest httpRequest) {
        String role = extractRole(httpRequest);
        String username = extractUsername(httpRequest);
        Integer countryId = extractCountryId(httpRequest);

        if (username == null) {
            return unauthorized();
        }

        List<OrderDTO> orders = orderService.getUserOrders(username, role, countryId);
        return ResponseEntity.ok(orders);
    }

    /**
     * Cancel an order (ADMIN, MANAGER)
     */
    @PostMapping("/{orderId}/cancel")
    public ResponseEntity<?> cancelOrder(@PathVariable Integer orderId, HttpServletRequest httpRequest) {
        String role = extractRole(httpRequest);
        String username = extractUsername(httpRequest);
        Integer countryId = extractCountryId(httpRequest);

        if (!hasAnyRole(role, "ADMIN", "MANAGER")) {
            return forbidden("Access denied: Only ADMIN or MANAGER can cancel orders");
        }
        if (username == null) {
            return unauthorized();
        }

        OrderDTO cancelledOrder = orderService.cancelOrder(orderId, username, role, countryId);
        return ResponseEntity.ok(cancelledOrder);
    }

    /**
     * Update an order's payment method (ADMIN only)
     */
    @PatchMapping("/{orderId}/payment-method")
    public ResponseEntity<?> updatePaymentMethod(@PathVariable Integer orderId,
                                                 @RequestParam String paymentMethod,
                                                 HttpServletRequest httpRequest) {
        String role = extractRole(httpRequest);

        if (!"ADMIN".equals(role)) {
            return forbidden("Access denied: Only ADMIN can update payment methods");
        }

        OrderDTO updated = orderService.updatePaymentMethod(orderId, paymentMethod);
        return ResponseEntity.ok(updated);
    }

    private String extractRole(HttpServletRequest request) {
        String role = (String) request.getAttribute("role");
        return role != null ? role.replace("ROLE_", "") : null;
    }

    private Integer extractCountryId(HttpServletRequest request) {
        return (Integer) request.getAttribute("countryId");
    }

    private String extractUsername(HttpServletRequest request) {
        return (String) request.getAttribute("username");
    }

    private boolean hasAnyRole(String role, String... allowed) {
        if (role == null) {
            return false;
        }
        for (String allowedRole : allowed) {
            if (role.equalsIgnoreCase(allowedRole)) {
                return true;
            }
        }
        return false;
    }

    private ResponseEntity<Map<String, String>> forbidden(String message) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("error", message));
    }

    private ResponseEntity<Map<String, String>> unauthorized() {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "Unauthorized"));
    }
}