# Contributing to Aetheris

Thanks for your interest in contributing to Aetheris! This guide will help you get started.

## 📋 Before you start

Please make sure you've read our [Code of Conduct](CODE_OF_CONDUCT.md). All contributors are expected to follow it.

## 🐛 Reporting bugs

Before opening a new issue, please check whether the bug has already been reported in [Issues](../../issues).

When reporting a bug, please include:
- A short description of the problem
- Steps to reproduce the bug
- Expected vs actual behavior
- Screenshots (if relevant)
- Node.js version you're using

## 💡 Suggesting new features

Open a new issue with the `enhancement` label, and explain:
- What feature you're proposing
- Why this feature would be useful
- Example use case (if any)

## 🔧 Setting up your development environment

1. Fork this repository
2. Clone your fork:
   ```bash
   git clone https://github.com/USERNAME/aetheris-bot.git
   cd aetheris-bot
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file (see `README.md` for the list of required environment variables)
5. Run the bot:
   ```bash
   node index.js
   ```

## 🌿 Contribution workflow

1. Create a new branch from `main`:
   ```bash
   git checkout -b feature/feature-name
   ```
2. Make your changes
3. Make sure the bot still runs normally without errors
4. Commit with a clear message:
   ```bash
   git commit -m "feat: add X feature"
   ```
5. Push to your fork:
   ```bash
   git push origin feature/feature-name
   ```
6. Open a Pull Request to the `main` branch of this repository

## 📝 Commit message convention

Use the following format for commit messages:
- `feat:` — new feature
- `fix:` — bug fix
- `docs:` — documentation changes
- `refactor:` — code changes that don't alter functionality
- `chore:` — minor changes/maintenance (dependencies, config, etc.)

Example: `feat: add /leaderboard command for weekly ranking`

## 📁 Project structure

New commands should be placed in the appropriate category folder inside `commands/`. See `README.md` for a full overview of the folder structure.

## ✅ Pull Request checklist

- [ ] Code has been manually tested and runs without errors
- [ ] No credentials/secrets are committed (check `.env`, API keys, tokens)
- [ ] Commit messages follow the convention above
- [ ] PR description explains what was changed and why

## ❓ Questions?

If you have any questions about contributing, feel free to open an issue with the `question` label, or contact the maintainer at **raihan.ramandha@nexalab.my.id**.