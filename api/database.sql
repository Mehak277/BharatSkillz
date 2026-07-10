CREATE TABLE IF NOT EXISTS blogs (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255),
    slug VARCHAR(255),
    description TEXT,
    content LONGTEXT,
    category VARCHAR(255),
    readTime VARCHAR(50),
    tags JSON,
    image VARCHAR(255),
    authorName VARCHAR(255),
    authorImage VARCHAR(255),
    metaTitle VARCHAR(255),
    date VARCHAR(255),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS courses (
    id VARCHAR(255) PRIMARY KEY,
    slug VARCHAR(255),
    title VARCHAR(255),
    category VARCHAR(255),
    level VARCHAR(50),
    duration VARCHAR(50),
    lessons INT,
    rating FLOAT,
    students INT,
    price FLOAT,
    originalPrice FLOAT,
    certificate BOOLEAN,
    emoji VARCHAR(50),
    shortDescription TEXT,
    longDescription LONGTEXT,
    outcomes JSON,
    status VARCHAR(50),
    image VARCHAR(255),
    instructor JSON,
    tone VARCHAR(50),
    youtubePlaylistUrl VARCHAR(255),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS internships (
    id VARCHAR(255) PRIMARY KEY,
    role VARCHAR(255),
    company VARCHAR(255),
    logo VARCHAR(255),
    logoColor VARCHAR(50),
    location VARCHAR(255),
    mode VARCHAR(50),
    duration VARCHAR(50),
    stipend VARCHAR(255),
    skills JSON,
    openings INT,
    postedDays INT,
    status VARCHAR(50),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS subscribers (
    email VARCHAR(255) PRIMARY KEY,
    status VARCHAR(50),
    subscribedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
    uid VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    bio TEXT,
    skills JSON,
    education VARCHAR(255),
    social JSON,
    role VARCHAR(50),
    status VARCHAR(50),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS enrollments (
    id VARCHAR(255) PRIMARY KEY,
    userId VARCHAR(255),
    slug VARCHAR(255),
    title VARCHAR(255),
    instructor VARCHAR(255),
    thumbnail VARCHAR(255),
    progress INT,
    nextLesson VARCHAR(255),
    totalLessons INT,
    completedLessons INT,
    completedLessonIndices JSON,
    enrolledAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(uid) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS applications (
    id VARCHAR(255) PRIMARY KEY,
    userId VARCHAR(255),
    internshipId VARCHAR(255),
    role VARCHAR(255),
    company VARCHAR(255),
    status VARCHAR(50),
    appliedOn VARCHAR(50),
    location VARCHAR(255),
    stipend VARCHAR(255),
    appliedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(uid) ON DELETE CASCADE,
    FOREIGN KEY (internshipId) REFERENCES internships(id) ON DELETE CASCADE
);
