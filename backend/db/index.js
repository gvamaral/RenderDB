const Pool = require("pg").Pool;

let dbURL = {
    connectionString: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/postgres'
}

const pool = new Pool(dbURL);

pool.connect();

exports.getUserById = (id) => {
    pool.query('SELECT * FROM users WHERE id = $1', [id], (err, results) => {
        console.log(results.rows[0]);
        return {'id':results.rows[0].id, 'username' : results.rows[0].username};
    })
}

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
