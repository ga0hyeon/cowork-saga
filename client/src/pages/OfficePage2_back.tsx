import Phaser from "phaser";
import { useEffect, useRef, useState } from "react";

const OfficePage = () => {
  const variables = useRef<{
    platforms: Phaser.Physics.Arcade.StaticGroup;
    player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    stars: Phaser.Physics.Arcade.Group;
  }>();

  const config = useRef<Phaser.Types.Core.GameConfig>({
    type: Phaser.AUTO,
    parent: "office-page",
    width: 800,
    height: 600,
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 200 },
      },
    },
    scene: {
      preload: function () {
        this.load.image("sky", "assets/sky.png");
        this.load.image("ground", "assets/platform.png");
        this.load.image("star", "assets/star.png");
        this.load.image("bomb", "assets/bomb.png");
        this.load.spritesheet("dude", "assets/dude.png", {
          frameWidth: 32,
          frameHeight: 48,
        });

        this.load.image("floor_tiles", "assets/room/floor_ceiling.png");
        this.load.image("interior_tiles", "assets/room/interiors.png");

      },
      create: function () {
        this.add.image(400, 300, "sky");

        //NOTE : config에 physics를 정의해두어야 정상적으로 동작한다
        const platforms = this.physics.add.staticGroup();

        //NOTE : static physics body의 크기를 변경했으므로 refreshBody 호출
        platforms.create(400, 568, "ground").setScale(2).refreshBody();

        platforms.create(600, 400, "ground");
        platforms.create(50, 250, "ground");
        platforms.create(750, 220, "ground");

        const player = this.physics.add.sprite(100, 450, "dude");
        player.setBounce(0.2);
        player.setCollideWorldBounds(true);

        this.anims.create({
          key: "left",
          frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
          frameRate: 10,
          repeat: -1,
        });

        this.anims.create({
          key: "turn",
          frames: [{ key: "dude", frame: 4 }],
          frameRate: 20,
        });

        this.anims.create({
          key: "right",
          frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
          frameRate: 10,
          repeat: -1,
        });

        this.physics.add.collider(player, platforms);

        const cursors = this.input.keyboard.createCursorKeys();

        const scoreText = this.add.text(16, 16, "score: 0", {
          fontSize: "32px",
          color: "#fff",
        });

        const stars = this.physics.add.group({
          key: "star",
          repeat: 11,
          setXY: { x: 12, y: 0, stepX: 70 },
        });

        stars.children.iterate(function (child) {
          (child as any).setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });

        this.physics.add.collider(stars, platforms);
        this.physics.add.overlap(
          player,
          stars,
          (player, star) => {
            (star as any).disableBody(true, true);
            setScore((prev) => {
              scoreText.setText("Score: " + (prev + 1));
              return prev + 1;
            });

            if (stars.countActive(true) === 0) {
              stars.children.iterate(function (child) {
                (child as any).enableBody(
                  true,
                  (child as any).x,
                  0,
                  true,
                  true
                );
              });

              const x =
                (player as any).x < 400
                  ? Phaser.Math.Between(400, 800)
                  : Phaser.Math.Between(0, 400);

              const bomb = bombs.create(x, 16, "bomb");
              bomb.setBounce(1);
              bomb.setCollideWorldBounds(true);
              bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
            }
          },
          undefined,
          this
        );

        const bombs = this.physics.add.group();

        this.physics.add.collider(bombs, platforms);

        this.physics.add.collider(
          player,
          bombs,
          (player, bomb) => {
            this.physics.pause();

            (player as any).setTint(0xff0000);

            this.anims.play("turn", player);

            this.add.text(240, 300, "GAME OVER", {
              fontSize: "64px",
              color: "#0xff00",
            });
          },
          undefined,
          this
        );
        variables.current = {
          platforms,
          player,
          cursors,
          stars,
        };
      },
      update: function () {
        if (variables.current) {
          const { cursors, player } = variables.current;

          if (cursors.left.isDown) {
            player.setVelocityX(-160);
            player.anims.play("left", true);
          } else if (cursors.right.isDown) {
            player.setVelocityX(160);
            player.anims.play("right", true);
          } else {
            player.setVelocityX(0);
            player.anims.play("turn");
          }
          if (cursors.up.isDown && player.body.touching.down) {
            player.setVelocityY(-330);
          }
        }
      },
    },
  });
  const [score, setScore] = useState<number>(0);
  const [game, setGame] = useState<Phaser.Game>();

  useEffect(() => {
    const game = new Phaser.Game(config.current);
    setGame(game);

    return () => {
      game.destroy(true);
    };
  }, []);

  return <div id="office-page"></div>;
};

export default OfficePage;
