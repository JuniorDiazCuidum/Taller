import type { FC } from "react";
import React, { useEffect, useState } from "react";

interface Props {
  selectedSize: string;
  selectedColor: string;
  selectedGen: string;
}

const COLORS = ["Rojo", "Azul", "Verde"];

/* Images from ropa.txt — keyed by "Gen-Color" */
const IMAGE_MAP: Record<string, string> = {
  // ── Hombre ──
  "Hombre-Rojo":  "https://www.bolf.es/hpeciai/7be13dea291df4e30dcaa466e804c58b/spa_pl_Camisa-elegante-de-manga-larga-para-hombre-rojo-Bolf-4704-43546_3.jpg",
  "Hombre-Azul":  "https://www.bolf.es/hpeciai/f439beeb97f8e6defa2e45a395e4956a/spa_pl_Camisa-elegante-de-manga-larga-para-hombre-azul-real-Bolf-3725-17649_2.jpg",
  "Hombre-Verde": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvFkL-fceLNg1AQ9_MB3LtRO8OXoX2ctUrMQ&s",

  // ── Mujer ──
  "Mujer-Rojo":  "https://7camicie.com/cdn/shop/products/CDR_1D_BD_2PS0002UNR000_6_c4da590a-a98a-4731-b7ba-25d950dc283a.jpg?v=1753453000",
  "Mujer-Azul":  "https://m.media-amazon.com/images/I/61qBpOyzREL._AC_UF894,1000_QL80_.jpg",
  "Mujer-Verde": "https://m.media-amazon.com/images/I/71YnoPpExkL._AC_UY1000_.jpg",
};

const COLOR_DATA: Record<
  string,
  {
    name: string;
    description: string;
    basePrice: number;
    badge?: string;
    accent: string;
    colorHex: string;
  }
> = {
  Rojo: {
    name: "Camiseta Roja Classic",
    description:
      "Estilo urbano y atrevido. 100% algodón peinado de alta densidad, corte recto que se adapta a cualquier complexión. Lavable a máquina.",
    basePrice: 22.99,
    badge: "Más Vendido",
    accent: "#b91c1c",
    colorHex: "#ef4444",
  },
  Azul: {
    name: "Camiseta Ocean Blue",
    description:
      "Frescura y estilo en uno. Tejido jersey suave con tecnología anti-sudor, ideal para uso diario o actividad física ligera.",
    basePrice: 24.99,
    badge: "Nueva Llegada",
    accent: "#1d4ed8",
    colorHex: "#3b82f6",
  },
  Verde: {
    name: "Camiseta Nature Line",
    description:
      "Comprometida con el planeta. Fabricada con algodón orgánico certificado GOTS. Tinte ecológico que no destiñe. Edición limitada.",
    basePrice: 20.99,
    badge: "Eco ♻️",
    accent: "#15803d",
    colorHex: "#22c55e",
  },
};

/* Progressive pricing: XS más barato → XXL más caro */
const SIZE_SURCHARGE: Record<string, number> = {
  XS: -4,
  S:  -2,
  M:   0,
  L:  +3,
  XL: +7,
  XXL: +12,
};

const SIZE_LABEL: Record<string, string> = {
  XS: "Extra Pequeña",
  S: "Pequeña",
  M: "Mediana",
  L: "Grande",
  XL: "Extra Grande",
  XXL: "Doble XL",
};

const GEN_LABEL: Record<string, string> = {
  Hombre: "Hombre",
  Mujer: "Mujer",
};

