import ipads from '../data/ipads.js';
import navigations from '../data/navigations.js';

// 장바구니!
// 장바구니 관련 요소 찾기.
const basketStarterEl = document.querySelector('header .basket-starter');
const basketEl = basketStarterEl.querySelector('.basket');

basketStarterEl.addEventListener('click', (event) => {
  event.stopPropagation(); // 이벤트 버블링 정지! - 버튼을 클릭했을 때 드롭다운 메뉴가 나타나야 함.
  if (basketEl.classList.contains('show')) {
    hideBasket();
  } else {
    showBasket();
  }
});
basketEl.addEventListener('click', (event) => {
  event.stopPropagation(); // 이벤트 버블링 정지! - 드롭다운 메뉴 영역을 클릭했을 때 메뉴가 사라지지 않아야 함.
});
// 화면 전체를 클릭했을 때 메뉴가 사라짐.
window.addEventListener('click', () => {
  hideBasket();
});

// 특정 로직을 직관적인 함수 이름으로 묶음.
function showBasket() {
  basketEl.classList.add('show');
}
function hideBasket() {
  basketEl.classList.remove('show');
}

// 검색!
// 헤더 검색 관련 요소 찾기.
const headerEl = document.querySelector('header');
const headerMenuEls = [...headerEl.querySelectorAll('ul.menu > li')];
const searchWrapEl = headerEl.querySelector('.search-wrap');
const searchStarterEl = headerEl.querySelector('.search-starter');
const searchCloserEl = searchWrapEl.querySelector('.search-closer');
const searchShadowEl = searchWrapEl.querySelector('.shadow');
const searchInputEl = searchWrapEl.querySelector('input');
const searchDelayEls = [...searchWrapEl.querySelectorAll('li')];

searchStarterEl.addEventListener('click', showSearch);
searchCloserEl.addEventListener('click', function (event) {
  // textfield를 선택한 것이 아니게 만든다. => 모바일에 적용된 textfield 부분에 영향을 미치지 않도록 한다.
  event.stopPropagation();
  hideSearch();
});
searchShadowEl.addEventListener('click', hideSearch);

function showSearch() {
  headerEl.classList.add('searching');
  // html 문서 자체를 선택해서 스크롤이 실행되지 않도록 한다.
  stopScroll();
  // .reverse() 사용하지 않고 원래 순서대로 반복 처리.
  headerMenuEls.reverse().forEach(function (el, index) {
    el.style.transitionDelay = (index * 0.4) / headerMenuEls.length + 's';
  });
  searchDelayEls.forEach(function (el, index) {
    el.style.transitionDelay = (index * 0.4) / searchDelayEls.length + 's';
  });
  // 검색 인풋 요소가 나타난 후 동작!
  setTimeout(function () {
    searchInputEl.focus();
  }, 600);
}

function hideSearch() {
  headerEl.classList.remove('searching');
  playScroll();
  headerMenuEls.reverse().forEach(function (el, index) {
    el.style.transitionDelay = (index * 0.4) / headerMenuEls.length + 's';
  });
  searchDelayEls.reverse().forEach(function (el, index) {
    el.style.transitionDelay = (index * 0.4) / searchDelayEls.length + 's';
  });
  searchDelayEls.reverse();
  // 나타날 때 원래의 순서대로 처리해야 하기 때문에 다시 뒤집어서 순서 돌려놓기!
  searchInputEl.value = ''; // 입력값 초기화
}

function playScroll() {
  document.documentElement.classList.remove('fixed');
}

function stopScroll() {
  document.documentElement.classList.add('fixed');
}

// 헤더 메뉴 토글! (mobile)
const menuStaterEl = document.querySelector('header .menu-starter');
menuStaterEl.addEventListener('click', function () {
  if (headerEl.classList.contains('menuing')) {
    headerEl.classList.remove('menuing');
    searchInputEl.value = '';
    playScroll();
  } else {
    headerEl.classList.add('menuing');
    stopScroll();
  }
});

