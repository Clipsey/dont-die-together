const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GameStateSchema = new Schema({
  GameState: Schema.Types.Mixed
});

module.exports = GameState = mongoose.model('GameState', GameStateSchema);