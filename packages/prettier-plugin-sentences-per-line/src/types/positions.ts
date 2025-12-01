export interface Position {
	end: PositionPoint;
	start: PositionPoint;
}

export interface PositionPoint {
	column: number;
	line: number;
	offset: number;
}

export interface WithPosition {
	position: Position;
}
