interface HeaderProps {
  dateRange: string;
  setDateRange: (range: string) => void;
}

const Header = ({ dateRange, setDateRange }: HeaderProps) => {
  const ranges = ["7d", "14d", "30d"];

  return (
    <header className="bg-white shadow-sm sticky">
      <div className="container mx-auto p-2 flex justify-between items-center">
        <h1 className="text-lg font-bold text-gray-800">SupplySight</h1>
        <div className="flex gap-2">
          {ranges.map((range) => (
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
