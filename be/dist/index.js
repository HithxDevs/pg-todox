"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const zod_1 = __importDefault(require("zod"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const pg_1 = require("pg");
const config_1 = require("./config");
const middleware_1 = require("./middleware");
const app = (0, express_1.default)();
const port = 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const pgClient = new pg_1.Client("postgresql://neondb_owner:npg_8gNDEihVX5lI@ep-rough-snow-a8myr5vx-pooler.eastus2.azure.neon.tech/neondb?sslmode=require");
pgClient.connect();
const saltRounds = 5;
app.post('/api/v1/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const UserSchema = zod_1.default.object({
        username: zod_1.default.string().min(3, 'Username must be at least 3 characters long').max(20, 'Username must be at most 20 characters long'),
        password: zod_1.default.string().min(6, 'Password must be at least 6 characters long'),
        email: zod_1.default.string().email('Invalid email format')
    });
    const parsed_data = UserSchema.safeParse({ username, password, email });
    const hashed_password = yield bcrypt_1.default.hash(password, saltRounds);
    if (!parsed_data.success) {
        res.status(400).json({ errors: parsed_data.error.errors });
    }
    const user_insert_query = `INSERT INTO TODOSCHEMA.users (username, password, email) VALUES ($1, $2, $3) RETURNING id`;
    pgClient.query(user_insert_query, [username, hashed_password, email], (err, result) => {
        if (err) {
            console.error('Error:', err);
            res.status(500).json({ message: 'Internal server error' });
        }
        else {
            res.status(201).json({ message: 'User created successfully' });
        }
    });
}));
app.post('/api/v1/signin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const password = req.body.password;
    const user_select_query = `SELECT * FROM TODOSCHEMA.users WHERE username = $1`;
    pgClient.query(user_select_query, [username], (err, result) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            console.error('Error:', err);
            res.status(500).json({ message: 'Internal server error' });
        }
        else {
            const user = result.rows[0];
            if (!user) {
                res.status(400).json({ message: 'User not found' });
            }
            else {
                const isvalid = yield bcrypt_1.default.compare(password, user.password);
                if (!isvalid) {
                    res.status(400).json({ message: 'Invalid password' });
                }
                else {
                    const token = jsonwebtoken_1.default.sign({ userId: user.id, username: username }, config_1.JWT_SECRET, { expiresIn: '1h' });
                    res.status(200).json({ message: 'Login successful', token });
                }
            }
        }
    }));
}));
app.post('/api/v1/todos', middleware_1.middleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userid = req.user;
    const title = req.body.title;
    const discription = req.body.discription;
    console.log(userid);
    console.log(title);
    console.log(discription);
    const todo_insert_query = `INSERT INTO TODOSCHEMA.todos (title, discription, userid, done) VALUES ($1, $2, $3, FALSE) RETURNING id`;
    const dbRes = yield pgClient.query(todo_insert_query, [title, discription, userid]);
    if (dbRes.rowCount === 0) {
        res.status(400).json({ message: 'Todo not created successfully' });
        return;
    }
    console.log(dbRes);
    res.status(201).json({ message: 'Todo created successfully' });
}));
app.get('/api/v1/todos', middleware_1.middleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userid = req.user;
    const todo_select_query = `SELECT id, title, discription as description, done FROM TODOSCHEMA.todos WHERE userid = $1`;
    pgClient.query(todo_select_query, [userid], (err, result) => {
        if (err) {
            console.error('Error:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        return res.status(200).json({ todos: result.rows });
    });
}));
app.patch('/api/v1/todos/:id', middleware_1.middleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const todoId = req.params.id;
    const userId = req.user;
    const update_query = `UPDATE TODOSCHEMA.todos SET done = TRUE WHERE id = $1 AND userid = $2 RETURNING *`;
    try {
        const result = yield pgClient.query(update_query, [todoId, userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Todo not found or unauthorized' });
        }
        return res.status(200).json({ message: 'Todo marked as done', todo: result.rows[0] });
    }
    catch (err) {
        console.error('Error updating todo:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}));
app.listen(port, () => {
    console.log('Server started on port' + port);
});
