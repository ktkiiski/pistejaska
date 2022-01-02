# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## 2022-01-02

### Added

- Player's plays to player view
- Recently played games as shortcuts when starting new play

### Removed

- Broken dark mode support

### Fixed

- Start player randomization animation
- Play list load flicker
- Footer buttons layout broken on mobile
- Footer buttons flow to two rows on some mobile phones instead of staying in one row
- Game report view filter expansion selector shows wrong amount of plays for selected expansion

## 2022-12-28

### Changed

- Sticky footer to edit play view

### Fixed

- Start player randomization animation bug
- Prevent starting game with less than two players

### Removed

- Game trend chart

## 2021-12-26

### Changed

- New design using Tailwind CSS

## 2021-08-20

### Changed

- Removed all calculated properties (like date and rankings) from plays. This reduces the size of documents and improves performance.

### Added

- Feature to add images to plays

## 2021-03-30

### Added

- Show game trends as a chart on "Plays" and player report view
- Show "animation" while randomizing starting player for a new play

## 2021-03-02

### Changed

- **Games are stored in the Firestore** instead of being hard-coded. They can be edited in the Admin view, located at `/admin`
- "Reports" is now "Games"

### Added

- New feature: filter game reports by expansions, player counts, and dimensions (e.g. races, factions, corporations)
- Show stats how long players have played games

### Fixed

- Crash in report views when a play has less than 2 players

## 2021-01-23

### Added

- Support for Wingspan
- Support for Clank! In! Space!

## 2020-11-13

### Changed

- Group certain fields on the same view when editing a play.
- Move play edit "Save" button between "Next" and "Previous" buttons
- Minor styling improvements of the play edit form.

### Fixed

- Do not confirm setting the play duration if already set.
- Fixed "Show reports" link button.

## 2020-10-31

### Added

- Reports for single player showing max points, best position, win percentage, trueskill and
  number of plays for each game & for all games

### Fixed

- Issue where navigating between play view and report view was slow due to loading full page

## 2020-10-24

### Added

- Support for Eclipse, for Eclipse: Rise of the Ancients and for Eclipse: Shadow of the Rift

## 2020-10-18

### Added

- Button for randomizing the starting player when selecting players for a new play
- Play again a previous play: use the game and the players from any existing play
- Show play & win counts for best players

## 2020-09-27

### Added

- Remind user to update the game duration when saving play if the play is edited 10 mins - 10 hour after it was created

### Changed

- Sort players by position, not by starting order, in play view

## 2020-09-06

### Changed

- Support for Terraforming Mars expansions

## 2020-09-05

### Fixed

- Issues setting scores with tabulator/enter in plays with expansions

### Changed

- Updated all NPM dependencies

## 2020-08-09

### Added

- Show statistics about each score category for the games:
  - Average scores for the winning players
  - Correlation coefficient with the ranking
- Show correlation coefficient with the ranking and the starting order
- In addition to win/usage percentage, also show the number of wins/usage in game dimension reports

### Changed

- Improved the app bar:
  - "Plays" and "Reports" are now separate top-level navigation pages
  - "Changelog" and "Log out" options can be found in the menu

### Removed

- Removed the ranking vs. winning order chart as it did not provide any statistically meaningful information

## 2020-07-16

### Added

- Support for game expansions. Expansions should no longer be defined as misc fields (with "Variant" in the name),
  but as separate entities that add scoring categories and misc fields to the base game.
- Support for 7 Wonders expansions + Brass Birmingham (as an expansion to Brass)
- Support for Everdell

## 2020-6-22

### Added

- Set play duration from timer feature

## 2020-5-23

### Fixed

- Added Interplanetary cinematics corporation to Terraforming Mars

## 2020-5-16

### Fixed

- Issue where Dominion scores could not be negative

## 2020-5-10

### Fixed

- Fixed the tie breaker. It can now also be any number, not just a fraction, as it won't be added to the normal scores.

### Added

