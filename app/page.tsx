"use client";

import { useEffect, useState } from "react";

type Flow = "not-bought" | "bought";
type Stage = "start" | "cards" | "dish" | "print";

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

function IngredientCards({ count = ingredients.length }: { count?: number }) {
  const visibleIngredients = ingredients.slice(0, count);
  return (
    <div className="ingredient-cards" aria-label={`${visibleIngredients.length}张食材卡`}>
      {visibleIngredients.map((name) => (
        <div className="ingredient-card" key={name}>{name}</div>
      ))}
    </div>
  );
}

function Basket({ count }: { count: number }) {
  return (
    <div className="object-wrap" aria-label="菜篮子">
      <div className="basket-handle" />
      <div className="basket-body">
        <IngredientCards count={count} />
      </div>
    </div>
  );
}

function Pot({ count }: { count: number }) {
  return (
    <div className="object-wrap" aria-label="锅">
      <div className="pot-lid"><span /></div>
      <div className="pot-handle pot-handle-left" />
      <div className="pot-handle pot-handle-right" />
      <div className="pot-body">
        <IngredientCards count={count} />
      </div>
    </div>
  );
}

function DetailCards({ count }: { count: number }) {
  return (
    <div className="detail-row">
      {ingredients.map((name, index) => (
        <div className="detail-card" key={name}>
          {index < count ? `${name}详情` : "待获取"}
        </div>
      ))}
    </div>
  );
}

function DetectedIngredientCards({ count }: { count: number }) {
  const detectedIngredients = ingredients.slice(0, count);
  return (
    <>
      <div className="detected-cards detected-cards-container" aria-label={`容器内已获取${count}张食材卡`}>
        {detectedIngredients.map((name, index) => (
          <div className={`detected-card detected-card-${index + 1}`} key={name}>{name}</div>
        ))}
      </div>
      <div className="detected-cards detected-cards-fence" aria-label={`木排上已获取${count}张食材卡`}>
        {detectedIngredients.map((name, index) => (
          <div className={`detected-card detected-card-${index + 1}`} key={name}>{name}</div>
        ))}
      </div>
    </>
  );
}

function PoundingAnimation() {
  return (
    <div className="pounding-demo" aria-label="将食材放入木臼并拿起木杵舂击的循环动画">
      <div className="step-guide">
        <div className="pounding-mini pounding-mini-one">
          <div className="step-label"><span>STEP</span><b>1</b></div>
          <div className="mini-frame">
            <img src="./assets/step1-empty-transparent.png" alt="空木臼" />
            <img src="./assets/step1-card-transparent.png" alt="食材卡放入木臼" />
          </div>
        </div>
        <div className="pounding-mini pounding-mini-two">
          <div className="step-label"><span>STEP</span><b>2</b></div>
          <div className="mini-frame">
            <img src="./assets/step2-up-transparent.png" alt="举起木杵" />
            <img src="./assets/step2-down-transparent.png" alt="木杵向下舂击" />
          </div>
        </div>
      </div>
      <div className="full-sequence" aria-label="完整舂击动作">
        <img className="full-frame full-frame-1" src="./assets/step1-empty-transparent.png" alt="" />
        <img className="full-frame full-frame-2" src="./assets/step1-card-transparent.png" alt="" />
        <img className="full-frame full-frame-3" src="./assets/step2-up-transparent.png" alt="" />
        <img className="full-frame full-frame-4" src="./assets/step2-down-transparent.png" alt="" />
      </div>
    </div>
  );
}

function FinalIngredientCards({ count, flow }: { count: number; flow: Flow | null }) {
  return (
    <div className={`final-collected-cards ${flow === "bought" ? "final-cards-bought" : "final-cards-curious"}`}>
      {ingredients.slice(0, count).map((name, index) => (
        <div className={`final-collected-card final-collected-card-${index + 1}`} key={name}>{name}</div>
      ))}
    </div>
  );
}

function DishPlate({ dishIndex }: { dishIndex: number }) {
  return (
    <div className={`dish-plate dish-${dishIndex}`} aria-label={dishes[dishIndex].name}>
      <div className="food-lines"><i /><i /><i /><i /><i /></div>
      <span>{dishes[dishIndex].name}</span>
    </div>
  );
}

function LargeBasket() {
  return (
    <div className="large-basket" aria-label="大篓子">
      <i /><i /><i /><i /><i /><i />
    </div>
  );
}

function HandWithBag() {
  return (
    <div className="hand-scene" aria-label="手拎着装有食材卡的塑料袋">
      <div className="arm" />
      <div className="hand hand-down"><i /><i /><i /></div>
      <div className="bag-handle" />
      <div className="bag-body"><IngredientCards /></div>
    </div>
  );
}

function HandWithBook() {
  return (
    <div className="hand-scene" aria-label="手拿着一本装有食材卡的书">
      <div className="arm arm-book" />
      <div className="hand hand-book"><i /><i /><i /></div>
      <div className="book">
        <div className="book-spine" />
        <IngredientCards />
      </div>
    </div>
  );
}

