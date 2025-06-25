import express from 'express';
import cors from 'cors';
import z from 'zod';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {Client} from 'pg';

import { JWT_SECRET } from './config';
import { middleware } from './middleware';
import { Request, Response } from 'express';

interface AuthenticatedRequest extends Request {
    user?: string | number;
}


const app = express();
app.use(cors());
app.use(express.json());

const pgClient = new Client("postgresql://neondb_owner:npg_8gNDEihVX5lI@ep-rough-snow-a8myr5vx-pooler.eastus2.azure.neon.tech/neondb?sslmode=require");
pgClient.connect();

const saltRounds = 5;


app.post('/api/v1/signup', async(req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    const UserSchema = z.object({
        username: z.string().min(3, 'Username must be at least 3 characters long').max(20, 'Username must be at most 20 characters long') ,
        password: z.string().min(6, 'Password must be at least 6 characters long'),
        email: z.string().email('Invalid email format')
    })

    const parsed_data = UserSchema.safeParse({ username, password, email });

    const hashed_password = await bcrypt.hash(password, saltRounds);
    
    if (!parsed_data.success) {
        res.status(400).json({ errors: parsed_data.error.errors });
    }

    const user_insert_query = `INSERT INTO TODOSCHEMA.users (username, password, email) VALUES ($1, $2, $3) RETURNING id`;

    pgClient.query(user_insert_query, [username, hashed_password, email], (err, result) => {
        if (err) {
            console.error('Error:', err);
            res.status(500).json({ message: 'Internal server error' });
        } else {
            res.status(201).json({ message: 'User created successfully' });
        }
    });
});

app.post('/api/v1/signin', async(req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const user_select_query = `SELECT * FROM TODOSCHEMA.users WHERE username = $1`;
    pgClient.query(user_select_query, [username], async(err, result) => {
        if (err) {
            console.error('Error:', err);
            res.status(500).json({ message: 'Internal server error' });
        } else {
            const user = result.rows[0];
            if (!user) {
                res.status(400).json({ message: 'User not found' });
            } else {
                const isvalid = await bcrypt.compare(password, user.password);
                if (!isvalid) {
                    res.status(400).json({ message: 'Invalid password' });
                } else {
                    const token = jwt.sign({ userId: user.id, username: username }, JWT_SECRET, { expiresIn: '1h' });
                    res.status(200).json({ message: 'Login successful', token });
                }
            }
        }
    });

});

app.post('/api/v1/todos', middleware, async (req: any, res) => {
    const userid = req.user;
    const title = req.body.title;
    const discription = req.body.discription;
    console.log(userid);
    console.log(title);
    console.log(discription);
    const todo_insert_query = `INSERT INTO TODOSCHEMA.todos (title, discription, userid, done) VALUES ($1, $2, $3, FALSE) RETURNING id`;
    const dbRes = await pgClient.query(todo_insert_query, [title, discription, userid]);
    if(dbRes.rowCount === 0) {
        res.status(400).json({ message: 'Todo not created successfully' });
        return;
    }
    console.log(dbRes);
    res.status(201).json({ message: 'Todo created successfully' });
});

app.get('/api/v1/todos', middleware, async(req:any, res) => {
    const userid = req.user;
    const todo_select_query = `SELECT id, title, discription as description, done FROM TODOSCHEMA.todos WHERE userid = $1`;
    pgClient.query(todo_select_query, [userid], (err, result) => {
        if (err) {
            console.error('Error:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        return res.status(200).json({ todos: result.rows });
    });
});

app.patch('/api/v1/todos/:id', middleware, async (req: any, res: any) => {
    const todoId = req.params.id;
    const userId = req.user;

    const update_query = `UPDATE TODOSCHEMA.todos SET done = TRUE WHERE id = $1 AND userid = $2 RETURNING *`;
    try {
        const result = await pgClient.query(update_query, [todoId, userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Todo not found or unauthorized' });
        }
        return res.status(200).json({ message: 'Todo marked as done', todo: result.rows[0] });
    } catch (err) {
        console.error('Error updating todo:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
});



const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
