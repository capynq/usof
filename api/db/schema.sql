CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  login VARCHAR(64) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(160) NULL,
  role ENUM('user','admin') NOT NULL DEFAULT 'user',
  email_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
  email_confirmation_token_hash CHAR(64) NULL,
  email_confirmation_expires_at DATETIME NULL,
  password_reset_token_hash CHAR(64) NULL,
  password_reset_expires_at DATETIME NULL,
  auth_version INT UNSIGNED NOT NULL DEFAULT 0,
  profile_picture VARCHAR(512) NULL,
  rating INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY users_login_unique (login),
  UNIQUE KEY users_email_unique (email),
  KEY users_email_confirmation_token_idx (email_confirmation_token_hash),
  KEY users_password_reset_token_idx (password_reset_token_hash)
);

CREATE TABLE IF NOT EXISTS categories (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  title VARCHAR(120) NOT NULL,
  description TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY categories_title_unique (title)
);

CREATE TABLE IF NOT EXISTS posts (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  author_id INT UNSIGNED NOT NULL,
  title VARCHAR(255) NOT NULL,
  content MEDIUMTEXT NOT NULL,
  status ENUM('active','inactive') NOT NULL DEFAULT 'active',
  publish_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY posts_author_idx (author_id),
  KEY posts_status_publish_date_idx (status, publish_date),
  KEY posts_publish_date_idx (publish_date),
  CONSTRAINT posts_author_fk FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS post_categories (
  post_id INT UNSIGNED NOT NULL,
  category_id INT UNSIGNED NOT NULL,
  PRIMARY KEY (post_id, category_id),
  KEY post_categories_category_idx (category_id),
  CONSTRAINT post_categories_post_fk FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  CONSTRAINT post_categories_category_fk FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS comments (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  post_id INT UNSIGNED NOT NULL,
  parent_id INT UNSIGNED NULL,
  author_id INT UNSIGNED NOT NULL,
  content MEDIUMTEXT NOT NULL,
  status ENUM('active','inactive') NOT NULL DEFAULT 'active',
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  publish_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY comments_post_status_publish_date_idx (post_id, status, publish_date),
  KEY comments_parent_idx (parent_id),
  KEY comments_author_idx (author_id),
  KEY comments_status_idx (status),
  CONSTRAINT comments_post_fk FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  CONSTRAINT comments_parent_fk FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE SET NULL,
  CONSTRAINT comments_author_fk FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS likes (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  author_id INT UNSIGNED NOT NULL,
  post_id INT UNSIGNED NULL,
  comment_id INT UNSIGNED NULL,
  type ENUM('like','dislike') NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY likes_post_author_unique (post_id, author_id),
  UNIQUE KEY likes_comment_author_unique (comment_id, author_id),
  KEY likes_post_type_idx (post_id, type),
  KEY likes_comment_type_idx (comment_id, type),
  KEY likes_author_idx (author_id),
  CONSTRAINT likes_author_fk FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT likes_post_fk FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  CONSTRAINT likes_comment_fk FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE,
  CONSTRAINT likes_exactly_one_target CHECK ((post_id IS NOT NULL AND comment_id IS NULL) OR (post_id IS NULL AND comment_id IS NOT NULL))
);

CREATE TABLE IF NOT EXISTS favorites (
  user_id INT UNSIGNED NOT NULL,
  post_id INT UNSIGNED NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, post_id),
  KEY favorites_post_idx (post_id),
  KEY favorites_created_at_idx (user_id, created_at),
  CONSTRAINT favorites_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT favorites_post_fk FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);
