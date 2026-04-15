import React from "react"

type Props = {
  categories: string[]
  active: string
  onChange: (category: string) => void
}

export const CategoryTabs: React.FC<Props> = ({
  categories,
  active,
  onChange
}) => {
  return (
    <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          style={{
            padding: "8px 12px",
            background: active === cat ? "#333" : "#eee",
            color: active === cat ? "#fff" : "#000",
            border: "none",
            borderRadius: "6px"
          }}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}