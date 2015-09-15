#Change Log

The change log was created with version 2.0. For changes, please see the commit history of the project.

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
