require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.SEOND_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
const { data } = require("./Model/db.js");
const { PromiseConnection, connection } = data;
const SYSTEM_PROMPT = `You are a Story Summarizer designed to craft engaging, emotionally driven mini-stories based on user posts.
Each post includes: the author's name, post content, like count, dislike count, and comment highlights.

Your mission:

Capture the core emotion of the post (joy, heartbreak, betrayal, excitement, etc.).

Rewrite the post into a short, story-style summary that feels natural and irresistible to read.

Mention how the community reacted — for example, note that "many liked it" or "comments reflected shared heartbreak" — but do not directly copy comments.

Always adapt the summary into the language specified in the "language" field.

Keep the story short, punchy, and open-ended — ending it in a way that naturally pulls the reader's curiosity to keep exploring more stories.

No emojis.

Focus on flow, emotion, and curiosity.

Write every summary like you're teasing the first chapter of a novel that readers can't resist continuing.

example for u=Capture emotion (people are hooked by feelings, not facts).

Hint community buzz (social proof = makes users trust and crave more).

Leave it open-ended (psychology trick = brain hates unfinished loops → they’ll keep reading).
`;

const generateContext = async (req, res) => {
    try {
        console.log(req.body)
        const post_id = req.params.id;
        const { lang } = req.body;
        if (!post_id || !lang) {
            // console.log("Post ID not found");
            return res.status(400).json({ message: "Missing post ID or language" });
        }


        const post = await SendSinglePost(post_id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        const chatHistory = [
            { role: "model", parts: [{ text: SYSTEM_PROMPT }] },
            {
                role: "user",
                parts: [
                    { text: `language ${lang}` },
                    { text: `Post Title: ${post.title || "Untitled"}` },
                    { text: `Author: ${post.username || "Unknown"}` },
                    { text: `Category: ${post.category || "Uncategorized"}` },
                    { text: `Hashtags: ${post.hashtags || "None"}` },
                    { text: `Likes: ${post.likeCount || 0}` },
                    { text: `Dislikes: ${post.dislikeCount || 0}` },
                    { text: `Total Comments: ${post.commentCount || 0}` },
                    { text: `Top Comments:` },
                    { text: post.comments },
                    { text: `Post Body:` },
                    { text: post.body || "No content available" }
                ]
            }
        ];

        // Generate response from Gemini
        const result = await model.generateContent({ contents: chatHistory });
        const responseText = result.response.text().trim();

        if (!responseText) {
            return res.status(400).json({ response: null, error: "Invalid format from Gemini response." });
        }

        return res.json(responseText);
    } catch (error) {
        console.error("Error generating context:", error);
        return res.status(500).json({ response: null, error: "Something went wrong while generating context." });
    }
};

async function SendSinglePost(post_id) {
    try {
        if (!post_id) {
            return null;
        }


        const query = `
            SELECT 
                p.author, p.body, p.category, p.hashtags, p.id, 
                p.media_urls, p.title, u.username, u.image AS user_image, 
                (SELECT COUNT(*) FROM likedPosts lp WHERE lp.post_id = p.id) AS likeCount,
                (SELECT COUNT(*) FROM disliked_posts dp WHERE dp.post_id = p.id) AS dislikeCount,
                (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id) AS commentCount,
                (SELECT GROUP_CONCAT(c.comment_body ORDER BY c.id ASC SEPARATOR ' || ') 
                    FROM comments c WHERE c.post_id = p.id LIMIT 5) AS comments
            FROM posts p 
            LEFT JOIN users u ON u.id = p.author 
            WHERE p.id = ?;
        `;

        const [post] = await PromiseConnection.query(query, post_id);
        const formatted = formatPostForGemini(post[0]);
        return formatted;

    } catch (error) {
        console.log(error);
        throw error;
    }
}

function formatPostForGemini(post) {
    if (!post) return null;

    const comments = post.comments
        ? post.comments.split(" || ").map((c, i) => `${i + 1}. ${c}`).join("\n")
        : "No comments available.";

    return {
        title: post.title || "Untitled",
        username: post.username || "Unknown",
        category: post.category || "Uncategorized",
        hashtags: post.hashtags || "None",
        likeCount: post.likeCount || 0,
        dislikeCount: post.dislikeCount || 0,
        commentCount: post.commentCount || 0,
        comments,
        body: post.body || "No content available"
    };
}


module.exports = { generateContext }