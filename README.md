# thelounge-plugin-prism

Simple plugin for the irc client [thelounge](https://thelounge.chat) that allows you to apply rainbow colors to a message

# Installation

- If you have installed thelounge via NPM/Yarn:

  `thelounge install thelounge-plugin-prism`

- If you have installed thelounge via source:

  `node index.js install thelounge-plugin-prism`

# Usage

`/prism [message...]` -> Color your message

```
/prism -b -g -r 'Notfound c'est bon je peux prism depuis thelounge'
```

![screenshot](screenshot.png)

# Development

Install the plugin locally using a local URI ( from the thelounge repository ):

```
node index.js install file:///home/sakiir/code/thelounge-plugin-prism
```
