const Socket = require("websocket").server;

const http = require("http");

// http server
const server = http.createServer((req, res) => {});

server.listen(5500, () => {
  console.log("Listening on port 5500");
});

//// connect this http server with websocket

const websocket = new Socket({ httpServer: server });

////create users array
let users = [];

websocket.on("request", (req) => {
  console.log("A new client is connected");

  const connection = req.accept();
  connection.on("message", (message) => {
    const data = JSON.parse(message.utf8Data);
    const user = findUser(data.username);

    switch (data.type) {
      case "store_user":
        /// database

        if (user != null) {
          return;
        }
        const newUser = {
          conn: connection,
          username: data.username,
        };

        //// users array

        users.push(newUser.username);

        break;

      case "store_offer":
        if (user == null) {
          return;
        }
        user.offer = data.offer;

        break;

      case "store_candidate":
        if (user == null) {
          return;
        }
        if (user.candidates == null) {
          user.candidates = [];
        }
        user.candidates.push(data.candidate);

        break;

      case "send_answer":
        if (user == null) {
          return;
        }
        sendData(
          {
            type: "answer",
            answer: data.answer,
          },
          user.conn
        );

        break;

      case "send_candidate":
        if (user == null) {
          return;
        }

        sendData(
          {
            type: "candidate",
            candidate: data.candidate,
          },
          user.conn
        );

        break;

      case "join_call":
        if (user == null) {
          return;
        }
        sendData(
          {
            type: "offer",
            offer: user.offer,
          },
          connection
        );

        user.candidates.forEach((candidate) => {
          sendData(
            {
              type: "candidate",
              candidate: candidate,
            },
            connection
          );
        });
        break;
    }
  });

  //// user disconnect the video call

  connection.on("close", (reason, description) => {
    users.forEach((user) => {
      if (user.conn == connection) {
        users.splice(users.indexOf(user), 1);

        return;
      }
    });
  });
});

//////send data from the server to the client

function sendData(data, conn) {
  conn.send(JSON.stringify(data));
}

function findUser(username) {
  for (let i = 0; i < users.length; i++) {
    if (user[i].username == username) return users[i];
  }
}