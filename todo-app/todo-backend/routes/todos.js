const express = require('express');
const { Todo } = require('../mongo');
const { increment } = require('../redis/index');
const { getCount } = require('../redis/index');
const router = express.Router();

/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({})
  res.send(todos);
});

/* POST todo to listing. */
router.post('/', async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false
  })
  await increment();
  res.send(todo);
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params
  req.todo = await Todo.findById(id)
  if (!req.todo) return res.sendStatus(404)

  next()
}

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await req.todo.delete()  
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get('/', async (req, res) => {
  res.status(200).json(req.todo);
});

/* PUT todo. */
singleRouter.put('/', async (req, res) => {
  try {
    const { text, done } = req.body;
    if (text !== undefined) req.todo.text = text;
    if (done !== undefined) req.todo.done = done;

    const updated = await req.todo.save();
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message || 'Failed to update todo' });
  }
});

router.use('/:id', findByIdMiddleware, singleRouter)

module.exports = router;
