package Jar.dto;

import lombok.Data;
import java.util.List;

@Data
public class CreateOrderRequest {
    private Integer restaurantId;
    private List<OrderItemRequest> items;
    private String paymentMethod;
}