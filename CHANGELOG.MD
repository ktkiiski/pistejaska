# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
