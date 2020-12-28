import React from "react";
import "./Card.css";
import { Anime } from "../../types";

interface IProps {
	anime: Anime;
	handleCardClick(id: number): void;
}

export function Card(props: IProps) {
	const { anime, handleCardClick } = props;
	return (
		<div className="card">
			<img
				className="card-cover"
				src={anime.picture}
				onError={(e: any) => {
					e.target.src = "https://i.imgur.com/pmH5UFA.jpg";
				}}
			/>
			<div className="card-title-background"></div>
			<div className="card-title">
				<span>{anime.title}</span>
			</div>
			<button
				onClick={() => {
					handleCardClick(anime.id);
				}}
				className="card-button"
			>
				View Info
			</button>
		</div>
	);
}
