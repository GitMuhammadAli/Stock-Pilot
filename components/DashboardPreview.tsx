import type React from "react"

const DashboardPreview: React.FC = () => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 1200 800"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="max-w-full h-auto"
    >
      {/* Background */}
      <rect width="1200" height="800" rx="12" fill="#0B0F1A" />

      {/* Sidebar */}
      <rect x="0" y="0" width="240" height="800" fill="#1C2333" />

      {/* Logo */}
      <rect x="30" y="30" width="180" height="40" rx="4" fill="#2C3444" />
      <text x="120" y="55" textAnchor="middle" fill="#B6F400" fontFamily="sans-serif" fontSize="18" fontWeight="bold">
        StockPilot
      </text>

      {/* Navigation Items */}
      <rect x="20" y="100" width="200" height="40" rx="4" fill="#B6F400" fillOpacity="0.1" />
      <text x="60" y="125" fill="white" fontFamily="sans-serif" fontSize="14">
        Dashboard
      </text>
      <circle cx="35" cy="120" r="6" fill="#B6F400" />

      <text x="60" y="175" fill="#9CA3AF" fontFamily="sans-serif" fontSize="14">
        Warehouses
      </text>
      <circle cx="35" cy="170" r="6" fill="#9CA3AF" />

      <text x="60" y="225" fill="#9CA3AF" fontFamily="sans-serif" fontSize="14">
        Products
      </text>
      <circle cx="35" cy="220" r="6" fill="#9CA3AF" />

      <text x="60" y="275" fill="#9CA3AF" fontFamily="sans-serif" fontSize="14">
        Inventory
      </text>
      <circle cx="35" cy="270" r="6" fill="#9CA3AF" />

      <text x="60" y="325" fill="#9CA3AF" fontFamily="sans-serif" fontSize="14">
        Reports
      </text>
      <circle cx="35" cy="320" r="6" fill="#9CA3AF" />

      <text x="60" y="375" fill="#9CA3AF" fontFamily="sans-serif" fontSize="14">
        Users
      </text>
      <circle cx="35" cy="370" r="6" fill="#9CA3AF" />

      <text x="60" y="425" fill="#9CA3AF" fontFamily="sans-serif" fontSize="14">
        Settings
      </text>
      <circle cx="35" cy="420" r="6" fill="#9CA3AF" />

      {/* User Profile */}
      <rect x="20" y="720" width="200" height="60" rx="4" fill="#2C3444" />
      <circle cx="50" cy="750" r="20" fill="#4B5563" />
      <text x="100" y="745" fill="white" fontFamily="sans-serif" fontSize="14">
        John Doe
      </text>
      <text x="100" y="765" fill="#9CA3AF" fontFamily="sans-serif" fontSize="12">
        Admin
      </text>

      {/* Top Bar */}
      <rect x="240" y="0" width="960" height="70" fill="#1C2333" />

      {/* Search Bar */}
      <rect x="270" y="20" width="300" height="30" rx="4" fill="#2C3444" />
      <text x="290" y="40" fill="#9CA3AF" fontFamily="sans-serif" fontSize="12">
        Search...
      </text>

      {/* Notification Icon */}
      <circle cx="1100" cy="35" r="15" fill="#2C3444" />
      <circle cx="1100" cy="35" r="4" fill="#B6F400" />

      {/* Main Content */}
      <rect x="270" y="100" width="900" height="60" rx="4" fill="transparent" />
      <text x="270" y="130" fill="white" fontFamily="sans-serif" fontSize="24" fontWeight="bold">
        Dashboard
      </text>
      <text x="270" y="155" fill="#9CA3AF" fontFamily="sans-serif" fontSize="14">
        Overview of your inventory and performance
      </text>

      {/* Summary Cards */}
      <rect x="270" y="180" width="210" height="120" rx="8" fill="#1C2333" />
      <text x="290" y="210" fill="#B6F400" fontFamily="sans-serif" fontSize="14">
        Total Products
      </text>
      <text x="290" y="245" fill="white" fontFamily="sans-serif" fontSize="28" fontWeight="bold">
        1,234
      </text>
      <text x="290" y="270" fill="#9CA3AF" fontFamily="sans-serif" fontSize="12">
        ↑ 12% from last month
      </text>

      <rect x="500" y="180" width="210" height="120" rx="8" fill="#1C2333" />
      <text x="520" y="210" fill="#B6F400" fontFamily="sans-serif" fontSize="14">
        Low Stock Items
      </text>
      <text x="520" y="245" fill="white" fontFamily="sans-serif" fontSize="28" fontWeight="bold">
        24
      </text>
      <text x="520" y="270" fill="#9CA3AF" fontFamily="sans-serif" fontSize="12">
        ↓ 3% from last month
      </text>

      <rect x="730" y="180" width="210" height="120" rx="8" fill="#1C2333" />
      <text x="750" y="210" fill="#B6F400" fontFamily="sans-serif" fontSize="14">
        Expiring Soon
      </text>
      <text x="750" y="245" fill="white" fontFamily="sans-serif" fontSize="28" fontWeight="bold">
        37
      </text>
      <text x="750" y="270" fill="#9CA3AF" fontFamily="sans-serif" fontSize="12">
        Within next 7 days
      </text>

      <rect x="960" y="180" width="210" height="120" rx="8" fill="#1C2333" />
      <text x="980" y="210" fill="#B6F400" fontFamily="sans-serif" fontSize="14">
        Total Value
      </text>
      <text x="980" y="245" fill="white" fontFamily="sans-serif" fontSize="28" fontWeight="bold">
        $123.4K
      </text>
      <text x="980" y="270" fill="#9CA3AF" fontFamily="sans-serif" fontSize="12">
        ↑ 8% from last month
      </text>

      {/* Warehouse Heatmap */}
      <rect x="270" y="320" width="440" height="300" rx="8" fill="#1C2333" />
      <text x="290" y="350" fill="#B6F400" fontFamily="sans-serif" fontSize="16" fontWeight="bold">
        Warehouse Capacity Heatmap
      </text>

      {/* Heatmap Grid */}
      <rect x="290" y="370" width="400" height="230" rx="4" fill="#2C3444" />

      {/* Heatmap Cells */}
      <rect x="300" y="380" width="70" height="40" rx="2" fill="#B6F400" fillOpacity="0.9" />
      <rect x="380" y="380" width="70" height="40" rx="2" fill="#B6F400" fillOpacity="0.7" />
      <rect x="460" y="380" width="70" height="40" rx="2" fill="#B6F400" fillOpacity="0.5" />
      <rect x="540" y="380" width="70" height="40" rx="2" fill="#B6F400" fillOpacity="0.3" />

      <rect x="300" y="430" width="70" height="40" rx="2" fill="#B6F400" fillOpacity="0.6" />
      <rect x="380" y="430" width="70" height="40" rx="2" fill="#B6F400" fillOpacity="0.8" />
      <rect x="460" y="430" width="70" height="40" rx="2" fill="#B6F400" fillOpacity="0.4" />
      <rect x="540" y="430" width="70" height="40" rx="2" fill="#B6F400" fillOpacity="0.2" />

      <rect x="300" y="480" width="70" height="40" rx="2" fill="#B6F400" fillOpacity="0.3" />
      <rect x="380" y="480" width="70" height="40" rx="2" fill="#B6F400" fillOpacity="0.5" />
      <rect x="460" y="480" width="70" height="40" rx="2" fill="#B6F400" fillOpacity="0.9" />
      <rect x="540" y="480" width="70" height="40" rx="2" fill="#B6F400" fillOpacity="0.7" />

      <rect x="300" y="530" width="70" height="40" rx="2" fill="#B6F400" fillOpacity="0.2" />
      <rect x="380" y="530" width="70" height="40" rx="2" fill="#B6F400" fillOpacity="0.4" />
      <rect x="460" y="530" width="70" height="40" rx="2" fill="#B6F400" fillOpacity="0.6" />
      <rect x="540" y="530" width="70" height="40" rx="2" fill="#B6F400" fillOpacity="0.8" />

      {/* Stock Movement Timeline */}
      <rect x="730" y="320" width="440" height="300" rx="8" fill="#1C2333" />
      <text x="750" y="350" fill="#B6F400" fontFamily="sans-serif" fontSize="16" fontWeight="bold">
        Stock Movement Timeline
      </text>

      {/* Timeline Chart */}
      <rect x="750" y="370" width="400" height="230" rx="4" fill="#2C3444" />

      {/* Chart Grid Lines */}
      <path d="M750 420 L1150 420" stroke="#4B5563" strokeWidth="1" strokeDasharray="4 4" />
      <path d="M750 470 L1150 470" stroke="#4B5563" strokeWidth="1" strokeDasharray="4 4" />
      <path d="M750 520 L1150 520" stroke="#4B5563" strokeWidth="1" strokeDasharray="4 4" />
      <path d="M750 570 L1150 570" stroke="#4B5563" strokeWidth="1" strokeDasharray="4 4" />

      {/* Chart Line */}
      <path
        d="M770 520 L820 500 L870 530 L920 480 L970 450 L1020 470 L1070 420 L1120 440"
        stroke="#B6F400"
        strokeWidth="3"
        fill="none"
      />

      {/* Chart Points */}
      <circle cx="770" cy="520" r="4" fill="#B6F400" />
      <circle cx="820" cy="500" r="4" fill="#B6F400" />
      <circle cx="870" cy="530" r="4" fill="#B6F400" />
      <circle cx="920" cy="480" r="4" fill="#B6F400" />
      <circle cx="970" cy="450" r="4" fill="#B6F400" />
      <circle cx="1020" cy="470" r="4" fill="#B6F400" />
      <circle cx="1070" cy="420" r="4" fill="#B6F400" />
      <circle cx="1120" cy="440" r="4" fill="#B6F400" />

      {/* X-Axis Labels */}
      <text x="770" y="590" textAnchor="middle" fill="#9CA3AF" fontFamily="sans-serif" fontSize="10">
        Jan
      </text>
      <text x="820" y="590" textAnchor="middle" fill="#9CA3AF" fontFamily="sans-serif" fontSize="10">
        Feb
      </text>
      <text x="870" y="590" textAnchor="middle" fill="#9CA3AF" fontFamily="sans-serif" fontSize="10">
        Mar
      </text>
      <text x="920" y="590" textAnchor="middle" fill="#9CA3AF" fontFamily="sans-serif" fontSize="10">
        Apr
      </text>
      <text x="970" y="590" textAnchor="middle" fill="#9CA3AF" fontFamily="sans-serif" fontSize="10">
        May
      </text>
      <text x="1020" y="590" textAnchor="middle" fill="#9CA3AF" fontFamily="sans-serif" fontSize="10">
        Jun
      </text>
      <text x="1070" y="590" textAnchor="middle" fill="#9CA3AF" fontFamily="sans-serif" fontSize="10">
        Jul
      </text>
      <text x="1120" y="590" textAnchor="middle" fill="#9CA3AF" fontFamily="sans-serif" fontSize="10">
        Aug
      </text>

      {/* Cost-Saving Calculator */}
      <rect x="270" y="640" width="900" height="140" rx="8" fill="#1C2333" />
      <text x="290" y="670" fill="#B6F400" fontFamily="sans-serif" fontSize="16" fontWeight="bold">
        Cost-Saving Calculator
      </text>

      {/* Calculator Inputs */}
      <rect x="290" y="690" width="180" height="70" rx="4" fill="#2C3444" />
      <text x="300" y="710" fill="#9CA3AF" fontFamily="sans-serif" fontSize="12">
        Current Stock Value
      </text>
      <text x="300" y="740" fill="white" fontFamily="sans-serif" fontSize="18">
        $100,000
      </text>

      <rect x="490" y="690" width="180" height="70" rx="4" fill="#2C3444" />
      <text x="500" y="710" fill="#9CA3AF" fontFamily="sans-serif" fontSize="12">
        Optimization Target
      </text>
      <text x="500" y="740" fill="white" fontFamily="sans-serif" fontSize="18">
        15%
      </text>

      <rect x="690" y="690" width="180" height="70" rx="4" fill="#2C3444" />
      <text x="700" y="710" fill="#9CA3AF" fontFamily="sans-serif" fontSize="12">
        Potential Savings
      </text>
      <text x="700" y="740" fill="#B6F400" fontFamily="sans-serif" fontSize="18" fontWeight="bold">
        $15,000
      </text>

      <rect x="890" y="690" width="180" height="70" rx="4" fill="#B6F400" />
      <text x="980" y="730" textAnchor="middle" fill="#0B0F1A" fontFamily="sans-serif" fontSize="16" fontWeight="bold">
        Calculate
      </text>

      {/* Quick Actions */}
      <rect x="270" y="20" width="900" height="60" rx="4" fill="transparent" />
      <text x="1050" y="155" textAnchor="end" fill="white" fontFamily="sans-serif" fontSize="14">
        Quick Actions
      </text>

      <rect x="800" y="130" width="110" height="30" rx="4" fill="#2C3444" />
      <text x="855" y="150" textAnchor="middle" fill="white" fontFamily="sans-serif" fontSize="12">
        Barcode Scan
      </text>

      <rect x="920" y="130" width="120" height="30" rx="4" fill="#2C3444" />
      <text x="980" y="150" textAnchor="middle" fill="white" fontFamily="sans-serif" fontSize="12">
        Instant Transfer
      </text>

      <rect x="1050" y="130" width="120" height="30" rx="4" fill="#2C3444" />
      <text x="1110" y="150" textAnchor="middle" fill="white" fontFamily="sans-serif" fontSize="12">
        CSV Export
      </text>
    </svg>
  )
}

export default DashboardPreview

