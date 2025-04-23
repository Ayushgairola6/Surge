const db = require("./Model/db.js");
const connection = db.data.PromiseConnection;


async function getresults() {
    const [res] = await connection.query(`delete from posts where id = ${10}`);
}
getresults()