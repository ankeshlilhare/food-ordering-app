package Jar.dto;

import lombok.Data;

@Data
public class OrderItemDTO {
    private Integer id;
    private Integer menuItemId;
    private String menuItemName;
    private Integer quantity;
    private Double price;
}