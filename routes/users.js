const { User } = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

router.get('/', async (req, res) => {
  const userList = await User.find().select('-passwordHash');

  if (!userList) {
    res.status(500).json({ sucess: false })
  }
  res.send(userList)

})

router.get('/:id', async (req, res) => {
  const user = await User.findById(req.params.id).select('-passwordHash')
  if (!user) {
    res.status(500).json({ sucess: false })
  }
  res.send(user)
})

router.post('/', async (req, res) => {

  let user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.password, 10),
    streetName: req.body.streetName,
    number: req.body.number,
    complement: req.body.complement,
    city: req.body.city,
    state: req.body.state,
    zip: req.body.zip,
    country: req.body.country,
    phone: req.body.phone,
    isAdmin: req.body.isAdmin
  })

  user = await user.save();

  if (!user) {
    return res.status(404).send('The user cannot be created.')
  }

  res.send(user)
})

router.post('/register', async (req, res) => {

  let user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.password, 10),
    streetName: req.body.streetName,
    number: req.body.number,
    complement: req.body.complement,
    city: req.body.city,
    state: req.body.state,
    zip: req.body.zip,
    country: req.body.country,
    phone: req.body.phone,
    isAdmin: req.body.isAdmin
  })

  user = await user.save();

  if (!user) {
    return res.status(404).send('The user cannot be created.')
  }

  res.send(user)
})

router.put('/:id', async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      email: req.body.email,
      passwordHash: req.body.passwordHash,
      streetName: req.body.streetName,
      number: req.body.number,
      complement: req.body.complement,
      city: req.body.city,
      state: req.body.state,
      zip: req.body.zip,
      country: req.body.country,
      phone: req.body.phone,
      isAdmin: req.body.isAdmin
    },
    { new: true }
  )
  if (!user) {
    return res.status(404).send('The user cannot be updated.')
  }

  res.send(user)
})

router.delete('/:userId', (req, res) => {
  Product.findByIdAndRemove(req.params.userId).then(user => {
    if (user) {
      return res.status(200).json({
        sucess: true,
        message: "The user has been deleted"
      })
    } else {
      return res.status(404).json({
        sucess: false,
        message: "user not found"
      })
    }
  }).catch(err => {
    return res.status(400).json({
      sucess: false,
      error: err
    })
  })
})

// Authentication
router.post('/login', async (req, res) => {
  const user = await User.findOne({
    email: req.body.email
  })

  if (!user) {
    return res.status(400).send('No known user with this e-mail address')
  }

  if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
    const token = jwt.sign({
      userId: user.id,
      isAdmin: user.isAdmin
    },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    )
    res.status(200).send({ user: user.email, token: token })
  } else {
    res.status(400).send("Incorrect password")
  }

  return res.status(200).send(user)
})

module.exports = router;
