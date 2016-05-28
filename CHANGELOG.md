#Change Log

The change log was created with version 2.0. For changes, please see the commit history of the project.

## 3.3.0

- Added tests to the plug-in using Jasmine and Karma
- Minor refactoring of the code to DRY it
- Added the Materialish theme
    - __Note__: This theme does not support having a heading

## 3.2.0

- Added module functionality to make the plug-in more easily extensible for developers
- Moved the icon functionality into its own module
- Option settings changes:
    - Deprecated the family `option`
    - Added the `color` option to replace the existing `theme` option functionality
    - Changed the `theme` option to use the functionality the `theme` option formerly defined
- Default theme color partial file names changed
    - The theme file names have been changed from ending with `_themes` to `_colors`
    - Sym links have been created for the original file names but will be removed in version 4.0
- The base style file has been renamed from `jquery.notific8.scss` to `notific8.scss`. The compiled file names are also changed
    - Sym links have been created for the original file names but will be removed in version 4.0

## 3.1.2

- Fixing bugs with the Atomic theme

## 3.1.1

- Updating the templates from Jade to Pug due to Jade being forced to rename

## 3.1.0

- Updated the release task to create versions of the styles in Sass format, Stylus, and Less
    - Note: The project will continue to use Scss for development - this will not change, please don't open issues or pull-requests to change it

## 3.0.1

- Added a height option for each of the theme families to make sure animations function properly

## 3.0.0

- Released pure JavaScript version of the plug-in that is usable with any framework
- Released a jQuery wrapper for the JavaScript (this will allow existing code to function properly)
- Updated notifications to have flexible sizing for longer notification text

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
