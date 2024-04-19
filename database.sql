CREATE TABLE users (
	`id` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`username` VARCHAR(24) NOT NULL UNIQUE,
	`password` VARCHAR(1024) NOT NULL,
	`email` VARCHAR(256) NOT NULL,
	`bio` VARCHAR(256) NOT NULL
);
CREATE TABLE sessions (
	`id` VARCHAR(256) NOT NULL UNIQUE,
	`userid` INT(11) REFERENCES users(id)
);
CREATE TABLE posts (
	`id` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`userid` INT(11) REFERENCES users(id),
	`content` VARCHAR(1024) NOT NULL,
	`postedOn` TIMESTAMP NOT NULL
);
CREATE TABLE follows (
	`followerId` INT(11) REFERENCES users(id),
	`followingId` INT(11) REFERENCES users(id)
);
CREATE TABLE likes (
	`userid` INT(11) REFERENCES users(id),
	`postid` INT(11) REFERENCES posts(id)
);
CREATE TABLE comments (
	`id` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`userid` INT(11) REFERENCES users(id),
	`postid` INT(11) REFERENCES posts(id),
	`content` VARCHAR(1024) NOT NULL,
	`postedOn` TIMESTAMP NOT NULL
);