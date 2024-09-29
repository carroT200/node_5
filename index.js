const Sequelize = require('sequelize');
const express = require('express');
require('dotenv').config();

const config = require('./config.json').development;

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    port: config.port,
    logging: false,
  }
);

const db = require('./models')(Sequelize, sequelize);

const app = express();

app.use(express.json());

db.sequelize
  .sync()
  .then(async () => {
    console.log('Connected to the database');

    const pizza1 = await db.pizzas.create({
      name: 'Mozzarella',
      description: 'Cheese pizza',
      calories: 2500,
    });
    const pizza2 = await db.pizzas.create({
      name: 'Pepperoni',
      description: 'Spicy pizza',
      calories: 3200,
    });
    const pizza3 = await db.pizzas.create({
      name: 'Margherita',
      description: 'Tomato and basil pizza',
      calories: 2200,
    });
    const pizza4 = await db.pizzas.create({
      name: 'BBQ Chicken',
      description: 'Barbecue chicken pizza',
      calories: 3000,
    });

    const weapon1 = await db.weapons.create({ name: 'Katana', dps: 120 });
    const weapon2 = await db.weapons.create({ name: 'Nunchaku', dps: 95 });
    const weapon3 = await db.weapons.create({ name: 'Bo Staff', dps: 85 });
    const weapon4 = await db.weapons.create({ name: 'Sai', dps: 105 });

    await db.turtles.create({
      name: 'Leonardo',
      color: 'blue',
      weaponId: weapon1.id,
      firstFavoritePizzaId: pizza1.id,
      secondFavoritePizzaId: pizza2.id,
    });

    await db.turtles.create({
      name: 'Michelangelo',
      color: 'orange',
      weaponId: weapon2.id,
      firstFavoritePizzaId: pizza2.id,
      secondFavoritePizzaId: pizza1.id,
    });

    await db.turtles.create({
      name: 'Donatello',
      color: 'purple',
      weaponId: weapon3.id,
      firstFavoritePizzaId: pizza3.id,
      secondFavoritePizzaId: pizza4.id,
    });

    await db.turtles.create({
      name: 'Raphael',
      color: 'red',
      weaponId: weapon4.id,
      firstFavoritePizzaId: pizza4.id,
      secondFavoritePizzaId: pizza3.id,
    });
  })
  .catch((err) => console.log('Error connecting to the database:', err));

const { turtleRoutes } = require('./routes/turtleRoutes');

app.use('/api', turtleRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
