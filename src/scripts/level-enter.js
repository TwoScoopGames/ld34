var importTilemap = require("splat-ecs/lib/import-from-tiled");
var levels = require("../data/levels.json");

var player = 0;

module.exports = function(game) { // eslint-disable-line no-unused-vars
  var level = levels[game.arguments.level || 0];

  game.entities.set(player, "radius", level.radius);
  game.entities.set(player, "goalRadius", level.goalRadius);
  game.entities.get(player, "timers").goalTimer.max = level.maxTime * 1000;
  game.entities.set(2, "message", level.message);
  loadTilemap(game, level.map);
};

function loadTilemap(game, map) {
  var tilemap = require("../tiled/" + map + ".json");
  importTilemap(tilemap, game.entities, game.images);

  var spawn = game.entities.find("spawn")[0];
  center(game, player, spawn);
  game.entities.destroy(spawn);

  var tiles = game.entities.find("tile").slice();
  for (var i = 0; i < tiles.length; i++) {
    var tile = tiles[i];
    var tilePosition = game.entities.get(tile, "position");
    var prefab = game.entities.get(tile, "prefab");

    if (prefab) {
      var trash = game.instantiatePrefab(prefab);
      var trashPosition = game.entities.get(trash, "position");
      trashPosition.x = tilePosition.x;
      trashPosition.y = tilePosition.y;

      game.entities.destroy(tile);
    }
  }
}

function center(game, entity, target) {
  var targetPosition = game.entities.get(target, "position");
  var targetSize = game.entities.get(target, "size");

  var entityPosition = game.entities.get(entity, "position");
  var entitySize = game.entities.get(entity, "size");

  entityPosition.x = targetPosition.x + (targetSize.width / 2) - (entitySize.width / 2);
  entityPosition.y = targetPosition.y + (targetSize.height / 2) - (entitySize.height / 2);
}