// 헤더 검색 (mobile)
const searchTextFieldEl = document.querySelector('header .textfield');
const searchCancelEl = document.querySelector('header .search-canceler');
searchTextFieldEl.addEventListener('click', function () {
  headerEl.classList.add('searching--mobile');
  searchInputEl.focus();
});
searchCancelEl.addEventListener('click', function () {
  headerEl.classList.remove('searching--mobile');
});

//
window.addEventListener('resize', function () {
  if (window.innerWidth <= 740) {
    headerEl.classList.remove('searching');
  } else {
    headerEl.classList.remove('searching--mobile');
  }
});

//
const navEl = document.querySelector('nav');
const navMenuToggleEl = navEl.querySelector('.menu-toggler');
const navMenuShadowEl = navEl.querySelector('.shadow');

navMenuToggleEl.addEventListener('click', function () {
  if (navEl.classList.contains('menuing')) {
    hideNavMenu();
  } else {
    showNavMenu();
  }
});

navEl.addEventListener('click', function (event) {
  event.stopPropagation();
});

navMenuShadowEl.addEventListener('click', hideNavMenu);

window.addEventListener('click', hideNavMenu);

function showNavMenu() {
  navEl.classList.add('menuing');
}

function hideNavMenu() {
  navEl.classList.remove('menuing');
}

// 요소의 가시성 관찰
const io = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (!entry.isIntersecting) {
      return;
    }
    entry.target.classList.add('show');
  });
});

const infoEls = document.querySelectorAll('.info');
infoEls.forEach(function (el) {
  io.observe(el);
});

// 비디오 재생!
const video = document.querySelector('.stage video');
const playBtn = document.querySelector('.stage .controller--play');
const pauseBtn = document.querySelector('.stage .controller--pause');

playBtn.addEventListener('click', function () {
  video.play();
  playBtn.classList.add('hide');
  pauseBtn.classList.remove('hide');
});

pauseBtn.addEventListener('click', function () {
  video.pause();
  playBtn.classList.remove('hide');
  pauseBtn.classList.add('hide');
});

// '당신에게 맞는 iPad는?' 랜더링!
const itemsEl = document.querySelector('section.compare .items');

ipads.forEach(function (ipad) {
  const itemEl = document.createElement('div');
  itemEl.classList.add('item');

  let colorList = '';
  ipad.colors.forEach(function (color) {
    colorList += `<li style="background-color: ${color};"></li>`;
  });

  // itemEl.textContent = ipad.name;
  itemEl.innerHTML = /* html */ `<div class="thumbnail">
  <img src="${ipad.thumbnail}" alt="${ipad.name}"
 />  </div>
 <ul class="colors"> 
    ${colorList}
 </ul>
 <h3 class="name">${ipad.name}</h3>
 <p class="tagline">${ipad.tagline}</p>
 <p class="price">￦${ipad.price.toLocaleString('en-US')}부터</p>
 <button class="btn">구입하기</button>
 <a href="${ipad.url}" class="link">더 알아보기</a>
 `;

  itemsEl.append(itemEl);
});

const navigationEl = document.querySelector('footer .navigations');
navigations.forEach(function (nav) {
  const mapEl = document.createElement('div');
  mapEl.classList.add('map');

  let mapList = '';
  nav.maps.forEach(function (map) {
    mapList += /* html */ `<li>
        <a href="${map.url}">${map.name}</a>
        </li>`;
  });

  mapEl.innerHTML = /*html*/ `
    <h3>
        <span class="text">${nav.title}</span>
        <span class="icon">+<span>
    </h3>
    <ul>
${mapList}
</ul>
    `;

  navigationEl.append(mapEl);
});

const thisYearEl = document.querySelector('span.this-year');
thisYearEl.textContent = new Date().getFullYear();

// 푸터 내비게이션 맵 아코디언
const mapEls = [...document.querySelectorAll('footer .navigations .map')];
mapEls.forEach((el) => {
  const h3El = el.querySelector('h3');
  h3El.addEventListener('click', () => {
    el.classList.toggle('active');
  });
});
