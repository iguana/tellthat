import { Command } from "commander";
import { runTellThat, TellThatOptions } from "./tellthat";
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname+"/../.env" });

const program = new Command();
program
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
  .action((options: TellThatOptions) => {
    if (options.verbose) {
      console.log(`Run and tell that`, options);
    }
    runTellThat(options).then().catch(console.error);
  });

program.parse();
