module ainomma.models {	
	export class Item {
		url: string;
		title: string;
		text: string;
		score: number;
		by: string;
		id: string;
		commentCount: number;
		iconClass: string;
		storyUrl: string;
	}
	
	export class StoryTypeSetting {
		constructor(public title: string, public value = 100) {
		}
	}
}