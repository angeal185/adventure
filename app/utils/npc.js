var skin = require('../modules/minecraft-skin');


module.exports = function (game, rt) {
    var mountPoint;

    return function (img, skinOpts) {
        if (!skinOpts) {
          skinOpts = {};
        }
        skinOpts.scale = skinOpts.scale || new game.THREE.Vector3(0.04, 0.04, 0.04);
        var playerSkin = skin(game.THREE, img, skinOpts);
        var player = playerSkin.mesh;
        var physics = game.makePhysical(player);
        physics.playerSkin = playerSkin;

        if(rt){
          player.rotation.y = game.THREE.Math.degToRad(rt);
        }

        //player.position.set(0, 562, -20);
        game.scene.add(player);
        game.addItem(physics);

        physics.yaw = player;
        physics.pitch = player.head;
        physics.subjectTo(game.gravity);
        physics.blocksCreation = true;

        game.control(physics);

        physics.move = function (x, y, z) {
            var xyz = parseXYZ(x, y, z);
            physics.yaw.position.x += xyz.x;
            physics.yaw.position.y += xyz.y;
            physics.yaw.position.z += xyz.z;
        };

        physics.moveTo = function (x, y, z) {
            var xyz = parseXYZ(x, y, z);
            physics.yaw.position.x = xyz.x;
            physics.yaw.position.y = xyz.y;
            physics.yaw.position.z = xyz.z;
        };


        physics.position = physics.yaw.position;
        return physics;

    }
};

function parseXYZ (x, y, z) {
    if (typeof x === 'object' && Array.isArray(x)) {
        return { x: x[0], y: x[1], z: x[2] };
    }
    else if (typeof x === 'object') {
        return { x: x.x || 0, y: x.y || 0, z: x.z || 0 };
    }
    return { x: Number(x), y: Number(y), z: Number(z) };
}