export const ProductCarousel: FC<Props> = ({
  selectedSize,
  selectedColor,
  selectedGen,
}) => {
  const getInitialIndex = () => {
    const idx = COLORS.indexOf(selectedColor);
    return idx >= 0 ? idx : 0;
  };

  const [currentIndex, setCurrentIndex] = useState<number>(getInitialIndex);
  const [slideDir, setSlideDir] = useState<"right" | "left">("right");
  const [animKey, setAnimKey] = useState(0);

  /* Auto-play when nothing is selected */
  const isIdle =
    selectedSize === "none" &&
    selectedColor === "none" &&
    selectedGen === "none";

  useEffect(() => {
    if (!isIdle) return;
    const timer = setInterval(() => {
      setSlideDir("right");
      setAnimKey((k) => k + 1);
      setCurrentIndex((prev) => (prev + 1) % COLORS.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [isIdle]);

  /* Sync carousel index when color changes externally */
  useEffect(() => {
    const idx = COLORS.indexOf(selectedColor);
    if (idx >= 0 && idx !== currentIndex) {
      setSlideDir(idx > currentIndex ? "right" : "left");
      setAnimKey((k) => k + 1);
      setCurrentIndex(idx);
    }
  }, [selectedColor]);

  /* Animate image when gender changes (same color, different model photo) */
  useEffect(() => {
    setSlideDir("right");
    setAnimKey((k) => k + 1);
  }, [selectedGen]);

  const navigateTo = (idx: number) => {
    if (idx === currentIndex) return;
    setSlideDir(idx > currentIndex ? "right" : "left");
    setAnimKey((k) => k + 1);
    setCurrentIndex(idx);
  };

  const color = COLORS[currentIndex];
  const data = COLOR_DATA[color];
  const genKey = selectedGen === "none" ? "Hombre" : selectedGen;
  const imageUrl =
    IMAGE_MAP[`${genKey}-${color}`] ?? IMAGE_MAP[`Hombre-${color}`];
  const sizeLabel = SIZE_LABEL[selectedSize] || selectedSize;
  const genLabel = GEN_LABEL[selectedGen] || selectedGen;
  const surcharge = SIZE_SURCHARGE[selectedSize] ?? 0;
  const finalPrice =
    selectedSize !== "none"
      ? (data.basePrice + surcharge).toFixed(2)
      : data.basePrice.toFixed(2);

  const animClass =
    slideDir === "right" ? "carousel-slide-right" : "carousel-slide-left";

  const hasSize = selectedSize !== "none";
  const hasColor = selectedColor !== "none";
  const hasGen = selectedGen !== "none";

  return (
    <div style={s.card}>
      {/* ── Header ── */}
      <div style={s.header}>
        <span style={s.storeName}>✦ FASHION STORE</span>
        <div style={s.tags}>
          {([
            hasSize  ? { key: "size",  bg: data.accent,   label: selectedSize  } : null,
            hasColor ? { key: "color", bg: data.colorHex, label: selectedColor } : null,
            hasGen   ? { key: "gen",   bg: "#6b7280",     label: selectedGen   } : null,
          ].filter(Boolean) as { key: string; bg: string; label: string }[]).map((t) => (
            <span key={t.key} style={{ ...s.tag, background: t.bg }}>
              {t.label}
            </span>
          ))}
        </div>
      </div>

      {/* ── Image area ── */}
      <div style={s.imageWrapper}>
        {/* Badge */}
        {data.badge && (
          <span style={{ ...s.badge, background: data.accent }}>
            {data.badge}
          </span>
        )}

        {/* Animated image */}
        <img
          key={`slide-${animKey}`}
          className={animClass}
          src={imageUrl}
          alt={data.name}
          style={s.image}
        />


        {/* Color accent strip */}
        <div
          style={{
            ...s.colorStrip,
            background: `linear-gradient(90deg, ${data.colorHex}, ${data.accent})`,
          }}
        />
      </div>

      {/* ── Dot indicators ── */}
      <div style={s.dots}>
        {COLORS.map((c, i) => (
          <button
            key={`dot-${c}`}
            onClick={() => navigateTo(i)}
            aria-label={`Ir a ${c}`}
            style={{
              ...s.dot,
              width: i === currentIndex ? "28px" : "8px",
              background: i === currentIndex ? data.accent : "#d1d5db",
            }}
          />
        ))}
      </div>

      {/* ── Product info ── */}
      <div style={s.info}>
        <h3 style={{ ...s.productName, color: data.accent }}>{data.name}</h3>

        {(hasSize || hasGen) && (
          <p style={s.meta}>
            {hasSize && (
              <>
                Talla: <strong>{sizeLabel}</strong>
              </>
            )}
            {hasSize && hasGen && " · "}
            {hasGen && (
              <>
                Para: <strong>{genLabel}</strong>
              </>
            )}
          </p>
        )}

        <p style={s.description}>{data.description}</p>

        <div style={s.priceRow}>
          <span style={{ ...s.price, color: data.accent }}>${finalPrice}</span>
          {surcharge !== 0 && hasSize && (
            <span style={s.surchargeNote}>
              {surcharge > 0
                ? `+$${surcharge} talla ${selectedSize}`
                : `−$${Math.abs(surcharge)} talla ${selectedSize}`}
            </span>
          )}
          {!hasSize && (
            <span style={s.surchargeNote}>Selecciona tu talla</span>
          )}
        </div>
      </div>
    </div>
  );
};

/* ─── Styles ─── */
const s: Record<string, React.CSSProperties> = {
  card: {
    background: "#ffffff",
    borderRadius: "20px",
    boxShadow: "0 8px 40px rgba(0,0,0,0.13)",
    overflow: "hidden",
    width: "100%",
    maxWidth: "420px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 20px",
    borderBottom: "1px solid #f3f4f6",
  },
  storeName: {
    fontWeight: 700,
    letterSpacing: "0.12em",
    fontSize: "12px",
    color: "#374151",
    textTransform: "uppercase",
  },
  tags: {
    display: "flex",
    gap: "6px",
  },
  tag: {
    borderRadius: "20px",
    padding: "3px 10px",
    fontSize: "11px",
    fontWeight: 700,
    color: "#fff",
    letterSpacing: "0.03em",
  },
  imageWrapper: {
    position: "relative",
    width: "100%",
    aspectRatio: "420 / 320",
    background: "#f3f4f6",
    overflow: "hidden",
  },
  image: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  badge: {
    position: "absolute",
    top: "14px",
    left: "14px",
    zIndex: 2,
    borderRadius: "20px",
    padding: "5px 14px",
    fontSize: "10px",
    fontWeight: 800,
    color: "#fff",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  colorStrip: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "4px",
  },
  dots: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "7px",
    padding: "12px",
    background: "#f9fafb",
    borderBottom: "1px solid #f3f4f6",
  },
  dot: {
    height: "8px",
    borderRadius: "4px",
    border: "none",
    cursor: "pointer",
    transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
    padding: 0,
  },
  info: {
    padding: "18px 22px 22px",
  },
  productName: {
    fontSize: "19px",
    fontWeight: 800,
    margin: "0 0 6px",
    letterSpacing: "-0.01em",
  },
  meta: {
    fontSize: "13px",
    color: "#6b7280",
    margin: "0 0 10px",
  },
  description: {
    fontSize: "14px",
    color: "#4b5563",
    lineHeight: 1.65,
    margin: "0 0 16px",
  },
  priceRow: {
    display: "flex",
    alignItems: "baseline",
    gap: "10px",
  },
  price: {
    fontSize: "30px",
    fontWeight: 900,
    letterSpacing: "-0.02em",
  },
  surchargeNote: {
    fontSize: "12px",
    color: "#9ca3af",
    background: "#f3f4f6",
    padding: "3px 10px",
    borderRadius: "12px",
  },
};
