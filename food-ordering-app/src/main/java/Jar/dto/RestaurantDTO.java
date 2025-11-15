package Jar.dto;

import lombok.Data;

@Data
public class RestaurantDTO {
    private Integer id;
    private String name;
    private String cuisine;
    private String address;
    private String phoneNumber;
    private String imageUrl;
    private Integer countryId;
    private String countryName;
    private Boolean isActive;
}