# Tell That

Command Line tool to call someone and tell them something, and (optionally) get a confirmation.

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