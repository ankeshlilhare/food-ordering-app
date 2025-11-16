package Jar.dto;

import lombok.Data;

@Data
public class MenuItemDTO {
    private Integer id;
    private String name;
    private String description;
    private Double price;
    private String category;
    private Integer restaurantId;
    private String restaurantName;
    private Boolean isAvailable;
    private String imageUrl;
}