- Feature to report average normalized rank for certain game dimensions, e.g. corporation in Terraforming Mars
- Feature to report win and use percentages for certain game dimensions, e.g. corporation in Terraforming Mars

## 2020-4-11

### Fixed

- Issue where all new plays since 4.4. were replacing the older play resulting in data loss

## 2020-4-4

### Changed

- Updated all NPM dependencies

## 2020-2-22

### Added

- Support for Terraforming Mars: Prelude
- Support for Terraforming Mars: Turmoil
- Link from report view to max/min score plays

## 2020-1-26

### Fixed

- Play list pagination

## 2020-1-25

### Added

- Support for generic game
- Support for Lords of Waterdeep
- Play list pagination

### Fixed

- Misc scores were not shown on play view
- Tie breaker was not shown on play view

## 2019-12-29

### Changed

- Top players list shows 5 players
- Qualification for the top players list requires 3 plays (unless no one has played that many times)

## 2019-12-22

### Changed

- Updated npm libraries

### Fixed

- Catan support

## 2019-12-22

### Added

- Support for Catan

## 2019-10-07

### Removed

- Support for PWA due to caching issues

## 2019-10-03

### Added

- Support for Coup

## 2019-09-29

### Added

- Support for Dominion
- Support for PWA

## 2019-09-22

### Added

- Support winner scores by # of players in report view
- Support for 7 Wonders Armada
- Corporations dimension to Terraforming Mars
- Support for "misc" score fields (e.g. when playing with unsupported expansion)

## 2019-09-21

### Added

- Support for Brass, Imperial & Bohnanza

## 2019-09-18

### Changed

- Switched from ELO rating to TrueSkill to get better player strength estimations

## 2019-09-16

### Added

- Feature to select previously added players easily to new plays
- ELO rating in reports view to find out the most skilled players (based on [SME](http://www.tckerrigan.com/Misc/Multiplayer_Elo/))
- Support for 7 wonders game

### Changed

- Migrated all existing players by removing duplicates and setting same Id for same person

### Fixed

- Equal scores now have equal position

## 2019-09-15

### Changed

- Migrated Caverna: Forgotten folk to be a variant of Caverna

## 2019-08-25

### Added

- Link to reports from play view
- "Colonies" variant to Terraforming Mars

## 2019-08-18

### Added

- Support for Splendor game

## 2019-08-12

### Added

- Simple game reports (min,avg&max winning scores)

### Changed

- Changed PlayView table to be condensed & mobile-friendly

## 2019-08-03

### Added

- Variants (like map, ruleset and add-ons) game fields to Terraforming Mars & to Dominant Species
- Support for "boolean" type game fields
- Support for "affects scoring" property of game fields

### Changed

- Combined Welcome to game's Housing estate 1-6 fields to single Housing estate field
- Minor UI fixes

### Technical

- Updated libraries
- Refactored persisted data model from custom to Firestore's native model
- Renamed game ids to be consistently kebab-cased

## 2019-07-30

### Added

- Added support for resolving ties
- Order plays played on the same date correctly on the play list
- Show CHANGELOG.MD on UI

### Fixed

- Allow inputting empty values
- Minor UI layout fix on play view

## 2019-07-18

### Added

- Support for Dominant Species game

## 2019-06-20

### Added

- Support options for score and misc fields

## 2019-04-19

### Added

- Support for Honshu game

### Fixed

- Minor UX fix: "Select players" => "Add players"

## 2019-03-31

### Added

- Allow play date editing
- Confirm before deleting game
- Support for "value per player" type misc fields for games. Typically misc fields only have 1 value (like "Duration").
  Value per player type is useful for example when storing player race in Caverna.

### Changed

- Better UI design on play list

### Fixed

- Allow setting 0 as score value
- Cannot set negative values to score fields that have minValue == 0
- Cannot set positive values to score fields that have maxValue == 0
- Cannot set non-number values as scores

## 2019-03-30

### Added

- Support for Caverna: Forgotten folk game

## 2019-03-25

### Added

- Initial MVP version. Supports signing in & inputting scores & persisting scores
