import { Voice } from "@signalwire/realtime-api";

export interface TellThatOptions {
  to: string; // +E.164 phone number (e.g. +14085551212)
  from: string; // +E.164 phone number (e.g. +14085551212)
  greeting: string; // what to say when call is answered
  tell: string; // what to tell the person
  thanks: string; // what to say when confirmed
  pauseBeforeGreeting: number; // seconds
  confirm: boolean; // whether to confirm the message
  loops: number; // how many times to repeat the message until confirmed
  timeout: number; // how long to wait until call is answered
  confirmStrings: string; // comma-delimited list of strings that count as a confirmation
  verbose: boolean; // verbose output
}

export interface TellResult {
  error?: string;
  confirmed: boolean;
}

export async function runTellThat(options: TellThatOptions): Promise<TellResult> {
  const client = new Voice.Client({
    project: process.env.SW_PROJECT_ID,
    token: process.env.SW_TOKEN || 'set token',
    contexts: ["tellthat"],
  });
  try {
    const call = await client.dialPhone({
      from: options.from,
      to: options.to, 
      timeout: parseInt(options.timeout as unknown as string), 
    });

    if (options.verbose) {
      callLog(call, "Call Answered", call.id);
    }
    // pause a few seconds for the greeting
    await new Promise(resolve => setTimeout(resolve, options.pauseBeforeGreeting * 1000));

    let loops = parseInt(options.loops as unknown as string);
    let confirmed = false;
    while (loops >= 0) {
      if (options.confirm) {
        if (options.verbose) {
          callLog(call, "Prompting for confirmation.");
        }
        const prompt = await call.promptTTS({
          text: `${options.greeting || ''} ${options.tell}`,
          speech: {
            endSilenceTimeout: 3
          }
        });
        const { speech } = await prompt.ended();
        if (options.verbose) {
          callLog(call, `Speech: ${speech}`);
        }
        if (matchAny(speech, options.confirmStrings)) {
          callLog(call, `Got a confirmation.`);
          confirmed = true;
          loops = 0;
          const playThanks = await call.playTTS({ text: options.thanks });
          await playThanks.ended();
          break;
        } else {
          if (options.verbose) {
            callLog(call, `Did not get a confirmation. Loops: ${loops}`);
          }
          loops--;
        }
      } else {
        const playTell = await call.playTTS({ text: options.tell });
        await playTell.ended();
        loops = 0; 
      }
    }
    
    if (options.verbose) {
      callLog(call, `Call complete.`);
    }
    call.hangup();
    client.disconnect();
    return { confirmed };
  } catch (e: any) {
    if (options.verbose) {
      console.error(e);
    }
    client.disconnect();
    return { error: e.message, confirmed: false}
  }
}

export function matchAny(utterance: string | undefined, confirmStrings: string) {
  utterance = utterance?.toLowerCase();
  if (!utterance) {
    return false;
  }
  const confirmArray = confirmStrings.split(",");
  const confirmRegex = new RegExp(`(${confirmArray.join("|")})`, "i");
  const confirmMatch = utterance.match(confirmRegex);
  if (confirmMatch) {
    return true;
  } else {
    return false;
  }
}

export async function callLog(call: Voice.Call, ...args: any[]) {
  const logStr = `[Call ${call.id} To: ${call.to}]`;
  console.log(logStr, ...args);
}