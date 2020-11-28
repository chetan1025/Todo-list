const express = require('express')

const app = express()

const port = 3000

const Sequelize = require('sequelize')
// const sequelize = new Sequelize('postgres://postgres:1025:5432/todo_list')
const sequelize = new Sequelize('todo_list', 'postgres', '1025', {
    host: 'localhost',
    dialect: 'postgres',
    // operatorsAliases: Op,
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});
sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

const Task = sequelize.define('task', {
    // attributes
    task: {
        type: Sequelize.STRING,
        allowNull: false
    },
    status: {
        type: Sequelize.STRING,
        defaultValue: "active"
    }
}, {
    // options
});

Task.sync({})

app.use(express.json());

app.use(function (req, res, next) {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.get('/task/all/', async (req, res) => {
    try {
        console.log(req.query)
        let query = {};
        if (req.query.type == 'all') {
            query = {}
        } else if (req.query.type == 'active') {
            query = { 'status': 'active' }
        } else if (req.query.type == 'done') {
            query = { 'status': 'done' }
        }
        const task = await Task.findAll({
            where: query
        })
        res.json({ task })
    } catch (error) {
        console.error(error)
    }
})

app.post('/task/', async (req, res) => {
    try {
        const newTask = new Task(req.body)
        const newRow = await newTask.save()
        res.json({ task: newRow })
    } catch (error) {
        console.error(error)
    }
})

app.put('/task/:taskId', async (req, res) => {
    try {
        console.log(req.params.taskId)
        const row = await Task.update(
            { task: req.body.task, status: req.body.status },
            {
                where: {
                    id: req.params.taskId
                }
            }
        )
        res.json(row)
    } catch (error) {
        console.error(error)
    }
})

app.delete('/task/', async (req, res) => {
    try {
        const task = await Task.destroy({
            where: {
                id: req.body['id']
            }
        })
        res.json({})
    } catch (error) {
        console.error(error)
    }
})

app.listen(port, () => console.log(`ToDo REST app listening on port ${port}!`))

