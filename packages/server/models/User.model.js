import { DataTypes } from "sequelize";
export async function init(sequelize) {
  const model = sequelize.define("User", {
    id: { type:DataTypes.INTEGER, primaryKey: true },
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    start: DataTypes.DATE,
    delta: DataTypes.INTEGER,
    quota: DataTypes.INTEGER,
    download: DataTypes.BIGINT(20),
    upload: DataTypes.BIGINT(20),
  },{
    timestamps: false,
    freezeTableName: true,
    tableName:"users"
  });
  await model.sync({ force: true });
}


