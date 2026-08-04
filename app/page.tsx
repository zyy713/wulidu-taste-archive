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

function IngredientCards() {
  return (
    <div className="ingredient-cards" aria-label="三张食材卡">
      {ingredients.map((name) => (
        <div className="ingredient-card" key={name}>{name}</div>
      ))}
    </div>
  );
}

function Basket() {
  return (
    <div className="object-wrap" aria-label="装有食材卡的菜篮子">
      <div className="basket-handle" />
      <div className="basket-body">
        <IngredientCards />
      </div>
    </div>
  );
}

function Pot() {
  return (
    <div className="object-wrap" aria-label="装有食材卡的锅">
      <div className="pot-lid"><span /></div>
      <div className="pot-handle pot-handle-left" />
      <div className="pot-handle pot-handle-right" />
      <div className="pot-body">
        <IngredientCards />
      </div>
    </div>
  );
}

function DetailCards() {
  return (
    <div className="detail-row">
      {ingredients.map((name) => (
        <div className="detail-card" key={name}>{name}详情</div>
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

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (stage === "cards" && event.key === "1") setStage("dish");
      if (stage === "dish" && event.key === "2") setStage("print");
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [stage]);

  const chooseFlow = (nextFlow: Flow) => {
    setFlow(nextFlow);
    setStage("cards");
  };

  if (stage === "start") {
    return (
      <main className="page start-page">
        <button onClick={() => chooseFlow("not-bought")}>没买</button>
        <button onClick={() => chooseFlow("bought")}>买了</button>
      </main>
    );
  }

  if (stage === "cards") {
    const notBought = flow === "not-bought";
    return (
      <main className="page cards-page">
        <section className="cards-main">
          <div className="object-column">{notBought ? <Basket /> : <Pot />}</div>
          <div className="cards-title">
            {notBought ? (
              <h1>开始探索<br />酸木瓜、小米辣、香菜</h1>
            ) : (
              <h1>今天怎么吃<br />酸木瓜、小米辣、香菜</h1>
            )}
          </div>
        </section>
        <DetailCards />
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
