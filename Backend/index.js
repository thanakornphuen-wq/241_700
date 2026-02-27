const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const mysql = require('mysql2/promise')
app.use(bodyParser.json());
const port = 8000;
let conn = null;
const initNySQL = async () => {
    conn = await mysql.createConnection({
        host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'webdb',
            port: 8700
    });
    console.log('Connected to MySQL database')
}
// path = GET/users

app.get('/users', async (req,res) => {
    const results = await conn.query('SELECT * FROM users');
    res.json(results[0]);
})

app.post('/users',async (req,res) => {
    try {
        let user = req.body;
    const results = await conn.query('INSERT INTO users SET ?',user);
    
    res.json({
        message: 'User added successfully',
        data: results[0]
    });
    }catch (error) {
        console.error('Error user:',error)
        res.status(500).json({ message: 'Server Error' })
    }
})

app.get('/users/:id',async (req,res) => {
    try{
       let id = req.params.id;
       const results = await conn.query('SELECT * FROM users WHERE id = ?',id)
       if(results[0].length === 0) {
          throw { statusCode: 404, message: 'User not found'};
       }
       res.json(results[0][0]);
    }catch (error){
        console.error('Error fetching user:',error);
        let statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Error fetching user'
        });

    }
    
})

app.put('/users/:id', async (req,res) => {
   try{ 
      let id = req.params.id;
      let updatedUser = req.body;
      const results = await conn.query('UPDATE users SET ? WHERE id = ?',[updatedUser,id]);
      res.json({
        message: 'User updated successfully',
        data: results[0]
      });
   } catch (error) {
    console.error('Error updating user:',error);
    res.status(500).json({ message: 'Server Error' })
   }
})
app.delete('/users/:id', async (req,res) => {
    try {
        let id = req.params.id;
        const results = await conn.query('DELETE FROM users WHERE id = ?',id);
        res.json({
            message: 'User deleted successfully'
        });
    }catch (error) {
        console.error('Error deleting user:',error);
        res.status(500).json({ message: 'Server Error' })
    }
});




app.get('/testdb-new', async (req, res) => {
    try {
        const conn = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'webdb',
            port: 8700
        });
        const results = await conn.query('SELECT * FROM users')
        res.json(results[0]);
    } catch (err) {
        console.error('Error connecting to the database:',err)
        res.status(500).json({ error: 'Server Error' })
    }
});


app.listen(port, async() => {
    await initNySQL();
    console.log(`server is running on http://localhost:${port}`);
});