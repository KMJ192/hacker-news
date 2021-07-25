interface Store {
    currentPage: number;
    feeds: NewsFeed[];
}

interface News {
    readonly id: number;
    readonly time_ago: string;
    readonly title: string;
    readonly url: string;
    readonly user: string;
    readonly contents: string
}

interface NewsFeed extends News {
    readonly comments_count: number;
    readonly points: number;
    read?: boolean;
}

interface NewsDetail extends News {
    readonly comments: NewsComment[];
}
interface NewsComment extends News {
    readonly comments: NewsComment[];
    readonly level: number;
}

const container: HTMLElement | null = document.getElementById('root');
const NEWS_URL = 'http://api.hnpwa.com/v0/news/1.json';
const CONTENT_URL = 'http://api.hnpwa.com/v0/item/@id.json';

const store: Store = {
    currentPage: 1,
    feeds: []
};

function applyApiMixins(targetClass: any, baseClass: any){
    baseClass.forEach(baseClass => {
        Object.getOwnPropertyNames(baseClass.prototype).forEach(name => {
            const descriptor = Object.getOwnPropertyDescriptor(baseClass.prototype, name);
            if(descriptor){
                Object.defineProperty(targetClass.prototype, name, descriptor);
            }
        });
    });
}

class Api{
    protected getRequest<AjaxResposne>(method: string, url: string, async: boolean): AjaxResposne{
        const ajax = new XMLHttpRequest();
        ajax.open(method, url, async);
        ajax.send();
        return JSON.parse(ajax.response);
    }
}

class NewsFeedApi extends Api{
    getData(): NewsFeed[]{
        return this.getRequest<NewsFeed[]>("GET", NEWS_URL, false);
    }
}

class NewsDetailApi extends Api{
    getData(id: string): NewsDetail{
        return this.getRequest<NewsDetail>("GET", CONTENT_URL.replace('@id', id), false);
    }
}

//mixin
// first arg로 class
// second arg로 첫번째class에 상속 시켜주는 class
applyApiMixins(NewsFeedApi, Api);
applyApiMixins(NewsDetailApi, Api);

function makeFeeds(feeds: NewsFeed[]): NewsFeed[] {
    for(let i = 0; i < feeds.length; i++){
        feeds[i].read = false;
    }
    return feeds;
}

function updateView(html: string): void{
    if(container) container.innerHTML = html;
    else console.error("최상위 컨테이너가 없습니다.");
}

function newsFeed(): void {
    //const newsFeed = getData("GET", NEWS_URL, false);
    const api = new NewsFeedApi();
    let newsFeed: NewsFeed[] = store.feeds;
    const newsList = [];
    let template = `
        <div class="bg-gray-600 min-h-screnn">
            <div class="bg-white text-xl">
                <div class="mx-auto px-4">
                    <div class="flex justify-between items-center py-6">
                        <div class="flex justify-start">
                            <h1 class="font-extrabold">Hacker News</h1>
                        </div>
                        <div class="items-center justify-end">
                            <a href="#/page/{{__prev_page__}}" class="text-gray-500">
                                Previous
                            </a>
                            <a href="#/page/{{__next_page__}}" class="text-gray-500 ml-4">
                                Next
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="p-4 text-2xl text-gray-700">
                {{__news_feed__}}
            </div>
        </div>
    `;
    
    if(newsFeed.length === 0){
        //newsFeed = store.feeds = makeFeeds(getData<NewsFeed[]>("GET", NEWS_URL, false));
        newsFeed = store.feeds = makeFeeds(api.getData());
    }

    for(let i = (store.currentPage - 1) * 10; i < (store.currentPage * 10); i++){
        const nf = newsFeed[i];
        newsList.push(`
            <div class="p-6 ${nf.read ? 'bg-red-500' : 'bg-white'} mt-6 rounded-lg shadow-md transition-colors duration-500 hover:bg-green-100">
                <div class="flex">
                    <div class="flex-auto">
                        <a href="#/show/${nf.id}">
                            ${nf.title}
                        </a>
                    </div>
                    <div class="text-center text-sm">
                        <div class="w-10 text-white bg-green-300 rounded-lg px-0 py-2">
                            ${nf.comments_count}
                        </div>
                    </div>
                </div>
                <div class="flex mt-3">
                    <div class="grid grid-cols-3 text-sm text-gray-500">
                        <div><i class="fas fa-user mr-l">${nf.user}</i></div>
                        <div><i class="fas fa-heart mr-l">${nf.points}</i></div>
                        <div><i class="fas fa-clock mr-l">${nf.time_ago}</i></div>
                    </div>
                </div>
            </div>
        `);
    }

    template = template.replace("{{__news_feed__}}", newsList.join(''));
    template = template.replace("{{__prev_page__}}", store.currentPage > 1 ? String(store.currentPage - 1) : String(1));
    template = template.replace("{{__next_page__}}", String(store.currentPage + 1));
    //template = template.replace("{{__next_page__}}", store.currentPage < 3 ? String(store.currentPage + 1) : String(store.currentPage = 3));
    //template = template.replace("{{__next_page__}}", store.currentPage + 1);
    updateView(template);
    
}

