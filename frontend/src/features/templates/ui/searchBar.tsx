import React from "react"

type Props = {
  value: string
  onChange: (value: string) => void
}

export const SearchBar: React.FC<Props> = ({ value, onChange }) => {
  return (
    <input
      type="text"
      placeholder="Search templates..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="
        w-full
        px-4 py-2
        rounded-xl
        border border-gray-300
        focus:outline-none
        focus:ring-2 focus:ring-black
        mb-4
      "
    />
  )
}