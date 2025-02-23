const db = require("./db");

const CreateDislikePostTable = () => {
    const query = `CREATE TABLE IF NOT EXISTS disliked_posts (
        id INT PRIMARY KEY UNIQUE AUTO_INCREMENT,
        post_id INT NOT NULL,  -- The ID of the post being liked, must always be a valid post
        user_id INT NOT NULL,  -- The ID of the user who liked the post, must always be a valid user
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Timestamp of when the like was created
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE (user_id, post_id)  -- Ensures a user can't like the same post/comment combination more than once
    );`;

    db.data.connection.query(query, (error, results) => {
        if (error) {
            throw error;
        }
        console.log("Liked Posts table created");
    });
};

exports.disliked = { CreateDislikePostTable };

