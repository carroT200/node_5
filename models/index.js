const Turtle = require('./turtle');
const Weapon = require('./weapon');
const Pizza = require('./pizza');
const Color = require('./color');

module.exports = (Sequelize, config) => {
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

  const turtles = Turtle(Sequelize, sequelize);
  const weapons = Weapon(Sequelize, sequelize);
  const pizzas = Pizza(Sequelize, sequelize);
  const colors = Color(Sequelize, sequelize);

  weapons.hasMany(turtles, {
    foreignKey: 'weaponId',
  });
  turtles.belongsTo(weapons, { foreignKey: 'weaponId' });

  pizzas.hasMany(turtles, {
    foreignKey: 'firstFavoritePizzaId',
  });

  pizzas.hasMany(turtles, {
    foreignKey: 'secondFavoritePizzaId',
  });

  turtles.belongsTo(pizzas, {
    foreignKey: 'firstFavoritePizzaId',
    as: 'firstFavoritePizza',
  });

  turtles.belongsTo(pizzas, {
    foreignKey: 'secondFavoritePizzaId',
    as: 'secondFavoritePizza',
  });

  return {
    turtles,
    weapons,
    pizzas,
    colors,

    sequelize,
    Sequelize,
  };
};
