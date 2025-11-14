package Jar.service;

import Jar.dto.RestaurantDTO;
import Jar.entity.Country;
import Jar.entity.Restaurant;
import Jar.repository.CountryRepository;
import Jar.repository.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RestaurantService {

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private CountryRepository countryRepository;

    /**
     * Get all restaurants with country-based filtering
     * @param role User's role
     * @param countryId User's country ID (null for ADMIN)
     * @return List of restaurants
     */
    public List<RestaurantDTO> getAllRestaurants(String role, Integer countryId) {
        List<Restaurant> restaurants;

        if ("ADMIN".equals(role)) {
            // ADMIN can see all restaurants
            restaurants = restaurantRepository.findByIsActiveTrue();
        } else {
            // MANAGER and MEMBER can only see restaurants in their country
            if (countryId == null) {
                throw new RuntimeException("Country not assigned to user");
            }
            restaurants = restaurantRepository.findByCountryIdAndIsActiveTrue(countryId);
        }

        return restaurants.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get restaurant by ID with country-based access control
     */
    public RestaurantDTO getRestaurantById(Integer id, String role, Integer countryId) {
        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));

        // Check country-based access
        if (!"ADMIN".equals(role)) {
            if (countryId == null || !restaurant.getCountry().getId().equals(countryId)) {
                throw new RuntimeException("Access denied: Restaurant not in your country");
            }
        }

        return convertToDTO(restaurant);
    }

    /**
     * Create restaurant (ADMIN only in controller)
     */
    public RestaurantDTO createRestaurant(RestaurantDTO dto) {
        Restaurant restaurant = new Restaurant();
        restaurant.setName(dto.getName());
        restaurant.setCuisine(dto.getCuisine());
        restaurant.setAddress(dto.getAddress());
        restaurant.setPhoneNumber(dto.getPhoneNumber());
        restaurant.setIsActive(true);

        Country country = countryRepository.findById(dto.getCountryId())
                .orElseThrow(() -> new RuntimeException("Country not found"));
        restaurant.setCountry(country);

        Restaurant saved = restaurantRepository.save(restaurant);
        return convertToDTO(saved);
    }

    private RestaurantDTO convertToDTO(Restaurant restaurant) {
        RestaurantDTO dto = new RestaurantDTO();
        dto.setId(restaurant.getId());
        dto.setName(restaurant.getName());
        dto.setCuisine(restaurant.getCuisine());
        dto.setAddress(restaurant.getAddress());
        dto.setPhoneNumber(restaurant.getPhoneNumber());
        dto.setCountryId(restaurant.getCountry().getId());
        dto.setCountryName(restaurant.getCountry().getName());
        dto.setIsActive(restaurant.getIsActive());
        return dto;
    }
}