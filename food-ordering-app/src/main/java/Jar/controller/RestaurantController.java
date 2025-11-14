package Jar.controller;

import Jar.dto.RestaurantDTO;
import Jar.service.RestaurantService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/restaurants")
@CrossOrigin(origins = "*")
public class RestaurantController {

    @Autowired
    private RestaurantService restaurantService;

    /**
     * View restaurants - ALL roles (ADMIN, MANAGER, MEMBER)
     */
    @GetMapping
    public ResponseEntity<List<RestaurantDTO>> getAllRestaurants(HttpServletRequest request) {
        String role = extractRole(request);
        Integer countryId = extractCountryId(request);

        List<RestaurantDTO> restaurants = restaurantService.getAllRestaurants(role, countryId);
        return ResponseEntity.ok(restaurants);
    }

    /**
     * Get restaurant by ID - ALL roles
     */
    @GetMapping("/{id}")
    public ResponseEntity<RestaurantDTO> getRestaurantById(
            @PathVariable Integer id,
            HttpServletRequest request) {

        String role = extractRole(request);
        Integer countryId = extractCountryId(request);

        RestaurantDTO restaurant = restaurantService.getRestaurantById(id, role, countryId);
        return ResponseEntity.ok(restaurant);
    }

    /**
     * Create restaurant - ADMIN only
     */
    @PostMapping
    public ResponseEntity<?> createRestaurant(
            @RequestBody RestaurantDTO restaurantDTO,
            HttpServletRequest request) {

        String role = extractRole(request);

        // RBAC: Only ADMIN can create restaurants
        if (!"ADMIN".equals(role)) {
            return ResponseEntity.status(403)
                    .body(Map.of("error", "Access denied: Only ADMIN can create restaurants"));
        }

        RestaurantDTO created = restaurantService.createRestaurant(restaurantDTO);
        return ResponseEntity.ok(created);
    }

    // Helper methods
    private String extractRole(HttpServletRequest request) {
        String role = (String) request.getAttribute("role");
        return role != null ? role.replace("ROLE_", "") : null;
    }

    private Integer extractCountryId(HttpServletRequest request) {
        return (Integer) request.getAttribute("countryId");
    }
}