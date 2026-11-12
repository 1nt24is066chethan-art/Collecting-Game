import * as THREE from "three";
import { io } from "socket.io-client";


// ==========================================
// SCENE
// ==========================================

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x87ceeb);

scene.fog = new THREE.Fog(
    0x87ceeb,
    40,
    100
);


// ==========================================
// CAMERA
// ==========================================

const camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.1,
    500
);

camera.position.set(0, 6, 10);


// ==========================================
// RENDERER
// ==========================================

const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
);

renderer.shadowMap.enabled = true;

document.body.appendChild(
    renderer.domElement
);


// ==========================================
// LIGHT
// ==========================================

scene.add(
    new THREE.HemisphereLight(
        0xffffff,
        0x444444,
        1.5
    )
);


const light = new THREE.DirectionalLight(
    0xffffff,
    2
);

light.position.set(
    10,
    20,
    10
);

light.castShadow = true;

scene.add(light);


// ==========================================
// GROUND
// ==========================================

const ground = new THREE.Mesh(

    new THREE.PlaneGeometry(
        80,
        80
    ),

    new THREE.MeshStandardMaterial({
        color: 0x3c9b3c
    })

);

ground.rotation.x = -Math.PI / 2;

ground.receiveShadow = true;

scene.add(ground);


// ==========================================
// GRID
// ==========================================

const grid = new THREE.GridHelper(
    80,
    40
);

grid.position.y = 0.02;

scene.add(grid);


// ==========================================
// TREES
// ==========================================

function createTree(x, z) {

    const tree = new THREE.Group();


    const trunk = new THREE.Mesh(

        new THREE.CylinderGeometry(
            0.3,
            0.4,
            2,
            8
        ),

        new THREE.MeshStandardMaterial({
            color: 0x8b5a2b
        })

    );

    trunk.position.y = 1;

    trunk.castShadow = true;

    tree.add(trunk);


    const leaves = new THREE.Mesh(

        new THREE.SphereGeometry(
            1.4,
            16,
            16
        ),

        new THREE.MeshStandardMaterial({
            color: 0x176b2c
        })

    );

    leaves.position.y = 2.7;

    leaves.castShadow = true;

    tree.add(leaves);


    tree.position.set(
        x,
        0,
        z
    );

    scene.add(tree);
}


createTree(-15, -15);
createTree(15, -15);
createTree(-15, 15);
createTree(15, 15);
createTree(-25, 5);
createTree(25, 5);


// ==========================================
// NAME TAG
// ==========================================

function nameTag(text) {

    const canvas =
        document.createElement("canvas");

    canvas.width = 512;
    canvas.height = 128;

    const ctx =
        canvas.getContext("2d");

    ctx.fillStyle =
        "rgba(0,0,0,0.8)";

    ctx.fillRect(
        5,
        5,
        502,
        118
    );

    ctx.font =
        "bold 50px Arial";

    ctx.fillStyle =
        "white";

    ctx.textAlign =
        "center";

    ctx.textBaseline =
        "middle";

    ctx.fillText(
        text,
        256,
        64
    );


    const texture =
        new THREE.CanvasTexture(
            canvas
        );


    const sprite =
        new THREE.Sprite(

            new THREE.SpriteMaterial({
                map: texture,
                transparent: true,
                depthTest: false
            })

        );


    sprite.scale.set(
        2.5,
        0.63,
        1
    );

    sprite.position.y = 3.5;

    return sprite;
}


// ==========================================
// AVATAR
// ==========================================

