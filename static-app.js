const ingredients = ["酸木瓜", "小米辣", "香菜"];

const dishes = [
  {
    name: "酸木瓜煮鱼",
    short: "煮鱼",
    method: "鱼块煎香后加入姜片和热水，汤色变白时放入酸木瓜，小火煮十二分钟，最后加入小米辣、香菜和盐。",
  },
  {
    name: "凉拌酸木瓜",
    short: "凉拌",
    method: "酸木瓜切薄片，用少量盐腌出水分，加入小米辣、香菜和少量糖，拌匀后静置十分钟。",
  },
  {
    name: "酸木瓜炖鸡",
    short: "炖鸡",
    method: "鸡块炒香后加水炖煮，鸡肉变软时加入酸木瓜，再煮十五分钟，最后用盐调味并撒上香菜。",
  },
];

let flow = null;
let stage = "start";
let dishIndex = 0;
let pressCount = 0;
let discoveredCount = 0;

const app = document.getElementById("app");

function ingredientCards(count = ingredients.length) {
  return `<div class="ingredient-cards" aria-label="${count}张食材卡">${ingredients
    .slice(0, count)
    .map((name) => `<div class="ingredient-card">${name}</div>`)
    .join("")}</div>`;
}

function basket(count) {
  return `<div class="object-wrap" aria-label="菜篮子">
    <div class="basket-handle"></div>
    <div class="basket-body">${ingredientCards(count)}</div>
  </div>`;
}

function pot(count) {
  return `<div class="object-wrap" aria-label="锅">
    <div class="pot-lid"><span></span></div>
    <div class="pot-handle pot-handle-left"></div>
    <div class="pot-handle pot-handle-right"></div>
    <div class="pot-body">${ingredientCards(count)}</div>
  </div>`;
}

function detailCards(count) {
  return `<div class="detail-row">${ingredients
    .map((name, index) => `<div class="detail-card">${index < count ? `${name}详情` : "待获取"}</div>`)
    .join("")}</div>`;
}

function dishPlate(index) {
  return `<div class="dish-plate dish-${index}" aria-label="${dishes[index].name}">
    <div class="food-lines"><i></i><i></i><i></i><i></i><i></i></div>
    <span>${dishes[index].name}</span>
  </div>`;
}

function largeBasket() {
  return `<div class="large-basket" aria-label="大篓子"><i></i><i></i><i></i><i></i><i></i><i></i></div>`;
}

function handWithBag() {
  return `<div class="hand-scene" aria-label="手拎着装有食材卡的塑料袋">
    <div class="arm"></div>
    <div class="hand hand-down"><i></i><i></i><i></i></div>
    <div class="bag-handle"></div>
    <div class="bag-body">${ingredientCards()}</div>
  </div>`;
}

function handWithBook() {
  return `<div class="hand-scene" aria-label="手拿着一本装有食材卡的书">
    <div class="arm arm-book"></div>
    <div class="hand hand-book"><i></i><i></i><i></i></div>
    <div class="book"><div class="book-spine"></div>${ingredientCards()}</div>
  </div>`;
}

function renderStart() {
  app.innerHTML = `<main class="page start-page">
    <button data-flow="not-bought">没买</button>
    <button data-flow="bought">买了</button>
  </main>`;
  document.querySelectorAll("[data-flow]").forEach((button) => {
    button.addEventListener("click", () => {
      flow = button.dataset.flow;
      pressCount = 0;
      discoveredCount = 0;
      stage = "cards";
      render();
    });
  });
}

function renderCards() {
  const notBought = flow === "not-bought";
  const discoveredIngredients = ingredients.slice(0, discoveredCount).join("、");
  app.innerHTML = `<main class="page cards-page">
    <section class="cards-main">
      <div class="object-column">${notBought ? basket(discoveredCount) : pot(discoveredCount)}</div>
      <div class="cards-title">
        <h1>${notBought ? "开始探索" : "今天怎么吃"}${discoveredIngredients ? `<br />${discoveredIngredients}` : ""}</h1>
      </div>
    </section>
    ${detailCards(discoveredCount)}
  </main>`;
}

function renderDish() {
  const dish = dishes[dishIndex];
  app.innerHTML = `<main class="page dish-page">
    <section class="dish-content">
      <div class="dish-top">
        ${dishPlate(dishIndex)}
        <div class="dish-copy"><h1>${dish.name}</h1><p>${dish.method}</p></div>
      </div>
      <div class="dish-selector">
        ${dishes.map((item, index) => `<button data-dish="${index}" class="${dishIndex === index ? "selected" : ""}">${item.short}</button>`).join("")}
      </div>
    </section>
    ${largeBasket()}
  </main>`;
  document.querySelectorAll("[data-dish]").forEach((button) => {
    button.addEventListener("click", () => {
      dishIndex = Number(button.dataset.dish);
      render();
    });
  });
}

function renderPrint() {
  const notBought = flow === "not-bought";
  app.innerHTML = `<main class="page print-page">
    <section class="print-visual">${notBought ? handWithBook() : handWithBag()}</section>
    <section class="print-copy">
      <h1>${notBought ? "记下了" : "拿走，开做"}</h1>
      <button id="print-button">打印</button>
    </section>
  </main>`;
  document.getElementById("print-button").addEventListener("click", () => window.print());
}

function render() {
  if (stage === "start") renderStart();
  if (stage === "cards") renderCards();
  if (stage === "dish") renderDish();
  if (stage === "print") renderPrint();
}

window.addEventListener("keydown", (event) => {
  if (event.repeat) return;
  if (stage === "cards" && event.key === "1") {
    pressCount += 1;
    if (pressCount % 10 === 0) {
      discoveredCount = Math.min(discoveredCount + 1, ingredients.length);
      render();
    }
  } else if (stage === "cards" && event.key === "3") {
    stage = "dish";
    render();
  } else if (stage === "dish" && event.key === "2") {
    stage = "print";
    render();
  }
});

render();
