// db.js
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('postgres://postgres.cwijfgnuvqjbaerczzqc:9291maniDEEP@@aws-0-ap-south-1.pooler.supabase.com:5432/postgres', {
    dialect: 'postgres',
    logging: false
});



const UsersCointabs = sequelize.define('UsersCointabs', {
    Name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Phone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Website: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    City: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Company: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});


const Posts = sequelize.define('Posts', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    Title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Body: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'UsersCointabs',
            key: 'id',
        },
    },
    Company: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});


UsersCointabs.hasMany(Posts, { as: 'Posts', foreignKey: 'userId' });

Posts.belongsTo(UsersCointabs, { foreignKey: 'userId' });



module.exports = { sequelize, UsersCointabs, Posts };