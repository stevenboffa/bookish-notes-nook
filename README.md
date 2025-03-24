
# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/533e39f2-9c6b-4832-86e4-2c5b3c425f90

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/533e39f2-9c6b-4832-86e4-2c5b3c425f90) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

## Environments (Staging & Production)

This project supports both staging and production environments for Supabase:

### Setting up Staging Environment

1. Create a new Supabase project to serve as your staging environment
2. Get your staging project anon key from the Supabase dashboard:
   - Go to https://supabase.com/dashboard
   - Select your staging project
   - Go to Project Settings → API
   - Copy the "anon public" key
3. Create a `.env.local` file in the project root with the following variables:
   ```
   VITE_USE_STAGING=true
   VITE_SUPABASE_STAGING_URL=your_staging_project_url
   VITE_SUPABASE_STAGING_KEY=your_staging_project_anon_key
   ```

Note: The project is currently configured to use the staging environment by default.

### Testing the Environment

You can verify which environment you're using in several ways:
1. Check your browser's console for a message like: "🔌 Supabase Environment: STAGING"
2. Look for the environment indicator in the bottom-right corner of the app (in development mode)
3. Check network requests to see which Supabase URL they're going to

### Running in Staging Mode
```sh
# Run the application using the staging environment (default)
npm run dev
```

### Running in Production Mode
```sh
# Run the application using the production environment
VITE_USE_STAGING=false npm run dev
```

### Deploying to Production

When you deploy the application:

1. For staging deployment: No additional environment variables needed (staging is default)
2. For production deployment: Set `VITE_USE_STAGING=false` in your deployment environment

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with .

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/533e39f2-9c6b-4832-86e4-2c5b3c425f90) and click on Share -> Publish.

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)
