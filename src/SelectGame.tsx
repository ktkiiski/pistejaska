import React, { useEffect, useState, useRef } from "react";
import { games, GameDefinition, players } from "./domain/domain";
import { InputScoresForm } from "./InputScoresForm";

export const SelectGame = () => {
  const [selectedGame, setSelectedGame] = useState<GameDefinition | null>(null);

  const onSelectGame = (id: GameDefinition) => setSelectedGame(id);
  // TODO PANU: fix awkward null checks?
  const renderGame =
    selectedGame != null ? (
      <InputScoresForm game={selectedGame} players={players} />
    ) : (
      <></>
    );
  const gameSelector = (
    <div>
      <h2>Select game</h2>
      <ul>
        {games.map(game => (
          <li key={game.id} onClick={() => onSelectGame(game)}>
            <a href="#">{game.name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
  const renderMe = selectedGame ? renderGame : gameSelector;
  return <div>{renderMe}</div>;
};
