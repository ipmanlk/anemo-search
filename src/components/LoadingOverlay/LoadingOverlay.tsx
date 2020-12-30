import React from "react";
import "./LoadingOverlay.css";

interface IProps {
	text: string;
	progress: string;
	visible: boolean;
	spinnerVisible: boolean;
}

export function LoadingOverlay(props: IProps) {
	return (
		<div
			className={props.visible ? "loading-overlay" : "loading-overlay-hidden"}
		>
			<div>
				{props.spinnerVisible ? (
					<div className="lds-ellipsis">
						<div></div>
						<div></div>
						<div></div>
						<div></div>
					</div>
				) : (
					""
				)}
				{props.progress !== "" && (
					<h3 className="loading-overlay-progress">{props.progress}</h3>
				)}
				<div className="loading-overlay-text">
					{props.text.split("/n").map((t, index) => (
						<h3 key={index}>{t}</h3>
					))}
				</div>
			</div>
		</div>
	);
}
