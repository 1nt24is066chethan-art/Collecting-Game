import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();

const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: "*"
    }
});

app.use(express.static("dist"));


// -------------------------
// GAME DATA
// -------------------------

const players = {};

const collectibles = {};


// -------------------------
// CREATE COLLECTIBLE
// -------------------------

function spawnCollectible(id) {

    collectibles[id] = {

        x: (Math.random() - 0.5) * 40,

        y: 0.5,

        z: (Math.random() - 0.5) * 40

    };

}


// Create 20 objects

for (let i = 0; i < 20; i++) {

    spawnCollectible(`c${i}`);

}


// -------------------------
// PLAYER CONNECTION
// -------------------------

io.on("connection", (socket) => {

    console.log("Player connected:", socket.id);


    // Create player

    players[socket.id] = {

        x: 0,

        y: 0.5,

        z: 0,

        score: 0

    };


    // Send current world to new player

    socket.emit("init", {

        id: socket.id,

        players: players,

        collectibles: collectibles

    });


    // Tell other players

    socket.broadcast.emit(
        "playerJoined",
        {
            id: socket.id,
            ...players[socket.id]
        }
    );


    // -------------------------
    // PLAYER MOVEMENT
    // -------------------------

    socket.on("move", (pos) => {

        if (!players[socket.id]) {
            return;
        }


        players[socket.id] = {

            ...players[socket.id],

            ...pos

        };


        socket.broadcast.emit(
            "playerMoved",
            {
                id: socket.id,
                ...pos
            }
        );

    });


    // -------------------------
    // COLLECT OBJECT
    // -------------------------

    socket.on("collect", (collectibleId) => {

        // Object already collected

        if (!collectibles[collectibleId]) {
            return;
        }


        // Remove object

        delete collectibles[collectibleId];


        // Increase score

        players[socket.id].score += 1;


        // Tell everyone

        io.emit(
            "collected",
            {
                collectibleId: collectibleId,

                by: socket.id,

                score: players[socket.id].score
            }
        );


        // Respawn after 3 seconds

        setTimeout(() => {

            spawnCollectible(collectibleId);


            io.emit(
                "spawned",
                {
                    id: collectibleId,

                    ...collectibles[collectibleId]
                }
            );

        }, 3000);

    });


    // -------------------------
    // PLAYER DISCONNECT
    // -------------------------

    socket.on("disconnect", () => {

        console.log(
            "Player disconnected:",
            socket.id
        );


        delete players[socket.id];


        io.emit(
            "playerLeft",
            socket.id
        );

    });

});


// -------------------------
// START SERVER
// -------------------------

httpServer.listen(3000, () => {

    console.log(
        "Server running on http://localhost:3000"
    );

});