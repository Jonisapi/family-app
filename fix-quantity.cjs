const fs = require('fs');
let add = fs.readFileSync('src/pages/Add.tsx', 'utf8');

// Add quantity state after confidence state
add = add.replace(
  "const [confidence, setConfidence] = useState<string>('')",
  "const [confidence, setConfidence] = useState<string>('')\n  const [quantity, setQuantity] = useState('100')"
);

// Add quantity field before sugar/calories grid
add = add.replace(
  '<div className="grid grid-cols-2 gap-3">',
  `<div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">כמות שאכלת (גרם)</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => {
              setQuantity(e.target.value)
              const q = Number(e.target.value)
              const s = Number(sugar)
              const c = Number(calories)
              if (q && s) setSugar(String(Math.round(q * s / 100 * 10) / 10))
              if (q && c) setCalories(String(Math.round(q * c / 100)))
            }}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            min={1}
          />
          <p className="mt-1 text-xs text-slate-400">הערכים יחושבו אוטומטית לפי הכמות</p>
        </div>
        <div className="grid grid-cols-2 gap-3">`
);

// Close the extra div
add = add.replace(
  '</div>\n\n        <button type="submit"',
  '</div>\n        </div>\n\n        <button type="submit"'
);

fs.writeFileSync('src/pages/Add.tsx', add, 'utf8');
console.log('Done!');