function createAvatar(
    color,
    name
) {

    const player =
        new THREE.Group();


    // BODY

    const body =
        new THREE.Mesh(

            new THREE.BoxGeometry(
                0.9,
                1.1,
                0.55
            ),

            new THREE.MeshStandardMaterial({
                color
            })

        );

    body.position.y = 1.45;

    body.castShadow = true;

    player.add(body);


    // HEAD

    const head =
        new THREE.Mesh(

            new THREE.SphereGeometry(
                0.42,
                24,
                24
            ),

            new THREE.MeshStandardMaterial({
                color: 0xffc7a0
            })

        );

    head.position.y = 2.35;

    head.castShadow = true;

    player.add(head);


    // HAIR

    const hair =
        new THREE.Mesh(

            new THREE.SphereGeometry(
                0.43,
                20,
                20,
                0,
                Math.PI * 2,
                0,
                Math.PI / 2
            ),

            new THREE.MeshStandardMaterial({
                color: 0x20150e
            })

        );

    hair.position.y = 2.55;

    hair.castShadow = true;

    player.add(hair);


    // LEFT ARM

    const leftArm =
        new THREE.Mesh(

            new THREE.BoxGeometry(
                0.22,
                0.9,
                0.22
            ),

            new THREE.MeshStandardMaterial({
                color: 0xffc7a0
            })

        );

    leftArm.position.set(
        -0.58,
        1.45,
        0
    );

    leftArm.castShadow = true;

    player.add(leftArm);


    // RIGHT ARM

    const rightArm =
        new THREE.Mesh(

            new THREE.BoxGeometry(
                0.22,
                0.9,
                0.22
            ),

            new THREE.MeshStandardMaterial({
                color: 0xffc7a0
            })

        );

    rightArm.position.set(
        0.58,
        1.45,
        0
    );

    rightArm.castShadow = true;

    player.add(rightArm);


    // LEFT LEG

    const leftLeg =
        new THREE.Mesh(

            new THREE.BoxGeometry(
                0.28,
                0.9,
                0.28
            ),

            new THREE.MeshStandardMaterial({
                color: 0x202040
            })

        );

    leftLeg.position.set(
        -0.23,
        0.55,
        0
    );

    leftLeg.castShadow = true;

    player.add(leftLeg);


    // RIGHT LEG

    const rightLeg =
        new THREE.Mesh(

            new THREE.BoxGeometry(
                0.28,
                0.9,
                0.28
            ),

            new THREE.MeshStandardMaterial({
                color: 0x202040
            })

        );

    rightLeg.position.set(
        0.23,
        0.55,
        0
    );

    rightLeg.castShadow = true;

    player.add(rightLeg);


    // SHOES

    const shoeMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x111111
        });


    const leftShoe =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                0.35,
                0.2,
                0.55
            ),
            shoeMaterial
        );

    leftShoe.position.set(
        -0.23,
        0.08,
        -0.1
    );

    player.add(leftShoe);


    const rightShoe =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                0.35,
                0.2,
                0.55
            ),
            shoeMaterial
        );

    rightShoe.position.set(
        0.23,
        0.08,
        -0.1
    );

    player.add(rightShoe);


    // NAME

    player.add(
        nameTag(name)
    );


    // Animation data

    player.userData.leftArm =
        leftArm;

    player.userData.rightArm =
        rightArm;

    player.userData.leftLeg =
        leftLeg;

    player.userData.rightLeg =
        rightLeg;

    player.userData.walking =
        false;


    return player;
}


// ==========================================
// MY PLAYER
// ==========================================

const myPlayer =
    createAvatar(
        0x3366ff,
        "YOU"
    );

scene.add(myPlayer);


// ==========================================
// REMOTE PLAYERS
// ==========================================

const remotePlayers = {};


// ==========================================
// COLLECTIBLES
// ==========================================

const collectibleMeshes = {};


// ==========================================
// CREATE COLLECTIBLE
// ==========================================

function createCollectible(
    id,
    position
) {

    if (collectibleMeshes[id]) {

        return;

    }


    const group =
        new THREE.Group();


    // Outer glowing sphere

    const sphere =
        new THREE.Mesh(

            new THREE.SphereGeometry(
                0.45,
                24,
                24
            ),

            new THREE.MeshStandardMaterial({

                color: 0xffff00,

                emissive: 0xffaa00,

                emissiveIntensity: 1.5,

                metalness: 0.3,

                roughness: 0.2

            })

        );


    group.add(sphere);


    // Ring

    const ring =
        new THREE.Mesh(

            new THREE.TorusGeometry(
                0.65,
                0.08,
                12,
                24
            ),

            new THREE.MeshStandardMaterial({

                color: 0xffffff,

                emissive: 0xffff00,

                emissiveIntensity: 1

            })

        );


    group.add(ring);


    group.position.set(
        position.x,
        0.8,
        position.z
    );


    group.castShadow = true;


    scene.add(group);


    collectibleMeshes[id] =
        group;
}


