import Phaser from "phaser";
import { useEffect, useRef, useState } from "react";

const OfficePage = () => {
  const [pc, setPc] = useState<RTCPeerConnection>();

  let localVideoRef = useRef<HTMLVideoElement>(null);
  let remoteVideoRef = useRef<HTMLVideoElement>(null);

  const pc_config = {
    iceServers: [
      // {
      //   urls: 'stun:[STUN_IP]:[PORT]',
      //   'credentials': '[YOR CREDENTIALS]',
      //   'username': '[USERNAME]'
      // },
      {
        urls: "stun:stun.l.google.com:19302",
      },
    ],
  };

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
    pixelArt: true,
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 200 },
      },
    },
    scene: {
      preload: function () {
        this.load.image("sky", "assets/landscape/sky.jpg");

        this.load.tilemapTiledJSON(
          "map",
          "assets/tilemaps/maps/super-mario.json"
        );
        this.load.image("tiles1", "assets/tilemaps/tiles/super-mario.png");
      },
      create: function () {
        this.cameras.main.setBounds(0, 0, 3392, 100);
        this.physics.world.setBounds(0, 0, 3392, 240);

        var map = this.make.tilemap({ key: "map" });
        var tileset = map.addTilesetImage("SuperMarioBros-World1-1", "tiles1");
        var layer = map.createLayer("World1", tileset, 0, 0);

        this.cameras.main.setZoom(4);
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

  return (
    <div>
      <video
        style={{
          width: 240,
          height: 240,
          margin: 5,
          backgroundColor: "black",
        }}
        muted
        ref={localVideoRef}
        autoPlay
      ></video>
      <video
        id="remotevideo"
        style={{
          width: 240,
          height: 240,
          margin: 5,
          backgroundColor: "black",
        }}
        ref={remoteVideoRef}
        autoPlay
      ></video>
      <div id="office-page"></div>
    </div>
  );
};

export default OfficePage;
