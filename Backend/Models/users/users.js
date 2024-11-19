const bcrypt = require('bcryptjs');
const db = require('../../daos/db_connection/db_connect');

const create_user = async ({username, user_password, email}) => {
  const pass_hash = await bcrypt.hash(user_password, 10);
  const res = await db.query(
    'INSERT INTO users (username, email, user_password) VALUES ($1, $2, $3) RETURNING *',
    [username, email, pass_hash]
  );
  return res.rows[0];
};


// find the user by email
const find_user_by_email = async (email) => {
  const res = await db.query('SELECT * FROM users WHERE email = $1', [email])
  return res.rows[0];
}

// fetch all users
const fetch_all_users = async () => {
  const res = await db.query('SELECT id, username, email, create_at FROM users');
  return res.rows;
  }


// fetch user by the id
const fetch_user_by_id = async (id) => {
  const res = await db.query('SELECT id, username, email, create_at FROM users WHERE id = $1', [id])
  return res.rows[0];
}


module.exports = { create_user, find_user_by_email, fetch_all_users, fetch_user_by_id };
