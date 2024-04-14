CREATE TABLE Users (
	`id` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`username` VARCHAR(24) NOT NULL UNIQUE,
	`password` VARCHAR(1024) NOT NULL,
	`email` VARCHAR(256) NOT NULL,
	`bio` VARCHAR(256) NOT NULL
);
CREATE TABLE Sessions (
	`id` VARCHAR(256) NOT NULL UNIQUE,
	`userid` INT(11) REFERENCES Users(id)
)
CREATE TABLE Posts (
	`id` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`userid` INT(11) REFERENCES Users(id),
	`content` VARCHAR(1024) NOT NULL,
	`postedOn` DATE NOT NULL
)
CREATE TABLE Follows (
	`followerId` INT(11) REFERENCES Users(id),
	`followingId` INT(11) REFERENCES Users(id)
)