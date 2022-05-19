let thelounge = null;
let USAGE = `
Usage: /prism [-rwmbkg] [-re] [message...]

-r, -random: Randomize colors
-m, -me: Prepend /me to your message
-b, -background, : Randomize background color as well
-k, -black: Black background
-n, -nocolor: disable coloration
-re, -reverse: Reverse string

-g, -gogolize: Gogolize string 

> gogolize("Bonjour, mon nom est SakiiR")
'BoNjOuR, mOn nOm eSt sAkIiR'
`;

function parseOptions(args) {
  const options = args
    .filter((arg) => arg.startsWith("-"))
    .map((o) => o.replace(/^\-/gi, ""));

  const hasRandom = !!options.find((o) => o === "r" || o === "random");
  const hasMe = !!options.find((o) => o === "m" || o === "me");
  const hasReverse = !!options.find((o) => o === "re" || o === "reverse");
  const hasChaoticBgColors = !!options.find(
    (o) => o === "b" || o === "background"
  );
  const hasBlackBg = !!options.find((o) => o === "k" || o === "black");
  const hasGolgolize = !!options.find((o) => o === "g" || o === "gogolize");
  const hasDisableColoration = !!options.find(
    (o) => o === "n" || o === "nocolor"
  );

  return {
    hasRandom,
    hasMe,
    hasReverse,
    hasChaoticBgColors,
    hasBlackBg,
    hasGolgolize,
    hasDisableColoration,
  };
}

class Color {
  static Black = 1;
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

function pickRandomColor() {
  return colors[getRandomInt(colors.length)];
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function colorMessage(str, options = {}) {
  let output = "";
  let index = 0;

  for (const c of str) {
    let colorStr = colors[index % colors.length].toString().padStart(2, "0");
    if (options.hasRandom) {
      colorStr = pickRandomColor().toString().padStart(2, "0");
    }
    output += `\x03${colorStr}`;

    if (options.hasBlackBg) {
      output += ",";
      output += Color.Black.toString().padStart(2, "0");
    } else if (options.hasChaoticBgColors) {
      output += ",";
      output += pickRandomColor().toString().padStart(2, "0");
    }

    output += `${c}`;

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

function reverseStr(str) {
  return str.split("").reverse().join("");
}

function gogolize(str) {
  return str
    .split("")
    .map((c, i) => (i % 2 == 0 ? c.toUpperCase() : c.toLowerCase()))
    .join("");
}

async function prismCallback(client, target, command, args) {
  if (args.length === 0) {
    for (const line of USAGE.split("\n")) {
      client.sendMessage(colorString(line, Color.Red), target.chan);
    }
    return;
  }

  const options = parseOptions(args);

  let message = args.filter((arg) => !arg.startsWith("-")).join(" ");

  if (options.hasGolgolize) message = gogolize(message);

  if (options.hasReverse) message = reverseStr(message);

  if (!options.hasDisableColoration) message = colorMessage(message, options);

  if (options.hasMe) {
    message = `/me ${message}`;
  }

  client.runAsUser(message, target.chan.id);
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
