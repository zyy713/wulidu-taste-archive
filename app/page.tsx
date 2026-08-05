"use client";

import { useEffect, useState } from "react";

type Flow = "not-bought" | "bought";
type Stage = "start" | "cards" | "dish" | "print";

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
      <div className="pounding-frame">
        <img src="./assets/pound-before-empty.png" alt="空木臼" />
        <img src="./assets/pound-before-card.png" alt="食材卡放入木臼" />
      </div>
      <span className="pounding-arrow" aria-hidden="true">➜</span>
      <div className="pounding-frame">
        <img src="./assets/pound-after-up.png" alt="举起木杵" />
        <img src="./assets/pound-after-down.png" alt="木杵向下舂击" />
      </div>
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
      if (stage === "dish" && event.key === "2") setStage("print");
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [stage]);

  const chooseFlow = (nextFlow: Flow) => {
    setFlow(nextFlow);
    setPressCount(0);
    setDiscoveredCount(0);
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
          <small>*舂：用木杵在木臼内上下锤击</small>
        </section>
        <PoundingAnimation />
      </main>
    );
  }

  if (stage === "dish") {
    const dish = dishes[dishIndex];
    return (
      <main className="page dish-page">
        <section className="dish-content">
          <div className="dish-top">
            <DishPlate dishIndex={dishIndex} />
            <div className="dish-copy">
              <h1>{dish.name}</h1>
              <p>{dish.method}</p>
            </div>
          </div>
          <div className="dish-selector">
            {dishes.map((item, index) => (
              <button
                key={item.name}
                className={dishIndex === index ? "selected" : ""}
                onClick={() => setDishIndex(index)}
              >
                {item.short}
              </button>
            ))}
          </div>
        </section>
        <LargeBasket />
      </main>
    );
  }

  return (
    <main className="page print-page">
      <section className="print-visual">
        {flow === "not-bought" ? <HandWithBook /> : <HandWithBag />}
      </section>
      <section className="print-copy">
        <h1>{flow === "not-bought" ? "记下了" : "拿走，开做"}</h1>
        <button onClick={() => window.print()}>打印</button>
      </section>
    </main>
  );
}
