# Narrawise — AI Chat Frontend

An Angular frontend prototype for an AI chat experience. The repository includes a chat workspace, conversation sidebar, message composer, model selector and theme-related UI services.

## Current interface

- Chat area with message input and conversation display
- Sidebar and conversation navigation
- AI model selector UI
- Conversation and message TypeScript models
- Theme service and shared chat state
- Angular standalone components

## Tech stack

- Angular 19
- TypeScript
- RxJS
- Angular Router
- Font Awesome
- Marked (Markdown rendering)

## Getting started

**Requirements:** Node.js compatible with Angular 19 and npm.

```bash
git clone https://github.com/Aryan96250/Narrawise-frontend.git
cd Narrawise-frontend
npm ci
npm start
```

Open the local URL printed by Angular CLI (typically `http://localhost:4200`).

## Scripts

| Command | Description |
| --- | --- |
| `npm start` | Start the Angular development server |
| `npm run build` | Build the application |

## Project structure

```text
src/app/
├── components/       # AI selector, chat area, header, input and sidebar
├── models/           # AI model, conversation and message types
└── services/         # AI, chat and sidebar services
```

## Important implementation note

The current AI service contains a configured backend URL and a local mock-response path. A working end-to-end AI experience therefore depends on a compatible backend being available and configured for the environment. Before deploying, move service endpoints into environment configuration, use HTTPS, and avoid exposing credentials in frontend code.

The model selector is currently a frontend selection interface; selecting a model in the UI does not by itself provide access to that model's external API.

## Security

Do not commit API keys, tokens, private credentials or real conversation data. Configure backend access and CORS on the server rather than embedding secrets in the browser application.

## Author

**Aryan Chauhan** · [GitHub](https://github.com/Aryan96250)
