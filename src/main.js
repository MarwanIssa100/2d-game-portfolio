import { K } from "./KaboomCtx";
import { dialogueData, scaleFactor } from "./constants";
import { displayDialogue, setCamScale } from "./utils";

K.loadSprite("spritesheet", "./spritesheet.png", {
  sliceX: 39,
  sliceY: 31,
  anims: {
    "idle-down": 940,
    "walk-down": { from: 940, to: 943, loop: true, speed: 8 },
    "idle-side": 979,
    "walk-side": { from: 979, to: 982, loop: true, speed: 8 },
    "idle-up": 1018,
    "walk-up": { from: 1018, to: 1021, loop: true, speed: 8 },
  },
});

K.loadSprite("map", "./map.png");

K.setBackground(K.Color.fromHex("#311047"));

//define the scene

K.scene("main", async () => {
  const mapData = await (await fetch("./map.tmj")).json();
  const layers = mapData.layers;

  const map = K.add([K.sprite("map"), K.pos(0), K.scale(scaleFactor)]);

  const player = K.make([
    K.sprite("spritesheet", { anim: "idle-down" }),
    K.area({
      shape: new K.Rect(K.vec2(0, 3), 10, 10),
    }),
    K.body(),
    K.anchor("center"),
    K.pos(0),
    K.scale(scaleFactor),
    {
      speed: 200,
      dir: "down",
      isInDialogue: false,
    },
    "player",
  ]);

  for (const layer of layers) {
    if (layer.name === "boundries") {
      for (const boundary of layer.objects) {
        map.add([
          K.area({
            shape: new K.Rect(K.vec2(0), boundary.width, boundary.height),
          }),
          K.body({ isStatic: true }),
          K.pos(boundary.x, boundary.y),
          boundary.name,
        ]);

        if (boundary.name) {
          player.onCollide(boundary.name, () => {
            player.isInDialogue = true;
            displayDialogue(dialogueData[boundary.name], () => (player.isInDialogue = false));
          });
        }
      }

      continue;
    }
    if (layer.name === "playerSpawn") {
      for (const entity of layer.objects) {
        if (entity.name === "player") {
          player.pos = K.vec2(
            (map.pos.x + entity.x) * scaleFactor,
            (map.pos.y + entity.y) * scaleFactor
          );
          K.add(player);
          continue;
        }
      }
    }
  }
  setCamScale(K);

  K.onResize(() => {
    setCamScale(K);
  });

  K.onUpdate(() => {
    K.camPos(player.worldPos().x, player.worldPos().y + 100);
  });

  K.onMouseDown((mouseBtn) => {
    if (mouseBtn !== "left" || player.isInDialogue) return;
    const mouseWorldPos = K.toWorld(K.mousePos());
    player.moveTo(mouseWorldPos, player.speed);

    const mouseAngle = player.pos.angle(mouseWorldPos);

    const lowerBound = 50;
    const upperBound = 125;

    if (
      mouseAngle > lowerBound &&
      mouseAngle < upperBound &&
      player.curAnim() !== "walk-up"
    ) {
      player.play("walk-up");
      player.dir = "up";
      return;
    }

    if (
      mouseAngle < -lowerBound &&
      mouseAngle > -upperBound &&
      player.curAnim() !== "walk-down"
    ) {
      player.play("walk-down");
      player.dir = "down";
      return;
    }

    if (Math.abs(mouseAngle) < lowerBound) {
      player.flipX = true;
      if (player.curAnim() !== "walk-side") {
        player.play("walk-side");
        player.dir = "left";
      }
    }

    if (Math.abs(mouseAngle) > upperBound) {
      player.flipX = false;
      if (player.curAnim() !== "walk-side") {
        player.play("walk-side");
        player.dir = "right";
      }
    }
  });
  K.onMouseRelease(() => {
    if (player.dir === "down") {
      player.play("idle-down");
      return;
    }
    if (player.dir === "up") {
        player.play("idle-up");
        return;
    }
    player.play("idle-side");
  });
});

//enter the scene
K.go("main");
