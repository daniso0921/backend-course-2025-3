// Імпортуємо необхідні модулі
const { program } = require('commander'); // для роботи з аргументами
const fs = require('fs'); // для роботи з файлами

// --- Налаштування параметрів командного рядка ---
program
  .requiredOption('-i, --input <path>', 'Input JSON file') // шлях до JSON
  .option('-o, --output <path>', 'Output file') // куди зберігати результат
  .option('-d, --display', 'Display result in console') // показати у консолі
  .option('-h, --humidity', 'Show humidity (Humidity3pm field)') // показати вологість
  .option('-r, --rainfall <value>', 'Filter by rainfall greater than value', parseFloat); // фільтр по опадах

program.parse(process.argv);
const options = program.opts();

// --- Перевірка наявності вхідного файлу ---
if (!options.input) {
  console.error('Please, specify input file');
  process.exit(1);
}
if (!fs.existsSync(options.input)) {
  console.error('Cannot find input file');
  process.exit(1);
}

// --- Читаємо JSON ---
const rawData = fs.readFileSync(options.input, 'utf8');
const data = JSON.parse(rawData);

// --- Обробка даних ---
let result = data;

// фільтр по опадах, якщо задано параметр -r
if (options.rainfall !== undefined) {
  result = result.filter(item => item.Rainfall > options.rainfall);
}

// --- Формування результату ---
const output = result.map(item => {
  const rainfall = item.Rainfall ?? 'N/A';
  const pressure = item.Pressure3pm ?? 'N/A';
  const humidity = options.humidity ? (item.Humidity3pm ?? 'N/A') : '';
  return `${rainfall} ${pressure}${humidity ? ' ' + humidity : ''}`;
}).join('\n');

// --- Вивід або запис у файл ---
if (options.output) {
  fs.writeFileSync(options.output, output);
}
if (options.display) {
  console.log(output);
}
