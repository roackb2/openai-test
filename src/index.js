#! /usr/bin/env node

const { program } = require('commander')
const { textCompletion } = require('./lib/text')
const { createImage, imageVariations } = require('./lib/image')

program
  .command('completion')
  .version('0.1.0')
  .description('Text completion')
  .argument('<prompt>', 'Prompt of text to complete')
  .action(textCompletion)

program
  .command('image-create')
  .version('0.1.0')
  .description('Create images')
  .argument('<prompt>', 'Prompt of the image to create')
  .option('-n, --n <n>', 'Number of images to create', 3)
  .action(createImage)

program
  .command('variation')
  .version('0.1.0')
  .description('Image variations')
  .argument('<fileName>', 'File name of the image to generate variations in the input folder')
  .action(imageVariations)

program.parse()