# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## 2019-07-30

### Added

- Added support for resolving tie breakers

### Changed

- Allow inputting empty values

### Fixed

- Minor UI layout fix on play view

## 2019-06-20

### Added

- Support options for score and misc fields

## 2019-04-19

### Added

- Added Honshu game definition

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
