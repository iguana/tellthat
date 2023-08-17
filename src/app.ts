import { Command } from "commander";
import { runTellThat, TellThatOptions } from "./tellthat";
import * as dotenv from "dotenv";
import os from 'os';
import * as fs from 'fs';
import Papa from 'papaparse';

dotenv.config({ path: os.homedir() + "/.tellthat.env" });


interface JustCommandOptions {
  csv: string;
  concurrency: number; // how many calls to make at once, default 1
}

type TellThatCommand = JustCommandOptions & TellThatOptions;

const program = new Command();
program
  .option('--csv [string]', 'CSV file to read')
  .option('--concurrency [number]', 'How many calls to make at once', '1')
  .option('--to [string]', 'Phone number to dial', '+14083654354')
  .option('--from [string]', 'Caller ID', '+12068032583')
  .option('--pauseBeforeGreeting [number]', 'Seconds to wait before greeting', '3')
  .option('--greeting [string]', 'What to say when call is answered',
    'Hello, this is FreeSwitch Middle School')
  .option('--tell [string]', 'What you want to tell', 
    'Your child, Tony, was late today. Please confirm.')
  .option('--confirm [boolean]', 'Confirm the message', 
    'true')
  .option('--loops [number]', 'Attempts at confirmation', '1')
  .option('--thanks [string]', 'What to say when confirmed', 
    'Thank you. Have a nice day!')
  .option('--timeout [number]', 'Seconds to wait until call is answered', '30')
  .option('--confirmStrings [string]', 'Comma-delimited list of strings that count as a confirmation', 
    'yes,okay,sure')
  .option('--verbose [boolean]', 'Verbose output', 'true')
  .action(async (options: TellThatCommand) => {
    if (options.verbose) {
      console.log(`Run and tell that`, options);
    }
    // There are 2 modes: CSV and single call. In CSV mode, we read a CSV file and 
    // make calls concurrently.
    if (options.csv) {
      await parseCSV(options.csv, async (items: TellThatOptions[]) => {
        const results = await processConcurrently(items, runTellThat, options.concurrency);
        console.log(results); // TODO: generate report
      });
    } else {
    // In single call mode, we make a single call and use Shell return codes to indicate
    // success/failure and if we confirmed the message.
      const result = await runTellThat(options);
      if (result.error) {
        process.exit(2);
      } else if (result.confirmed) {
        process.exit(0);
      } else {
        process.exit(1);
      }
    }
  });

program.parse();

async function processConcurrently<T>(
  items: T[],
  worker: (item: T) => Promise<any>,
  concurrency: number
): Promise<any[]> {
  const results: any[] = [];
  let index = 0;

  while (index < items.length) {
    const chunk = items.slice(index, index + concurrency);
    const promises = chunk.map((item) => worker(item));
    const chunkResults = await Promise.all(promises);
    results.push(...chunkResults);
    index += concurrency;
  }

  return results;
}

function parseCSV(filePath: string, resultHandler: (items: TellThatOptions[]) => void): void {
  const fileContent = fs.readFileSync(filePath, 'utf8');

  Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        resultHandler(result.data as TellThatOptions[]);
      },
      error: (error: Error) => {
          console.error("Error:", error.message);
      }
  });
}
