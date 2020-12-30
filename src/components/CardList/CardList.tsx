import React, { useCallback, useRef } from "react";
import "./CardList.css";
import { Card } from "../Card/Card";
import { AnimeList } from "../../types";

interface IProps {
	animeList: AnimeList;
	handleCardClick(id: number): void;
	handleCardListScrollToBottom(): void;
}

export function CardList(props: IProps) {
	const observer = useRef<any>();

	const lastCardRef = useCallback((node) => {
		if (observer.current) observer.current.disconnect();
		observer.current = new IntersectionObserver((entries) => {
			if (entries[0].isIntersecting) {
				props.handleCardListScrollToBottom();
			}
		});
		if (node) observer.current.observe(node);
	}, []);

	return (
		<div className="card-list">
			<div className="card-list-container">
				{props.animeList.map((anime, index) =>
					props.animeList.length - 10 === index ? (
						<Card
							key={index}
							lastCardRef={lastCardRef}
							anime={anime}
							handleCardClick={props.handleCardClick}
						/>
					) : (
						<Card
							key={index}
							anime={anime}
							handleCardClick={props.handleCardClick}
						/>
					)
				)}
			</div>
		</div>
	);
}
