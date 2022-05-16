let thelounge = null;

class Color {
  static Red = 5;
  static LightRed = 4;
  static Brown = 7;
  static Yellow = 8;
  static Green = 3;
  static LightGreen = 9;
  static Cyan = 10;
  static LightCyan = 11;
  static Blue = 2;
  static LightBlue = 12;
  static Magenta = 6;
  static LightMagenta = 13;
}

const colors = [
  Color.Red,
  Color.LightRed,
  Color.Brown,
  Color.Yellow,
  Color.Green,
  Color.LightGreen,
  Color.Cyan,
  Color.LightCyan,
  Color.Blue,
  Color.LightBlue,
  Color.Magenta,
  Color.LightMagenta,
];

function colorStringProgressively(str, options = {}) {
  let output = "";
  let index = 0;

  for (const c of str) {
    const colorStr = colors[index % colors.length].toString().padStart(2, "0");
    output += `\x03${colorStr}${c}`;
    ++index;
  }

  return output;
}

/**
 * Returns an IRC color string from a color code ( specified as Color on top of the script )
 *
 * @param {Color} color
 */
function pickColor(color) {
  const str = color.toString().padStart(2, "0");
  return `\x03${str}`;
}

function colorString(str, color) {
  return `${pickColor(color)}${str}`;
}

async function prismCallback(client, target, command, args) {
  if (args.length === 0) {
    client.sendMessage(colorString(`Usage: /prism [message...]`, Color.Red), target.chan);
    return;
  }

  const message = args.filter((arg) => !arg.startsWith("-")).join(" ");

  client.runAsUser(colorStringProgressively(message), target.chan.id);
}

const options = {
  input: function (client, target, command, args) {
    return prismCallback(client, target, command, args);
  },
  allowDisconnected: true,
};

module.exports = {
  onServerStart: (api) => {
    thelounge = api;
    thelounge.Commands.add("prism", options);
  },
};
