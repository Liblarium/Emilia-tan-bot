/**
 * Type for array with information about commands
 */
type HelpArray = {
  /**
   * Command name
   */
  name: string;
  /**
   * Command description
   */
  text: string;
  /**
   * Command aliases
   */
  aliases: string[];
};

/**
 * Array with information about commands
 */
const helpArray: HelpArray[] = [{
  name: "help",
  //text: "Command for viewing available commands. Other ways to call:",
  text: "Команда для просмотра доступных команд. Другие варианты вызова:",
  aliases: ["хелп", "помощь", "command", "commands", "команды", "</хелп:1027277375123230827>"]
}, {
  name: "newinfo",
  //text: "Command for changing \"User information\". Other ways to call:",
  text: "Команда для изменения \"Информация о пользователе\". Другие варианты вызова:",
  aliases: ["nio", "</newinfo:1027277375123230822>"]
}, {
  name: "profile",
  //text: "Profile view. Currently not working as the command is being changed. Other ways to call:",
  text: "Просмотр профиля. Пока не работает, так как команда изменяется. Другие варианты вызова:",
  aliases: ["pr", "</profile:1027277375123230824>"]
}, {
  name: "шар",
  //text: "Ball. Ask a question and get an answer from the bot. The bot is not AI, so the answer will be different each time. There can be repeats. Other ways to call:",
  text: "Шар. Задайте вопрос и узнаете ответ от бота. Бот не ИИ, так что на тот же вопрос будет отвечать по разному. Могут быть повторения. Другие варианты вызова:",
  aliases: ["</шар:1027277375123230828>"]
}, {
  name: "time",
  //text: "View the current time on the host. Other ways to call:",
  text: "Узнать время, что сейчас у хоста. Другие варианты вызова:",
  aliases: ["</time:1027277375123230826>"]
}, {
  name: "report",
  //text: "Submit a complaint about a user. For example: ++report @JuniperBot#6999 Baka. Other ways to call:",
  text: "Подать жалобу на пользователя. Например: ++report @JuniperBot#6999 Baka. Другие варианты вызова:",
  aliases: ["репорт", "</report:1027277375123230825>"]
}, {
  name: "prefix",
  //text: "View the current prefix and the standard one. The server owner can change the prefix. Other ways to call:",
  text: "Просмотр какой сейчас префикс и какой стандартный. Владелец сервера может изменить префикс. Другие варианты вызова:",
  aliases: ["</prefix:1027277375123230823>"]
}, {
  name: "ping",
  //text: "View my ping. Other ways to call:",
  text: "Просмотр моего пинга. Другие варианты вызова:",
  aliases: ["p", "пинг", "</пинг:1018117173056638986>"]
}, {
  name: "xp",
  //text: "View the amount of experience for yourself or a specified user. Currently without alternative commands",
  text: "Просмотр количества опыта у себя или у указанного пользователя. Пока без альтернативных команд",
  aliases: []
}];

/**
 * Array with command names
 */
const helpName = helpArray.map(i => i.name);

/**
 * Map with command names as keys and their information as values
 */
const help_map = new Map<string, HelpArray>();

for (const command of helpArray) {
  help_map.set(command.name, command);
  if (command.aliases.length > 0) {
    for (const alias of command.aliases) {
      help_map.set(alias, command);
    }
  }
}

/**
 * Exporting the help list and the help names
 */
export { help_map as helpList, helpName };
