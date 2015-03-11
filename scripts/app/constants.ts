module ainomma.constants {
	export class AppSettings {
		static baseUrl: string = 'https://hacker-news.firebaseio.com/v0/';

		static topUrl: string = AppSettings.baseUrl + 'topstories';
		static newUrl: string = AppSettings.baseUrl + 'newstories';
		static askUrl: string = AppSettings.baseUrl + 'askstories';
		static showUrl: string = AppSettings.baseUrl + 'showstories';
		static jobsUrl: string = AppSettings.baseUrl + 'jobstories';
		static itemUrl: string = AppSettings.baseUrl + 'item/';
		static userUrl: string = AppSettings.baseUrl + 'user/';
	}
}

angular.module('ainomma.constants', [])
	.constant('AppSettings', ainomma.constants.AppSettings);
