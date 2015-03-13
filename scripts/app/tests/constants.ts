module ainomma.tests.constants {
	describe('AppSettings constants',() => {
		it('should return the correct value for topUrl',() => {
			expect("https://hacker-news.firebaseio.com/v0/topstories").toEqual(ainomma.constants.AppSettings.topUrl); 
		});
		it('should return the correct value for newUrl',() => {
			expect("https://hacker-news.firebaseio.com/v0/newstories").toEqual(ainomma.constants.AppSettings.newUrl);
		});
		it('should return the correct value for askUrl',() => {
			expect("https://hacker-news.firebaseio.com/v0/askstories").toEqual(ainomma.constants.AppSettings.askUrl);
		});
		it('should return the correct value for showUrl',() => {
			expect("https://hacker-news.firebaseio.com/v0/showstories").toEqual(ainomma.constants.AppSettings.showUrl);
		});
		it('should return the correct value for jobsUrl',() => {
			expect("https://hacker-news.firebaseio.com/v0/jobstories").toEqual(ainomma.constants.AppSettings.jobsUrl);
		});
		it('should return the correct value for itemUrl',() => {
			expect("https://hacker-news.firebaseio.com/v0/item/").toEqual(ainomma.constants.AppSettings.itemUrl);
		});
		it('should return the correct value for userUrl',() => {
			expect("https://hacker-news.firebaseio.com/v0/user/").toEqual(ainomma.constants.AppSettings.userUrl);
		});
	});
}