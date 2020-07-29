DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    _id VARCHAR(11) NOT NULL,
    username VARCHAR(255) NOT NULL,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    resetPasswordExpires VARCHAR(255) NOT NULL,
    resetPasswordToken VARCHAR(255) NOT NULL,
    createdDate DATE DEFAULT NOW()
);

DROP TABLE IF EXISTS categories;
CREATE TABLE categories(
    id SERIAL PRIMARY KEY,
    _id VARCHAR(11) NOT NULL,
    name VARCHAR(255) NOT NULL,
    shortName VARCHAR(255) NOT NULL,
    about TEXT NOT NULL,
    subCategories INTEGER NULL,
    createdDate DATE DEFAULT NOW()
);

DROP TABLE IF EXISTS files;
CREATE TABLE files(
    id SERIAL PRIMARY KEY,
    _id VARCHAR(11) NOT NULL,
    name VARCHAR(255) NOT NULL,
    path VARCHAR(255) NOT NULL,
    size VARCHAR(255) NOT NULL,
    filename VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    createdDate DATE DEFAULT NOW()
);

DROP TABLE IF EXISTS news;
CREATE TABLE news(
    id SERIAL PRIMARY KEY,
    _id VARCHAR(11) NOT NULL,
    title VARCHAR(255) NOT NULL,
    article TEXT NOT NULL,
    isPublished BOOLEAN DEFAULT FALSE,
    createdDate DATE DEFAULT NOW()
);

DROP TABLE IF EXISTS stakeholder;
CREATE TABLE stakeholder(
    id SERIAL PRIMARY KEY,
    _id VARCHAR(11) NOT NULL,
    name VARCHAR(255) NOT NULL,
    about TEXT NOT NULL,
    mission TEXT NULL,
    vision TEXT NULL,
    createdDate DATE DEFAULT NOW()
);

DROP TABLE IF EXISTS contacts;
CREATE TABLE contacts(
    id SERIAL PRIMARY KEY,
    _id VARCHAR(11) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telephone TEXT NULL,
    website VARCHAR(255) NULL,
    address TEXT NULL,
    createdDate DATE DEFAULT NOW()
);

DROP TABLE IF EXISTS sessions;
CREATE TABLE sessions(
    id SERIAL PRIMARY KEY,
    _id VARCHAR(11) NOT NULL,
    createdDate DATE DEFAULT NOW()
);