export default function Home() {
  const [flow, setFlow] = useState<Flow | null>(null);
  const [stage, setStage] = useState<Stage>("start");
  const [dishIndex, setDishIndex] = useState(0);
  const [, setPressCount] = useState(0);
  const [discoveredCount, setDiscoveredCount] = useState(0);
  const [receiptPrinted, setReceiptPrinted] = useState(false);

  useEffect(() => {
    [
      "./assets/final-bought-background.png",
      "./assets/final-curious-background.png",
      "./assets/recipe-receipt.png",
      ...dishes.map((dish) => dish.image),
    ].forEach((src) => {
      const image = new window.Image();
      image.src = src;
    });
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return;
      if (stage === "cards" && event.key === "1") {
        setPressCount((currentPressCount) => {
          const nextPressCount = currentPressCount + 1;
          if (nextPressCount % 10 === 0) {
            setDiscoveredCount((currentCount) => Math.min(currentCount + 1, ingredients.length));
          }
          return nextPressCount;
        });
      }
      if (stage === "cards" && event.key === "3") setStage("dish");
      if (stage === "dish" && event.key === "2") {
        setReceiptPrinted(false);
        setStage("print");
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [stage]);

  const chooseFlow = (nextFlow: Flow) => {
    setFlow(nextFlow);
    setPressCount(0);
    setDiscoveredCount(0);
    setReceiptPrinted(false);
    setStage("cards");
  };

  if (stage === "start") {
    return (
      <main className="page start-page">
        <h1>舂一舂！对这份滇味下手！</h1>
        <button onClick={() => chooseFlow("not-bought")}>不买菜，但好奇</button>
        <button onClick={() => chooseFlow("bought")}>拎回家，怎么做</button>
      </main>
    );
  }

  if (stage === "cards") {
    const notBought = flow === "not-bought";
    return (
      <main className={`page cards-page ${notBought ? "cards-page-curious" : "cards-page-bought"}`}>
        <DetectedIngredientCards count={discoveredCount} />
        <section className="acquisition-copy">
          <p>食材入钵，拿起木杵</p>
          <p><strong>舂舂舂</strong>，将食材加入{notBought ? "菜篮" : "铜锅"}</p>
        </section>
        <PoundingAnimation />
        <p className="acquisition-stop-hint">*全部原材料添加完成后停止“舂”</p>
        <p className="pounding-definition">*舂：用木杵在木臼内上下锤击</p>
      </main>
    );
  }

  if (stage === "dish") {
    const dish = dishes[dishIndex];
    return (
      <main className="page dish-page">
        <section className="dish-hero">
          <div className="dish-photo-wrap">
            <span className="dish-photo-index">RECIPE / 0{dishIndex + 1}</span>
            <img key={dish.image} className="dish-photo" src={dish.image} alt={dish.name} />
          </div>
          <article className="dish-recipe">
            <div className="dish-kicker"><i /> YUNNAN SPICE MATCH</div>
            <h1>{dish.name}</h1>
            <p className="dish-taste-label">{dish.label}</p>
            <div className="recipe-block">
              <h2><span>01</span> 烹饪方法</h2>
              <p>{dish.method}</p>
            </div>
            <div className="recipe-block recipe-spices">
              <h2><span>02</span> 需要的香料</h2>
              <p>{dish.spices}</p>
            </div>
          </article>
        </section>
        <section className="recommendation-section">
          <header className="recommendation-head">
            <div><span>RECOMMENDATION</span><h2>菜品推荐</h2></div>
            <small>横向滑动查看更多&nbsp; →</small>
          </header>
          <div className="dish-selector">
            {dishes.map((item, index) => (
              <button
                key={item.name}
                className={dishIndex === index ? "selected" : ""}
                onClick={() => setDishIndex(index)}
              >
                <span>0{index + 1}</span>
                <strong>{item.short}</strong>
                <small>{item.label}</small>
              </button>
            ))}
          </div>
        </section>
        <div className="dish-page-dots" aria-hidden="true"><i /><i /><i /><i /></div>
      </main>
    );
  }

  return (
    <main className={`page print-page ${flow === "not-bought" ? "print-page-curious" : "print-page-bought"}`}>
      <FinalIngredientCards count={discoveredCount} flow={flow} />
      <section className="print-copy">
        <h1>{flow === "not-bought" ? "记下，去吃！" : "拎菜，开火！"}</h1>
        <div className="receipt-machine">
          <div className="receipt-slot" aria-hidden="true"><i /></div>
          <button
            className={`receipt-output ${receiptPrinted ? "open" : ""}`}
            type="button"
            aria-expanded={receiptPrinted}
            aria-label="点击获取食谱小票"
            onClick={() => setReceiptPrinted(true)}
          >
            <img src="./assets/recipe-receipt.png" alt="舂！滇味实验站食谱小票" />
          </button>
          <p className={`receipt-guide ${receiptPrinted ? "hidden" : ""}`}>点击小票，获取你的滇味食谱</p>
        </div>
      </section>
    </main>
  );
}
