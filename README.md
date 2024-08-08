# Custom Chatbot

## Before You Start
### For Local Development
- Download LM Studio [link](https://lmstudio.ai/)
- (Optional) Download lms CLI tool
- -  For Windows, Open Command Prompt and run 
```bash
cmd /c %USERPROFILE%/.cache/lm-studio/bin/lms.exe bootstrap
```
- - For Linux/macOS, Open terminal and run 
```bash  
~/.cache/lm-studio/bin/lms bootstrap
```

### Using OpenAI API Key
- Retrieve an API key for your project from OpenAI official site
NOTICE: If using OpenAI api key you will need to make minor changes to route.js file to use your key


## Getting Started
```bash
cd chatassitant
npm install
```
create an environment file to store api keys
For example,
if using the CLI type 
```bash 
touch  .env
```
and add
```OPENAI_API_KEY=<YOUR KEY HERE> ```

## Run It!
```bash
npm run dev
```

## Congratulations Your All Done!