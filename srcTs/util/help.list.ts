const helpArray: { name: string, text: string, aliases: string[] }[] = [{
  name: "help",
  text: "Команда для просмотра доступных команд. Другие варианты вызова:",
  aliases: ["help", "хелп", "помощь", "command", "commands", "команды", "</хелп:1027277375123230827>"]
}, {
  name: "newinfo",
  text: "Команда для изменения \"Информация о пользователе\". Другие варианты вызова:",
  aliases: ["newinfo", "nio", "</newinfo:1027277375123230822>"]
}, {
  name: "profile",
  text: "Просмотр профиля. Пока не работает, так как команда изменяется. Другие варианты вызова:",
  aliases: ["profile", "pr", "</profile:1027277375123230824>"]
}, {
  name: "шар",
  text: "Шар. Задайте вопрос и узнаете ответ от бота. Бот не ИИ, так что на тот же вопрос будет отвечать по разному. Могут быть повторения. Другие варианты вызова:",
  aliases: ["шар", "</шар:1027277375123230828>"]
}, {
  name: "time",
  text: "Узнать время, что сейчас у хоста. Другие варианты вызова:",
  aliases: ["time", "</time:1027277375123230826>"]
}, {
  name: "report",
  text: "Подать жалобу на пользователя. Например: ++report @JuniperBot#6999 Baka. Другие варианты вызова:",
  aliases: ["report", "репорт", "</report:1027277375123230825>"]
}, {
  name: "prefix",
  text: "Просмотр какой сейчас префикс и какой стандартный. Владелец сервера может изменить префикс. Другие варианты вызова:",
  aliases: ["prefix", "</prefix:1027277375123230823>"]
}, {
  name: "ping",
  text: "Просмотр моего пинга. Другие варианты вызова:",
  aliases: ["ping", "p", "пинг", "</пинг:1018117173056638986>"]
}, {
  name: "xp",
  text: "Просмотр количества опыта у себя или у указанного пользователя. Пока без альтернативных команд",
  aliases: ["xp"]
}];

const help_map: Record<string, string> = {};
const helpName = helpArray.map(i => i.name);

for (const commandName of helpArray) {
  const commandAliases = commandName.aliases;
  const aliasesLength = commandAliases.length;
  for (const alias of commandAliases.slice(0, (aliasesLength === 1 ? 1 : aliasesLength - 1))) {
    if (!(alias in help_map)) {
      help_map[alias] = `${commandName.text} ${commandAliases.filter(f => f !== alias).map(i => i.toString()).join(", ")}`;
    }
  }
}

export { help_map as helpList, helpName };