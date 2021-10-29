const i18n = require("../util/i18n");
config = require("../config.json");

module.exports = {
  name: "addBlacklist",
  aliases: ["bl"],
  description: "Para negrear gente",
  execute(message, args) {
    let messageToAuthor = "";
    const db = message.client.db;
    const authorIsBlack = db.get("blacklist").find({ id: message.author.id }).value();
    if (authorIsBlack) {
      return message.channel.send(`${message.author.username} tiene que tomar chicha`).catch(console.error);
    }
    const userId = args[0].slice(3, -1);
    const username = message.client.users.cache.get(userId).username;
    const dbInstance = db.get("blacklist").find({ id: userId });
    const existUser = dbInstance.value();

    if (config.TWJASA_ID.includes(userId)) {
      messageToAuthor = "No puedes agregar al papa de los helados";
    } else {
      args.shift();
      const commands = args ? args : [];
      if (existUser) {
        dbInstance.update("commands", () => args).write();
        messageToAuthor = `${username} was updated in the blacklist`;
      }
      if (!existUser) {
        db.get("blacklist").push({ id: userId, username, commands }).write();
        messageToAuthor = `${username} added to the blacklist`;
      }
    }
    return message.member.send(messageToAuthor).catch(console.error);
  }
};
