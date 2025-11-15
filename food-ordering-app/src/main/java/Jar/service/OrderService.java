package Jar.service;

import Jar.dto.CreateOrderRequest;
import Jar.dto.OrderDTO;
import Jar.dto.OrderItemDTO;
import Jar.entity.MenuItem;
import Jar.entity.Order;
import Jar.entity.OrderItem;
import Jar.entity.Restaurant;
import Jar.entity.User;
import Jar.repository.MenuItemRepository;
import Jar.repository.OrderItemRepository;
import Jar.repository.OrderRepository;
import Jar.repository.RestaurantRepository;
import Jar.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private MenuItemRepository menuItemRepository;

    /**
     * Create order - ADMIN, MANAGER only (checked in controller)
     */
    @Transactional
    public OrderDTO createOrder(CreateOrderRequest request, String username, String role, Integer userCountryId) {
        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new RuntimeException("Order must contain at least one item");
        }

        // Get user
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Get restaurant
        Restaurant restaurant = restaurantRepository.findById(request.getRestaurantId())
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));

        // Country-based access check
        if (!"ADMIN".equals(role)) {
            if (userCountryId == null || !restaurant.getCountry().getId().equals(userCountryId)) {
                throw new RuntimeException("Access denied: Cannot order from restaurants in other countries");
            }
        }

        // Create order
        Order order = new Order();
        order.setUser(user);
        order.setRestaurant(restaurant);
        order.setStatus("PENDING");
        order.setPaymentMethod(request.getPaymentMethod());

        // Create order items and calculate total
        double total = 0.0;
        List<OrderItem> createdItems = new ArrayList<>();
        for (var itemRequest : request.getItems()) {
            if (itemRequest.getQuantity() == null || itemRequest.getQuantity() <= 0) {
                throw new RuntimeException("Quantity must be greater than zero");
            }

            MenuItem menuItem = menuItemRepository.findById(itemRequest.getMenuItemId())
                    .orElseThrow(() -> new RuntimeException("Menu item not found"));

            if (!menuItem.getRestaurant().getId().equals(restaurant.getId())) {
                throw new RuntimeException("Menu item does not belong to the selected restaurant");
            }

            if (!Boolean.TRUE.equals(menuItem.getIsAvailable())) {
                throw new RuntimeException("Menu item is not available");
            }

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order); // Set the transient order
            orderItem.setMenuItem(menuItem);
            orderItem.setQuantity(itemRequest.getQuantity());
            orderItem.setPrice(menuItem.getPrice());

            createdItems.add(orderItem);
            total += menuItem.getPrice() * itemRequest.getQuantity();
        }

        order.setTotalAmount(total);
        order.setOrderItems(createdItems);

        Order savedOrder = orderRepository.save(order);

        return convertToDTO(savedOrder);
    }

    /**
     * Get user's orders with country-based filtering
     */
    @Transactional(readOnly = true)
    public List<OrderDTO> getUserOrders(String username, String role, Integer userCountryId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Order> orders = orderRepository.findByUserId(user.getId());

        // Filter by country for non-ADMIN users
        if (!"ADMIN".equals(role)) {
            orders = orders.stream()
                    .filter(order -> order.getRestaurant().getCountry().getId().equals(userCountryId))
                    .collect(Collectors.toList());
        }

        return orders.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Cancel order - ADMIN, MANAGER only (checked in controller)
     */
    @Transactional
    public OrderDTO cancelOrder(Integer orderId, String username, String role, Integer userCountryId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // Check if order belongs to user
        boolean isAdmin = "ADMIN".equals(role);
        if (!isAdmin && !order.getUser().getUsername().equals(username)) {
            throw new RuntimeException("Access denied: Not your order");
        }

        // Country-based access check
        if (!isAdmin) {
            if (userCountryId == null || !order.getRestaurant().getCountry().getId().equals(userCountryId)) {
                throw new RuntimeException("Access denied: Order not in your country");
            }
        }

        if (!"PENDING".equals(order.getStatus())) {
            throw new RuntimeException("Cannot cancel order with status: " + order.getStatus());
        }

        order.setStatus("CANCELLED");
        Order updated = orderRepository.save(order);
        return convertToDTO(updated);
    }

    /**
     * Update payment method - ADMIN only (checked in controller)
     */
    @Transactional
    public OrderDTO updatePaymentMethod(Integer orderId, String paymentMethod) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setPaymentMethod(paymentMethod);
        Order updated = orderRepository.save(order);
        return convertToDTO(updated);
    }

    private OrderDTO convertToDTO(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.setId(order.getId());
        dto.setUserId(order.getUser().getId());
        dto.setUsername(order.getUser().getUsername());
        dto.setRestaurantId(order.getRestaurant().getId());
        dto.setRestaurantName(order.getRestaurant().getName());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setStatus(order.getStatus());
        dto.setPaymentMethod(order.getPaymentMethod());
        dto.setCreatedAt(order.getCreatedAt());
        dto.setUpdatedAt(order.getUpdatedAt());

        if (order.getOrderItems() != null) {
            List<OrderItemDTO> items = order.getOrderItems().stream()
                    .map(this::convertOrderItemToDTO)
                    .collect(Collectors.toList());
            dto.setOrderItems(items);
        }

        return dto;
    }

    private OrderItemDTO convertOrderItemToDTO(OrderItem orderItem) {
        OrderItemDTO dto = new OrderItemDTO();
        dto.setId(orderItem.getId());
        dto.setMenuItemId(orderItem.getMenuItem().getId());
        dto.setMenuItemName(orderItem.getMenuItem().getName());
        dto.setQuantity(orderItem.getQuantity());
        dto.setPrice(orderItem.getPrice());
        return dto;
    }
}