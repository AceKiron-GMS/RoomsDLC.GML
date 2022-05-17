const fs = require("fs");

if (process.argv.length <= 2) {
    console.log("Usage: node index.js <.yyp file>");
    process.exit(1);
}

if (!process.argv[2].endsWith(".yyp")) {
    console.log("Must be a .yyp file");
    process.exit(2);
}

const yyp = JSON.parse(
    fs.readFileSync(process.argv[2]).toString()
        .replaceAll(/\n\s+/g, "\n")
        .replaceAll(/,\r*\n*\}/g, "}")
        .replaceAll(/,\r*\n*\]/g, "]")
);

const availableRooms = yyp.RoomOrderNodes;

console.log(availableRooms.map((room) => room.roomId.name));

// getListPromptByChoicesIndex("What would you like to pack?", ["A single room", "All of the rooms", "Rooms starting with a prefix", "Rooms ending with a suffix"]).then((index) => {
//     if (index == 0) {

//     }
// });