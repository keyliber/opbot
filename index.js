var tmi = require("tmi.js");
var multicraft = require("multicraft");
var fs = require("fs");
var config = require("./config.js");

// Open op database
let rawdata = fs.readFileSync("users.json");
let users = JSON.parse(rawdata);

// Connect to Twitch
var client = new tmi.Client({connection: {secure: true, reconnect: true}, channels: [config.channel]});
client.connect();

// Connect to Multicraft API
/*var api = multicraft.begin({
  url: config.panelurl,
  user: config.apiuser,
  key: config.apikey
});*/

client.on("connecting", (address, port) => {
  console.log("Connecting to Twitch...")
});

client.on("connected", (address, port) => {
  console.log("Connected.");
});

client.on("message", (channel, tags, message, self) => {
  // Check if it's by the bot
  // Message format: LostXOR has 11.12 / 10.00 hours. Minecraft username: LostXOR
  if (tags.username == config.user) {
    // Get Twitch id and MC username
    var id = message.split(" ")[0].toLowerCase();
    var username = message.split(" ")[8];
    var hours = parseInt(message.split(" ")[2]);

    // Get old and new MC usernames
    var olduser = (users[id] || "");
    var newuser = (username);

    // Update entry in database
    users[id] = username;

    // Save database
    data = JSON.stringify(users, null, 2);
    fs.writeFileSync("users.json", data);

    // If user has 10-20 hours
    if (10 <= hours && hours < 20) {
      console.log("10h");
    }
    else if (20 <= hours && hours < 30) {
      console.log("20h");
    }
    else if (30 <= hours && hours < 40) {
      console.log("30h");
    }
    else if (40 <= hours && hours < 50) {
      console.log("40h");
    }
    else if (50 <= hours) {
      console.log("50h");
    }
  }
    // Op/deop users if username is not unchanged
    /*if (toop != todeop) {
      console.log("id: " + id + "	op: " + toop + "	deop: " + todeop);
      api.sendConsoleCommand(config.serverid, "/deop " + todeop);
      api.sendConsoleCommand(config.serverid, "/team leave " + todeop);
      api.sendConsoleCommand(config.serverid, "/op " + toop);
      api.sendConsoleCommand(config.serverid, "/team join 10h " + toop);
    }*/
});
