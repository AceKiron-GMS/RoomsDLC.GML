const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");
const { createSpinner } = require("nanospinner");

if (process.argv.length <= 2) {
    console.log("Usage: node index.js <.yyp file>");
    process.exit(1);
}

if (!process.argv[2].endsWith(".yyp")) {
    console.log("Must be a .yyp file");
    process.exit(2);
}

function parseJSONFile(fname) {
    return JSON.parse(
        fs.readFileSync(fname).toString()
            .replaceAll(/\n\s+/g, "\n")
            .replaceAll(/,\r*\n*\}/g, "}")
            .replaceAll(/,\r*\n*\]/g, "]")
    );
}

const yyp = parseJSONFile(process.argv[2]);

function getListPromptByChoicesIndex(message, choices) {
    return new Promise((res, rej) => {
        inquirer.prompt([
            {
                type: "list",
                name: "answer",
                message: message,
                choices: choices,
            }
        ]).then((answers) => res(choices.indexOf(answers.answer))).catch(rej);
    })
}

const availableRooms = yyp.RoomOrderNodes;
const availableRoomsNames = availableRooms.map((room) => room.roomId.name);

function packRoom(room) {
    const spinner = createSpinner(`Packing ${room.name}...`).start();

    const dirname = path.dirname(process.argv[2]) + "/";

    const data = parseJSONFile(dirname + room.path);
    const out = { layers: [] };

    for (const layer of data.layers) {
        if (layer.instances === undefined) continue;

        const layerData = {
            name: layer.name,
            depth: layer.depth,
            objects: []
        };

        for (const object of layer.instances) {
            layerData.objects.push({
                x: object.x,
                y: object.y,
                object: object.objectId.name
            });
        }

        out.layers.push(layerData);
    }

    if (!fs.existsSync(dirname + "/datafiles/dlc")) fs.mkdirSync(dirname + "/datafiles/dlc");

    fs.writeFileSync(dirname + "/datafiles/dlc/" + room.name + ".json", JSON.stringify(out));

    spinner.success();
}

getListPromptByChoicesIndex("What would you like to pack?", ["A single room", "All of the rooms", "Rooms starting with a prefix", "Rooms ending with a suffix"]).then(async (index) => {
    if (index == 0) { // A single room
        getListPromptByChoicesIndex("What room would you like to pack?", availableRoomsNames).then((index2) => {
            packRoom(availableRooms[index2].roomId);
        });
    }

    else if (index == 1) { // All of the rooms
        for (const room of availableRooms) {
            packRoom(room.roomId);
        }
    }

    else if (index == 2) { // Rooms starting with a prefix
        inquirer.prompt([
            {
                type: "input",
                name: "prefix",
                message: "What prefix would you like to use?"
            }
        ]).then((answers) =>  {
            for (const room of availableRooms) {
                if (room.roomId.name.startsWith(answers.prefix)) {
                    packRoom(room.roomId);
                }
            }
        });
    }

    else if (index == 3) { // Rooms ending with a suffix
        inquirer.prompt([
            {
                type: "input",
                name: "suffix",
                message: "What suffix would you like to use?"
            }
        ]).then((answers) =>  {
            for (const room of availableRooms) {
                if (room.roomId.name.endsWith(answers.suffix)) {
                    packRoom(room.roomId);
                }
            }
        });
    }

    else {
        console.log("Invalid index");
    }
});