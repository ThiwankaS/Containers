const express = require('express')
const { getCount } = require('../redis/index');

const router = express.Router()

router.get('/', async (_req, res) => {
  const count = await getCount()
  res.json({ added_todos: count })
})

module.exports = router
