# Entity Relationship Diagram

## Database Schema

```mermaid
  erDiagram
    Carpark {
        UUID id PK
        string car_park_no UK
        string address
        float x_coord
        float y_coord
        string short_term_parking
        string free_parking
        boolean night_parking
        integer car_park_decks
        float gantry_height
        boolean car_park_basement
        integer carParkTypeId FK
        integer parkingSystemTypeId FK
    }

    CarParkType {
        integer id PK
        string name UK
    }

    ParkingSystemType {
        integer id PK
        string name UK
    }

    User {
        UUID id PK
        string username UK
        string password
        datetime created_at
        datetime updated_at
    }

    UserFavoriteCarpark {
        UUID UserId FK
        UUID CarparkId FK
        datetime created_at
    }

    Carpark ||--o{ UserFavoriteCarpark : "favoritedBy"
    User ||--o{ UserFavoriteCarpark : "favorites"
    CarParkType ||--o{ Carpark : "has"
    ParkingSystemType ||--o{ Carpark : "has"
```

## Relationships

### One-to-Many Relationships
- A `CarParkType` can have many `Carpark`s
- A `ParkingSystemType` can have many `Carpark`s

### Many-to-Many Relationships
- `User` and `Carpark` have a many-to-many relationship through `UserFavoriteCarpark`
  - A user can favorite many carparks
  - A carpark can be favorited by many users

## Field Descriptions

### Carpark
- `id`: UUID primary key
- `car_park_no`: Unique identifier string
- `address`: Location address
- `x_coord`: X coordinate for location
- `y_coord`: Y coordinate for location
- `short_term_parking`: Short term parking availability
- `free_parking`: Free parking availability
- `night_parking`: Whether night parking is available
- `car_park_decks`: Number of parking decks
- `gantry_height`: Height of the gantry
- `car_park_basement`: Whether basement parking exists
- `carParkTypeId`: Foreign key to CarParkType
- `parkingSystemTypeId`: Foreign key to ParkingSystemType

### CarParkType
- `id`: Auto-incrementing primary key
- `name`: Unique type name

### ParkingSystemType
- `id`: Auto-incrementing primary key
- `name`: Unique system type name

### User
- `id`: UUID primary key
- `username`: Unique username
- `password`: Hashed password
- `created_at`: Account creation timestamp
- `updated_at`: Last update timestamp

### UserFavoriteCarpark
- `UserId`: UUID foreign key to User
- `CarparkId`: UUID foreign key to Carpark
- `created_at`: When the favorite was added

## Legend
- PK: Primary Key
- FK: Foreign Key
- UK: Unique Key
