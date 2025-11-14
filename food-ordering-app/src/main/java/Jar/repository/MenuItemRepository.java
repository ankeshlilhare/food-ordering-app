package Jar.repository;

import Jar.entity.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Integer> {
    List<MenuItem> findByRestaurantId(Integer restaurantId);
    List<MenuItem> findByRestaurantIdAndIsAvailableTrue(Integer restaurantId);
}