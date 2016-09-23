#/bin/bash!
# Navigate to the folder in which you want the treasurehunt subfolder stored

REDIRECT=/dev/null

while getopts ":v" opt; do
    case "$opt" in
        v)
            REDIRECT=/dev/stdout
            ;;
        *)
            echo "Invalid option: -$OPTARG"
            exit 5
    esac
done

echo "Confirm that you have Xcode 7.3.* or 8.* (Latest version)"
echo "You will need this to run the application in a simulator"
echo "Press ENTER when you have opened it and installed the tools (only if you have not launched it yet)"
read newLine


echo "The program may ask you for a password."
echo "This is just to make sure your /usr/local and /Library/Caches/Homebrew are under the control of the current user (you)"
echo "Press Y and ENTER if you want to continue, or anything else and ENTER to exit the program"
read feedback

if [[ "$(echo $feedback | tr '[:upper:]' '[:lower:]')" != "y" ]]; then
    exit 1
fi

# Make sure homebrew can install things
echo "Chown-ing the /usr/local"
sudo chown -R "$USER":admin /usr/local &> $REDIRECT


if [[ $? != 0 ]]; then
    echo "ERROR: Encountered an error! Make sure you typed in your password and that you have administrator privalages"
    exit $?
fi

echo Checking brew...
brew help &> $REDIRECT
if [[ $? != 0 ]]; then
    echo Installing Homebrew
    /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

    if [[ $? != 0 ]]; then
        echo "ERROR: Failed to install cocoapods!"
        exit $?
    fi

    brew update

    if [[ $? != 0 ]]; then
        echo "ERROR: Failed to update homebrew!"
    fi
echo Installed
else
    echo Already installed. Updating...
    brew update

    if [[ $? != 0 ]]; then
        echo "ERROR: Failed to update homebrew!"
    fi
fi

# Making sure we own the homebrew
echo "Chown-ing the /Library/Caches/Homebrew"
sudo chown -R "$USER":admin /Library/Caches/Homebrew &> $REDIRECT

echo Checking npm...
npm -v &> $REDIRECT

if [[ $? != 0 ]]; then
    echo "Installing..."
    brew install npm && npm install -g react-native-cli
    if [[ $? != 0 ]]; then
        echo "ERROR: Failed to install npm!"
        exit $?
    fi
    echo Installed
else
    echo "Already installed. Installing CLI..."
    npm install -g react-native-cli 2> $REDIRECT
    echo "Installed"
fi

echo "Checking Cocoapods..."
pod &> $REDIRECT

if [[ $? != 0 ]]; then
    echo Installing...
    brew install cocoapods
    if [[ $? != 0 ]]; then
        echo "ERROR: Failed to install cocoapods!"
        exit $?
    fi
    echo Installed
else
    # In case they have an outdated version
    brew upgrade cocoapods &> $REDIRECT
fi

echo "Checking Watchman..."
watchman -v &> $REDIRECT

if [[ $? != 0 ]]; then
    echo Installing...
    brew install watchman
    if [[ $? != 0 ]]; then
        echo "ERROR: Failed to install watchman!"
        exit $?
    fi
    echo Installed
fi

git clone https://github.com/dali-lab/treasurehunt.git ./treasurehunt && cd ./treasurehunt

if [[ $? != 0 ]]; then
    echo; echo;
    echo "Failed to clone repository."
    echo -e "Check to see that the repo exists and there isn't already a file/directory named treasurehunt"
    exit $?
fi

echo "Installing node packages..."
npm install

if [[ $? != 0 ]]; then
    echo "ERROR: Failed to install node packages!"
fi

patch ./node_modules/react-native/React/Views/RCTTabBarItem.m ./installResources/tabBarPatch
cd ios
# I'm deintegrating and deleting the workspace because the pod files may be out of date. I just want to be certain they are in sync with the rest of the project
pod deintegrate &> $REDIRECT
rm -rf ./treasurehunt.xcworkspace &> $REDIRECT
pod install

if [[ $? != 0 ]]; then
    echo "ERROR: Failed to install cocoapods packages!"
fi

cd ..

watchman watch-del-all &> $REDIRECT

sudo xcode-select --install &> $REDIRECT
if [[ $? == 0 ]]; then
   echo "Downloading Xcode command line tools..."
   echo "You will be able to use your computer as you would, just let the download finish before shutting down the computer"
fi

echo -e "\n\n-----Complete-------"
echo -e "The script has finished installing all the required items!"
echo -e "To run the application type the following"
echo -e "\tcd treasurehunt"
echo -e "\treact-native run-ios"
echo -e "\n\n-- General Info --"
echo -e "The files with the majority of the code are in"
echo -e "\t./src/components/"
echo -e "If you want to make changes to the ios project itself, the workspace is in ./ios/"
