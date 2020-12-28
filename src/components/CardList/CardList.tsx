import React from "react";
import "./CardList.css";
import { Card } from "../Card/Card";
import { AnimeList } from "../../types";

interface IProps {
	animeList: AnimeList;
	handleCardClick(id: number): void;
	handleCardListScrollToBottom(): void;
}

export function CardList(props: IProps) {
	return (
		<div className="card-list">
			<div
				className="card-list-container"
				onScroll={(e: any) => {
					const element = e.target;
					const visibleHeight = element.scrollTop;
					const fullHeight = element.scrollHeight - element.offsetHeight;
					if (visibleHeight == fullHeight) {
						props.handleCardListScrollToBottom();
					}
				}}
			>
				{props.animeList.map((anime, index) => (
					<Card
						key={index}
						anime={anime}
						handleCardClick={props.handleCardClick}
					/>
				))}
			</div>
		</div>
	);
}