// ==========================================
// KEYBOARD
// ==========================================

const keys = {};

window.addEventListener(
    "keydown",
    event => {

        keys[
            event.key.toLowerCase()
        ] = true;

    }
);


window.addEventListener(
    "keyup",
    event => {

        keys[
            event.key.toLowerCase()
        ] = false;

    }
);


const speed = 0.15;


// ==========================================
// SOCKET
// ==========================================

const socket =
    io("http://localhost:3000");


let myId = null;


// ==========================================
// INIT
// ==========================================

socket.on(
    "init",
    data => {

        myId = data.id;

        console.log(
            "CONNECTED:",
            myId
        );


        // Existing players

        for (
            const [id, player]
            of Object.entries(
                data.players
            )
        ) {

            if (id !== myId) {

                addRemotePlayer(
                    id,
                    player
                );

            }

        }


        // Collectibles

        for (
            const [id, item]
            of Object.entries(
                data.collectibles
            )
        ) {

            createCollectible(
                id,
                item
            );

        }


        updateLeaderboard(
            Object.values(
                data.players
            )
        );

    }
);


// ==========================================
// ADD REMOTE PLAYER
// ==========================================

function addRemotePlayer(
    id,
    data
) {

    if (remotePlayers[id]) {

        return;

    }


    const player =
        createAvatar(
            0xff6633,
            "PLAYER"
        );


    player.position.set(
        data.x,
        0,
        data.z
    );


    scene.add(player);


    remotePlayers[id] =
        player;
}


// ==========================================
// NEW PLAYER
// ==========================================

socket.on(
    "playerJoined",
    player => {

        addRemotePlayer(
            player.id,
            player
        );

    }
);


// ==========================================
// REMOTE MOVEMENT
// ==========================================

socket.on(
    "playerMoved",
    player => {

        const avatar =
            remotePlayers[player.id];


        if (!avatar) {

            return;

        }


        avatar.position.x =
            player.x;

        avatar.position.z =
            player.z;

        avatar.userData.walking =
            true;

    }
);


// ==========================================
// PLAYER LEFT
// ==========================================

socket.on(
    "playerLeft",
    id => {

        if (remotePlayers[id]) {

            scene.remove(
                remotePlayers[id]
            );

            delete remotePlayers[id];

        }

    }
);


// ==========================================
// MOVEMENT
// ==========================================

function movePlayer() {

    let moving = false;


    if (
        keys["w"] ||
        keys["arrowup"]
    ) {

        myPlayer.position.z -= speed;

        moving = true;

    }


    if (
        keys["s"] ||
        keys["arrowdown"]
    ) {

        myPlayer.position.z += speed;

        moving = true;

    }


    if (
        keys["a"] ||
        keys["arrowleft"]
    ) {

        myPlayer.position.x -= speed;

        moving = true;

    }


    if (
        keys["d"] ||
        keys["arrowright"]
    ) {

        myPlayer.position.x += speed;

        moving = true;

    }


    myPlayer.position.x =
        THREE.MathUtils.clamp(
            myPlayer.position.x,
            -39,
            39
        );


    myPlayer.position.z =
        THREE.MathUtils.clamp(
            myPlayer.position.z,
            -39,
            39
        );


    myPlayer.userData.walking =
        moving;


    // Camera follows player

    camera.position.x =
        myPlayer.position.x;

    camera.position.z =
        myPlayer.position.z + 10;

    camera.lookAt(
        myPlayer.position.x,
        1.2,
        myPlayer.position.z
    );
}


// ==========================================
// SEND POSITION
// ==========================================

let lastSend = 0;

