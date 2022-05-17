const inquirer = require("inquirer");

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