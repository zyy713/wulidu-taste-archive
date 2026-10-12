"use client";

import { useEffect, useState } from "react";

type Flow = "not-bought" | "bought";
type Stage = "start" | "cards" | "dish" | "print";

const ingredients = [
  { name: "皱皮辣", nameEn: "Wrinkled Pepper", image: "./assets/card-wrinkled-pepper.png" },
  { name: "刺苦瓜", nameEn: "Spiny Bitter Gourd", image: "./assets/card-spiny-bitter-gourd.png" },
  { name: "二荆条", nameEn: "Erjingtiao Chili", image: "./assets/card-erjingtiao.png" },
  { name: "树番茄", nameEn: "Tree Tomato", image: "./assets/card-tree-tomato.png" },
  { name: "木姜子", nameEn: "Litsea pungens", image: "./assets/card-litsea-pungens.png" },
  { name: "马蹄番茄", nameEn: "Heirloom Tomato", image: "./assets/card-horseshoe-tomato.png" },
];

const dishes = [
  {
    name: "傣味舂鸡脚",
    nameEn: "Dai-style Pounded Chicken Feet",
    short: "傣味舂鸡脚",
    method: "鸡爪煮熟冰镇后去骨；将大蒜、小米辣和香茅舂碎，加入青柠汁、鱼露、生抽、白糖和盐调成酸辣汁。拌入洋葱、黄瓜和胡萝卜，最后加入香菜、薄荷和柠檬片，冷藏腌制。",
    methodEn: "Boil the chicken feet, chill in ice water and debone. Pound garlic, bird’s-eye chili and lemongrass, then mix with lime juice, fish sauce, soy sauce, sugar and salt. Toss with onion, cucumber and carrot; finish with cilantro, mint and lemon slices, then chill to marinate.",
    spices: "青柠檬 · 黄柠檬 · 小米辣 · 大蒜 · 生姜 · 香菜 · 香茅 · 薄荷",
    spicesEn: "Lime · Lemon · Bird’s-eye chili · Garlic · Ginger · Cilantro · Lemongrass · Mint",
    label: "酸辣 / 清香 / 舂拌",
    labelEn: "Tangy / Fresh / Pounded",
    image: "./assets/dish-dai-chicken-feet-f1eff1.png",
  },
  {
    name: "酸木瓜煮鱼",
    nameEn: "Sour Papaya Fish Soup",
    short: "酸木瓜煮鱼",
    method: "鱼块煎香后加入姜片和热水，汤色变白时放入酸木瓜，小火煮十二分钟，最后加入小米辣、香菜和盐。",
    methodEn: "Sear the fish with ginger and add hot water. When the broth turns milky, add sour papaya and simmer for twelve minutes. Finish with bird’s-eye chili, cilantro and salt.",
    spices: "酸木瓜 · 小米辣 · 生姜 · 香菜",
    spicesEn: "Sour papaya · Bird’s-eye chili · Ginger · Cilantro",
    label: "酸香 / 鲜润 / 慢煮",
    labelEn: "Tangy / Savory / Simmered",
    image: "./assets/dish-sour-papaya-fish.png",
  },
  {
    name: "木姜子烤鸡",
    nameEn: "Litsea Roasted Chicken",
    short: "木姜子烤鸡",
    method: "鸡肉加入木姜子、大蒜和香茅腌制，烤至表皮焦香；出炉后挤入青柠汁，以香菜和少量小米辣提鲜。",
    methodEn: "Marinate the chicken with litsea, garlic and lemongrass, then roast until crisp and golden. Finish with lime juice, cilantro and a little bird’s-eye chili.",
    spices: "木姜子 · 香茅 · 大蒜 · 小米辣 · 青柠",
    spicesEn: "Litsea pungens · Lemongrass · Garlic · Bird’s-eye chili · Lime",
    label: "柑橘香 / 焦香 / 烘烤",
    labelEn: "Citrusy / Charred / Roasted",
    image: "./assets/dish-litsea-roast-chicken.png",
  },
  {
    name: "青柠拌刺苦瓜",
    nameEn: "Lime-dressed Spiny Bitter Gourd",
    short: "青柠拌刺苦瓜",
    method: "刺苦瓜切薄片后冰镇，加入青柠汁、少量盐和糖抓拌，再用小米辣、香菜与薄荷补足清香。",
    methodEn: "Thinly slice and chill the spiny bitter gourd. Toss with lime juice, a little salt and sugar, then finish with bird’s-eye chili, cilantro and mint.",
    spices: "青柠 · 小米辣 · 香菜 · 薄荷",
    spicesEn: "Lime · Bird’s-eye chili · Cilantro · Mint",
    label: "清苦 / 酸亮 / 凉拌",
    labelEn: "Clean Bitter / Bright / Chilled",
    image: "./assets/dish-lime-bitter-gourd.png",
  },
  {
    name: "香茅烤鱼",
    nameEn: "Lemongrass Grilled Fish",
    short: "香茅烤鱼",
    method: "鲜鱼以香茅、大蒜和小米辣腌制，包入香叶烤熟，食用前挤上青柠汁，让草本香气更明亮。",
    methodEn: "Marinate the fish with lemongrass, garlic and bird’s-eye chili. Wrap with aromatic leaves and grill until cooked; finish with lime juice.",
    spices: "香茅 · 青柠 · 小米辣 · 大蒜 · 香叶",
    spicesEn: "Lemongrass · Lime · Bird’s-eye chili · Garlic · Aromatic leaves",
    label: "草本香 / 鲜辣 / 烘烤",
    labelEn: "Herbal / Spicy / Grilled",
    image: "./assets/dish-lemongrass-fish.png",
  },
];