function sendPosition(time) {

    if (
        time - lastSend > 50
    ) {

        socket.emit(
            "move",
            {
                x: myPlayer.position.x,
                y: 0,
                z: myPlayer.position.z
            }
        );

        lastSend = time;

    }
}


// ==========================================
// COLLECT
// ==========================================

function checkCollection() {

    for (
        const [id, mesh]
        of Object.entries(
            collectibleMeshes
        )
    ) {

        const dx =
            myPlayer.position.x -
            mesh.position.x;

        const dz =
            myPlayer.position.z -
            mesh.position.z;


        const distance =
            Math.sqrt(
                dx * dx +
                dz * dz
            );


        if (distance < 1.3) {

            socket.emit(
                "collect",
                id
            );

        }

    }
}


// ==========================================
// COLLECTED EVENT
// ==========================================

socket.on(
    "collected",
    data => {

        const mesh =
            collectibleMeshes[
                data.collectibleId
            ];


        if (mesh) {

            scene.remove(mesh);

            delete collectibleMeshes[
                data.collectibleId
            ];

        }


        if (
            data.by === myId
        ) {

            document.getElementById(
                "score"
            ).textContent =
                `Score: ${data.score}`;

        }

    }
);


// ==========================================
// RESPAWN
// ==========================================

socket.on(
    "spawned",
    item => {

        createCollectible(
            item.id,
            item
        );

    }
);


// ==========================================
// LEADERBOARD
// ==========================================

socket.on(
    "leaderboard",
    players => {

        updateLeaderboard(players);

    }
);


function updateLeaderboard(players) {

    const list =
        document.getElementById(
            "leaderboard-list"
        );


    if (!list) {

        return;

    }


    list.innerHTML = "";


    players.sort(
        (a, b) =>
            (b.score || 0) -
            (a.score || 0)
    );


    players.forEach(
        (player, index) => {

            const row =
                document.createElement(
                    "div"
                );


            const name =
                player.id === myId
                    ? "YOU"
                    : `PLAYER ${index + 1}`;


            row.textContent =
                `${index + 1}. ${name}     ${player.score || 0}`;


            row.style.padding =
                "4px";


            if (
                player.id === myId
            ) {

                row.style.fontWeight =
                    "bold";

            }


            list.appendChild(row);

        }
    );
}


// ==========================================
// ANIMATION
// ==========================================

function animate(time) {

    requestAnimationFrame(
        animate
    );


    movePlayer();

    checkCollection();

    sendPosition(time);


    // Animate collectibles

    for (
        const mesh
        of Object.values(
            collectibleMeshes
        )
    ) {

        mesh.rotation.y += 0.04;

        mesh.rotation.x += 0.01;

        mesh.position.y =
            0.8 +
            Math.sin(
                time * 0.004
            ) * 0.15;

    }


    // Walking animation

    const characters = [
        myPlayer,
        ...Object.values(remotePlayers)
    ];


    for (
        const player
        of characters
    ) {

        if (
            player.userData.walking
        ) {

            const swing =
                Math.sin(
                    time * 0.015
                ) * 0.5;


            player.userData.leftArm.rotation.x =
                swing;

            player.userData.rightArm.rotation.x =
                -swing;

            player.userData.leftLeg.rotation.x =
                -swing;

            player.userData.rightLeg.rotation.x =
                swing;

        }

        else {

            player.userData.leftArm.rotation.x *= 0.8;

            player.userData.rightArm.rotation.x *= 0.8;

            player.userData.leftLeg.rotation.x *= 0.8;

            player.userData.rightLeg.rotation.x *= 0.8;

        }


        // Face name tag toward camera

        player.children.forEach(
            child => {

                if (
                    child instanceof THREE.Sprite
                ) {

                    child.quaternion.copy(
                        camera.quaternion
                    );

                }

            }
        );

    }


    renderer.render(
        scene,
        camera
    );

}


animate(0);


// ==========================================
// RESIZE
// ==========================================

window.addEventListener(
    "resize",
    () => {

        camera.aspect =
            window.innerWidth /
            window.innerHeight;

        camera.updateProjectionMatrix();

        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );

    }
);