import * as Discord from "discord.js";
require("dotenv").config();
var client = new Discord.Client({ partials: ["MESSAGE", "CHANNEL", "REACTION"] });
import * as mongoose from "mongoose";
export var commands = new Discord.Collection();
require("./handlers/command_handler")(client);
require("./handlers/event_handler")(client);
mongoose
    .connect(process.env.SRV, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
    .then(function () {
    console.log("Connected to the database!");
})["catch"](console.error);
require("./server")();
client.login(process.env.TOKEN);
