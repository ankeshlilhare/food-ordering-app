package Jar.repository;

import Jar.entity.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Integer> {
    List<Restaurant> findByCountryId(Integer countryId);
    List<Restaurant> findByIsActiveTrue();
    List<Restaurant> findByCountryIdAndIsActiveTrue(Integer countryId);
}