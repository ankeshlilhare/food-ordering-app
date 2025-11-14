package Jar.controller;

import Jar.dto.MenuItemDTO;
import Jar.service.MenuItemService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu-items")
@CrossOrigin(origins = "*")
public class MenuItemController {

    @Autowired
    private MenuItemService menuItemService;

    /**
     * Get menu items for a restaurant - ALL roles
     */
    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<List<MenuItemDTO>> getMenuItemsByRestaurant(
            @PathVariable Integer restaurantId,
            HttpServletRequest request) {

        String role = extractRole(request);
        Integer countryId = extractCountryId(request);

        List<MenuItemDTO> menuItems = menuItemService.getMenuItemsByRestaurant(restaurantId, role, countryId);
        return ResponseEntity.ok(menuItems);
    }

    private String extractRole(HttpServletRequest request) {
        String role = (String) request.getAttribute("role");
        return role != null ? role.replace("ROLE_", "") : null;
    }

    private Integer extractCountryId(HttpServletRequest request) {
        return (Integer) request.getAttribute("countryId");
    }
}