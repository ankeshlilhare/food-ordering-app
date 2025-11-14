package Jar.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderDTO {
    private Integer id;
    private Integer userId;
    private String username;
    private Integer restaurantId;
    private String restaurantName;
    private List<OrderItemDTO> orderItems;
    private Double totalAmount;
    private String status;
    private String paymentMethod;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}