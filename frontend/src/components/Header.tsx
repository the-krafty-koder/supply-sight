interface HeaderProps {
  dateRange: string;
  setDateRange: (range: string) => void;
}

const DATE_RANGES = ["7d", "14d", "30d"];

const Header = ({ dateRange, setDateRange }: HeaderProps) => {
  return (
    <header className="bg-slate-800">
      <div className="container mx-auto p-2 flex justify-between items-center">
        <h1 className="text-lg font-bold text-stone-100">SupplySight</h1>
        <div className="flex gap-2">
          {DATE_RANGES.map((range) => (
            <span
              key={range}
              className={`px-3 py-1 rounded-full text-sm font-medium cursor-pointer ${
                dateRange === range
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => setDateRange(range)}
            >
              {range}
            </span>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
