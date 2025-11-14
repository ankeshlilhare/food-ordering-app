package Jar.config;

import Jar.entity.User;
import Jar.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("--- Password Hashing Runner Started ---");

        // Find all users
        List<User> users = userRepository.findAll();

        for (User user : users) {
            // Check if the password is NOT already hashed
            // A BCrypt hash always starts with "$2a$" or "$2b$" etc.
            if (user.getPassword() != null && !user.getPassword().startsWith("$2")) {

                System.out.println("Hashing password for user: " + user.getUsername());

                // Hash the plain text password
                String hashedPassword = passwordEncoder.encode(user.getPassword());

                // Save the user back to the database with the hashed password
                user.setPassword(hashedPassword);
                userRepository.save(user);
            }
        }

        System.out.println("--- Password Hashing Runner Finished ---");
    }
}