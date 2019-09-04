#!/usr/bin/env node
const inquirer = require('inquirer');
const chalk = require('chalk');
const figlet = require('figlet');
const hbs = require('handlebars');
const ChangeCase = require('change-case');
const { readFileSync, outputFile } = require('fs-extra');
const pluralize = require('pluralize');

async function init() {
  console.log(chalk.bold.red(figlet.textSync('NestJS Generator')));
}

async function ask() {
  const questions = [
    {
      type: 'list',
      name: 'TYPE',
      message: 'Which file would you create?',
      choices: ['Controller', 'Model', 'DTO', 'Middleware', 'Service']
    },
    {
      type: 'input',
      name: 'FILENAME',
      message: 'What is the file name?'
    }
  ];
  return inquirer.prompt(questions);
}

async function createFile(type, name) {
  let fileInputPath = null;
  let fileOutputPath = null;

  switch(type) {
    case 'Controller':
      fileInputPath = __dirname + '/templates/controller.hbs';
      fileOutputPath = `${process.cwd()}/src/controllers/${ChangeCase.paramCase(name)}.controller.ts`;
      break;
    case 'Model':
      fileInputPath = __dirname + '/templates/model.hbs';
      fileOutputPath = `${process.cwd()}/src/models/${ChangeCase.paramCase(name)}.ts`;
      break;
    case 'DTO':
      fileInputPath = __dirname + '/templates/dto.hbs';
      fileOutputPath = `${process.cwd()}/src/dto/${ChangeCase.paramCase(name)}.dto.ts`;
      break;
    case 'Middleware':
      fileInputPath = __dirname + '/templates/middleware.hbs';
      fileOutputPath = `${process.cwd()}/src/middleware/${ChangeCase.paramCase(name)}.middleware.ts`;
      break;
    case 'Service':
      fileInputPath = __dirname + '/templates/service.hbs';
      fileOutputPath = `${process.cwd()}/src/services/${ChangeCase.paramCase(name)}.service.ts`;
      break;
  }

  const params = {
    NameLower: ChangeCase.lowerCase(name),
    NamePascal: ChangeCase.pascalCase(name),
    NameParam: ChangeCase.paramCase(name),
    NameSnake: ChangeCase.snakeCase(name),
    NameSnakes: pluralize(ChangeCase.snakeCase(name)),
  }

  const content = readFileSync(fileInputPath, 'utf8'); // load template file to string
  const template = hbs.compile(content); // compile using handlebars
  const result = template(params); // replace the template
  await outputFile(fileOutputPath, result); // write to file and create directory if doesn't exists

  return fileOutputPath;
}

async function run() {
  // show script introduction
  init();

  // ask questions
  const { TYPE, FILENAME } = await ask();

  // generate template
  const filePath = await createFile(TYPE, FILENAME);
  console.log(chalk.green(`File generated at ${filePath}`));
}

run();