const Pool = require('pg').Pool
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'rksp',
    password: 'onlyone',
    port: 5432,
});

const getPosts = () => {
    return new Promise(function(resolve, reject) {
        pool.query('SELECT * FROM posts ORDER BY id ASC', (error, results) => {
            if (error) {
                reject(error)
            }
            resolve(results.rows);
        })
    })
};

const createPost = (body) => {
    return new Promise(function(resolve, reject) {
        const { title, description } = body
        pool.query('INSERT INTO posts (title, description) VALUES ($1, $2) RETURNING *', [title, description], (error, results) => {
            if (error) {
                reject(error)
            }
            resolve(results.rows[0])
        })
    })
};

const deletePost = (body) => {
    return new Promise(function(resolve, reject) {
        const id = parseInt(body['id'])
        pool.query('DELETE FROM posts WHERE id = $1 RETURNING *', [id], (error, results) => {
            if (error) {
                reject(error)
            }
            resolve(results.rows[0])
        })
    })
};


module.exports = {
    getPosts,
    createPost,
    deletePost,
}