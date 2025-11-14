package Jar.repository;

import Jar.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {

    // This tells JPA to automatically create a query:
    // "SELECT * FROM users WHERE username = ?"
    Optional<User> findByUsername(String username);
}