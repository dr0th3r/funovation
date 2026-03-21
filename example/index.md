# Realtime Cooking Assistant - Quick Start Guide

This project provides a standalone Node.js script to interact with the OpenAI Realtime API as a **Cooking Assistant**.

## Prerequisites
- Node.js (v18 or higher)
- An OpenAI API Key

## Setup Steps

1. **API Key**: Ensure you have an `.env` file in the root directory with your key:
   ```env
   OPENAI_API_KEY=your_actual_key_here
   ```

2. **Install Dependencies**: Run the following command to install the required packages:
   ```bash
   npm install ws dotenv
   ```

3. **Run the Assistant**: Use Node.js to start the script:
   ```bash
   node index.mjs
   ```

## Interaction
- The assistant is configured with a **Cooking Assistant** persona.
- Type your messages in the terminal and press **Enter**.
- Type `exit` or press `Ctrl + C` to stop the session.

## Notes
- This script uses **WebSockets** for communication.
- It is designed to be easily integrated into other applications (like SvelteKit) by importing the `CookingAssistant` class.
