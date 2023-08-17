# Tell That

Command Line tool to call someone and tell them something, and (optionally) get a confirmation.

Requires a [SignalWire account](https://signalwire.com/).

| Shell exit code | Meaning |
| ---------- | ---- |
| 0 | Confirmed |
| 1 | Not confirmed |
| 2 | Timeout or error |

```
Usage: tellthat

Options:
  --to [string]                   Phone number to dial (default: "+14083654354")
  --from [string]                 Caller ID (default: "+12068032583")
  --pauseBeforeGreeting [number]  Seconds to wait before greeting (default: "3")
  --greeting [string]             What to say when call is answered (default: "Hello, this is FreeSwitch Middle School")
  --tell [string]                 What you want to tell (default: "Your child, Tony, was late today. Please confirm.")
  --confirm [boolean]             Confirm the message (default: "true")
  --loops [number]                Attempts at confirmation (default: "1")
  --thanks [string]               What to say when confirmed (default: "Thank you. Have a nice day!")
  --timeout [number]              Seconds to wait until call is answered (default: "30")
  --confirmStrings [string]       Comma-delimited list of strings that count as a confirmation (default: "yes,okay,sure")
  --verbose [boolean]             Verbose output (default: "true")
  -h, --help                      display help for command
  ```

  ---

## Setting up your SignalWire account to use this utility

1. [Set up a SignalWire account](https://www.signalwire.com)
2. [Purchase a phone number](https://YOUR_SPACE.signalwire.com/phone_numbers/new) - This will be used for your CallerID
3. [Create a new API token](https://YOUR_SPACE.signalwire.com/credentials/auth_tokens/new)

### Note: _You must purchase a phone number to use as the "from" CallerID number._

## Authentication:
1. On the [home / dashboard screen](https://YOUR_SPACE.signalwire.com/dashboard) find the Project ID (looks like a UUID)
2. Use the token you created in step (3) above