function IngredientCards({ count = ingredients.length }: { count?: number }) {
  const visibleIngredients = ingredients.slice(0, count);
  return (
    <div className="ingredient-cards" aria-label={`${visibleIngredients.length}张食材卡`}>
      {visibleIngredients.map((ingredient) => (
        <div className="ingredient-card" key={ingredient.name}>
          <img src={ingredient.image} alt={`${ingredient.name}食材卡`} />
        </div>
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
      {ingredients.map((ingredient, index) => (
        <div className="detail-card" key={ingredient.name}>
          {index < count ? (
            <><span>{ingredient.name}详情</span><small>{ingredient.nameEn} / DETAILS</small></>
          ) : (
            <><span>待获取</span><small>WAITING</small></>
          )}
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
        {detectedIngredients.map((ingredient, index) => (
          <div className={`detected-card detected-card-${index + 1}`} key={ingredient.name}>
            <img src={ingredient.image} alt={`${ingredient.name}食材卡`} />
          </div>
        ))}
      </div>
      <div className="detected-cards detected-cards-fence" aria-label={`木排上已获取${count}张食材卡`}>
        {detectedIngredients.map((ingredient, index) => (
          <div className={`detected-card detected-card-${index + 1}`} key={ingredient.name}>
            <img src={ingredient.image} alt={`${ingredient.name}食材卡`} />
          </div>
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
      {ingredients.slice(0, count).map((ingredient, index) => (
        <div className={`final-collected-card final-collected-card-${index + 1}`} key={ingredient.name}>
          <img src={ingredient.image} alt={`${ingredient.name}食材卡`} />
        </div>
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
      ...ingredients.map((ingredient) => ingredient.image),
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
        <h1>舂一舂！对这份滇味下手！<small className="en-copy">POUND IT! TAKE ON THIS YUNNAN FLAVOR.</small></h1>
        <button onClick={() => chooseFlow("not-bought")}><span>不买菜，但好奇</span><small className="en-copy">JUST CURIOUS, NOT BUYING</small></button>
        <button onClick={() => chooseFlow("bought")}><span>拎回家，怎么做</span><small className="en-copy">TAKING IT HOME — HOW TO COOK?</small></button>
      </main>
    );
  }

  if (stage === "cards") {
    const notBought = flow === "not-bought";
    return (
      <main className={`page cards-page ${notBought ? "cards-page-curious" : "cards-page-bought"}`}>
        <DetectedIngredientCards count={discoveredCount} />
        <section className="acquisition-copy">
          <p>食材入钵，拿起木杵<small className="en-copy">ADD INGREDIENTS. PICK UP THE PESTLE.</small></p>
          <p><strong>舂舂舂</strong>，将食材加入{notBought ? "菜篮" : "铜锅"}<small className="en-copy">POUND, POUND, POUND — ADD THEM TO THE {notBought ? "BASKET" : "COPPER POT"}.</small></p>
        </section>
        <PoundingAnimation />
        <p className="acquisition-stop-hint"><span>*全部原材料添加完成后停止“舂”</span><small className="en-copy">STOP WHEN ALL INGREDIENTS ARE ADDED.</small></p>
        <p className="pounding-definition"><span>*舂：用木杵在木臼内上下锤击</span><small className="en-copy">POUND UP AND DOWN WITH THE WOODEN PESTLE.</small></p>
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
            <h1>{dish.name}<small className="en-copy">{dish.nameEn}</small></h1>
            <p className="dish-taste-label"><span>{dish.label}</span><small>{dish.labelEn}</small></p>
            <div className="recipe-block">
              <h2><span>01</span> 烹饪方法 <small>METHOD</small></h2>
              <p>{dish.method}<small className="recipe-en">{dish.methodEn}</small></p>
            </div>
            <div className="recipe-block recipe-spices">
              <h2><span>02</span> 需要的香料 <small>SPICES</small></h2>
              <p>{dish.spices}<small className="recipe-en">{dish.spicesEn}</small></p>
            </div>
          </article>
        </section>
        <section className="recommendation-section">
          <header className="recommendation-head">
            <div><span>RECOMMENDATION</span><h2>菜品推荐 <small>RECOMMENDED DISHES</small></h2></div>
            <small><span>横向滑动查看更多</span><b>SWIPE TO EXPLORE</b>&nbsp; →</small>
          </header>
          <div className="dish-selector">
            {dishes.map((item, index) => (
              <button
                key={item.name}
                className={dishIndex === index ? "selected" : ""}
                onClick={() => setDishIndex(index)}
              >
                <span>0{index + 1}</span>
                <strong>{item.short}<em>{item.nameEn}</em></strong>
                <small>{item.label}<em>{item.labelEn}</em></small>
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
        <h1>{flow === "not-bought" ? "记下，去吃！" : "拎菜，开火！"}<small className="en-copy">{flow === "not-bought" ? "NOTE IT DOWN. GO TASTE IT!" : "TAKE IT HOME. FIRE IT UP!"}</small></h1>
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
          <p className={`receipt-guide ${receiptPrinted ? "hidden" : ""}`}><span className="receipt-guide-copy"><span>点击小票，获取你的滇味食谱</span><small className="en-copy">TAP FOR YOUR YUNNAN RECIPE</small></span></p>
        </div>
      </section>
    </main>
  );
}
