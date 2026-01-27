# How to run Organized local environment – dependencies, backend, and frontend.

**We also have a [video version of this guide](https://www.youtube.com/watch?v=duw2TPJg0wY). It's easy to follow and relatively short.**

Hello everyone! Thank you so much for your support in developing the Organized application. In this guide, we will guide you through the steps to set up the local environment to run the application locally. This video covers many steps, but by following along, you'll successfully set up everything and will be ready to start coding.

## Part 1: Dependencies

Let's start by looking at what you need to set up the environment. We'll begin completely from scratch to make it easy to understand how to install all the necessary dependencies.

### Install Git

_The first dependency is Git, our version control system. You can download it from [git-scm.com](https://git-scm.com/download)._

1. Visit the Git website and select the version suitable for your operating system. For this guide, we'll demonstrate on Windows, but you can adapt the instructions for your OS.
2. Now, download Git. Once the download is finished, we’re ready to install it.

_Now, let’s proceed with the installation of Git._

1. Navigate to the folder location and begin the installation process.
2. Please wait while the installation completes.
3. Excellent, Git is now installed.

### Install Node.js

_There are two valid options for installing Node.js on your system. You can either use an application called [Node Version Manager for Windows (NVM)](https://github.com/coreybutler/nvm-windows), or directly [download Node.js](https://nodejs.org/en), especially if you’re using Linux or macOS. Both methods are acceptable, so you can choose the one that suits you best._

1. Download the NVM
2. Install it using all the default options for the installation.

### Install Node Version Manager

1. Before installing, let’s check the current Long Term Support (LTS), version of Node.js on the [official Node.js website](https://nodejs.org/en). As of now, the LTS version is `20.11.0`.
2. Back in the Command Prompt, type `nvm install 20.11.0`(or the latest version avaible at the time you are reading this) to start downloading that version of Node.js from the official website. We will also install npm, the package manager for Node.js.
3. After installation, open Command Prompt and type `nvm use 20.11.0` to use the installed version. Make sure you have admin privileges for setup.

And that’s it! Node.js is now installed on our computer.

### Install Visual Studio Code

_Next, we’ll move on to our code editor. We use Visual Studio Code, or VS Code, as Integrated Development Environment (IDE), but feel free to use any IDE you’re comfortable with._

1. To download VS Code, visit the [official VS Code website](https://code.visualstudio.com/download) and select the installer that suits your needs.
2. For this guide, we’ll be downloading the System Installer.
3. Let’s install it. Please make sure to check the following "Open with Code" Additional Tasks to make it easier to open folders in the VS Code. But even without doing so, you will be able to open the folders directly from VS Code.
4. Open the VS Code.

_When you open VS Code for the first time, you'll be asked to personalize its appearance. The IDE will also offer helpful coding tips and suggestions. Feel free to check out these options and click "Mark as done" when you're done._

### Install OpenJDK

_Finally, our last dependency for this initial setup is Java. We specifically need the OpenJDK version, as it’s required by the Firebase Emulators._

1. Go to the [OpenJDK download page](https://www.oracle.com/java/technologies/downloads/) and select the version you prefer. As of now, versions 23 and 21 are available. We'll choose version 23 in this guide, but version 21 will work equally well, as Firebase Emulators need at least version 11.
2. Now, proceed to download OpenJDK, version 23.
3. Let's go ahead with the installation using the default options.

### Double-check all dependencies

_Now, let’s do a quick check to confirm that everything has been installed correctly._

1. Open a Command Prompt and type `java --version`. You should see the version you’ve just installed. If you see any errors, try reinstalling it by repeating the previous step once again.
2. We can perform similar checks for Node.js and npm. Type `node -v` to check the Node.js version, and `npm -v` to check the npm version. If everything is correct, you should see the exact versions you’ve installed.

_With that, all our major dependencies are now installed._

## Part 2: Backend API

Next, let's proceed to run the local backend API server. This server handles login, Firebase sync, end-to-end encryption, and some other essential features.

### Clone GitHub projects

1. First thing first, let’s create a new folder in your file system to store both the backend and frontend projects.
2. Once you’ve created the folder, right-click within it and select ‘Open Git Bash’. You can also use Terminal or Command Prompt if you prefer.
3. The next step is to clone each of these projects using the `git clone` command. Using the direct GitHub repository URL from the [sws2apps organization](https://github.com/sws2apps), or you can also clone from your own fork if you already have one.
4. Let’s start by cloning the [API project](https://github.com/sws2apps/sws2apps-api). This should be a quick process as the **sws2apps-api** repository is relatively small.
5. With the API project cloned, let’s move on to the [frontend project](https://github.com/sws2apps/organized-app), the **Organized app** itself. Please note that this repository is quite large so the cloning process may take more time.
6. Great! Both repositories have been successfully cloned.
7. Next, open the `sws2apps-api` folder, right-click within it, and select **Open with Code.** This is a VS Code shortcut that we enabled during the VS Code installation.

_When you open it for the first time, you'll need to trust yourself as the author of the files in this folder. There might be a prompt to install a Dev Containers extension, but it's not necessary for local development, so feel free to ignore it._

### Install Visual Studio Code extensions

_Some extensions can make development easier. Let's install them!_

1. The first extension is **Prettier,** a useful format that supports JavaScript, HTML, and TypeScript files. Wait for the installation to complete.
2. The second extension we need is **ESLint,** a tool from Microsoft that helps us write error-free code. Prettier and ESLint work together to help us write better code for our applications.

### Prepare Firebase environment

_Before booting up the API server, let’s prepare our environment._

1. In VS Code, open a new Terminal by navigating to **View** and selecting **Terminal.** Wait for the Terminal window to load completely.
2. With the terminal ready, let’s install the Firebase CLI using the command `npm i -g firebase-tools`. This command installs the Firebase CLI globally.
3. Once installed, you might receive a notice from npm about a new minor version being available. If so, let’s install that quickly.
4. To check if the Firebase CLI was installed correctly, use the command `firebase --version`. It should display the version of Firebase you just installed. For now, it’s 13.12.0.
5. Now install the backend dependencies by running `npm i` inside the `sws2apps-api` folder. This will start the installation of all the project’s dependencies.

#### Set up environment variables for the backend API

Firebase Emulators require a storage rule file to set up Firebase Storage locally.

1. To get this file, use the command `cp storage.rules.example storage.rules`. That’s done! Now we have our own storage rules for Firebase.
2. Let’s also make a copy of the environment file example, using the command `cp .env.example .env`.
3. Additionally, create .firebaserc file with `cp .firebaserc.example .firebaserc` command.

#### Start the Firebase emulators

We can now finally proceed to the next step – starting emulators.

1. To do this, type `npm run start:emulators`, and wait for it to start.
2. Awesome, the Firebase Emulators are now running perfectly.
3. Next, open **a new Terminal** in the same VS Code project. On this new Terminal, we’ll start the API project itself. Remember, the first Terminal still has the Firebase Emulators running. These both terminals should be running simultaneously.
4. Start the dev server by typing `npm run dev`.

_Great, the dev server is now running without errors, indicating it has successfully connected to the Firebase Emulators._

_That completes the setup of the backend project for the local environment. The API is now ready to be used._

## Part 3: Frontend

1. Open the frontend project folder (`organized-app` repo) in VS Code and open a new Terminal.
2. Install the dependencies by typing `npm i`.
3. After a while, installation is complete.

### Setup environment variables for frontend

_Now, let’s add the required environment variables for the frontend application._

1. Create an `.env` file for this frontend project. You can do it starting from the example file `cp .env.example .env`.
2. (OPTIONAL) **TEST MODE**: By setting `VITE_APP_MODE="TEST"`, you configure the application to run in a test mode, which includes **pre-populated data** and configurations that facilitate testing and demonstration purposes.

_All the dependencies were installed, and the environment variables are all ready. We can now start the frontend application._

### Run the frontend app

1. Type `npm run dev` to start the frontend application.
2. Well done! The dev server for the frontend application is now ready. Let’s open it in the browser.

### Check if API is working

_Good. The frontend app is working. Let’s test a few functions to ensure that the frontend can communicate properly with the backend API. We’ll see if it can connect to the local backend API that we set up earlier._

Let’s proceed on this journey as if we were a new user:

1. On this page, we’ll select the option for ‘Baptized brother’ and accept the agreements.
2. Next, we’ll continue with our authentication. Enter any email (there’s no verification if the email is real or not). Choose your preferred method, then click ‘Send link’. **Please note that the email won’t be sent to a real email address. Instead, simply click a link displayed on the page, simulating the process of clicking a link from an email to complete your authentication.** Now, let’s click ‘Log in’.
3. Great, the authentication for your account is now complete.
4. Now, let’s create a congregation. Enter a fictitious first and last name.
5. Let’s select a country for our testing. Then, find a congregation using a congregation name or number and click ‘Create congregation’.
6. Now, you’ll be prompted to create an encryption code. Remember, in this new version, **the encryption code is required** after creating your congregation account.
7. Once this is set, you’ll be directed to the Dashboard page of the Organized app.

This is the ‘Organized’ Dashboard page. From this page, you can access various features of the app as they are developed by our team.

### Congratulations and happy coding!

If you have more questions or face any problems not covered in this guide, head to our GitHub repository Discussions to ask! Your contributions and support for the Organized app are highly appreciated!
