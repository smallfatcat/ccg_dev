﻿function attackRoll(percentage: number) {
  var roll: number = Math.random() * 100;
  if (roll < percentage) {
    return true;
  }
  return false;
}

function setFighting(source: Player, target: Player) {
  if (source.team != target.team) {
    if (source.isFighting) {
      if (source.fight.targetHealth > target.health) {
        source.stop();
        source.pointAt(target.pos);
        source.fight.targetID = target.id;
        source.fight.targetHealth = target.health;
        source.fight.targetDirection = getVectorAB(source.pos, target.pos);
      }
    }
    else {
      source.stop();
      source.pointAt(target.pos);
      source.isFighting = true;
      target.attackers++;
      source.fight.targetID = target.id;
      source.fight.targetHealth = target.health;
      source.fight.targetDirection = getVectorAB(source.pos, target.pos);
    }
    if (target.isFighting) {
      if (target.fight.targetHealth > source.health) {
        target.stop();
        target.pointAt(source.pos);
        target.fight.targetID = source.id;
        target.fight.targetHealth = source.health;
        target.fight.targetDirection = getVectorAB(target.pos, source.pos);
      }
    }
    else {
      target.stop();
      target.pointAt(source.pos);
      target.isFighting = true;
      source.attackers++;
      target.fight.targetID = source.id;
      target.fight.targetHealth = source.health;
      target.fight.targetDirection = getVectorAB(target.pos, source.pos);
    }
  }
} 

function performFights() {
  for (var i: number = 0; i < gPlayers.length; i++) {
    var player: Player = gPlayers[i];
    var target: Player = gPlayers[player.fight.targetID];
    if (player.isFighting) {
      if (target.isAlive) {
        if (attackRoll(player.attackChance)) {
          target.health -= player.damage;
          if (target.health < 1) {
            target.isAlive = false;
            target.team == 0 ? gStats.teamKillsA++ : gStats.teamKillsB++
            gStats.kills++;
            gStats.playersAlive--;
            player.isFighting = false;
            gPlayers[target.fight.targetID].attackers--;
            target.isFighting = false;
            player.pointAt(nearestEnemyPos(player.pos, player.team));
            player.moveForward();
          }
        }
      }
      else {
        player.isFighting = false;
        player.pointAt(nearestEnemyPos(player.pos, player.team));
        player.moveForward();
      }
    }
  }
}

function setApproachTimerFlag() {
  gApproachTimerFlag = true;
  console.log('setApproachTimerFlag hit');
}

function nearestEnemyPos(myPos: Vector2D, myTeam: number) {
  var enemyPos: Vector2D = new Vector2D({ x: 400, y: 400 });
  var distance: number = 0;
  var minDistance = -1;
  for (var i: number = 0; i < gPlayers.length; i++) {
    var enemy: Player = gPlayers[i];
    if (enemy.isAlive && enemy.team != myTeam && enemy.attackers < 2) {
      distance = getDistance(myPos, enemy.pos);
      if (distance < minDistance || minDistance == -1) {
        minDistance = distance;
        enemyPos = enemy.pos;
      }
    }
  }
  return enemyPos;
}

function makeAllThingsApproachEnemies() {
  for (var i: number = 0; i < gPlayers.length; i++) {
    if (!gPlayers[i].isFighting) {
      gPlayers[i].pointAt(nearestEnemyPos(gPlayers[i].pos, gPlayers[i].team));
      gPlayers[i].moveForward();
    }
  }
}