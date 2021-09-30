export default (_, newM, client) => client.emit("messageCreate", newM);
