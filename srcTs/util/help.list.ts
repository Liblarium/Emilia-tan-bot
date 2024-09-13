type HelpArray = { name: string, text: string, aliases: string[] };
const helpArray: HelpArray[] = [{
  name: "help",
  text: "Команда для просмотра доступных команд. Другие варианты вызова:",
  aliases: ["хелп", "помощь", "command", "commands", "команды", "</хелп:1027277375123230827>"]
}, {
  name: "newinfo",
  text: "Команда для изменения \"Информация о пользователе\". Другие варианты вызова:",
  aliases: ["nio", "</newinfo:1027277375123230822>"]
}, {
  name: "profile",
  text: "Просмотр профиля. Пока не работает, так как команда изменяется. Другие варианты вызова:",
  aliases: ["pr", "</profile:1027277375123230824>"]
}, {
  name: "шар",
  text: "Шар. Задайте вопрос и узнаете ответ от бота. Бот не ИИ, так что на тот же вопрос будет отвечать по разному. Могут быть повторения. Другие варианты вызова:",
  aliases: ["</шар:1027277375123230828>"]
}, {
  name: "time",
  text: "Узнать время, что сейчас у хоста. Другие варианты вызова:",
  aliases: ["</time:1027277375123230826>"]
}, {
  name: "report",
  text: "Подать жалобу на пользователя. Например: ++report @JuniperBot#6999 Baka. Другие варианты вызова:",
  aliases: ["репорт", "</report:1027277375123230825>"]
}, {
  name: "prefix",
  text: "Просмотр какой сейчас префикс и какой стандартный. Владелец сервера может изменить префикс. Другие варианты вызова:",
  aliases: ["</prefix:1027277375123230823>"]
}, {
  name: "ping",
  text: "Просмотр моего пинга. Другие варианты вызова:",
  aliases: ["p", "пинг", "</пинг:1018117173056638986>"]
}, {
  name: "xp",
  text: "Просмотр количества опыта у себя или у указанного пользователя. Пока без альтернативных команд",
  aliases: []
}];

const helpName = helpArray.map(i => i.name);

const help_map = new Map<string, HelpArray>();

for (const command of helpArray) {
  help_map.set(command.name, command);
  if (command.aliases.length > 0) {
    for (const alias of command.aliases) {
      help_map.set(alias, command);
    }
  }
}

export { help_map as helpList, helpName };