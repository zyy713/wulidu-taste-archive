const ingredients = ["酸木瓜", "小米辣", "香菜"];

const dishes = [
  {
    name: "傣味舂鸡脚",
    short: "傣味舂鸡脚",
    method: "鸡爪煮熟冰镇后去骨；将大蒜、小米辣和香茅舂碎，加入青柠汁、鱼露、生抽、白糖和盐调成酸辣汁。拌入洋葱、黄瓜和胡萝卜，最后加入香菜、薄荷和柠檬片，冷藏腌制。",
    spices: "青柠檬 · 黄柠檬 · 小米辣 · 大蒜 · 生姜 · 香菜 · 香茅 · 薄荷",
    label: "酸辣 / 清香 / 舂拌",
    image: "./assets/dish-dai-chicken-feet-f1eff1.png",
  },
  {
    name: "酸木瓜煮鱼",
    short: "酸木瓜煮鱼",
    method: "鱼块煎香后加入姜片和热水，汤色变白时放入酸木瓜，小火煮十二分钟，最后加入小米辣、香菜和盐。",
    spices: "酸木瓜 · 小米辣 · 生姜 · 香菜",
    label: "酸香 / 鲜润 / 慢煮",
    image: "./assets/dish-sour-papaya-fish.png",
  },
  {
    name: "木姜子烤鸡",
    short: "木姜子烤鸡",
    method: "鸡肉加入木姜子、大蒜和香茅腌制，烤至表皮焦香；出炉后挤入青柠汁，以香菜和少量小米辣提鲜。",
    spices: "木姜子 · 香茅 · 大蒜 · 小米辣 · 青柠",
    label: "柑橘香 / 焦香 / 烘烤",
    image: "./assets/dish-litsea-roast-chicken.png",
  },
  {
    name: "青柠拌刺苦瓜",
    short: "青柠拌刺苦瓜",
    method: "刺苦瓜切薄片后冰镇，加入青柠汁、少量盐和糖抓拌，再用小米辣、香菜与薄荷补足清香。",
    spices: "青柠 · 小米辣 · 香菜 · 薄荷",
    label: "清苦 / 酸亮 / 凉拌",
    image: "./assets/dish-lime-bitter-gourd.png",
  },
  {
    name: "香茅烤鱼",
    short: "香茅烤鱼",
    method: "鲜鱼以香茅、大蒜和小米辣腌制，包入香叶烤熟，食用前挤上青柠汁，让草本香气更明亮。",
    spices: "香茅 · 青柠 · 小米辣 · 大蒜 · 香叶",
    label: "草本香 / 鲜辣 / 烘烤",
    image: "./assets/dish-lemongrass-fish.png",
  },
];

let flow = null;
let stage = "start";
let dishIndex = 0;
let pressCount = 0;
let discoveredCount = 0;
let receiptPrinted = false;

const app = document.getElementById("app");

[
  "./assets/final-bought-background.png",
  "./assets/final-curious-background.png",
  "./assets/recipe-receipt.png",
  ...dishes.map((dish) => dish.image),
].forEach((src) => {
  const image = new Image();
  image.src = src;
});

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

function detectedIngredientCards(count) {
  const detectedIngredients = ingredients.slice(0, count);
  const cards = detectedIngredients
    .map((name, index) => `<div class="detected-card detected-card-${index + 1}">${name}</div>`)
    .join("");
  return `<div class="detected-cards detected-cards-container" aria-label="容器内已获取${count}张食材卡">${cards}</div>
    <div class="detected-cards detected-cards-fence" aria-label="木排上已获取${count}张食材卡">${cards}</div>`;
}

function poundingAnimation() {
  return `<div class="pounding-demo" aria-label="将食材放入木臼并拿起木杵舂击的循环动画">
    <div class="step-guide">
      <div class="pounding-mini pounding-mini-one">
        <div class="step-label"><span>STEP</span><b>1</b></div>
        <div class="mini-frame">
          <img src="./assets/step1-empty-transparent.png" alt="空木臼" />
          <img src="./assets/step1-card-transparent.png" alt="食材卡放入木臼" />
        </div>
      </div>
      <div class="pounding-mini pounding-mini-two">
        <div class="step-label"><span>STEP</span><b>2</b></div>
        <div class="mini-frame">
          <img src="./assets/step2-up-transparent.png" alt="举起木杵" />
          <img src="./assets/step2-down-transparent.png" alt="木杵向下舂击" />
        </div>
      </div>
    </div>
    <div class="full-sequence" aria-label="完整舂击动作">
      <img class="full-frame full-frame-1" src="./assets/step1-empty-transparent.png" alt="" />
      <img class="full-frame full-frame-2" src="./assets/step1-card-transparent.png" alt="" />
      <img class="full-frame full-frame-3" src="./assets/step2-up-transparent.png" alt="" />
      <img class="full-frame full-frame-4" src="./assets/step2-down-transparent.png" alt="" />
    </div>
  </div>`;
}

