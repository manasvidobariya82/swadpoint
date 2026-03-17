CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(100),
  role VARCHAR(20) DEFAULT 'user'
);

CREATE TABLE food (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  price INT,
  image TEXT
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  userid INT,
  total INT,
  status VARCHAR(20) DEFAULT 'pending'
);
