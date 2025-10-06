//s.
//
const { program } = require('commander'); 
const fs = require('fs'); 


program
  .requiredOption('-i, --input <path>', 'Input JSON file') 
  .option('-o, --output <path>', 'Output file') 
  .option('-d, --display', 'Display result in console') 
  .option('-h, --humidity', 'Show humidity (Humidity3pm field)') 
  .option('-r, --rainfall <value>', 'Filter by rainfall greater than value', parseFloat); 

program.parse(process.argv);
const options = program.opts();


if (!options.input) {
  console.error('Please, specify input file');
  process.exit(1);
}
if (!fs.existsSync(options.input)) {
  console.error('Cannot find input file');
  process.exit(1);
}


const rawData = fs.readFileSync(options.input, 'utf8');
const data = JSON.parse(rawData);


let result = data;

// фільтр по опадах, якщо задано параметр -r
if (options.rainfall !== undefined) {
  result = result.filter(item => item.Rainfall > options.rainfall);
}


const output = result.map(item => {
  const rainfall = item.Rainfall ?? 'N/A';
  const pressure = item.Pressure3pm ?? 'N/A';
  const humidity = options.humidity ? (item.Humidity3pm ?? 'N/A') : '';
  return `${rainfall} ${pressure}${humidity ? ' ' + humidity : ''}`;
}).join('\n');


if (options.output) {
  fs.writeFileSync(options.output, output);
}
if (options.display) {
  console.log(output);
}
