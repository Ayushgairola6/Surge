const db = require("../Model/db");
const connection = db.data.PromiseConnection;

const recieveFeedback = async (req, res) => {
    try {

        const user_id = req.user.id;
        const { feedback } = req.body;

        if (!user_id) return res.status(400).json({ message: "Unauthorized" });

        if (!feedback) return res.status(400).json({ message: "All fields are mandatory!" });


        const query = `insert into feedback (body ,user_id) Values(?,?)`;
        const [data] = await connection.query(query, [feedback, user_id]);


        return res.status(200).json({ message: "Done" });
    } catch (error) {
        console.log(error);
    }
}

module.exports = {recieveFeedback};