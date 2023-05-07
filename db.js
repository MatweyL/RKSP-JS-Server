const Pool = require('pg').Pool
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'rksp',
    password: '',
    port: 5432,
});
const bcrypt = require("bcrypt")
const saltRounds = 10

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
        const { title, description, user_id } = body
        pool.query('INSERT INTO posts (title, description, user_id) VALUES ($1, $2, $3) RETURNING *', [title, description, user_id], (error, results) => {
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


const getUser = (body) => {
    return new Promise(function(resolve, reject) {
        const username = body['username'];
        const password = body['password'];
        pool.query('SELECT * FROM users where username = $1', [username], (error, results) => {
            if (error) {
                console.error(error.message);
                reject(error)
            }
            const user = results.rows[0];
            if (user) {
                bcrypt
                    .compare(password, user.password_hash)
                    .then(res => {
                        if (res) {
                            resolve(user);
                        }
                        else {
                            resolve();
                        }
                    })
                    .catch(err => {
                        console.error(err.message);
                        resolve();
                    })
            } else {
                resolve();
            }
        })
    });
}

const getUsers = (body) => {
    return new Promise(function(resolve, reject) {
        pool.query('SELECT * FROM users', (error, results) => {
            if (error) {
                reject(error)
            }
            const users = results.rows;
            resolve(users);
        })
    });
}

module.exports = {
    getPosts,
    createPost,
    deletePost,
    getUser,
    getUsers
}