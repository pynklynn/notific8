#Change Log

The change log was created with version 2.0. For changes, please see the commit history of the project.

## 2.3.1

- Fixing zindex setting bug
- Fixed readme link

## 2.3.0

- Removed unused code
- Refined the build process
    - Cleans up the src/ directory
    - Makes use of an untracked build directory for intermediary files
    - Added task to update the bower and jquery info files from package.json's version
- Converted the demo page to Jade for easy inclusion in other sites
    - Note: the use of include instead of extend in the index.jade file is intentional for easy drop-in use

## 2.2.0

- Changing the project's name to notific8. The old URL for GitHub will still work.
- Adding namespace for CSS option and moving css variables into their own file

## 2.1.1

- Fixed height for the Atomic theme family clashing with other theme families

## 2.1.0

- Created the Atomic theme family

## 2.0.1

- Move default themes out of theme family files
- Handling side sizing for ChicChat bug being in main code instead of themed

## 2.0

- Theme families were added for version 2.0
    - If you were generating custom themes in the past, please update your SASS files to call the __notific8\_legacy\_theme__ mixin instead of the old __theme__ mixin
    - As new mixins are added, their mixins will be named with the following formula __notific8\_[theme name]\_theme__
- Added the ChicChat theme family inspired by the built in notifications for HipChat
- Removed the times icon from the sticky close notifications because of reduncancy
