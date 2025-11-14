package Jar.service;

import Jar.dto.MenuItemDTO;
import Jar.entity.MenuItem;
import Jar.entity.Restaurant;
import Jar.repository.MenuItemRepository;
import Jar.repository.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MenuItemService {

    @Autowired
    private MenuItemRepository menuItemRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    /**
     * Get menu items for a restaurant with country-based access
     */
    public List<MenuItemDTO> getMenuItemsByRestaurant(Integer restaurantId, String role, Integer countryId) {
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));

        // Check country-based access
        if (!"ADMIN".equals(role)) {
            if (countryId == null || !restaurant.getCountry().getId().equals(countryId)) {
                throw new RuntimeException("Access denied: Restaurant not in your country");
            }
        }

        List<MenuItem> menuItems = menuItemRepository.findByRestaurantIdAndIsAvailableTrue(restaurantId);
        return menuItems.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private MenuItemDTO convertToDTO(MenuItem menuItem) {
        MenuItemDTO dto = new MenuItemDTO();
        dto.setId(menuItem.getId());
        dto.setName(menuItem.getName());
        dto.setDescription(menuItem.getDescription());
        dto.setPrice(menuItem.getPrice());
        dto.setCategory(menuItem.getCategory());
        dto.setRestaurantId(menuItem.getRestaurant().getId());
        dto.setRestaurantName(menuItem.getRestaurant().getName());
        dto.setIsAvailable(menuItem.getIsAvailable());
        return dto;
    }
}