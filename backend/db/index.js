const Pool = require("pg").Pool;

let dbURL = {
    connectionString: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/postgres'
}

const pool = new Pool(dbURL);

pool.connect();

exports.getUsers = (req, res) => {
    pool.query('SELECT * FROM users LIMIT 3', (err, results) => {
        if (err) throw err;
        for (let row of results.rows) {
            console.log(JSON.stringify(row));
        }
        res.status(200).json(results.rows);
    })
}

exports.authUserByName = async(username) => {
    const results = await pool.query('SELECT * FROM users WHERE username = $1', [username])

    return results.rows[0];
}
