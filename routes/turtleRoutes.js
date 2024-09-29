const Sequelize = require('sequelize');
const express = require('express');
const turtleRoutes = express.Router();

const db = require('../models/index');

turtleRoutes.get('/turtles', async (req, res) => {
  try {
    const turtles = await db.turtles.findAll();
    res.json(turtles);
  } catch (error) {
    res.status(500).send(error);
  }
});

turtleRoutes.get('/favorite-mozzarella', async (req, res) => {
  try {
    const turtles = await db.turtles.findAll({
      include: [
        {
          model: db.pizzas,
          as: 'firstFavoritePizza',
          where: { name: 'Mozzarella' },
        },
      ],
    });
    res.json(turtles);
  } catch (error) {
    res.status(500).json({ error: 'не могу получить пиццу' });
  }
});

turtleRoutes.get('/favorite-pizzas', async (req, res) => {
  try {
    const pizzas = await db.pizzas.findAll({
      include: [
        { model: db.turtles, as: 'firstFavoritePizza', attributes: [] },
        { model: db.turtles, as: 'secondFavoritePizza', attributes: [] },
      ],
      distinct: true,
    });
    res.json(pizzas);
  } catch (error) {
    res.status(500).json({ error: 'не могу получить любимые пиццы' });
  }
});

turtleRoutes.post('/create', async (req, res) => {
  try {
    const {
      name,
      color,
      weaponId,
      firstFavoritePizzaId,
      secondFavoritePizzaId,
    } = req.body;

    const newTurtle = await db.turtles.create({
      name,
      color,
      weaponId,
      firstFavoritePizzaId,
      secondFavoritePizzaId,
    });

    res.status(201).json(newTurtle);
  } catch (error) {
    res.status(500).send(error);
  }
});

turtleRoutes.get('/count-weapons', async (req, res) => {
  try {
    const count = await db.weapons.count({
      where: { dps: { [Sequelize.Op.gt]: 100 } },
    });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: 'не могу найти оружие' });
  }
});

turtleRoutes.get('/pizza/:id', async (req, res) => {
  try {
    const pizza = await db.pizzas.findByPk(req.params.id);
    res.json(pizza);
  } catch (error) {
    res.status(500).json({ error: 'Unable to find pizza' });
  }
});

module.exports = { turtleRoutes };
