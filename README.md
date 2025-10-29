# Forge

Forge is a powerful prompt builder tool designed to help developers transform their ideas into well-structured prompts for AI coding assistants like Cursor, Replit, and other AI coding agents. Whether you're a beginner trying to articulate your coding challenges or an experienced developer looking to optimize your AI interactions, Forge provides an intuitive interface to craft effective prompts.

## Story Behind Forge

During one of our live sessions at the Programmify Internship Program (PIP4) on October 28th, 2025, mentor and AI engineer Vincent Agunda was delivering a presentation on Large Language Models (LLMs) and AI coding assistants. A student asked if there was a prompt builder that could help him turn his ideas into prompts which he could then paste for Cursor, Replit, or any AI coding agents. The program director took up the challenge to build it overnight. That's how Forge was born.

## Technologies Used

This project is built with:

- Vite
- TypeScript
- React
- Tailwind CSS
- shadcn/ui

## Getting Started

Follow these steps to run the project locally:

1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/forge.git
   ```

2. Navigate to the project directory:
   ```sh
   cd forge
   ```

3. Install the necessary dependencies:
   ```sh
   npm install
   # or
   bun install
   ```

4. Start the development server:
   ```sh
   npm run dev
   # or
   bun run dev
   ```

5. Open your browser and visit `http://localhost:8080` to see the application.

## Contributing

We welcome contributions from the community! Here's how you can get involved:

1. Fork the repository
2. Create a new branch for your feature or bug fix
3. Make your changes and test thoroughly
4. Submit a pull request with a clear description of your changes

### Development Guidelines

- Follow the existing code style and conventions
- Write clear commit messages
- Add tests for new features when applicable
- Ensure all tests pass before submitting a pull request

### Project Structure

- `src/` - Source code for the application
- `public/` - Static assets
- `components.json` - Configuration for shadcn/ui components
- `vite.config.ts` - Vite configuration
- `tailwind.config.ts` - Tailwind CSS configuration

## Building for Production

To build the project for production:

```sh
npm run build
# or
bun run build
```

## Deployment

The project is configured to be easily deployed to platforms like Netlify, Vercel, or any static hosting service that supports Vite applications.

## License

This project is open source and available under the MIT License.

## Support

If you have any questions or need help with the project, feel free to open an issue in the repository.