function finalIngredientCards(count, currentFlow) {
  return `<div class="final-collected-cards ${currentFlow === "bought" ? "final-cards-bought" : "final-cards-curious"}">
    ${ingredients.slice(0, count).map((name, index) => `<div class="final-collected-card final-collected-card-${index + 1}">${name}</div>`).join("")}
  </div>`;
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
    <h1>舂一舂！对这份滇味下手！</h1>
    <button data-flow="not-bought">不买菜，但好奇</button>
    <button data-flow="bought">拎回家，怎么做</button>
  </main>`;
  document.querySelectorAll("[data-flow]").forEach((button) => {
    button.addEventListener("click", () => {
      flow = button.dataset.flow;
      pressCount = 0;
      discoveredCount = 0;
      receiptPrinted = false;
      stage = "cards";
      render();
    });
  });
}

function renderCards() {
  const notBought = flow === "not-bought";
  app.innerHTML = `<main class="page cards-page ${notBought ? "cards-page-curious" : "cards-page-bought"}">
    ${detectedIngredientCards(discoveredCount)}
    <section class="acquisition-copy">
      <p>食材入钵，拿起木杵</p>
      <p><strong>舂舂舂</strong>，将食材加入${notBought ? "菜篮" : "铜锅"}</p>
      <small>*舂：用木杵在木臼内上下锤击</small>
    </section>
    ${poundingAnimation()}
    <p class="acquisition-stop-hint">*全部原材料添加完成后停止“舂”</p>
  </main>`;
}

function renderDish() {
  const dish = dishes[dishIndex];
  app.innerHTML = `<main class="page dish-page">
    <section class="dish-hero">
      <div class="dish-photo-wrap">
        <span class="dish-photo-index">RECIPE / 0${dishIndex + 1}</span>
        <img class="dish-photo" src="${dish.image}" alt="${dish.name}" />
      </div>
      <article class="dish-recipe">
        <div class="dish-kicker"><i></i> YUNNAN SPICE MATCH</div>
        <h1>${dish.name}</h1>
        <p class="dish-taste-label">${dish.label}</p>
        <div class="recipe-block"><h2><span>01</span> 烹饪方法</h2><p>${dish.method}</p></div>
        <div class="recipe-block recipe-spices"><h2><span>02</span> 需要的香料</h2><p>${dish.spices}</p></div>
      </article>
    </section>
    <section class="recommendation-section">
      <header class="recommendation-head">
        <div><span>RECOMMENDATION</span><h2>菜品推荐</h2></div>
        <small>横向滑动查看更多&nbsp; →</small>
      </header>
      <div class="dish-selector">
        ${dishes.map((item, index) => `<button data-dish="${index}" class="${dishIndex === index ? "selected" : ""}"><span>0${index + 1}</span><strong>${item.short}</strong><small>${item.label}</small></button>`).join("")}
      </div>
    </section>
    <div class="dish-page-dots" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
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
  app.innerHTML = `<main class="page print-page ${notBought ? "print-page-curious" : "print-page-bought"}">
    ${finalIngredientCards(discoveredCount, flow)}
    <section class="print-copy">
      <h1>${notBought ? "记下，去吃！" : "拎菜，开火！"}</h1>
      <div class="receipt-machine">
        <div class="receipt-slot" aria-hidden="true"><i></i></div>
        <button class="receipt-output ${receiptPrinted ? "open" : ""}" type="button" aria-expanded="${receiptPrinted}" aria-label="点击获取食谱小票">
          <img src="./assets/recipe-receipt.png" alt="舂！滇味实验站食谱小票" />
        </button>
        <p class="receipt-guide ${receiptPrinted ? "hidden" : ""}">点击小票，获取你的滇味食谱</p>
      </div>
    </section>
  </main>`;
  const receiptOutput = document.querySelector(".receipt-output");
  receiptOutput.addEventListener("click", () => {
    receiptPrinted = true;
    receiptOutput.classList.add("open");
    receiptOutput.setAttribute("aria-expanded", "true");
    document.querySelector(".receipt-guide").classList.add("hidden");
  });
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
    receiptPrinted = false;
    stage = "print";
    render();
  }
});

render();
