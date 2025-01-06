CREATE TABLE pokemon (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    ability VARCHAR(255)  NOT NULL,
    type INTEGER,
    is_male BOOLEAN DEFAULT true,
    is_shiny BOOLEAN DEFAULT false,
    level INTEGER
);