# Datasets & Sample Data

This file describes the sample dataset used by the application and how to reset or re-seed the database.

Files of interest
- `food-ordering-app/src/main/resources/data.sql` — SQL script used on application startup to insert sample countries, roles, users, restaurants, menu items and orders.
- `target/classes/data.sql` — copy of the SQL that the running JAR may use.

What the dataset contains
- Countries (e.g., India, America)
- Roles (ADMIN, MANAGER, MEMBER)
- Users (seeded users with sample passwords; passwords are re-hashed on app startup via runner)
- Restaurants (4 sample restaurants across countries)
- Menu items (3-4 items per restaurant; includes `image_url` values from Unsplash)

How to reset the dataset
1. Stop the running backend.
2. Delete or drop the application's database schema (or tables) used by the app.
3. Rebuild and restart the backend as documented in `README.md`:

```powershell
cd "d:\Work space\food-ordering-app"
mvn clean package -DskipTests
java -jar target/food-ordering-app-0.0.1-SNAPSHOT.jar --server.port=8081
```

On startup the `data.sql` script will run (if configured in `application.properties`) and re-seed the sample data.

Notes
- If you use an external MySQL instance, make sure the connection settings in `application.properties` match your DB.
- If you change the schema or data, update `data.sql` accordingly.