function newsDetail(): void {
    const id = location.hash.substr(7);
    const api = new NewsDetailApi();
    const newsContent = api.getData(id);
    let template = `
        <div class="bg-gray-600 min-h-screnn pb-8">
            <div class="bg-white text-xl">
                <div class="mx-auto px-4">
                    <div class="flex justify-between items-center py-6">
                        <div class="flex justify-start">
                            <h1 class="font-extrabold">Hacker News</h1>
                        </div>
                        <div class="items-center justify-end">
                            <a href="#/page/${store.currentPage}" class="text-gray-500">
                                <i class="fa fa-times"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="h-full border rounded-xl bg-white m-6 p-4">
                <h2>
                    ${newsContent.title}
                </h2>
                <div class="text-gray-400 h-20">
                    ${newsContent.contents}
                </div>
                {{__comments__}}
            </div>
        </div>
    `;

    for(let i = 0; i < store.feeds.length; i++){
        if(store.feeds[i].id === Number(id)){
            store.feeds[i].read = true;
            break;
        }
    }

    function makeComment(comments: NewsComment[]): string{
        const commentString = [];
        for(let i = 0; i < comments.length; i++){
            const comment = comments[i];
            commentString.push(`
                <div style="padding-left: ${comment.level * 40}px;" class="mt-4">
                    <div class="text-gray-400">
                        <i class="fa fa-sort-up mr-2"></i>
                        <strong>${comment.user}</strong> ${comment.time_ago}
                    </div>
                    <p class="text-gray-700">${comment.contents}</p>
                </div>
            `);

            if(comment.comments.length > 0){
                commentString.push(makeComment(comment.comments));
            }
        }
        return commentString.join('');
    }
    updateView(template.replace("{{__comments__}}", makeComment(newsContent.comments)));
}

function makeComment(comments: NewsComment[]): string{
    const commentString = [];
    for(let i = 0; i < comments.length; i++){
        const comment: NewsComment = comments[i];
        commentString.push(`
            <div style="padding-left: ${comment.level * 40}px;" class="mt-4">
                <div class="text-gray-400">
                    <i class="fa fa-sort-up mr-2"></i>
                    <strong>${comment.user}</strong> ${comment.time_ago}
                </div>
                <p class="text-gray-700">${comment.contents}</p>
            </div>
        `);
        if(comment.comments.length > 0){
            commentString.push(makeComment(comment.comments));
        }
    }
    return commentString.join('');
}

function router(): void{
    const routePath = location.hash;
    if(routePath === ''){
        newsFeed();
    }else if(routePath.indexOf('#/page/') >= 0){
        store.currentPage = Number(routePath.substr(7));
        newsFeed();
    }else{
        newsDetail();
    }
}

window.addEventListener('hashchange', router);

router();