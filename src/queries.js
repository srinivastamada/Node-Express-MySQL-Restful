const mysql = require('mysql');
const bcrypt = require('bcrypt');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'node',
});

const users = async () => {
  const promise = new Promise((resolve, reject) => {
    connection.query('SELECT uid, username FROM users', function (
      error,
      data,
      fields
    ) {
      if (error) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
  return promise;
};

const user = async (uid) => {
  const promise = new Promise((resolve, reject) => {
    connection.query(
      'SELECT uid, username, email FROM users WHERE uid = "' + uid + '"',
      function (error, data, fields) {
        if (error) {
          reject(err);
        } else {
          resolve(data);
        }
      }
    );
  });
  return promise;
};

const signup = async (postData) => {
  const username = postData.username;
  const email = postData.email;
  const password = postData.password;

  const salt = bcrypt.genSaltSync();
  const encryptedPassword = bcrypt.hashSync(password, salt);
  const promise = new Promise((resolve, reject) => {
    connection.query(
      'INSERT INTO users (username,email,password) VALUES ("' +
        username +
        '","' +
        email +
        '","' +
        encryptedPassword +
        '")',
      function (error, data, fields) {
        if (error) {
          reject(err);
        } else {
          resolve(data);
        }
      }
    );
  });
  return promise;
};

const sendMessage = async (postData) => {
  const uid = postData.uid;
  const message = postData.message;
  const promise = new Promise((resolve, reject) => {
    connection.query(
      'INSERT INTO messages (message,uid_fk) VALUES ("' +
        message +
        '","' +
        uid +
        '")',
      function (error, data, fields) {
        if (error) {
          reject(err);
        } else {
          resolve(data);
        }
      }
    );
  });
  return promise;
};

const messages = async (postData) => {
  const uid = postData.uid;
  const promise = new Promise((resolve, reject) => {
    connection.query(
      'SELECT * FROM messages WHERE uid_fk = "' + uid + '"',
      function (error, data, fields) {
        if (error) {
          reject(err);
        } else {
          resolve(data);
        }
      }
    );
  });
  return promise;
};

const messageDelete = async (uid, mid) => {
  const promise = new Promise((resolve, reject) => {
    connection.query(
      'DELETE FROM messages WHERE uid_fk = "' +
        uid +
        '"AND mid = "' +
        mid +
        '"',
      function (error, data, fields) {
        if (error) {
          reject(err);
        } else {
          resolve(data);
        }
      }
    );
  });
  return promise;
};

module.exports = {
  users,
  user,
  signup,
  sendMessage,
  messages,
  messageDelete,
};
